import { useEffect, useState } from "react";

export interface PlantConfigData {
  plant_type?: string;
  plant_config?: {
    plantName?: string;
    capacityMW?: number;
    capacitorKVAR?: number;
    location?: string;
    description?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

const usePlantConfig = () => {
  const [plantConfig, setPlantConfig] = useState<PlantConfigData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlantConfig = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("http://75.119.146.115:5179/api/get-plant-config");
        const json = await res.json();

        if (json.success) {
          setPlantConfig(json.data);
        } else {
          setError(json.error || "Failed to load plant config");
        }
      } catch (err: any) {
        setError(err?.message || "Plant config load error");
      } finally {
        setLoading(false);
      }
    };

    loadPlantConfig();
  }, []);

  return { plantConfig, loading, error };
};

export default usePlantConfig;
