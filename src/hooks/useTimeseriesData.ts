import { useState, useEffect } from 'react';
import TimeseriesDataAPI from '../api/TimeseriesDataAPI';
import type { TimeseriesDataSource } from '../types/timeseries/datasource';

interface WidgetData {
  [deviceID: string]: {
    [keyName: string]: { ts: number; value: number }[];
  };
}

interface UseTimeseriesDataReturn {
    data: WidgetData | null;
    loading: boolean;
    error: string | null;
    fetchData: (dataSource: TimeseriesDataSource | null) => void;
}

const useTimeseriesData = (): UseTimeseriesDataReturn => {
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (dataSource: TimeseriesDataSource | null) => {
        if (!dataSource) {
            setData(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {

            const result = await TimeseriesDataAPI(dataSource);

            if (result.success) {
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

export default useTimeseriesData;