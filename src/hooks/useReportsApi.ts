import { useState } from "react";

const BASE_URL =
  (import.meta as any).env?.VITE_API_BASE ||
  "http://75.119.146.115:5179";

const safeJson = async (res: Response) => {
  try {
    return await res.json();
  } catch {
    return {};
  }
};

type ScheduleMode = "email" | "self";

export default function useReportsApi() {
  const [loading, setLoading] = useState(false);

  const createTemplate = async (payload: any) => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/reports/templates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const data = await safeJson(res);
      if (!res.ok || !data?.ok) throw new Error(data?.error || `Status ${res.status}`);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const scheduleReport = async (payload: any) => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/reports/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const data = await safeJson(res);
      if (!res.ok || !data?.ok) throw new Error(data?.error || `Status ${res.status}`);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const saveOrSchedule = async (
    payload: any,
    mode: ScheduleMode,
    shouldSchedule: boolean
  ) => {
    const url = shouldSchedule
      ? "/api/reports/schedule"
      : "/api/reports/templates";
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${BASE_URL}${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const data = await safeJson(res);
      if (!res.ok || !data?.ok) throw new Error(data?.error || `Status ${res.status}`);
      return data;
    } finally {
      setLoading(false);
    }
  };

  return { loading, createTemplate, scheduleReport, saveOrSchedule };
}
