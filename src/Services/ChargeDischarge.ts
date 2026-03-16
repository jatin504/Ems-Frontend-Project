import axios from "axios";

/* ================= API BASE ================= */

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString()?.replace(/\/$/, "") ||
  "";

/* ================= AXIOS INSTANCE ================= */

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

/* ================= API ================= */

export const getChargeDischargeTrack = async () => {
  const res = await api.get("/api/bess_control/charge_discharge_track");
  return res.data;
};