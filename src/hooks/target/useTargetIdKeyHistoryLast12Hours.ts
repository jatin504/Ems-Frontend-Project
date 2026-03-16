import { useState, useEffect } from "react";
import axios from "axios";
import type { HistoryItem } from "../../types/history/historyData";

const BASE_URL = import.meta.env.VITE_API_BASE;

type HistoryResponse = Record<string, HistoryItem[]>;

export const useTargetIdKeyHistoryLast12Hours = (body: Object[]) => {
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStatus("loading");

        const now = new Date();
        const startDate = new Date(now.getTime() - 12 * 60 * 60 * 1000);

        const pad = (n: number) => n.toString().padStart(2, "0");

        const formatLocal = (date: Date): string =>
          `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
            date.getDate()
          )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
            date.getSeconds()
          )}`;

        const startTs = formatLocal(startDate);
        const endTs = formatLocal(now);

        const params = new URLSearchParams({
          startTs,
          endTs,
        });

        const response = await axios.post<HistoryResponse>(
          `${BASE_URL}/target_id_key_history/?${params}`,
          body
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
  }, [body]);

  return { data, status, error };
};