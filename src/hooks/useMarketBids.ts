import { useState, useEffect } from 'react';

/* ================= TYPES ================= */

export type MarketBid = {
  id: number;
  market: string;
  block_no: number;
  quantity_mw: string;
  price_rs_per_kwh: string;
  start_time: string;
  end_time: string;
  status: string;
  direction: string;
  entity: string;
  asset_id: string;
  bid_id: string;
  step_no: number;
  remarks: string;
  trade_date: string;
  created_at: string;
  updated_at: string;
  approval_required: boolean;
  approved_at: string | null;
  approved_by: string | null;
  clearing_result: string | null;
  exchange_ack: string | null;
};

/* ================= CONSTANTS ================= */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://75.119.146.115:5179";

/* ================= HOOK ================= */

export function useMarketBids(selectedDate: string) {
  const [marketBids, setMarketBids] = useState<MarketBid[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketBids = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${API_BASE_URL}/api/market-bids?trade_date=${selectedDate}`
        );

        if (!res.ok) throw new Error("Failed to fetch market bids");

        const json = await res.json();
        setMarketBids(json.data || []);
      } catch (err: any) {
        setError(err.message);
        console.error("Market bids fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketBids();
  }, [selectedDate]);

  return { marketBids, loading, error };
}