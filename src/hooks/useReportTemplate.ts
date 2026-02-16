import { useState } from "react";

const BASE_URL =
  (import.meta as any).env?.VITE_API_BASE ||
  "http://75.119.146.115:5179";

export default function useReportTemplate() {
  const [loading, setLoading] = useState(false);
  const [templateData, setTemplateData] = useState<any>(null);

  // ===============================
  // 🔵 SAFE JSON PARSER
  // ===============================
  const safeJson = async (res: Response) => {
    try {
      return await res.json();
    } catch {
      return {};
    }
  };

  // ===============================
  // 🔵 GET SINGLE TEMPLATE
  // ===============================
  const fetchTemplateByName = async (reportName: string) => {
    try {
      setLoading(true);

      const res = await fetch(
        `${BASE_URL}/api/reports/templates/${encodeURIComponent(reportName)}`
      );

      const data = await safeJson(res);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to fetch template");
      }

      setTemplateData(data);
      return data;
    } catch (err) {
      console.error("fetchTemplateByName error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // 🟢 CLEAN PAYLOAD BUILDER
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
  // 🟢 UPDATE TEMPLATE (FIXED)
  // ===============================
  const updateTemplate = async (reportName: string, payload: any) => {
    try {
      setLoading(true);

      const token = sessionStorage.getItem("token");

      const cleanPayload = buildUpdatePayload(payload);

      const res = await fetch(
        `${BASE_URL}/api/reports/templates/${encodeURIComponent(reportName)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(cleanPayload),
        }
      );

      const data = await safeJson(res);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Update failed");
      }

      return data;
    } catch (err) {
      console.error("updateTemplate error:", err);
      throw err;
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
