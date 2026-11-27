"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface Loaded<T> {
  key: string;
  data?: T;
  error?: string;
}

export function useApiData<T>(path: string) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Loaded<T> | null>(null);

  const key = `${path}#${attempt}`;
  const loading = result?.key !== key;

  useEffect(() => {
    let cancelled = false;

    apiFetch<T>(path, { auth: true })
      .then((data) => {
        if (!cancelled) setResult({ key, data });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setResult({
            key,
            error: err instanceof Error ? err.message : "Could not load data",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [path, key]);

  const reload = useCallback(() => setAttempt((value) => value + 1), []);

  return {
    data: result?.data,
    error: loading ? undefined : result?.error,
    loading,
    reload,
  };
}