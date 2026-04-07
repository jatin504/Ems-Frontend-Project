import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE;

interface ConfigState {
  safety_factor: number;
  sustain_interval_min_number: number;
  sustain_interval_number: number;
  sustain_interval_minute: number;
}

interface ConfidenceState {
  early_warning: number;
  stronger_signal: number;
  confirmation_building: number;
  confirmed_cloud: number;
}

interface WindowItem {
  name: string;
  morning: number;
  midday: number;
  evening: number;
}

export const useCloudConfig = () => {
  const [config, setConfig] = useState<ConfigState>({
    safety_factor: -3,
    sustain_interval_min_number: 2,
    sustain_interval_number: 2,
    sustain_interval_minute: 5,
  });

  const [windows, setWindows] = useState<WindowItem[]>([]);

  const [confidence, setConfidence] = useState<ConfidenceState>({
    early_warning: 0.3,
    stronger_signal: 0.5,
    confirmation_building: 0.8,
    confirmed_cloud: 1.0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/getCloudDetails`);
      const json = await res.json();

      if (!json.success || !json.data) return;

      const data = json.data;

      setConfig({
        safety_factor: data.safety_factor ?? -3,
        sustain_interval_min_number: data.sustain_interval_min_number ?? 2,
        sustain_interval_number: data.sustain_interval_number ?? 2,
        sustain_interval_minute: data.sustain_interval_minute ?? 5,
      });

      setConfidence(data.confidance_dispatch_stages ?? {
        early_warning: 0.3,
        stronger_signal: 0.5,
        confirmation_building: 0.8,
        confirmed_cloud: 1.0,
      });

      const windowsData = data.windows_avg_rate_per_minute;
      if (windowsData && typeof windowsData === 'object') {
        const mappedWindows = Object.entries(windowsData).map(([key, val]: any) => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          morning: Number(val.morning),
          midday: Number(val.midday),
          evening: Number(val.evening),
        }));
        setWindows(mappedWindows);
      } else {
        setWindows([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (payload: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/saveCloudDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    config,
    setConfig,
    windows,
    setWindows,
    confidence,
    setConfidence,
    isLoading,
    error,
    fetchData,
    saveData,
  };
};