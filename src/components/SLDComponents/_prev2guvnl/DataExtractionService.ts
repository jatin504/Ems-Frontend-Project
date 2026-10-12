
type RecordValue = {
    [k : string]: string | number;
};

export type ObjData = Record<string, Record<string, RecordValue>>;

export const GetDataService= (key : string, data : ObjData | null) => {
    if (!key || !data) {
        return 0;
    }

    var targetObj = data[key.toLowerCase()];
    
    if (!targetObj) {
        return 0;
    }

    if (targetObj["value"]) {
        return targetObj["value"];
    }

    return 0;
}