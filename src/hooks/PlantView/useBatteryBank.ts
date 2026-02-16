import { useState, useEffect } from 'react';
import BatteryBankAPI from '../../api/PlantView/BatteryBankAPI';


interface useBatteryBankReturn {
    data: any | null;
    loading: boolean;
    error: string | null;
    fetchData: (plant: string | null) => void;
}

const useBatteryBank = (): useBatteryBankReturn => {
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (plant: string | null) => {
        if (!plant) {
            setData(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {

            const result = await BatteryBankAPI(plant);

            if (result.response) {
                setData(result.data);
            } else {
                throw new Error(result.error || 'Unknown error from server');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch timeseries data');
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch when dataSource changes
    // useEffect(() => {
    //     fetchData();
    // }, [dataSource]);

    return {
        data,
        loading,
        error,
        fetchData, // Expose manual refetch
    };
};

export default useBatteryBank;