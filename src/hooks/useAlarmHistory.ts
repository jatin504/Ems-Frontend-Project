import { useEffect, useState } from "react";

export type RowStatus = "Self Resolved" | "Ack Alarm" | "Cleared";

export type AlarmBase = {
  device: string;
  time: string;
  rawTimestamp: string;
  tag: string;
  type: string;
  severity: string;
  status: RowStatus;
  assignee: string;
};

export type AlarmRow = AlarmBase & {
  comment: string;
  inputValue: string;
  ackDisabled: boolean;
  clrDisabled: boolean;
};

export type AlarmApiRow = {
  alarm_type: string;
  device_id: string;
  severity: string;
  tag_name: string;
  time_stamp: string;
  value: string;
  status?: string;
  comment?: string;
};

const API_BASE = import.meta.env.VITE_API_BASE;

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function useAlarmHistory(initialPageSize: number = 10) {
  const [rows, setRows] = useState<AlarmRow[]>([]);
  const [activePopover, setActivePopover] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  // ================= FETCH HISTORY =================
  const fetchHistory = async (startTs?: string, endTs?: string) => {
    try {
      let url = `${API_BASE}/api/alarms/history?limit=5000`;

      if (startTs && endTs) {
        url += `&startTs=${encodeURIComponent(startTs)}&endTs=${encodeURIComponent(endTs)}`;
      }

      const res = await fetch(url);

      if (!res.ok) {
        console.error("Failed to fetch alarm history");
        return;
      }

      const data: AlarmApiRow[] = await res.json();

      const mapped: AlarmRow[] = data.map((item) => {
        const formattedTime = item.time_stamp ?? "";

        let status: RowStatus = "Self Resolved";
        if (item.status === "ACK") status = "Ack Alarm";
        if (item.status === "CLR") status = "Cleared";

        return {
          device: item.device_id,
          tag: item.tag_name,
          time: formattedTime,
          rawTimestamp: item.time_stamp,
          type: item.alarm_type,
          severity: item.severity,
          status,
          assignee: "-",
          comment: item.comment || "--",
          inputValue: "",
          ackDisabled: status !== "Self Resolved",
          clrDisabled: status === "Cleared",
        };
      });

      setRows(mapped);
      setCurrentPage(1);
    } catch (err) {
      console.error("Alarm history load error:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // ================= PAGINATION =================
  const totalRows = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));

  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRows);
  const pageRows = rows.slice(startIndex, endIndex);

  const handlePageSizeChange = (value: string) => {
    setPageSize(parseInt(value, 10));
    setCurrentPage(1);
  };

  const goToFirst = () => setCurrentPage(1);
  const goToPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goToNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const goToLast = () => setCurrentPage(totalPages);

  // ================= COMMENT INPUT =================
  const handleCommentChange = (indexInPage: number, value: string) => {
    const globalIndex = startIndex + indexInPage;

    setRows((prev) => {
      const updated = [...prev];
      if (!updated[globalIndex]) return prev;

      updated[globalIndex] = {
        ...updated[globalIndex],
        inputValue: value,
      };

      return updated;
    });
  };

  // ================= ACK / CLR SAVE =================
  const handleCommentSave = async (
    indexInPage: number,
    action: "ack" | "clr"
  ) => {
    const globalIndex = startIndex + indexInPage;
    const row = rows[globalIndex];
    if (!row) return;

    try {
      const res = await fetch(`${API_BASE}/api/alarms/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_id: row.device,
          tag_name: row.tag,
          time_stamp: row.rawTimestamp,
          action,
          comment: row.inputValue,
        }),
      });

      if (!res.ok) {
        console.error("Failed to update alarm");
        return;
      }

      await fetchHistory();
    } catch (err) {
      console.error("Update alarm error:", err);
    } finally {
      setActivePopover(null);
    }
  };

  // ================= UI HELPERS =================
  const getRowBg = (status: RowStatus) => {
    if (status === "Ack Alarm") return "yellow.300";
    if (status === "Self Resolved") return "green.300";
    if (status === "Cleared") return "gray.300";
    return undefined;
  };

  return {
    rows,
    pageRows,
    totalRows,
    totalPages,
    pageSize,
    safeCurrentPage,
    startIndex,

    activePopover,
    setActivePopover,

    handleCommentChange,
    handleCommentSave,
    handlePageSizeChange,
    goToFirst,
    goToPrev,
    goToNext,
    goToLast,

    fetchHistory,

    getRowBg,
  };
}