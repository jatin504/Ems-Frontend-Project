import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE;

const TimeseriesDataAPI = async (dataSource: any) => {
  const body = {
    dataSource,
  };

  try {
    const response = await axios.post(
      `${BASE_URL}/api/timeseries-data`,
      body
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default TimeseriesDataAPI;