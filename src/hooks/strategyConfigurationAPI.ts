// ---- API BASE URL ----
export const API_BASE =
  (typeof import.meta !== "undefined" &&
    (import.meta as any).env &&
    (import.meta as any).env.VITE_EMS_API_URL) ||
  "http://75.119.146.115:5179";

// ---- Mapping helpers 
export const mapForecastCodeToUi = (
  code?: string
): "none" | "ai" | "manual" | "external" => {
  switch (code) {
    case "1":
      return "ai";
    case "2":
      return "manual";
    case "3":
      return "external";
    case "0":
    default:
      return "none";
  }
};

export const mapPriceSourceCodeToUi = (
  code?: string
): "dayahead" | "real" | "custom" | "xls" => {
  switch (code) {
    case "0":
      return "dayahead";
    case "1":
      return "real";
    case "2":
      return "custom";
    case "3":
      return "xls";
    default:
      return "dayahead";
  }
};

export const mapSettlementCodeToUi = (
  code?: string
): "wholesale" | "fixed" => {
  switch (code) {
    case "1":
      // baseline_load_method -> treat as fixed settlement
      return "fixed";
    case "0":
    case "2":
    default:
      // wholesale_arbitrage_calculation / export_settlement_method
      return "wholesale";
  }
};

export const mapArbitrageCodeToUi = (
  code?: string
): "maxrev" | "balanced" | "solar" => {
  switch (code) {
    case "1":
      return "balanced";
    case "2":
      return "solar";
    case "0":
    default:
      return "maxrev";
  }
};

// ---- GET API: /strategy/configuration ----
export async function fetchStrategyConfiguration() {
  const resp = await fetch(`${API_BASE}/strategy/configuration`);

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(
      `Failed to load strategy configuration: ${resp.status} ${text}`
    );
  }

  return resp.json();
}

// ---- POST API: /strategy/configuration ----
export async function saveStrategyConfiguration(payload: any) {
  const resp = await fetch(`${API_BASE}/strategy/configuration`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(
      `Tariff config save failed: ${resp.status} ${text || ""}`.trim()
    );
  }

  return resp.json();
}
