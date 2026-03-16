import axios from "axios";
import { useEffect, useState } from "react";

/* ================= API BASE ================= */

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString()?.replace(/\/$/, "") ||
  "";

/* ================= HOOK ================= */

export function useCurrentStrategy() {
  const [strategy, setStrategy] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get(`${API_BASE}/currentStrategy`)
      .then((res) => setStrategy(res.data.current_bess_strategy))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateStrategy = async (newStrategy: string) => {
    try {
      await axios.post(`${API_BASE}/currentStrategy`, {
        current_bess_strategy: newStrategy,
      });
      setStrategy(newStrategy);
    } catch (err) {
      console.error("Error updating strategy", err);
    }
  };

  return { strategy, loading, updateStrategy };
}