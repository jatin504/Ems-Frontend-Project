// src/api/reportTemplates.ts
export type ReportTemplatePayload = {
  reportName: string;
  deliveryType: "self" | "email";
  email?: string;
  scheduleTime: number;  // 0..23
  scheduleLive: 7 | 30;
  configuration: {
    dateType: string;
    type: string;
    interval: string;
    deviceType: string;
    deviceIds: string[];
    params: string[];
  };
};

export async function saveReportTemplate(payload: ReportTemplatePayload) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = sessionStorage.getItem("token");
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch("/api/reports/template", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = "Failed to save template";
    try {
      const err = await res.json();
      if (err?.message) msg = err.message;
    } catch {}
    throw new Error(msg);
  }

  return res.json() as Promise<{ message: string; reportName: string }>;
}
