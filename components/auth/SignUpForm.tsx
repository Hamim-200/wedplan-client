"use client";

import { useState, type ChangeEvent } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { RoleSelector } from "@/components/auth/RoleSelector";
import { apiFetch, clearTokenCache } from "@/lib/api";
import { signUp } from "@/lib/auth-client";
import { getDashboardPath } from "@/lib/roles";
import { signUpSchema, type SignUpValues } from "@/lib/validations/auth";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", role: "customer", businessName: "" },
  });

  const role = watch("role");
  const password = watch("password");

  const passwordRules = [
    { label: "At least 6 characters", ok: password.length >= 6 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "One lowercase letter", ok: /[a-z]/.test(password) },
  ];

  function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setPreview(null);
      return;
    }
    if (!IMAGE_TYPES.includes(file.type)) {
      toast.error("Please choose a JPG, PNG, WEBP or GIF image");
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5 MB or smaller");
      event.target.value = "";
      return;
    }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function onSubmit(values: SignUpValues) {
    setSubmitting(true);
    try {
      // 1. Upload the optional profile image to ImgBB (through our server).
      let image: string | undefined;
      if (imageFile) {
        try {
          const formData = new FormData();
          formData.append("image", imageFile);
          const uploaded = await apiFetch<{ url: string }>("/api/upload/avatar", {
            method: "POST",
            body: formData,
          });
          image = uploaded.url;
        } catch (error) {
          toast.error(
            error instanceof Error ? `Image upload failed: ${error.message}` : "Image upload failed"
          );
          return;
        }
      }

      // 2. Create the account (this also signs the user in).
      const { error } = await signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        image,
      });
      if (error) {
        toast.error(error.message ?? "Could not create your account");
        return;
      }
      clearTokenCache();

      // 3. Save the chosen role on our server (one time only).
      try {
        await apiFetch("/api/users/me/onboarding", {
          method: "POST",
          auth: true,
          body: { role: values.role, businessName: values.businessName || undefined },
        });
      } catch (onboardingError) {
        toast.error(
          onboardingError instanceof Error
            ? onboardingError.message
            : "Account created, but we could not save your account type"
        );
        window.location.assign("/onboarding");
        return;
      }

      toast.success("Account created! Welcome to WedPlan");
      // A full reload makes sure the Navbar shows the new role.
      window.location.assign(getDashboardPath(values.role));
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label>I want to join as</Label>
          <RoleSelector
            value={role}
            onChange={(value) => setValue("role", value, { shouldValidate: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" autoComplete="name" placeholder="Your full name" {...register("name")} />
          {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
        </div>

        {role === "vendor" ? (
          <div className="space-y-2">
            <Label htmlFor="businessName">Business name</Label>
            <Input
              id="businessName"
              placeholder="e.g. Dream Weddings Studio"
              {...register("businessName")}
            />
            {errors.businessName ? (
              <p className="text-sm text-destructive">{errors.businessName.message}</p>
            ) : null}
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              className="pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <ul className="space-y-1 text-xs">
            {passwordRules.map((rule) => (
              <li
                key={rule.label}
                className={`flex items-center gap-1.5 ${
                  rule.ok ? "text-green-600" : "text-muted-foreground"
                }`}
              >
                {rule.ok ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                {rule.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Profile image (optional)</Label>
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              {preview ? <AvatarImage src={preview} alt="Profile preview" /> : null}
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
            <Input
              id="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImage}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {submitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        OR
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="space-y-2">
        <GoogleButton callbackURL="/dashboard" />
        <p className="text-center text-xs text-muted-foreground">
          With Google, you will choose Customer or Vendor on the next screen.
        </p>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/signin" className="font-medium text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}