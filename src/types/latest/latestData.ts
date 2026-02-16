export type UseLatestDataReturn = {
  data: LatestData[] | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
};

export interface LatestData {
  table_name: string;
  time_stamp: string;
  [key: string]: string; // for dynamic keys like soc, dod, soh
}
