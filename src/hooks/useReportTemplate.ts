import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function useReportTemplate() {
  const [loading, setLoading] = useState(false);
  const [templateData, setTemplateData] = useState<any>(null);

  // ===============================
  // SAFE JSON PARSER
  // ===============================
  const safeJson = async (res: Response) => {
    try {
      return await res.json();
    } catch {
      return {};
    }
  };

  const getAuthHeader = () => {
    const token = sessionStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // ===============================
  // GET SINGLE TEMPLATE
  // ===============================
  const fetchTemplateByName = async (reportName: string) => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE}/api/reports/templates/${encodeURIComponent(reportName)}`
      );

      const data = await safeJson(res);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to fetch template");
      }

      setTemplateData(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // CLEAN PAYLOAD BUILDER
  // ===============================
  const buildUpdatePayload = (payload: any) => {
    return {
      email: payload?.email ?? null,
      scheduleTime: payload?.scheduleTime ?? null,
      scheduleLive: payload?.scheduleLive ?? null,
      selectedDateType: payload?.selectedDateType ?? null,
      selectedFrequency: payload?.selectedFrequency ?? null,
      selectedInterval: payload?.selectedInterval ?? null,
      selectedDeviceTypes: payload?.selectedDeviceTypes ?? [],
      selectedDeviceIds: payload?.selectedDeviceIds ?? [],
      selectedParams: payload?.selectedParams ?? [],
      ...(payload?.historyStartTs && payload?.historyEndTs
        ? {
            historyStartTs: payload.historyStartTs,
            historyEndTs: payload.historyEndTs,
          }
        : {}),
    };
  };

  // ===============================
  // UPDATE TEMPLATE
  // ===============================
  const updateTemplate = async (reportName: string, payload: any) => {
    try {
      setLoading(true);

      const cleanPayload = buildUpdatePayload(payload);

      const res = await fetch(
        `${API_BASE}/api/reports/templates/${encodeURIComponent(reportName)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
          body: JSON.stringify(cleanPayload),
        }
      );

      const data = await safeJson(res);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Update failed");
      }

      return data;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    templateData,
    fetchTemplateByName,
    updateTemplate,
  };
}