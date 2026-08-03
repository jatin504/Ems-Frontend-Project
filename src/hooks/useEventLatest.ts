import { useEffect, useState, useMemo } from "react";

export type RowStatus = "Latest Alarm" | "Acknowledged" | "Self Resolved";

export type AlarmBase = {
  device: string;
  time: string;
  type: string;
  severity: string;
  status: RowStatus;
  assignee: string;
};

export type AlarmRow = AlarmBase & {
  deviceId: string;
  rawTimeStamp: string;
  ackTime: string;
  state: string;
  comment: string;
  inputValue: string;
  ackDisabled: boolean;
  clrDisabled: boolean;
};

export type AlarmApiRow = {
  device_id: string;
  tag_name: string;
  severity: string;
  time_stamp: string;
  ack_timestamp?: string;
  comment?: string;
};

const API_BASE = import.meta.env.VITE_API_BASE;

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function useAlarmLatest(fetchLimit: number = 50000) {
  const [rows, setRows] = useState<AlarmRow[]>([]);
  const [activePopover, setActivePopover] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  /* ================= FETCH LATEST ================= */
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/events/latest?page=1&limit=${fetchLimit}`);
        if (!res.ok) return;

        const data: AlarmApiRow[] = await res.json();
        const inverterRegex = /inverter[_-]?(\d+)/i;

        const mapped: AlarmRow[] = data
          .filter((item) => inverterRegex.test(item.device_id))
          .map((item) => {
            const match = item.device_id.match(inverterRegex);
            const invNum = match ? match[1] : "";
            const device = invNum ? `Inverter_${invNum}` : item.device_id;

            let activationTime = "";
            const d = new Date(item.time_stamp);

            if (!isNaN(d.getTime())) {
              const pad = (n: number) => n.toString().padStart(2, "0");
              activationTime = `${pad(d.getUTCDate())}/${pad(
                d.getUTCMonth() + 1
              )}/${d.getUTCFullYear()}, ${pad(d.getUTCHours())}:${pad(
                d.getUTCMinutes()
              )}:${pad(d.getUTCSeconds())}`;
            }

            let ackTime = "--";

            if (item.ack_timestamp) {
              const ackDate = new Date(item.ack_timestamp);

              if (!isNaN(ackDate.getTime())) {
                const pad = (n: number) => n.toString().padStart(2, "0");

                ackTime = `${pad(ackDate.getUTCDate())}/${pad(
                  ackDate.getUTCMonth() + 1
                )}/${ackDate.getUTCFullYear()}, ${pad(
                  ackDate.getUTCHours()
                )}:${pad(ackDate.getUTCMinutes())}:${pad(
                  ackDate.getUTCSeconds()
                )}`;
              }
            }

            return {
              device,

              deviceId: item.device_id,

              rawTimeStamp: item.time_stamp,
              ackTime,
              time: activationTime,
              type: item.tag_name,
              severity: item.severity,
              status: item.ack_timestamp ? "Acknowledged" : "Latest Alarm",
              assignee: "-",
              comment: item.comment ?? "--",
              inputValue: "",
              ackDisabled: Boolean(item.ack_timestamp),
              clrDisabled: false,
              state: item.tag_name,
            };
          });

        setRows(mapped);
        setCurrentPage(1);
      } catch (err) {
        console.error("Error while loading latest alarms:", err);
      }
    };

    fetchLatest();
  }, []);

  /* ================= COUNTS ================= */
  const alarmCount = rows.length;

  const warningCount = useMemo(
    () => rows.filter((r) => r.severity?.toLowerCase() === "warning").length,
    [rows]
  );

  const liveCount = rows.filter((r) => r.status === ("Latest Alarm" as RowStatus)).length;

  const ackCount = rows.filter((r) => r.status === ("Acknowledged" as RowStatus)).length;

  const selfResolvedCount = rows.filter((r) => r.status === ("Self Resolved" as RowStatus)).length;

  /* ================= SEARCH FILTER ================= */

  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return rows;

    const q = searchTerm.toLowerCase();

    return rows.filter((row) =>
      [
        row.device,
        row.type,
        row.severity,
        row.status,
        row.comment,
        row.time,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [rows, searchTerm]);

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  /* ================= PAGINATION ================= */
  const totalRows = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRows);
  const pageRows = filteredRows.slice(startIndex, endIndex);

  const handlePageSizeChange = (value: string) => {
    setPageSize(parseInt(value || "10", 10));
    setCurrentPage(1);
  };

  const updateAlarm = async (row: AlarmRow, action: "ack" | "clr") => {
    await fetch(`${API_BASE}/api/events/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        device_id: row.deviceId,
        tag_name: row.state,
        time_stamp: row.rawTimeStamp,
        action,
        comment: row.inputValue,
      }),
    });
  };

  const goToFirst = () => setCurrentPage(1);
  const goToPrev = () => setCurrentPage((p) => (p > 1 ? p - 1 : p));
  const goToNext = () => setCurrentPage((p) => (p < totalPages ? p + 1 : p));
  const goToLast = () => setCurrentPage(totalPages);

  /* ================= COMMENTS + UPDATE ================= */
  const handleCommentChange = (indexInPage: number, value: string) => {
    const globalIndex = startIndex + indexInPage;

    setRows((prev) => {
      const copy = [...prev];
      if (!copy[globalIndex]) return prev;
      copy[globalIndex] = { ...copy[globalIndex], inputValue: value };
      return copy;
    });
  };

  const handleCommentSave = async (
    indexInPage: number,
    action: "ack" | "clr"
  ) => {
    const globalIndex = startIndex + indexInPage;
    const row = rows[globalIndex];
    if (!row) return;

    await updateAlarm(row, action);

    if (action === "ack") {
      setRows((prev) => {
        const copy = [...prev];
        copy[globalIndex] = {
          ...row,
          comment: row.inputValue || "--",
          ackDisabled: true,
          status: "Acknowledged",
        };
        return copy;
      });
    } else {
      setRows((prev) => {
        const copy = [...prev];
        copy.splice(globalIndex, 1);
        return copy;
      });
    }

    setActivePopover(null);
  };

  const getRowBg = (status: RowStatus) =>
    status === "Acknowledged" ? "yellow.300" : "red.400";

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

    getRowBg,

    alarmCount,
    warningCount,
    liveCount,
    ackCount,
    selfResolvedCount,
    searchInput,
    setSearchInput,
    handleSearch,
  };
}