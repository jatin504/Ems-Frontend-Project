import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

export type CloudStage = "confirmed_cloud" | "early_warning" | "stronger_signal";

const daysRange = (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

const useCloudDetectionData = (externalDate?: Date) => {
  const [currentDate, setCurrentDate] = useState(externalDate || new Date());
  const [stage, setStage] = useState<CloudStage>("confirmed_cloud");
  const [apiData, setApiData] = useState<any>(null);

  const formattedDate = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, "0");
    const d = String(currentDate.getDate()).padStart(2, "0");
    return `${y}/${m}/${d}`;
  }, [currentDate]);

  const isToday = useMemo(() => {
    const t = new Date();
    return (
      currentDate.getFullYear() === t.getFullYear() &&
      currentDate.getMonth() === t.getMonth() &&
      currentDate.getDate() === t.getDate()
    );
  }, [currentDate]);

  const goPrevDay = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      return d;
    });
  };

  const goNextDay = () => {
    if (isToday) return;
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);
      return d;
    });
  };

  useEffect(() => {
    if (externalDate) {
      setCurrentDate(externalDate);
    }
  }, [externalDate]);

  const fetchData = async () => {
    try {
      const { start, end } = daysRange(currentDate);
      const res = await fetch(`${API_BASE}/api/v1/cloud-detection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stage_name: stage,
          start_ts: start.getTime(),
          end_ts: end.getTime(),
        }),
      });

      const json = await res.json();
      setApiData(json.data);
    } catch (err) {
      console.error("Cloud API Error", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [stage, currentDate]);

  return {
    currentDate,
    setCurrentDate,
    stage,
    setStage,
    apiData,
    formattedDate,
    isToday,
    goPrevDay,
    goNextDay,
    fetchData,
  };
};

export default useCloudDetectionData;
