import axios from "axios";

/* ================= API BASE ================= */

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString()?.replace(/\/$/, "") ||
  "";

/* ================= API ================= */

const GetDashboardDataAPI = async (dashboardConfig: any) => {
  try {
    const response = await axios.post(
      `${API_BASE}/get-dashboard-data`,
      dashboardConfig
    );
    return response.data;
  } catch (error) {
    console.error("GetDashboardDataAPI error:", error);
    throw error;
  }
};

export default GetDashboardDataAPI;