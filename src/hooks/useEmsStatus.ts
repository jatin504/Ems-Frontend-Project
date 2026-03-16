import { useEffect, useState } from "react";

interface EmsFlags {
  enable_capped_dynamic_strategy: number;
  max_cycle_life_reached: number;
  manual_override_enabled: number;
  internal_controlling_executing: number;
  enable_tou_tariff_strategy: number;
  enable_peak_shaving_strategy: number;
  is_db_healthy: number;
  is_protocol_healthy: number;
}

interface EmsStatusResponse {
  success: boolean;
  data: {
    flags: EmsFlags;
  };
}

const API_BASE = import.meta.env.VITE_API_BASE;

export const useEmsStatus = (pollInterval = 5000) => {
  const [flags, setFlags] = useState<EmsFlags | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE}/api/lastest-direct-data/ems-status`
      );

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const json: EmsStatusResponse = await res.json();

      if (json.success) {
        setFlags(json.data.flags);
        setError(null);
      } else {
        throw new Error("API returned success = false");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch EMS status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    const interval = setInterval(fetchStatus, pollInterval);

    return () => clearInterval(interval);
  }, [pollInterval]);

  return {
    flags,
    loading,
    error,
    refresh: fetchStatus,
  };
};