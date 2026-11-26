"use client";

import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ApiClientError, apiFetch } from "@/lib/api";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import type { MyService } from "@/lib/types";

const MAX_IMAGES = 4;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const selectClass =
  "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

const serviceSchema = z.object({
  serviceName: z.string().trim().min(3, "Name must be at least 3 characters").max(100),
  category: z.string().min(1, "Please choose a category"),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description is too long"),
  price: z
    .string()
    .trim()
    .min(1, "Price is required")
    .refine(
      (value) => Number.isFinite(Number(value)) && Number(value) > 0,
      "Price must be greater than 0"
    ),
  location: z.string().trim().min(2, "Location is required").max(100),
});

type ServiceValues = z.infer<typeof serviceSchema>;

interface Picked {
  file: File;
  url: string;
}

export function EditServiceForm({ service }: { service: MyService }) {
  const router = useRouter();
  const [existing, setExisting] = useState<string[]>(service.images);
  const [picked, setPicked] = useState<Picked[]>([]);
  const [imageError, setImageError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const totalImages = existing.length + picked.length;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      serviceName: service.serviceName,
      category: service.category,
      description: service.description,
      price: String(service.price),
      location: service.location,
    },
  });

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    setImageError("");

    const next = [...picked];
    for (const file of files) {
      if (existing.length + next.length >= MAX_IMAGES) {
        toast.error(`You can have up to ${MAX_IMAGES} images`);
        break;
      }
      if (!IMAGE_TYPES.includes(file.type)) {
        toast.error(`${file.name}: please use JPG, PNG, WEBP or GIF`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5 MB`);
        continue;
      }
      next.push({ file, url: URL.createObjectURL(file) });
    }
    setPicked(next);
  }

  function removeExisting(index: number) {
    setExisting(existing.filter((_, i) => i !== index));
  }

  function removePicked(index: number) {
    const item = picked[index];
    if (item) URL.revokeObjectURL(item.url);
    setPicked(picked.filter((_, i) => i !== index));
  }

  async function onSubmit(values: ServiceValues) {
    if (totalImages === 0) {
      setImageError("Please keep at least 1 image");
      return;
    }

    setSubmitting(true);
    try {
      const uploadedUrls: string[] = [];
      try {
        for (const { file } of picked) {
          const formData = new FormData();
          formData.append("image", file);
          const uploaded = await apiFetch<{ url: string }>("/api/upload", {
            method: "POST",
            auth: true,
            body: formData,
          });
          uploadedUrls.push(uploaded.url);
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? `Image upload failed: ${error.message}` : "Image upload failed"
        );
        return;
      }

      await apiFetch(`/api/vendor/services/${service._id}`, {
        method: "PATCH",
        auth: true,
        body: {
          serviceName: values.serviceName,
          category: values.category,
          description: values.description,
          price: Number(values.price),
          location: values.location,
          images: [...existing, ...uploadedUrls],
        },
      });

      toast.success("Service updated and sent for admin review");
      router.push("/dashboard/vendor/services");
    } catch (error) {
      if (error instanceof ApiClientError) {
        const detail = error.errors?.[0]?.message;
        toast.error(detail ? `${error.message}: ${detail}` : error.message);
      } else {
        toast.error("Could not update the service");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl space-y-5 rounded-2xl border bg-card p-6 shadow-sm"
      noValidate
    >
      <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
        After you save, the service goes back to <strong>pending</strong> and an admin must
        approve it again.
      </p>

      <div className="space-y-2">
        <Label htmlFor="serviceName">Service name</Label>
        <Input id="serviceName" {...register("serviceName")} />
        {errors.serviceName ? (
          <p className="text-sm text-destructive">{errors.serviceName.message}</p>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select id="category" className={selectClass} {...register("category")}>
            <option value="">Choose a category</option>
            {SERVICE_CATEGORIES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          {errors.category ? (
            <p className="text-sm text-destructive">{errors.category.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (USD)</Label>
          <Input
            id="price"
            type="number"
            inputMode="decimal"
            min="1"
            step="any"
            {...register("price")}
          />
          {errors.price ? <p className="text-sm text-destructive">{errors.price.message}</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" {...register("location")} />
        {errors.location ? (
          <p className="text-sm text-destructive">{errors.location.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={5} {...register("description")} />
        {errors.description ? (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label>Service images (1 to {MAX_IMAGES})</Label>
        <div className="flex flex-wrap gap-3">
          {existing.map((src, index) => (
            <div key={src} className="relative size-24 overflow-hidden rounded-lg border">
              <Image src={src} alt={`Current image ${index + 1}`} fill sizes="96px" className="object-cover" />
              <button
                type="button"
                onClick={() => removeExisting(index)}
                aria-label={`Remove image ${index + 1}`}
                className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}

          {picked.map((item, index) => (
            <div key={item.url} className="relative size-24 overflow-hidden rounded-lg border">
              <Image
                src={item.url}
                alt={`New image ${index + 1}`}
                fill
                unoptimized
                sizes="96px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removePicked(index)}
                aria-label={`Remove new image ${index + 1}`}
                className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}

          {totalImages < MAX_IMAGES ? (
            <label className="flex size-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-xs text-muted-foreground transition hover:border-primary hover:text-primary">
              <ImagePlus className="size-5" />
              Add
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={handleFiles}
              />
            </label>
          ) : null}
        </div>
        {imageError ? <p className="text-sm text-destructive">{imageError}</p> : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={submitting}
          onClick={() => router.push("/dashboard/vendor/services")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}