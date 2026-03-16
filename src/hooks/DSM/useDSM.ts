import axios from "axios";
import { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE;

const useDSM = () => {
  const [tariffData, setTariffData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  const FetchTariffByStateCode = async (state_code: string) => {
    try {
      const result = await axios.post(
        `${BASE_URL}/api/dsm/get_tariff`,
        { state_code }
      );

      const responseData = result.data;

      if (responseData.data) {
        setTariffData(responseData.data[0]);
      }
    } catch (err) {
      setTariffData([]);
      setError("Something Went Wrong!");
    } finally {
      setLoading(false);
    }
  };

  return {
    FetchTariffByStateCode,
    tariffData,
    loading,
    error,
  };
};

export default useDSM;