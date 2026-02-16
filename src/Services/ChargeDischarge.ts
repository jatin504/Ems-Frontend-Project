import axios from "axios";

const BASE_URL = "http://75.119.146.115:5179";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const getChargeDischargeTrack = async () => {
  const res = await api.get("/api/bess_control/charge_discharge_track");
  return res.data;
};
