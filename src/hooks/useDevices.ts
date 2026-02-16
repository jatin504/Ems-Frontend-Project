import { useCallback, useEffect, useMemo, useState } from "react";
import axios, { AxiosError } from "axios";
import type { DeviceConfig } from "../components/DeviceConfig/DeviceConfigFullScreenForm";

type DevicesResponse = { devices: DeviceConfig[] };
type AddDevicePayload = { device_data: DeviceConfig };

const DEFAULT_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString() || "http://75.119.146.115:5179";

export function useDevices(baseUrl: string = DEFAULT_BASE) {
  const [devices, setDevices] = useState<DeviceConfig[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  // Create axios instance to reuse base URL and headers
  const api = useMemo(
    () =>
      axios.create({
        baseURL: baseUrl.replace(/\/+$/, ""), // Ensure no trailing slashes
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    [baseUrl]
  );

  const listUrl = "/api/device/list";
  const addUrl = "/api/device/";

  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get<DevicesResponse>(listUrl);
      setDevices(res.data.devices);
      return res.data.devices;
    } catch (err) {
      const axiosError = err as AxiosError;

      // Only set error if not an abort/cancel
      if (axiosError.code !== "ERR_CANCELED") {
        setError(axiosError);
        console.error("Failed to fetch devices:", axiosError.message);
      }

      setDevices([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [api, listUrl]);

  const addDevice = useCallback(
    async (device: DeviceConfig[]) => {
          // console.log("OBJECTTTTTT: ", device)
      try {
        const res = await api.post<AddDevicePayload>(addUrl, { device_data: device });
        // Optionally refresh device list after successful add
        await fetchDevices();
        return res.data;
      } catch (err) {
        const axiosError = err as AxiosError<{ error?: string; message?: string }>;

        let msg = `Add device failed: ${axiosError.code}`;

        if (axiosError.response) {
          const { status, data } = axiosError.response;
          msg = data?.error || data?.message || `Add device failed: ${status}`;
        }

        console.error("Add device error:", msg);
        throw new Error(msg);
      }
    },
    [api, addUrl, fetchDevices]
  );

  // Fetch devices on mount
  useEffect(() => {
    fetchDevices();
    // Cleanup is automatic with axios (no AbortController needed unless you manually cancel)
  }, [fetchDevices]);

  return {
    devices,
    loading,
    error,
    refresh: fetchDevices,
    addDevice,
  };
}