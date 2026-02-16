import axios from 'axios';

const GetDashboardDataAPI  = async (dashboardConfig : any) => {
    const BASE_URL = "http://75.119.146.115:5179/";

    try {
        const response = await axios.post(`${BASE_URL}/get-dashboard-data`, dashboardConfig);
        return response.data;
    } catch (error) {
        console.error(error)
    }
}

export default GetDashboardDataAPI;
