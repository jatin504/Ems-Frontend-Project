import axios from "axios";

export interface BessSimulateResponse {
  result: {
    final_soc: number;
    initial_soc: number;
    simulation_start: string;
    timeline: Array<{
      action: string;
      duration_hours: number;
      dynamic_threshold_kw: number | null;
      end: string;
      energy_charged_kwh: number;
      energy_used_kwh: number;
      load: number;
      p_max_kw: number;
      shortfall_kwh: number;
      soc_after_percent: number;
      soc_before_percent: number;
      soft_limit_kw: number | null;
      start: string;
      window_state: string;
    }>;
    total_energy_discharged: number;
    windows_simulated: number;
  };
  status: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE;

const SimulateBessOptimizeAPI = async (
  strategy: string = "peak_shaving"
): Promise<BessSimulateResponse> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/bess_control/sim_optimize`,
      { strategy }
    );

    return response.data;
  } catch (error) {
    console.error("Error simulating BESS optimize:", error);
    throw error;
  }
};

export default SimulateBessOptimizeAPI;