import { useEffect, useState } from "react";

const API_BASE = (import.meta as any).env?.VITE_API_BASE?.toString()?.replace(/\/$/, "");

export function useEmergencyFaults() {
  const [faultData, setFaultData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFaults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/faults/emergency-last7days`);
        if (!res.ok) return;
        const data = await res.json();
        setFaultData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching emergency faults:", err);
        setFaultData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFaults();
  }, []);

  return { faultData, loading };
}