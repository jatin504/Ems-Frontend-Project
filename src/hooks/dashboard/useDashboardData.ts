// src/hooks/dashboard/useDashboardData.ts
import { useCallback, useRef, useState } from "react";
import GetDashboardDataAPI from "../../api/Dashboard/GetDashboardDataAPI";

type Dashboard = any;
type Widget = any;

export const useDashboardData = () => {
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // A ref to the current AbortController so we can cancel overlapping requests
  const currentControllerRef = useRef<AbortController | null>(null);

  const cancelPrevious = useCallback(() => {
    try {
      if (currentControllerRef.current) {
        currentControllerRef.current.abort();
      }
    } catch (e) {
      // ignore
    } finally {
      currentControllerRef.current = null;
    }
  }, []);

  const transformResponseToMap = useCallback((resp: any): Record<string, any> => {
    const out: Record<string, any> = {};
    if (!resp) return out;

    // If server already returns a map keyed by returnDataName, use it
    if (typeof resp === "object" && !Array.isArray(resp)) {
      // Heuristic: if values are objects/arrays it's probably already correct shape
      const keys = Object.keys(resp);
      if (keys.length > 0) {
        return resp;
      }
    }

    // If server returns an array of { key, data } items
    if (Array.isArray(resp)) {
      for (const item of resp) {
        const key = item?.key ?? item?.returnDataName;
        if (key) out[key] = item.data ?? item.payload ?? item.value ?? item;
      }
      return out;
    }

    // Fallback: put entire response under 'dashboard'
    out["dashboard"] = resp;
    return out;
  }, []);

  /**
   * loadDashboardData
   * Accepts dashboardConfig (preferred). Cancels any previous in-flight request.
   */
  const loadDashboardData = useCallback(
    async (dashboardConfig?: Dashboard) => {
      // if no widgets, clear data and return early
      if (!dashboardConfig?.config?.widgets || Object.keys(dashboardConfig.config.widgets).length === 0) {
        setData(null);
        setLoading(false);
        setError(null);
        return null;
      }

      cancelPrevious();
      const controller = new AbortController();
      currentControllerRef.current = controller;
      setLoading(true);
      setError(null);

      try {
        // Prefer passing controller.signal to your existing API wrapper.
        // If GetDashboardDataAPI supports options like (payload, { signal }), it will properly abort.
        const payload = dashboardConfig;

        // If your GetDashboardDataAPI does not accept signal, you may need to adapt it.
        // Here we attempt to call it with a second options param; if your wrapper ignores it, consider
        // updating the wrapper to accept signal or replace this call with fetch/axios directly.
        // Example: GetDashboardDataAPI(payload, { signal: controller.signal })
        const res = await GetDashboardDataAPI(payload, { signal: controller.signal });

        const mapped = transformResponseToMap(res);
        setData((prev) => ({ ...(prev ?? {}), ...mapped }));
        setLoading(false);
        currentControllerRef.current = null;
        return mapped;
      } catch (err: any) {
        // If aborted, ignore
        if (err?.name === "AbortError" || err?.code === "ERR_CANCELED") {
          // aborted
        } else {
          console.error("loadDashboardData error:", err);
          setError(err?.message ?? "Failed to load dashboard data");
        }
        setLoading(false);
        currentControllerRef.current = null;
        return null;
      }
    },
    [cancelPrevious, transformResponseToMap]
  );

  /**
   * fetchForWidget
   * Sends a minimal request to fetch only the newly added widget (most reliable immediately after add).
   * Backend should accept payload like { widgets: [...] } or similar. Adjust as needed.
   */
  const fetchForWidget = useCallback(
    async (widget: Widget) => {
      if (!widget) return null;
      cancelPrevious();
      const controller = new AbortController();
      currentControllerRef.current = controller;
      setLoading(true);
      setError(null);

      try {
        const minimalPayload = {
          widgets: [
            {
              id: widget.id,
              dataSource: widget.dataSource ?? {},
            },
          ],
        };

        const res = await GetDashboardDataAPI(minimalPayload, { signal: controller.signal });
        const mapped = transformResponseToMap(res);
        setData((prev) => ({ ...(prev ?? {}), ...mapped }));
        setLoading(false);
        currentControllerRef.current = null;
        return mapped;
      } catch (err: any) {
        if (err?.name === "AbortError" || err?.code === "ERR_CANCELED") {
          // aborted
        } else {
          console.error("fetchForWidget error:", err);
          setError(err?.message ?? "Failed to fetch widget data");
        }
        setLoading(false);
        currentControllerRef.current = null;
        return null;
      }
    },
    [cancelPrevious, transformResponseToMap]
  );

  const clearData = useCallback((key?: string) => {
    if (!key) {
      setData(null);
      return;
    }
    setData((prev) => {
      if (!prev) return prev;
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  }, []);

  return {
    loadDashboardData,
    fetchForWidget,
    data,
    loading,
    error,
    clearData,
  };
};

export default useDashboardData;
