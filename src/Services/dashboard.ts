import axios from "axios";

/* ================= API BASE ================= */

const BASE_URL =
  (import.meta as any).env?.VITE_API_BASE?.toString()?.replace(/\/$/, "") ||
  "";

/* ================= AXIOS INSTANCE ================= */

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= API ================= */

export const getWMSStatus = async (payload: {
  pattern: string;
  column: string;
}) => {
  const res = await api.post("/api/online_devices", payload);
  return res.data;
};