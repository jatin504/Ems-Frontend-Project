import {
  Grid,
  useColorModeValue,
} from "@chakra-ui/react";

import { useEffect, useMemo } from "react";

import {
  WiThermometer,
  WiStrongWind,
  WiHumidity,
  WiBarometer,
  WiRain,
  WiDaySunny,
} from "react-icons/wi";

import WMSCard from "./WMSCard";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";

interface WMSTopCardsProps {
  selectedDevice: string;
}

const WMSTopCards = ({
  selectedDevice,
}: WMSTopCardsProps) => {

  const iconColor = useColorModeValue(
    "#2563eb",
    "#5daeff"
  );

  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    if (!selectedDevice) return;

    const payload = {
      devices: {
        ids: [selectedDevice],
        patterns: [],
      },
      keys: [
        { key: "temperature", alias: "Temperature", keyType: "timeseries" },
        { key: "module_temperature", alias: "Module Temp", keyType: "timeseries" },
        { key: "irradiance", alias: "Irradiance", keyType: "timeseries" },
        { key: "wind_speed", alias: "Wind Speed", keyType: "timeseries" },
        { key: "wind_direction", alias: "Wind Direction", keyType: "timeseries" },
        { key: "relative_humidity", alias: "Relative Humidity", keyType: "timeseries" },
        { key: "rainfall", alias: "Rainfall", keyType: "timeseries" },
        { key: "barometric_pressure", alias: "Barometric Pressure", keyType: "timeseries" },
      ],
      aggregation: { func: "last", interval: 1, intervalType: "minute" },
      timeRange: { type: "last", interval: 1, intervalType: "day" },
      orderBy: "DESC",
    } as any;

    const fetchTop = () => fetchData(payload);

    // initial
    fetchTop();

    const interval = setInterval(fetchTop, 60000);
    return () => clearInterval(interval);
  }, [selectedDevice]);

  const latest = useMemo(() => {
    if (!data || !selectedDevice) return {} as any;
    const device = data[selectedDevice];
    if (!device) return {} as any;

    const getLatest = (alias: string) => {
      const arr = device?.[alias] || [];
      if (Array.isArray(arr) && arr.length > 0) return Number(arr[0].value || 0);
      return 0;
    };

    const getMin = (alias: string) => {
      const arr = device?.[alias] || [];
      const vals = arr.map((d: any) => Number(d.value)).filter((v: number) => !isNaN(v));
      return vals.length ? Math.min(...vals) : null;
    };

    const getMax = (alias: string) => {
      const arr = device?.[alias] || [];
      const vals = arr.map((d: any) => Number(d.value)).filter((v: number) => !isNaN(v));
      return vals.length ? Math.max(...vals) : null;
    };

    return {
      temperature: { latest: getLatest("Temperature"), min: getMin("Temperature"), max: getMax("Temperature") },
      module_temperature: { latest: getLatest("Module Temp"), min: getMin("Module Temp"), max: getMax("Module Temp") },
      irradiance: { latest: getLatest("Irradiance"), min: getMin("Irradiance"), max: getMax("Irradiance") },
      wind_speed: { latest: getLatest("Wind Speed"), min: getMin("Wind Speed"), max: getMax("Wind Speed") },
      wind_direction: { latest: getLatest("Wind Direction"), min: getMin("Wind Direction"), max: getMax("Wind Direction") },
      relative_humidity: { latest: getLatest("Relative Humidity"), min: getMin("Relative Humidity"), max: getMax("Relative Humidity") },
      rainfall: { latest: getLatest("Rainfall"), min: getMin("Rainfall"), max: getMax("Rainfall") },
      barometric_pressure: { latest: getLatest("Barometric Pressure"), min: getMin("Barometric Pressure"), max: getMax("Barometric Pressure") },
    } as any;
  }, [data, selectedDevice]);

  return (

    <Grid
      templateColumns={{
        base: "repeat(1,1fr)",
        md: "repeat(2,1fr)",
        lg: "repeat(4,1fr)",
        xl: "repeat(8,1fr)",
      }}
      gap="10px"
    >

      <WMSCard
        title="Ambient Temp."
        value={String((latest.temperature?.latest ?? 0).toFixed(1))}
        unit="°C"
        min={latest.temperature?.min != null ? `${latest.temperature.min.toFixed(1)} °C` : "-"}
        max={latest.temperature?.max != null ? `${latest.temperature.max.toFixed(1)} °C` : "-"}
        icon={<WiThermometer size={42} color={iconColor} />}
      />

      <WMSCard
        title="Module Temp."
        value={String((latest.module_temperature?.latest ?? 0).toFixed(1))}
        unit="°C"
        min={latest.module_temperature?.min != null ? `${latest.module_temperature.min.toFixed(1)} °C` : "-"}
        max={latest.module_temperature?.max != null ? `${latest.module_temperature.max.toFixed(1)} °C` : "-"}
        icon={
          <WiThermometer
            size={42}
            color={iconColor}
          />
        }
      />

      <WMSCard
        title="Irradiance"
        value={String((latest.irradiance?.latest ?? 0).toFixed(1))}
        unit="W/m²"
        min={latest.irradiance?.min != null ? `${latest.irradiance.min.toFixed(1)}` : "-"}
        max={latest.irradiance?.max != null ? `${latest.irradiance.max.toFixed(1)}` : "-"}
        icon={
          <WiDaySunny
            size={42}
            color="#ffb020"
          />
        }
      />

      <WMSCard
        title="Wind Speed"
        value={String((latest.wind_speed?.latest ?? 0).toFixed(1))}
        unit="m/s"
        min={latest.wind_speed?.min != null ? `${latest.wind_speed.min.toFixed(1)}` : "-"}
        max={latest.wind_speed?.max != null ? `${latest.wind_speed.max.toFixed(1)}` : "-"}
        icon={
          <WiStrongWind
            size={42}
            color={iconColor}
          />
        }
      />

      <WMSCard
        title="Wind Direction"
        value={String((latest.wind_direction?.latest ?? 0).toFixed(1))}
        unit="°"
        min={latest.wind_direction?.min != null ? `${latest.wind_direction.min.toFixed(1)}` : "-"}
        max={latest.wind_direction?.max != null ? `${latest.wind_direction.max.toFixed(1)}` : "-"}
        icon={
          <WiStrongWind
            size={42}
            color={iconColor}
          />
        }
      />

      <WMSCard
        title="Relative Humidity"
        value={String((latest.relative_humidity?.latest ?? 0).toFixed(1))}
        unit="%"
        min={latest.relative_humidity?.min != null ? `${latest.relative_humidity.min.toFixed(1)}%` : "-"}
        max={latest.relative_humidity?.max != null ? `${latest.relative_humidity.max.toFixed(1)}%` : "-"}
        icon={
          <WiHumidity
            size={42}
            color={iconColor}
          />
        }
      />

      <WMSCard
        title="Rainfall"
        value={String((latest.rainfall?.latest ?? 0).toFixed(1))}
        unit="mm"
        min={latest.rainfall?.min != null ? `${latest.rainfall.min.toFixed(1)}` : "-"}
        max={latest.rainfall?.max != null ? `${latest.rainfall.max.toFixed(1)}` : "-"}
        icon={
          <WiRain
            size={42}
            color={iconColor}
          />
        }
      />

      <WMSCard
        title="Barometric Pressure"
        value={String((latest.barometric_pressure?.latest ?? 0).toFixed(1))}
        unit="hPa"
        min={latest.barometric_pressure?.min != null ? `${latest.barometric_pressure.min.toFixed(1)}` : "-"}
        max={latest.barometric_pressure?.max != null ? `${latest.barometric_pressure.max.toFixed(1)}` : "-"}
        icon={
          <WiBarometer
            size={42}
            color={iconColor}
          />
        }
      />

    </Grid>
  );
};

export default WMSTopCards;