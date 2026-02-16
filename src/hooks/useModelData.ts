import { useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString() || "http://75.119.146.115:5179";

export function useModelData(baseUrl: string = DEFAULT_BASE) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch(`${baseUrl.replace(/\/+$/, "")}/api/model/directory`, {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`Fetch model data failed: ${res.status}`);
      const json = await res.json();
      return json;
    } catch (err) {
      if ((err as any).name !== "AbortError") throw err;
      return null;
    }
  };

  useEffect(() => {
    fetchData()
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      });
    const interval = setInterval(() => {
      fetchData()
        .then((data) => {
          setData(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        });
    }, 10000);
    return () => {
      clearInterval(interval);
      abortRef.current?.abort();
    };
  }, [baseUrl]);

  return { data, loading, error };
}

export function useModelDataById(deviceId: string, baseUrl: string = DEFAULT_BASE) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch(`${baseUrl.replace(/\/+$/, "")}/api/model/device_data/${deviceId}`, {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`Fetch model data by ID failed: ${res.status}`);
      const json = await res.json();
      return json;
    } catch (err) {
      if ((err as any).name !== "AbortError") throw err;
      return null;
    }
  };

  useEffect(() => {
    if (!deviceId) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchData()
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      });
    const interval = setInterval(() => {
      fetchData()
        .then((data) => {
          setData(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        });
    }, 10000);
    return () => {
      clearInterval(interval);
      abortRef.current?.abort();
    };
  }, [deviceId, baseUrl]);
  return { data, loading, error };
}