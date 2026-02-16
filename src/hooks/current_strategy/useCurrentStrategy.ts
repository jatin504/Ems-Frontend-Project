import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE = "http://75.119.146.115:5179/currentStrategy/";

export function useCurrentStrategy() {
  const [strategy, setStrategy] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios.get(API_BASE)
      .then(res => setStrategy(res.data.current_bess_strategy))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateStrategy = async (newStrategy: string) => {
    try {
      await axios.post(API_BASE, {
        current_bess_strategy: newStrategy,
      });
      setStrategy(newStrategy);
    } catch (err) {
      console.error("Error updating strategy", err);
    }
  };

  return { strategy, loading, updateStrategy };
}
