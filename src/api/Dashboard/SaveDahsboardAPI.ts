import axios from 'axios';

const SaveDashboardAPI  = async (dashboardConfig : any) => {
    const BASE_URL = (import.meta as any).env?.VITE_API_BASE?.toString() || "http://75.119.146.115:5179";

    try {
        const response = await axios.post(`${BASE_URL}/dashboard/save`, dashboardConfig);
        return response.data;
    } catch (error) {
        console.error(error)
        throw error;
    }
}

export default SaveDashboardAPI;