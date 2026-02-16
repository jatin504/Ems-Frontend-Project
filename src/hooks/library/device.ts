import type { DeviceConfig } from "../../components/DeviceConfig/GeneralDeviceConfigPanel";

const DEFAULT_BASE = (import.meta as any).env?.VITE_API_BASE?.toString() || "http://75.119.146.115:5179";
const DeviceTypeNameByID:any = {
    "ess": "Bank",
    "inverter": "Inverter",
    "pcs": "PCS",
    "rack": "Rack",
    "module": "Module",
    "poi": "POI",
    "computed": "computed" 
};

const deviceTypeIdByName:any = Object.fromEntries(
    Object.entries(DeviceTypeNameByID).map(([id, name]) => [name, id])
);

const getAllDeviceTypes = (devices: DeviceConfig[]) => {
    const types = new Set<string>();
    devices.forEach((device) => {
        // split device_id with _ and the string which occurs twice is device type
        const parts = device.device_id.split("_").filter(p => isNaN(parseInt(p))); // filter out empty parts
        for (const part of parts) {
            if (parts.filter(p => p === part).length > 1) {
                types.add(part);
                return;
            }
        }
    });
    return Array.from(types).filter(t=>t!=="plant").map((t:string)=>DeviceTypeNameByID[t]);
};

const getAllDeviceIds = (devices: DeviceConfig[]) => {
    const ids = new Set<string>();
    devices.forEach((device) => {
        if (device.device_id) {
            ids.add(device.device_id);
        }
    });
    return Array.from(ids);
};

const getDeviceIdsByTypes = (deviceIds: string[], types: string[]) => {
    const actualTypeIds = types.map(t => deviceTypeIdByName[t] || t);
    return deviceIds.filter(deviceId => actualTypeIds.some(type => deviceId.includes(type + "_" + type)));
};

const getDeviceColumnsByIds = async (device_ids: string[]) => {
  const columnUrl = `${DEFAULT_BASE.replace(/\/+$/, "")}/api/device/device_columns/`;
  try {
    const res = await fetch(`${columnUrl}${device_ids.join(",")}`);
    if (!res.ok) throw new Error(`Fetch device columns failed: ${res.status}`);
    return (await res.json()).columns;
    } catch (err) {
      console.error("Error fetching device columns:", err);
      return null;
    }
  };
export { getAllDeviceTypes, getAllDeviceIds, getDeviceIdsByTypes, deviceTypeIdByName, DeviceTypeNameByID, getDeviceColumnsByIds };
