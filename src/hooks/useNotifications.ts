import { useEffect, useState } from "react";

type NotificationItem = {
  id: number;
  event_time: string;
  title: string;
  event_type: string;
  severity: string;
  status: string;
  source: string;
  entity_type: string;
  entity_id: string;
  message: string;
  acknowledged: boolean;
  acknowledged_by: string;
  acknowledged_time: string;
  cleared_time: string;
  metadata: any;
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [unacknowledgedCount, setUnacknowledgedCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const query = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
        search,
        fromDate,
        toDate,
      });

      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/notification/list?${query}`);

      if (!res.ok) throw new Error("Notification fetch failed");

      const result = await res.json();

      const data = result.data || [];
      setTotal(result.total || 0);

      const normalized = data.map((item: any) => ({
        id: item.id,
        event_time: item.event_time ?? item.created_at ?? "",
        title: item.title ?? "",
        event_type: item.event_type ?? "",
        severity: item.severity ?? "",
        status: item.status ?? "",
        source: item.source ?? "",
        entity_type: item.entity_type ?? "",
        entity_id: item.entity_id ?? "",
        message: item.message ?? "",
        acknowledged: !!item.acknowledged,
        acknowledged_by: item.acknowledged_by ?? "",
        acknowledged_time: item.acknowledged_time ?? "",
        cleared_time: item.cleared_time ?? "",
        metadata: item.metadata ?? null,
      }));

      setNotifications(normalized);
    } catch (err) {
      console.error("Notification fetch error", err);
      setNotifications([]);
    }
  };

  const fetchUnackCount = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/notification/unack-count`
      );
      const data = await res.json();
      setUnacknowledgedCount(data.count || 0);
    } catch (err) {
      console.error("Unack count fetch error", err);
    }
  };

  const handleAck = async (id: number) => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE}/api/notification/ack`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          user: sessionStorage.getItem("username") || "admin",
        }),
      });

      fetchNotifications();
      fetchUnackCount();
    } catch (err) {
      console.error("ACK failed", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnackCount();
    fetchUnackCount();
  }, [page, pageSize]);

  return {
    notifications,
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
    search,
    setSearch,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    fetchNotifications,
    handleAck,
    unacknowledgedCount,
  };
};
