"use client";

import { useState } from "react";
import { Eye, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserDetailsDialog } from "@/components/admin/UserDetailsDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { useApiData } from "@/hooks/useApiData";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { apiFetch } from "@/lib/api";
import { formatShortDate } from "@/lib/format";
import type { AdminUser, UsersResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

const selectClass =
  "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function ManageUsers() {
  const [searchText, setSearchText] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [viewId, setViewId] = useState<string | null>(null);
  const [toToggle, setToToggle] = useState<AdminUser | null>(null);
  const [busy, setBusy] = useState(false);

  const search = useDebouncedValue(searchText.trim());

  const query = new URLSearchParams({ page: String(page), limit: "10" });
  if (search) query.set("search", search);
  if (role) query.set("role", role);

  const { data, error, loading, reload } = useApiData<UsersResponse>(
    `/api/admin/users?${query.toString()}`
  );

  async function confirmToggle() {
    if (!toToggle) return;
    const action = toToggle.isBlocked ? "unblock" : "block";
    setBusy(true);
    try {
      await apiFetch(`/api/admin/users/${toToggle.id}/${action}`, {
        method: "PATCH",
        auth: true,
      });
      toast.success(action === "block" ? "User blocked" : "User unblocked");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update the user");
    } finally {
      setBusy(false);
      setToToggle(null);
      reload();
    }
  }

  return (
    <>
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="relative sm:col-span-2">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchText}
            onChange={(event) => {
              setSearchText(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email..."
            className="pl-9"
            aria-label="Search users"
          />
        </div>
        <select
          value={role}
          onChange={(event) => {
            setRole(event.target.value);
            setPage(1);
          }}
          className={selectClass}
          aria-label="Filter by role"
        >
          <option value="">All roles</option>
          <option value="customer">Customers</option>
          <option value="vendor">Vendors</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {error ? (
        <EmptyState
          title="Could not load users"
          text={error}
          action={<Button onClick={reload}>Try again</Button>}
        />
      ) : loading && !data ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : data && data.users.length === 0 ? (
        <EmptyState title="No users found" text="Try a different search or role filter." />
      ) : (
        <>
          <div
            className={cn(
              "overflow-x-auto rounded-2xl border bg-card shadow-sm transition-opacity",
              loading && "opacity-60"
            )}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
                          <AvatarFallback>{user.name.slice(0, 1).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{user.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
                    <TableCell>
                      {user.isBlocked ? (
                        <Badge className="bg-red-100 text-red-800">Blocked</Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {user.createdAt ? formatShortDate(user.createdAt) : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setViewId(user.id)}>
                          <Eye className="size-4" />
                          View
                        </Button>
                        {user.role !== "admin" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className={user.isBlocked ? "" : "text-destructive"}
                            onClick={() => setToToggle(user)}
                          >
                            {user.isBlocked ? "Unblock" : "Block"}
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {data ? (
            <PaginationBar
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onChange={setPage}
              disabled={loading}
            />
          ) : null}
        </>
      )}

      {viewId ? <UserDetailsDialog id={viewId} onClose={() => setViewId(null)} /> : null}

      <Dialog open={toToggle !== null} onOpenChange={(open) => !open && setToToggle(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {toToggle?.isBlocked ? "Unblock this user?" : "Block this user?"}
            </DialogTitle>
            <DialogDescription>
              {toToggle?.isBlocked
                ? `${toToggle?.name} will be able to use WedPlan again.`
                : `${toToggle?.name} will lose access to all protected features right away.`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setToToggle(null)}>
              Cancel
            </Button>
            <Button onClick={confirmToggle} disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : null}
              {toToggle?.isBlocked ? "Unblock" : "Block"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}