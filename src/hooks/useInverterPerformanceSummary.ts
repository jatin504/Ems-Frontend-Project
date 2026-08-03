import { useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE;

interface PerformanceSummaryData {
  totalInverters: number;
  totalDCPower: number;
  totalACPower: number;
  totalEnergyToday: number;
  averagePR: number;
  averageAvailability: number;
  lastUpdateTime: number;
}

const useInverterPerformanceSummary = () => {
  const [data, setData] =
    useState<PerformanceSummaryData | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `${BASE_URL}/api/inverter-performance-summary`
      );

      if (res.data?.success) {
        setData(res.data.data);
      } else {
        throw new Error(
          res.data?.error || "Failed to fetch data"
        );
      }
    } catch (err: any) {
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    fetchData,
  };
};

export default useInverterPerformanceSummary;