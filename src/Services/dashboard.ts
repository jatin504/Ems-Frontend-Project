import axios from "axios";

const BASE_URL = "http://75.119.146.115:5179";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getWMSStatus = async (payload: {
  pattern: string;
  column: string;
}) => {
  const res = await api.post("/api/online_devices", payload);
  return res.data; // { response, data }
};
