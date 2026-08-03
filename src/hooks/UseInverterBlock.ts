import { useEffect, useState } from "react";

export interface InverterBlockType {
  block_name: string;
  connected: number;
  total_device: number;
  devices: string[];
}

const UseInverterBlock = () => {

  const [data, setData] = useState<InverterBlockType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {

    try {

      setLoading(true);

      const BASE_URL = (import.meta.env.VITE_API_BASE as string) || "";

      const response = await fetch(
        `${BASE_URL}/api/plantview/inverter_block`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plant_id: "plant_1",
          }),
        }
      );

      const result = await response.json();

      setData(result?.data || []);

    } catch (error) {

      console.log("INVERTER BLOCK API ERROR:", error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    fetchData,
  };
};

export default UseInverterBlock;