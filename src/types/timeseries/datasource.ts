export interface TimeseriesDataSource {
    devices: {
        patterns: string[];
        ids: string[];
    };
    keys: {
        key: string;
        alias: string;
        keyType: string;
    }[];
    aggregation: {
        func: string;
        interval: number;
        intervalType: string;
    };
    timeRange: {
        type: "absolute" | "relative" | "last";
        startTs?: number;
        endTs?: number;
        relativeType?: string;
        interval?: number;
        intervalType?: string;
    };
    orderBy: "ASC" | "DESC";
}