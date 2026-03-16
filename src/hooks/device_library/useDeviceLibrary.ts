import { useEffect, useState, useMemo } from "react";

export type DeviceLibraryResponse = {
  [deviceType: string]: {
    makes: string[];
    models: Record<string, string[]>;
  };
};

const BASE_URL = import.meta.env.VITE_API_BASE;

export function useDeviceLibrary(baseUrl: string = BASE_URL) {
  const [library, setLibrary] = useState<DeviceLibraryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const listUrl = useMemo(
    () => `${baseUrl.replace(/\/+$/, "")}/device-library/list`,
    [baseUrl]
  );

  const fetchLibrary = async () => {
    try {
      const res = await fetch(listUrl);
      if (!res.ok) throw new Error(`List device library failed: ${res.status}`);
      const json = (await res.json()) as DeviceLibraryResponse;
      return json;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchLibrary()
      .then((data) => {
        setLibrary(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [listUrl]);

  return { library, loading, error, refresh: fetchLibrary };
}