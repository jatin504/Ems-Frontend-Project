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

const BESS_BASE_URL = "http://75.119.146.115:5179";

export function useBessControlModes() {
  // ===============================
  // SET BESS CONTROL MODES
  // ===============================
  const setBessControlModes = async (payload: BessModePayload) => {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${BESS_BASE_URL}/api/bess_control/set_bess_control_modes`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
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
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${BESS_BASE_URL}/api/bess_control/set_bess_control_setpoints`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return res.data;
  };

  // ===============================
  // GET BESS CONTROL SETPOINTS
  // ===============================
  const getBessControlSetpoints = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${BESS_BASE_URL}/api/bess_control/get_bess_control_setpoints`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return res.data;
  };

  // ===============================
  // GET BESS CONTROL MODES
  // ===============================
  const getBessControlModes = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${BESS_BASE_URL}/api/bess_control/get_bess_control_modes`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return res.data;
  };

  // ===============================
  // 🔥 AUTO REFRESH (NO PAGE RELOAD)
  // ===============================
  const startBessModeAutoRefresh = (
    onUpdate: (data: any) => void,
    intervalMs = 3000 // ⏱ 3 sec
  ) => {
    // first load
    getBessControlModes().then(onUpdate);

    const interval = setInterval(async () => {
      const data = await getBessControlModes();
      onUpdate(data);
    }, intervalMs);

    return () => clearInterval(interval); // cleanup
  };

  return {
    setBessControlModes,
    setBessControlSetpoints,
    getBessControlSetpoints,
    getBessControlModes,
    startBessModeAutoRefresh, // ✅ NEW
  };
}
