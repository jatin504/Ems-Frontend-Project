import axios from 'axios';

const TimeseriesDataAPI  = async (dataSource : any) => {
    const BASE_URL = (import.meta as any).env?.VITE_API_BASE?.toString() || "http://75.119.146.115:5179";
    const body = {
        dataSource
    }
    try {
        const response = await axios.post(`${BASE_URL}/api/timeseries-data`, body);
        return response.data;
    } catch (error) {
        console.error(error)
        throw error;
    }
}

export default TimeseriesDataAPI;