import axios from "axios";

/* ================= API BASE ================= */

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString()?.replace(/\/$/, "") ||
  "";

/* ================= API ================= */

const GetDashboardAPI = async () => {
  try {
    const response = await axios.get(`${API_BASE}/dashboard/get`);
    return response.data;
  } catch (error) {
    console.error("GetDashboardAPI error:", error);
    throw error;
  }
};

export default GetDashboardAPI;