import axios from "axios";

export interface BessModePayload {
  [key: string]: {
    name: string;
    control_state: "local" | "remote";
    active: boolean;
    pcs_device_id: string[];
  };
}

export interface BessSetpointPayload {
  [key: string]: {
    setpoint_value: number;
    setpoint_unit: string;
  };
}

const BASE_URL = import.meta.env.VITE_API_BASE;

function getAuthHeader() {
  const token = sessionStorage.getItem("token") || "";
  return {
    Authorization: `Bearer ${token}`,
  };
}

export function useBessControlModes() {
  // ===============================
  // SET BESS CONTROL MODES
  // ===============================
  const setBessControlModes = async (payload: BessModePayload) => {
    const res = await axios.post(
      `${BASE_URL}/api/bess_control/set_bess_control_modes`,
      payload,
      {
        headers: getAuthHeader(),
      }
    );

    return res.data;
  };

  // ===============================
  // SET BESS CONTROL SETPOINTS
  // ===============================
  const setBessControlSetpoints = async (
    payload: BessSetpointPayload
  ) => {
    const res = await axios.post(
      `${BASE_URL}/api/bess_control/set_bess_control_setpoints`,
      payload,
      {
        headers: getAuthHeader(),
      }
    );

    return res.data;
  };

  // ===============================
  // GET BESS CONTROL SETPOINTS
  // ===============================
  const getBessControlSetpoints = async () => {
    const res = await axios.get(
      `${BASE_URL}/api/bess_control/get_bess_control_setpoints`,
      {
        headers: getAuthHeader(),
      }
    );

    return res.data;
  };

  // ===============================
  // GET BESS CONTROL MODES
  // ===============================
  const getBessControlModes = async () => {
    const res = await axios.get(
      `${BASE_URL}/api/bess_control/get_bess_control_modes`,
      {
        headers: getAuthHeader(),
      }
    );

    return res.data;
  };

  // ===============================
  // AUTO REFRESH
  // ===============================
  const startBessModeAutoRefresh = (
    onUpdate: (data: any) => void,
    intervalMs = 60000
  ) => {
    getBessControlModes().then(onUpdate);

    const interval = setInterval(async () => {
      const data = await getBessControlModes();
      onUpdate(data);
    }, intervalMs);

    return () => clearInterval(interval);
  };

  return {
    setBessControlModes,
    setBessControlSetpoints,
    getBessControlSetpoints,
    getBessControlModes,
    startBessModeAutoRefresh,
  };
}