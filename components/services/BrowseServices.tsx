"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/EmptyState";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServiceCardSkeleton } from "@/components/services/ServiceCardSkeleton";
import { fetchServices, type BrowseResponse } from "@/lib/data/browse";
import { SERVICE_CATEGORIES } from "@/lib/constants";

const selectClass =
  "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

interface LoadedResult {
  key: string;
  data?: BrowseResponse;
  error?: string;
}

export function BrowseServices({ locations }: { locations: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryString = searchParams.toString();
  const urlSearch = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const location = searchParams.get("location") ?? "";
  const sort = searchParams.get("sort") ?? "newest";
  const page = Number(searchParams.get("page") ?? "1") || 1;

  const [searchText, setSearchText] = useState(urlSearch);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<LoadedResult | null>(null);

  // A result belongs to one URL (and one retry number).
  const requestKey = `${queryString}#${attempt}`;
  const loading = result?.key !== requestKey;
  const data = !loading ? result?.data : undefined;
  const error = !loading ? (result?.error ?? "") : "";

  // Change one or more URL values. Changing a filter goes back to page 1.
  const updateParams = useCallback(
    (changes: Record<string, string>, keepPage = false) => {
      const params = new URLSearchParams(queryString);
      for (const [key, value] of Object.entries(changes)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      if (!keepPage) params.delete("page");
      const next = params.toString();
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    },
    [queryString, pathname, router]
  );

  // Debounce: update the URL 400 ms after the person stops typing.
  useEffect(() => {
    if (searchText.trim() === urlSearch) return;
    const timer = setTimeout(() => {
      updateParams({ search: searchText.trim() });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText, urlSearch, updateParams]);

  // Load services whenever the URL changes.
  // setResult is only called after the request finishes, never directly in the effect.
  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams(queryString);
    params.set("limit", "9");

    fetchServices(params)
      .then((response) => {
        if (!controller.signal.aborted) {
          setResult({ key: requestKey, data: response });
        }
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setResult({
            key: requestKey,
            error: err instanceof Error ? err.message : "Could not load services",
          });
        }
      });

    return () => controller.abort();
  }, [queryString, requestKey]);

  const hasFilters = Boolean(urlSearch || category || location || sort !== "newest");

  function clearAll() {
    setSearchText("");
    router.replace(pathname, { scroll: false });
  }

  const services = data?.services ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="grid gap-3 rounded-2xl border bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative sm:col-span-2">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search services by name..."
            className="pl-9"
            aria-label="Search services"
          />
        </div>

        <select
          value={category}
          onChange={(event) => updateParams({ category: event.target.value })}
          className={selectClass}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {SERVICE_CATEGORIES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={location}
          onChange={(event) => updateParams({ location: event.target.value })}
          className={selectClass}
          aria-label="Filter by location"
        >
          <option value="">All locations</option>
          {locations.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(event) =>
            updateParams({ sort: event.target.value === "newest" ? "" : event.target.value })
          }
          className={selectClass}
          aria-label="Sort services"
        >
          <option value="newest">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          {loading
            ? "Loading services..."
            : `${pagination?.total ?? 0} ${pagination?.total === 1 ? "service" : "services"} found`}
        </p>
        {hasFilters ? (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <X className="size-4" />
            Clear filters
          </Button>
        ) : null}
      </div>

      {/* Results */}
      {error ? (
        <EmptyState
          title="Could not load services"
          text={error}
          action={<Button onClick={() => setAttempt((value) => value + 1)}>Try again</Button>}
        />
      ) : loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ServiceCardSkeleton key={index} />
          ))}
        </div>
      ) : services.length === 0 ? (
        <EmptyState
          title="No services found"
          text="Try a different search or remove some filters."
          action={hasFilters ? <Button onClick={clearAll}>Clear filters</Button> : undefined}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || loading}
            onClick={() => updateParams({ page: String(page - 1) }, true)}
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pagination.totalPages || loading}
            onClick={() => updateParams({ page: String(page + 1) }, true)}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}