import axios from "axios";

/* ================= API BASE ================= */

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString()?.replace(/\/$/, "") ||
  "";

/* ================= API ================= */

const SaveDashboardAPI = async (dashboardConfig: any) => {
  try {
    const response = await axios.post(
      `${API_BASE}/dashboard/save`,
      dashboardConfig
    );
    return response.data;
  } catch (error) {
    console.error("SaveDashboardAPI error:", error);
    throw error;
  }
};

export default SaveDashboardAPI;