import axios from "axios";

/* ================= API BASE ================= */

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString()?.replace(/\/$/, "") ||
  "";

/* ================= API ================= */

const GetWidgetTemplatesAPI = async () => {
  try {
    const response = await axios.get(`${API_BASE}/widget-template/get`);
    return response.data;
  } catch (error) {
    console.error("GetWidgetTemplatesAPI error:", error);
    throw error;
  }
};

export default GetWidgetTemplatesAPI;