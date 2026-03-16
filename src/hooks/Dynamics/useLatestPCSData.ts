import { useState, useEffect, useRef } from "react";
import axios from "axios";
import type { LatestData, UseLatestDataReturn } from "../../types/latest/latestData";

const BASE_URL = import.meta.env.VITE_API_BASE;
const API_URL = `${BASE_URL}/latest`;

type Status = "idle" | "loading" | "success" | "error";

export const useLatestDynamicData = (
  keys: string[],
  pattern: string
): UseLatestDataReturn => {
  const [data, setData] = useState<LatestData[] | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const keysRef = useRef(keys);

  useEffect(() => {
    keysRef.current = keys;
  }, [keys]);

  const fetchData = async () => {
    if (keys.length === 0) {
      setData([]);
      setStatus("success");
      return;
    }

    setStatus("loading");

    try {
      const params = new URLSearchParams({ keys: keys.join(",") });

      const response = await axios.get<LatestData[]>(
        `${API_URL}/${pattern}?${params}`
      );

      setData(response.data);
      setStatus("success");
    } catch (err: any) {
      setError(err.message || "Failed to fetch ESS data");
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchData();

    const now = new Date();
    const msUntilNextMinute =
      60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

    const initialTimeout = setTimeout(() => {
      fetchData();

      const intervalId = setInterval(fetchData, 60000);

      return () => clearInterval(intervalId);
    }, msUntilNextMinute);

    return () => clearTimeout(initialTimeout);
  }, []);

  return { data, status, error };
};