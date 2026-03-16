import { useState, useEffect } from "react";
import axios from "axios";
import type {
  HistoryItem,
  HistoryResponse,
  Status,
  UseHistoryReturn,
} from "../../types/history/historyData";

const BASE_URL = import.meta.env.VITE_API_BASE;

export const useESSHistory = (
  keys: string[],
  startTs: string,
  endTs: string
): UseHistoryReturn => {
  const [data, setData] = useState<Record<string, HistoryItem[]> | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (keys.length === 0) {
        setData({});
        setStatus("success");
        return;
      }

      setStatus("loading");

      try {
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
        setError(err.message || "Failed to fetch history data");
        setStatus("error");
      }
    };

    fetchData();
  }, [keys, startTs, endTs]);

  return { data, status, error };
};