
// type RecordValue = {
//     [k : string]: string | number;
// };

export type ObjData = Record<string, Record<string, RecordValue>>;
export type RecordValue = {
    value?: number | string | null;
    [key: string]: unknown;
};

export type FlatObjData = Record<string, RecordValue>;

const normalizeData = (
    data: FlatObjData
): FlatObjData => {
    return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
            key.toLowerCase(),
            value,
        ])
    );
};

export const GetDataService = (
    key: string,
    data: FlatObjData | null,
): number | string => {
    if (!key || !data) {
        return 0;
    }

    const normalizedData = normalizeData(data);
    const targetObj = normalizedData[key.toLowerCase()];

    return targetObj?.value ?? 0;
};

