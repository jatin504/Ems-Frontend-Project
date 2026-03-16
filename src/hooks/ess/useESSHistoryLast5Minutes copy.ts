import { useState, useEffect } from "react";
import axios from "axios";
import type { HistoryItem } from "../../types/history/historyData";

const BASE_URL = import.meta.env.VITE_API_BASE;

type HistoryResponse = Record<string, HistoryItem[]>;

export const useESSHistoryLast5Minutes = (keys: string[]) => {
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStatus("loading");

        const now = new Date();
        const startDate = new Date(now.getTime() - 5 * 60 * 1000);

        const pad = (n: number) => n.toString().padStart(2, "0");

        const formatLocal = (date: Date): string => {
          return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
            date.getDate()
          )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
            date.getSeconds()
          )}`;
        };

        const startTs = formatLocal(startDate);
        const endTs = formatLocal(now);

        const params = new URLSearchParams({
          keys: keys.join(","),
          startTs,
          endTs,
        });

        const response = await axios.get<HistoryResponse>(
          `${BASE_URL}/history/ess_ess_?${params}`
        );

        setData(response.data);
        setStatus("success");
      } catch (err: any) {
        setError(err.message || "Failed to fetch history");
        setStatus("error");
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, [keys]);

  return { data, status, error };
};