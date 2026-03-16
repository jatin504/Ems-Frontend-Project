import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

/* ================= TYPES ================= */

export type DamConfig = {
  gate_closure_offset_hours: number;
  planning_start_offset_hours: number;
  planning_end_offset_hours: number;
  finalize_start_offset_hours: number;
  finalize_end_offset_hours: number;
  clearing_offset_hours: number;
};

export type RtmConfig = {
  block_minutes: number;
  plan_start_minutes: number;
  plan_end_minutes: number;
  freeze_at_minutes: number;
  submit_at_minutes: number;
};

/* ================= HOOK ================= */

export function useMarketConfig() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  function getToken(): string {
    return sessionStorage.getItem("token") || "";
  }

  /* ================= DAM ================= */

  const getDAMConfig = async (): Promise<DamConfig | null> => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/api/market/dam-timing`, {
        method: "GET",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) {
        throw new Error(`DAM GET failed (${res.status})`);
      }

      const json = await res.json();
      return json.data as DamConfig;
    } catch (err: any) {
      console.error("getDAMConfig error:", err);
      setError(err.message || "Failed to fetch DAM config");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveDAMConfig = async (
    payload: DamConfig,
    password?: string
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      };

      if (password) {
        headers["X-Confirm-Password"] = password;
      }

      const res = await fetch(`${API_BASE}/api/market/dam-timing`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`DAM POST failed (${res.status})`);
      }
    } catch (err: any) {
      console.error("saveDAMConfig error:", err);
      setError(err.message || "Failed to save DAM config");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* ================= RTM ================= */

  const getRTMConfig = async (): Promise<RtmConfig | null> => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/api/market/rtm-timing`, {
        method: "GET",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) {
        throw new Error(`RTM GET failed (${res.status})`);
      }

      const json = await res.json();
      return json.data as RtmConfig;
    } catch (err: any) {
      console.error("getRTMConfig error:", err);
      setError(err.message || "Failed to fetch RTM config");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveRTMConfig = async (
    payload: RtmConfig,
    password?: string
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      };

      if (password) {
        headers["X-Confirm-Password"] = password;
      }

      const res = await fetch(`${API_BASE}/api/market/rtm-timing`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`RTM POST failed (${res.status})`);
      }
    } catch (err: any) {
      console.error("saveRTMConfig error:", err);
      setError(err.message || "Failed to save RTM config");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getDAMConfig,
    saveDAMConfig,
    getRTMConfig,
    saveRTMConfig,
  };
}