import { useCallback, useEffect, useState } from "react";
import { authFetch } from "./useAuth";

export type BackendHealthLog = {
  id: number;
  log_type: "PRIMARY BACKEND HEALTH" | "BACKEND SELF HEALTH";
  event_time: string;
  down_at: string | null;
  up_at: string | null;
  duration_seconds: number | null;
  status: string;
  backend_name: string | null;
  created_at: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

type BackendHealthLogsResponse = {
  success: boolean;
  data: BackendHealthLog[];
  pagination: Pagination;
  error?: string;
};

export function useBackendHealthLogs() {
  const [logs, setLogs] = useState<BackendHealthLog[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadLogs = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (from) {
        params.set("startTs", `${from}T00:00:00`);
      }

      if (to) {
        params.set("endTs", `${to}T23:59:59`);
      }

      params.set("page", String(page));
      params.set("limit", String(limit));

      const url = `/api/backend-health/logs?${params.toString()}`;

      console.log("Backend Health API:", url);

      const response = await authFetch(url);

      if (!response.ok) {
        throw new Error(
          `Backend health API failed: ${response.status}`
        );
      }

      const result: BackendHealthLogsResponse =
        await response.json();

      console.log(
        "Backend Health API Response:",
        result
      );

      if (!result.success) {
        throw new Error(
          result.error ||
            "Failed to fetch backend health logs"
        );
      }

      const apiLogs = Array.isArray(result.data)
        ? result.data
        : [];

      console.log(
        "Backend Health Logs:",
        apiLogs
      );

      setLogs(apiLogs);

      setTotal(
        Number(result.pagination?.total || 0)
      );

      setTotalPages(
        Number(
          result.pagination?.total_pages || 0
        )
      );
    } catch (error) {
      console.error(
        "Backend health logs error:",
        error
      );

      setLogs([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [
    search,
    from,
    to,
    page,
    limit,
  ]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setFrom("");
    setTo("");
    setPage(1);
  }, []);

  const refresh = useCallback(() => {
    loadLogs();
  }, [loadLogs]);

  return {
    logs,
    loading,

    search,
    setSearch,

    from,
    setFrom,

    to,
    setTo,

    page,
    setPage,

    limit,
    setLimit,

    total,
    totalPages,

    clearFilters,
    refresh,
    loadLogs,
  };
}