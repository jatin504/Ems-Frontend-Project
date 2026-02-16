import axios from 'axios';

const BatteryBankAPI  = async (plant : string) => {
    const BASE_URL = (import.meta as any).env?.VITE_API_BASE?.toString() || "http://75.119.146.115:5179";
    const body = {
        "plant_id" : plant
    }
    try {
        const response = await axios.post(`${BASE_URL}/api/plantview/v2/battery_bank`, body);
        return response.data;
    } catch (error) {
        console.error(error)
        throw error;
    }
}

export default BatteryBankAPI;