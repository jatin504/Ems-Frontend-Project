import { useEffect, useState } from "react";
import { useDevices } from "./useDevices";
import { getDeviceColumnsByIds } from "./library/device";

/* ================= TYPES ================= */

type DeviceConfig = {
  server_ip: string;
  server_port: number | null;
  slave_id: number | null;
  plant: number | null;
  block: number | null;
  pcs: number | null;
  deviceType: string;
  device_id: string;
  make: string;
  model: string;
  function: number | null;
};

export type DateType = "relative" | "live" | "history";

/* ================= API BASE ================= */

const API_BASE = import.meta.env.VITE_API_BASE;

/* ================= HELPERS ================= */

const unique = (arr: string[]) => Array.from(new Set(arr));

const arraysEqual = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
};

/* ================= INTERVAL MAP ================= */

const intervalSuffixMap: Record<string, string> = {
  "5min": "_5_min",
  "15min": "_15_min",
  "30min": "_30_min",
  "1hr": "_1_hour",
  "1hour": "_1_hour",
  "2hr": "_2_hour",
  "2hour": "_2_hour",
  "1day": "_1_day",
};

const resolveDeviceId = (baseDeviceId: string, interval: string) => {
  if (interval === "1min") return baseDeviceId;
  const suffix = intervalSuffixMap[interval];
  return suffix ? `${baseDeviceId}${suffix}` : baseDeviceId;
};

/* ================= HOOK ================= */

const useReports = () => {
  const { devices } = useDevices();

  const [allDeviceTypes, setAllDeviceTypes] = useState<string[]>([]);
  const [allDeviceIds, setAllDeviceIds] = useState<string[]>([]);
  const [allDeviceColumns, setAllDeviceColumns] = useState<string[]>([]);

  const [selectedDeviceTypes, setSelectedDeviceTypes] = useState<string[]>([]);
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([]);
  const [selectedParams, setSelectedParams] = useState<string[]>([]);

  const [selectedDateType, setSelectedDateType] =
    useState<DateType>("relative");
  const [selectedFrequency, setSelectedFrequency] =
    useState<string>("Daily");
  const [selectedInterval, setSelectedInterval] =
    useState<string>("15min");

  const [startTs, setStartTs] = useState<string | null>(null);
  const [endTs, setEndTs] = useState<string | null>(null);

  const [reportData, setReportData] = useState<any[]>([]);

  /* DEVICE TYPES + IDS */
  useEffect(() => {
    const devs = (devices as DeviceConfig[]) || [];
    if (devs.length === 0) return;

    const types = unique(devs.map((d) => d.deviceType).filter(Boolean));
    setAllDeviceTypes(types);

    const baseIds =
      selectedDeviceTypes.length === 0
        ? devs.map((d) => d.device_id)
        : devs
            .filter((d) =>
              selectedDeviceTypes.includes(d.deviceType)
            )
            .map((d) => d.device_id);

    const resolvedIds = baseIds.map((id) =>
      resolveDeviceId(id, selectedInterval)
    );

    setAllDeviceIds(resolvedIds);

    setSelectedDeviceIds((prev) => {
      const pruned = prev.filter((id) =>
        resolvedIds.includes(id)
      );
      return arraysEqual(prev, pruned) ? prev : pruned;
    });
  }, [devices, selectedDeviceTypes, selectedInterval]);

  /* PARAMETERS */
  useEffect(() => {
    if (selectedDeviceIds.length === 0) {
      setAllDeviceColumns([]);
      return;
    }

    getDeviceColumnsByIds(selectedDeviceIds)
      .then((cols: any) => {
        setAllDeviceColumns((cols as string[]) || []);
      })
      .catch(() => setAllDeviceColumns([]));
  }, [selectedDeviceIds]);

  /* REPORT API */
  const generateReport = () => {
    const resolvedDeviceIds = selectedDeviceIds.map((id) =>
      resolveDeviceId(
        id.replace(/(_\d+_(min|hour|day))$/, ""),
        selectedInterval
      )
    );

    fetch(`${API_BASE}/api/device/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dateType: selectedDateType,
        frequency:
          selectedDateType === "history"
            ? ""
            : selectedFrequency.toLowerCase(),
        interval: selectedInterval,
        deviceIds: resolvedDeviceIds,
        params: selectedParams,
        ...(selectedDateType === "history"
          ? { startTs, endTs }
          : {}),
      }),
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setReportData(data || []))
      .catch((e) => console.error("Report fetch error", e));
  };

  const generateReportByConfig = (config: any) => {
    try {
      const cfgDeviceIds: string[] =
        (config?.selectedDeviceIds ??
          config?.deviceIds ??
          []) as string[];

      const resolvedDeviceIds = cfgDeviceIds.map((id) =>
        resolveDeviceId(
          String(id).replace(/(_\d+_(min|hour|day))$/, ""),
          config?.selectedInterval ??
            config?.interval ??
            selectedInterval
        )
      );

      const body: any = {
        dateType:
          config?.selectedDateType ??
          config?.dateType ??
          selectedDateType,
        frequency:
          (config?.selectedDateType ??
            config?.dateType) === "history"
            ? ""
            : (
                config?.selectedFrequency ??
                config?.frequency ??
                selectedFrequency
              ).toLowerCase(),
        interval:
          config?.selectedInterval ??
          config?.interval ??
          selectedInterval,
        deviceIds: resolvedDeviceIds,
        params:
          config?.selectedParams ??
          config?.params ??
          selectedParams,
      };

      if (
        (config?.selectedDateType ??
          config?.dateType) === "history"
      ) {
        body.startTs =
          config?.historyStartTs ??
          config?.startTs ??
          null;
        body.endTs =
          config?.historyEndTs ??
          config?.endTs ??
          null;
      }

      fetch(`${API_BASE}/api/device/data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((r) => (r.ok ? r.json() : []))
        .then((data) => setReportData(data || []))
        .catch((e) => {
          console.error("Report fetch by config error", e);
          setReportData([]);
        });
    } catch (e) {
      console.error("generateReportByConfig error", e);
      setReportData([]);
    }
  };

  /* AUTO */
  useEffect(() => {
    generateReport();
    // eslint-disable-next-line
  }, [
    selectedDeviceIds,
    selectedParams,
    selectedInterval,
    selectedFrequency,
    selectedDateType,
    startTs,
    endTs,
  ]);

  const clearSelections = () => {
    setSelectedDeviceTypes([]);
    setSelectedDeviceIds([]);
    setSelectedParams([]);
    setReportData([]);
    setStartTs(null);
    setEndTs(null);
  };

  return {
    allDeviceTypes,
    allDeviceIds,
    allDeviceColumns,

    selectedDeviceTypes,
    setSelectedDeviceTypes,
    selectedDeviceIds,
    setSelectedDeviceIds,
    selectedParams,
    setSelectedParams,

    selectedDateType,
    setSelectedDateType,
    selectedFrequency,
    setSelectedFrequency,
    selectedInterval,
    setSelectedInterval,

    startTs,
    setStartTs,
    endTs,
    setEndTs,

    reportData,
    setReportData,
    generateReport,
    generateReportByConfig,
    clearSelections,
  };
};

export default useReports;