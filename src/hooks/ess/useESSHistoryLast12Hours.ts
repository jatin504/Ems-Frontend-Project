import { useState, useEffect } from 'react';
import axios from 'axios';
import type { HistoryItem } from '../../types/history/historyData';


type HistoryResponse = Record<string, HistoryItem[]>;

export const useESSHistoryLast12Hours = (keys: string[]) => {
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = new Date();
        const startDate = new Date(now.getTime() - 12 * 60 * 60 * 1000); // 12 hours ago

        function formatLocal(date: Date): string {
          const pad = (n: number) => n.toString().padStart(2, '0');

          const year = date.getFullYear();
          const month = pad(date.getMonth() + 1); // months are 0-indexed
          const day = pad(date.getDate());
          const hours = pad(date.getHours());
          const minutes = pad(date.getMinutes());
          const seconds = pad(date.getSeconds());

          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }

        const startTs = formatLocal(startDate);
        const endTs = formatLocal(now);


        const params = new URLSearchParams({
          keys: keys.join(','),
          startTs,
          endTs,
        });

        const response = await axios.get<HistoryResponse>(`http://75.119.146.115:5179/history/ess_ess_?${params}`);
        setData(response.data);
        setStatus('success');
      } catch (err: any) {
        setError(err.message || 'Failed to fetch history');
        setStatus('error');
      }
    };

    // Initial fetch
    fetchData();

    // Refresh every 60 seconds
    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [keys]);

  return { data, status, error };
};