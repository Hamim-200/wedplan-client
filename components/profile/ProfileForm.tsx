"use client";

import { useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiData } from "@/hooks/useApiData";
import { ApiClientError, apiFetch } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import type { Profile } from "@/lib/types";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  businessName: z.string().trim().max(100),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?[0-9][0-9\s-]{5,18})?$/, "Enter a valid phone number"),
  bio: z.string().trim().max(300, "Bio must be 300 characters or less"),
});

type Values = z.infer<typeof schema>;

function Form({ profile, onSaved }: { profile: Profile; onSaved: () => void }) {
  const { refetch } = useSession();
  const isVendor = profile.role === "vendor";

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profile.name,
      businessName: profile.businessName ?? "",
      phone: profile.phone ?? "",
      bio: profile.bio ?? "",
    },
  });

  function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const picked = event.target.files?.[0];
    if (!picked) return;
    if (!IMAGE_TYPES.includes(picked.type)) {
      toast.error("Please choose a JPG, PNG, WEBP or GIF image");
      event.target.value = "";
      return;
    }
    if (picked.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5 MB or smaller");
      event.target.value = "";
      return;
    }
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  }

  async function onSubmit(values: Values) {
    if (isVendor && values.businessName.length < 2) {
      setError("businessName", { message: "Business name is required for vendors" });
      return;
    }

    setSubmitting(true);
    try {
      let image: string | undefined;
      if (file) {
        try {
          const formData = new FormData();
          formData.append("image", file);
          const uploaded = await apiFetch<{ url: string }>("/api/upload", {
            method: "POST",
            auth: true,
            body: formData,
          });
          image = uploaded.url;
        } catch (err) {
          toast.error(
            err instanceof Error ? `Image upload failed: ${err.message}` : "Image upload failed"
          );
          return;
        }
      }

      await apiFetch("/api/users/me", {
        method: "PATCH",
        auth: true,
        body: {
          name: values.name,
          phone: values.phone,
          bio: values.bio,
          ...(isVendor ? { businessName: values.businessName } : {}),
          ...(image ? { image } : {}),
        },
      });

      toast.success("Profile updated");
      setFile(null);
      await refetch(); // updates the name and photo in the Navbar
      onSaved();
    } catch (err) {
      if (err instanceof ApiClientError) {
        const detail = err.errors?.[0]?.message;
        toast.error(detail ? `${err.message}: ${detail}` : err.message);
      } else {
        toast.error("Could not update your profile");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const shownImage = preview ?? profile.image;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl space-y-5 rounded-2xl border bg-card p-6 shadow-sm"
      noValidate
    >
      <div className="flex items-center gap-4">
        <Avatar className="size-20">
          {shownImage ? <AvatarImage src={shownImage} alt={profile.name} /> : null}
          <AvatarFallback className="text-xl">
            {profile.name.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-accent">
          <Camera className="size-4" />
          Change photo
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={handleImage}
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={profile.email} disabled readOnly />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Account type</Label>
          <Input id="role" value={profile.role} disabled readOnly className="capitalize" />
        </div>
      </div>
      <p className="-mt-2 text-xs text-muted-foreground">
        Email and account type cannot be changed.
      </p>

      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" {...register("name")} />
        {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
      </div>

      {isVendor ? (
        <div className="space-y-2">
          <Label htmlFor="businessName">Business name</Label>
          <Input id="businessName" {...register("businessName")} />
          {errors.businessName ? (
            <p className="text-sm text-destructive">{errors.businessName.message}</p>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" type="tel" placeholder="+880 1700 000000" {...register("phone")} />
        {errors.phone ? <p className="text-sm text-destructive">{errors.phone.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">About you (optional)</Label>
        <Textarea id="bio" rows={4} maxLength={300} {...register("bio")} />
        {errors.bio ? <p className="text-sm text-destructive">{errors.bio.message}</p> : null}
      </div>

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
        {submitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}

export function ProfileForm() {
  const { data, error, loading, reload } = useApiData<{ profile: Profile }>("/api/users/me");

  if (error) {
    return (
      <EmptyState
        title="Could not load your profile"
        text={error}
        action={<Button onClick={reload}>Try again</Button>}
      />
    );
  }

  if (loading || !data) {
    return <Skeleton className="h-[34rem] max-w-2xl rounded-2xl" />;
  }

  return <Form profile={data.profile} onSaved={reload} />;
}