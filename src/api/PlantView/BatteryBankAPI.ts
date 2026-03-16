import axios from "axios";

/* ================= API BASE ================= */

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString()?.replace(/\/$/, "") ||
  "";

/* ================= API ================= */

const BatteryBankAPI = async (plant: string) => {
  const body = {
    plant_id: plant,
  };

  try {
    const response = await axios.post(
      `${API_BASE}/api/plantview/v2/battery_bank`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("BatteryBankAPI error:", error);
    throw error;
  }
};

export default BatteryBankAPI;