"use client";

import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Settings } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearTokenCache } from "@/lib/api";
import { signOut } from "@/lib/auth-client";

interface UserMenuProps {
  name: string;
  email: string;
  image?: string | null;
    role?: string | null;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function UserMenu({ name, email, image, role }: UserMenuProps) {
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    clearTokenCache();
    toast.success("You have been signed out");
    router.push("/");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 rounded-full border bg-card py-1 pr-3 pl-1 text-sm outline-none transition hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Open profile menu"
      >
        <Avatar className="size-8">
          {image ? <AvatarImage src={image} alt={name} /> : null}
          <AvatarFallback>{initials(name)}</AvatarFallback>
        </Avatar>
        <span className="hidden max-w-28 truncate font-medium sm:block">{name}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <div className="px-2 py-2">
          <p className="truncate text-sm font-semibold">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
          {role ? (
            <p className="mt-1 text-xs font-medium text-primary capitalize">{role}</p>
          ) : null}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
          <LayoutDashboard className="size-4" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <Settings className="size-4" />
          Profile Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}