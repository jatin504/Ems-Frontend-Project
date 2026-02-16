import axios from 'axios';

const GetWidgetTemplatesAPI  = async () => {
    const BASE_URL = (import.meta as any).env?.VITE_API_BASE?.toString() || "http://75.119.146.115:5179";

    try {
        const response = await axios.get(`${BASE_URL}/widget-template/get`);
        return response.data;
    } catch (error) {
        console.error(error)
        throw error;
    }
}

export default GetWidgetTemplatesAPI;