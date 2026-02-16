export type HistoryResponse = Record<string, HistoryItem[]>;


export type UseHistoryReturn = {
  data: Record<string, HistoryItem[]> | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
};

export type Status = 'idle' | 'loading' | 'success' | 'error'

export interface HistoryItem {
  tableName: string;
  ts: string; // ISO date string or readable format
  value: string | number;
}