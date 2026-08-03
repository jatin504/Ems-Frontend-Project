// types.ts (optional)
interface WidgetKeyConfig {
  key: string;
  alias: string;
  keyType: string;
  chartType?: string;
  yAxis?: number;
  color?: string;
  opposite? : boolean;
}

interface WidgetData {
  [deviceID: string]: {
    [keyName: string]: { ts: number; value: number }[];
  };
}

interface HighchartsSeries {
  type: string;
  name: string;
  data: [number, number][];
  yAxis?: number;
  color?: string;
  opposite : boolean;
}

export function transformToHighchartsTimeSeries(
  widgetData: WidgetData,
  keysConfig: WidgetKeyConfig[]
): HighchartsSeries[] {
  const series: HighchartsSeries[] = [];
// console.log(widgetData)
  // Build map: keyName → config (for fast lookup)
  const keyConfigMap = new Map<string, WidgetKeyConfig>();
  keysConfig.forEach(config => {
    keyConfigMap.set(config.alias, config);
  });

  // Process each device
  for (const deviceID in widgetData) {
    const deviceData = widgetData[deviceID];

    for (const keyName in deviceData) {
      const points = deviceData[keyName];
      const config = keyConfigMap.get(keyName);

      if (!config) continue;

      // Build series name
      let seriesName: string;
      if (config.keyType === 'common') {
        // Extract last number from deviceID: e.g., ...inverter_1 → "1"
        const match = deviceID.match(/_(\d+)$/);
        const suffix = match ? match[1] : '';
        seriesName = `${config.alias}-${suffix}`;
      } else {
        // individual: use alias as-is
        seriesName = config.alias;
      }

      // Convert [{ ts, value }] → [[ts, value]] for Highcharts
      const data: [number, number][] = points.map(p => [p.ts, p.value]);

        const seriesItem: any = {
            type: config.chartType,
            name: seriesName,
            data: data,
        };

        // Add color only if defined
        if(config.color !== undefined) {
          seriesItem.color = config.color;
        }

        // Only add yAxis if explicitly defined
        if (config.yAxis !== undefined) {
            seriesItem.yAxis = config.yAxis;
        }

        // Only add opposite if explicitly defined
        // if (config.opposite !== undefined) {
        //     seriesItem.opposite = config.opposite;
        // }

        series.push(seriesItem);
    }
  }
  // console.log("SERIES: ", series);
  return series;
}