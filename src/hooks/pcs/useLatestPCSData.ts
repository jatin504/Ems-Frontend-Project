import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import type { LatestData, UseLatestDataReturn } from '../../types/latest/latestData';

const API_URL = 'http://75.119.146.115:5179/latest/pcs_pcs_';

type Status = 'idle' | 'loading' | 'success' | 'error';

export const useLatestPCSData = (keys: string[]): UseLatestDataReturn => {
  const [data, setData] = useState<LatestData[] | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  // Wrap keys in ref so we can access them inside setInterval without retriggering it
  const keysRef = useRef(keys);
  useEffect(() => {
    keysRef.current = keys;
  }, [keys]);

  const fetchData = async () => {
    if (keys.length === 0) {
      setData([]);
      setStatus('success');
      return;
    }

    setStatus('loading');
    try {
      const params = new URLSearchParams({ keys: keys.join(',') });
      const response = await axios.get<LatestData[]>(`${API_URL}?${params}`);
      setData(response.data);
      setStatus('success');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch ESS data');
      setStatus('error');
    }
  };

  useEffect(() => {
    // Initial fetch immediately
    fetchData();

    // Calculate time until next minute starts
    const now = new Date();
    const msUntilNextMinute = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

    // Wait until the next full minute before starting regular polling
    const initialTimeout = setTimeout(() => {
      fetchData(); // First poll exactly at the next full minute
      const intervalId = setInterval(fetchData, 60000); // Then every minute

      // Cleanup interval on unmount
      return () => {
        clearInterval(intervalId);
      };
    }, msUntilNextMinute);

    // Cleanup timeout if component unmounts before first poll
    return () => clearTimeout(initialTimeout);
  }, []);

  return { data, status, error };
};