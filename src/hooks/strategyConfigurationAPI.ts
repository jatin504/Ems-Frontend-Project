// ---- API BASE URL ----
export const API_BASE =
  (typeof import.meta !== "undefined" &&
    (import.meta as any).env &&
    (import.meta as any).env.VITE_EMS_API_URL) ||
  "http://75.119.146.115:5179";

function getToken(): string {
  return sessionStorage.getItem("token") || "";
}

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
      return "fixed";
    case "0":
    case "2":
    default:
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

// ---- GET API ----
export async function fetchStrategyConfiguration() {
  const resp = await fetch(`${API_BASE}/strategy/configuration`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(
      `Failed to load strategy configuration: ${resp.status} ${text}`
    );
  }

  return resp.json();
}


// password REQUIRED now
export async function saveStrategyConfiguration(
  payload: any,
  password: string
) {
  if (!password) {
    throw new Error("Password missing");
  }

  const resp = await fetch(`${API_BASE}/strategy/configuration`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      "X-Confirm-Password": password,
    },
    body: JSON.stringify(payload),
  });

  const text = await resp.text().catch(() => "");

  if (!resp.ok) {
    throw new Error(
      `Tariff config save failed: ${resp.status} ${text || ""}`.trim()
    );
  }

  return text ? JSON.parse(text) : {};
}
