import { useState, useEffect, useRef } from "react";
import axios from "axios";
import type { LatestData, UseLatestDataReturn } from "../../types/latest/latestData";

const BASE_URL = import.meta.env.VITE_API_BASE;

type Status = "idle" | "loading" | "success" | "error";

export const useLatestPOIData = (keys: string[]): UseLatestDataReturn => {
  const [data, setData] = useState<LatestData[] | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const keysRef = useRef(keys);

  useEffect(() => {
    keysRef.current = keys;
  }, [keys]);

  const fetchData = async () => {
    if (keysRef.current.length === 0) {
      setData([]);
      setStatus("success");
      return;
    }

    setStatus("loading");

    try {
      const params = new URLSearchParams({
        keys: keysRef.current.join(","),
      });

      const response = await axios.get<LatestData[]>(
        `${BASE_URL}/latest/_poi_meter_?${params}`
      );

      setData(response.data);
      setStatus("success");
    } catch (err: any) {
      setError(err.message || "Failed to fetch POI data");
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchData();

    const now = new Date();
    const msUntilNextMinute =
      60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

    let intervalId: any;

    const initialTimeout = setTimeout(() => {
      fetchData();
      intervalId = setInterval(fetchData, 60000);
    }, msUntilNextMinute);

    return () => {
      clearTimeout(initialTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return { data, status, error };
};