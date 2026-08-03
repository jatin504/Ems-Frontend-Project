type Point = {
  ts: number;
  value: number;
};

type SeriesConfig = {
  alias: string;
  color: string;
  type?: "column" | "spline" | "line";
  yAxis?: number;
};

export const buildCategoryChartData = (
  deviceData: Record<string, Point[]>,
  configs: SeriesConfig[]
) => {
  if (!deviceData) {
    return {
      categories: [],
      series: [],
      timestamps: [],
    };
  }

  // ---- Build unique sorted timestamps ----
  const tsSet = new Set<number>();

  configs.forEach((cfg) => {
    (deviceData[cfg.alias] || []).forEach((p) => {
      tsSet.add(p.ts);
    });
  });

  const timestamps = Array.from(tsSet).sort((a, b) => a - b);

  // ---- Categories for UI only ----
  const categories = timestamps.map((ts) =>
    new Date(ts).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    })
  );

  // ---- Series ----
  const series = configs.map((cfg) => {
    const raw = deviceData[cfg.alias] || [];

    const map = new Map<number, number>();

    raw.forEach((p) => {
      map.set(p.ts, p.value);
    });

    return {
      type: cfg.type || "column",
      name: cfg.alias,
      color: cfg.color,
      yAxis: cfg.yAxis,

      data: timestamps.map((ts) => map.get(ts) ?? null),
    };
  });

  return {
    categories,
    series,
    timestamps,
  };
};