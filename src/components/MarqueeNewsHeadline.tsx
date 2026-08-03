// import React, { useEffect, useState } from "react";
// import { Box, HStack, Text, useColorModeValue } from "@chakra-ui/react";

// /* ================= API BASE ================= */

// const API_BASE =
//   (import.meta as any).env?.VITE_API_BASE?.toString()?.replace(/\/$/, "") || "";

// /* ================= CONFIG ================= */

// const MAIN_DEVICE_ID = "plant_1_pcs_2_bank_bank_1";
// const POWER_DEVICE_ID = "plant_1_pcs_2_bank_bank_2";

// const METRICS = [
//   { label: "Net Export", deviceId: MAIN_DEVICE_ID, key: "Reactive_power", unit: "MWh" },
//   { label: "Export Lifetime", deviceId: MAIN_DEVICE_ID, key: "Alarm_1", unit: "GWh" },
//   { label: "Net Export (Inverters)", deviceId: POWER_DEVICE_ID, key: "Alarm_2", unit: "MWh" },
//   { label: "Tilt Irradiation with peak & time", deviceId: MAIN_DEVICE_ID, key: "BCU_1_Charge_Discharge_power", unit: "kW" },
//   { label: "Tilt Insolation", deviceId: MAIN_DEVICE_ID, key: "BCU_1_DOD", unit: "%" },
//   { label: "Hor. Irradiation", deviceId: MAIN_DEVICE_ID, key: "BCU_1_Dischargeable_capacity", unit: "kWh" },
//   { label: "Hor. Insolation", deviceId: MAIN_DEVICE_ID, key: "BCU_1_Energy_charged_this_month", unit: "kWh" },
//   { label: "PR", deviceId: MAIN_DEVICE_ID, key: "Energy_charged_today", unit: "%" },
//   { label: "Live Power with Peak & time", deviceId: MAIN_DEVICE_ID, key: "Power_factor", unit: "kW" },
//   { label: "Plant Start/Stop Time", deviceId: null, key: null, dummy: "08:00 / 18:00", unit: "" },
//   { label: "Last Plant trip time", deviceId: null, key: null, dummy: "2026-02-10 14:23", unit: "" },
//   { label: "Revenue", deviceId: null, key: null, dummy: "₹0.00", unit: "" },
//   { label: "CO2 offset", deviceId: null, key: null, dummy: "0 t", unit: "" },
//   { label: "Trees Planted", deviceId: null, key: null, dummy: "0", unit: "" },
// ];

// /* ================= COMPONENT ================= */

// const MarqueeNewsHeadline: React.FC = () => {
//   const bgColor = useColorModeValue("#F4F6F6", "#0E1111");
//   const textColor = useColorModeValue("gray.800", "gray.100");
//   const tagColor = useColorModeValue("blue.600", "cyan.300");

//   const initialValues = METRICS.reduce((acc: any, m) => {
//     acc[m.label] = "--";
//     return acc;
//   }, {});

//   const [values, setValues] = useState<Record<string, any>>(initialValues);

//   useEffect(() => {
//     const deviceIds = Array.from(
//       new Set(METRICS.map((m) => m.deviceId).filter(Boolean))
//     );

//     fetch(
//       `${API_BASE}/api/lastest-direct-data/multiple-latest-devices`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           device_ids: deviceIds.join(","),
//         }),
//       }
//     )
//       .then((r) => r.json())
//       .then((j) => {
//         if (!j?.success) return;

//         const newVals: Record<string, any> = { ...initialValues };

//         METRICS.forEach((m) => {
//           if (!m.deviceId) {
//             newVals[m.label] = m.dummy ?? "--";
//             return;
//           }

//           const dev = j.data?.[m.deviceId];
//           const raw = dev?.[m.key];

//           let v = "--";

//           if (raw && typeof raw === "object") {
//             v = raw.value ?? raw.v ?? "--";
//           } else if (raw !== undefined && raw !== null) {
//             v = raw;
//           }

//           newVals[m.label] = v;
//         });

//         setValues(newVals);
//       })
//       .catch((e) => {
//         console.error("Failed to load marquee metrics:", e);
//       });
//   }, []);

//   return (
//     <Box
//       bg={bgColor}
//       overflow="hidden"
//       width="100%"
//       py={2}
//       whiteSpace="nowrap"
//       borderBottom="1px solid"
//       borderColor={useColorModeValue("gray.200", "gray.700")}
//     >
//       <Box
//         display="inline-flex"
//         whiteSpace="nowrap"
//         sx={{
//           animation: "marquee 60s linear infinite",
//           "@keyframes marquee": {
//             "0%": { transform: "translateX(100%)" },
//             "100%": { transform: "translateX(-100%)" },
//           },
//         }}
//       >
//         <HStack spacing={8} mx={6}>
//           {METRICS.map((m) => (
//             <Metric
//               key={m.label}
//               label={m.label}
//               value={values[m.label] ?? "--"}
//               unit={m.unit || ""}
//               color={tagColor}
//               textColor={textColor}
//             />
//           ))}
//         </HStack>
//       </Box>
//     </Box>
//   );
// };

// /* ================= HELPER ================= */

// const Metric = ({
//   label,
//   value,
//   unit,
//   color,
//   textColor,
// }: {
//   label: string;
//   value: number | string;
//   unit: string;
//   color: string;
//   textColor: string;
// }) => (
//   <HStack spacing={2}>
//     <Text fontWeight="bold" fontSize="sm" color={color}>
//       {label}:
//     </Text>
//     <Text fontSize="sm" color={textColor}>
//       {value} {unit}
//     </Text>
//   </HStack>
// );

// export default MarqueeNewsHeadline;
import React, { useEffect, useMemo, useState, useRef } from "react";
import { Box, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import useTimeseriesData from "../hooks/useTimeseriesData";

/* ================= CONFIG ================= */

const DEVICE_ID = "plant_1_plant_device";

const METRICS = [
  {
    label: "Net Export",
    deviceId: DEVICE_ID,
    key: "grid_export_today",
    unit: "MWh",
  },

  {
    label: "Export Lifetime",
    deviceId: DEVICE_ID,
    key: "inv_total_energy",
    unit: "GWh",
  },

  {
    label: "Net Export (Inverters)",
    deviceId: DEVICE_ID,
    key: "inv_daily_energy",
    unit: "MWh",
  },

  // {
  //   label: "Last Update Time",
  //   deviceId: DEVICE_ID,
  //   key: "inv_daily_energy",
  //   unit: "",
  //   showTs: true,
  // },

  {
    label: "Tilt Irradiation",
    deviceId: DEVICE_ID,
    key: "",
    unit: "",
  },

  {
    label: "Tilt Insolation",
    deviceId: DEVICE_ID,
    key: "",
    unit: "",
  },

  {
    label: "Hor. Irradiation",
    deviceId: DEVICE_ID,
    key: "",
    unit: "",
  },

  {
    label: "Hor. Insolation",
    deviceId: DEVICE_ID,
    key: "",
    unit: "",
  },

  {
    label: "PR",
    deviceId: DEVICE_ID,
    key: "total_inv_pr",
    unit: "%",
  },

  {
    label: "Plant peak power with time",
    deviceId: DEVICE_ID,
    key: "inv_total_power",
    unit: "",
    isPeak: true,
  },

  {
    label: "Plant Start/Stop Time",
    deviceId: DEVICE_ID,
    key: ["plant_start_time", "plant_stop_time"],
    unit: "",
  },

  {
    label: "Last Plant trip time",
    deviceId: null,
    key: "plant_trip_time",
    unit: "",
  },

  {
    label: "Revenue",
    deviceId: DEVICE_ID,
    key: "revenue",
    unit: "₹",
  },

  {
    label: "CO2 Saved",
    deviceId: DEVICE_ID,
    key: "co2_saved",
    unit: "kg",
  },

  {
    label: "Trees Planted",
    deviceId: DEVICE_ID,
    key: "trees_equivalent",
    unit: "",
  },
];

/* ================= COMPONENT ================= */

const MarqueeNewsHeadline: React.FC = () => {
  const bgColor = useColorModeValue("#F4F6F6", "#0E1111");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const tagColor = useColorModeValue("blue.600", "cyan.300");

  const { data, fetchData } = useTimeseriesData();

  const initialValues = useMemo(() => {
    return METRICS.reduce((acc: any, m) => {
      acc[m.label] = (m as any).dummy ?? "--";
      return acc;
    }, {});
  }, []);

  const [values, setValues] =
    useState<Record<string, any>>(initialValues);

  const [animate, setAnimate] = useState(true);
  const delayTimeout = useRef<number | null>(null);

  const deviceIds = useMemo(
    () =>
      Array.from(
        new Set(
          METRICS.map((m) => m.deviceId).filter(Boolean)
        )
      ),
    []
  );

  /* ================= API REQUEST ================= */

  const fetchingToServerObj: any = useMemo(() => {
    return {
      dataSource: {
        devices: {
          ids: deviceIds as string[],
          patterns: [],
        },

        keys: METRICS
          .filter((m) => m.deviceId)
          .flatMap((m: any) => {

            if (Array.isArray(m.key)) {
              return m.key.map((k: string) => ({
                key: k,
                alias: k,
                keyType: "common",
              }));
            }

            return [{
              key: m.key,
              alias: m.label,
              keyType: "common",
            }];
          }),

        aggregation: {
          func: "none",
          interval: 1,
          intervalType: "minute",
        },

        timeRange: {
          type: "relative",
          relativeType: "currentDaySoFar",
        },

        orderBy: "DESC",
      },
    };
  }, [deviceIds]);

  /* ================= FETCH ================= */

  useEffect(() => {
    if (deviceIds.length === 0) return;

    fetchData(fetchingToServerObj.dataSource);

    const interval = setInterval(() => {
      fetchData(fetchingToServerObj.dataSource);
    }, 60000);

    return () => clearInterval(interval);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchingToServerObj]);

  useEffect(() => {
    return () => {
      if (delayTimeout.current) {
        clearTimeout(delayTimeout.current as number);
      }
    };
  }, []);

  /* ================= MAP API RESPONSE ================= */

  useEffect(() => {
    if (!data) return;

    const updatedValues: Record<string, any> = {
      ...initialValues,
    };

    METRICS.forEach((metric: any) => {
      if (!metric.deviceId) return;

      const deviceData =
        (data as any)?.[metric.deviceId];

      /* ================= START / STOP ================= */

      if (Array.isArray(metric.key)) {

        const startSeries =
          deviceData?.["plant_start_time"] ?? [];

        const stopSeries =
          deviceData?.["plant_stop_time"] ?? [];

        // ===== START (minimum value > 0) =====
        // ===== STOP (maximum value) =====

        let minStartPoint: any = null;
        let maxStopPoint: any = null;

        /* ================= START ================= */

        startSeries.forEach((p: any) => {

          // ignore 0 / null / undefined
          if (
            p?.value !== null &&
            p?.value !== undefined &&
            Number(p.value) > 0
          ) {

            if (
              !minStartPoint ||
              Number(p.value) < Number(minStartPoint.value)
            ) {
              minStartPoint = p;
            }
          }
        });

        /* ================= STOP ================= */

        stopSeries.forEach((p: any) => {

          // ignore 0 / null / undefined
          if (
            p?.value !== null &&
            p?.value !== undefined &&
            Number(p.value) > 0
          ) {

            if (
              !maxStopPoint ||
              Number(p.value) > Number(maxStopPoint.value)
            ) {
              maxStopPoint = p;
            }
          }
        });

        /* ================= FORMAT ================= */

        const formatUnix = (unix: number) => {

          if (!unix || unix <= 0 || isNaN(unix)) {
            return "--";
          }

          const date = new Date(unix * 1000);

          return date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
        };

        // SHOW TS OF PICKED POINTS
        updatedValues[metric.label] =
          `${formatUnix(Number(minStartPoint?.value))} / ${formatUnix(Number(maxStopPoint?.value))}`;

        return;
      }

      /* ================= PEAK POWER ================= */

      if (metric.isPeak) {

        const series =
          deviceData?.[metric.label];

        if (
          Array.isArray(series) &&
          series.length > 0
        ) {

          let maxPoint = series[0];

          series.forEach((p: any) => {
            if (Number(p.value) > Number(maxPoint.value)) {
              maxPoint = p;
            }
          });

          let peakValueNum = Number(maxPoint.value ?? 0);

          if (metric.unit === "MWh") {
            peakValueNum = peakValueNum / 1000;
          }

          if (metric.unit === "GWh") {
            peakValueNum = peakValueNum / 1000000;
          }

          const peakValue = peakValueNum.toFixed(2);

          const date = new Date(Number(maxPoint.ts));
          const hr = date.getUTCHours() < 10 ? `0${date.getUTCHours()}` : date.getUTCHours()
            const min = date.getUTCMinutes() < 10 ? `0${date.getUTCMinutes()}` : date.getUTCMinutes()

          updatedValues[metric.label] =
            `${peakValue} kW @ ${hr}:${min}`;
        }

        return;
      }

      /* ================= SHOW LAST TIMESTAMP ================= */

      if (metric.showTs) {
        const series = deviceData?.[metric.label];

        if (Array.isArray(series) && series.length > 0) {
          const lastTs = series[0]?.ts ?? series[0]?.ts;

          const formatTs = (ts: any) => {
            if (!ts) return "--";
            const date = new Date(Number(ts));
            // if (isNaN(date.getTime())) return "--";
            const hr = date.getUTCHours() < 10 ? `0${date.getUTCHours()}` : date.getUTCHours()
            const min = date.getUTCMinutes() < 10 ? `0${date.getUTCMinutes()}` : date.getUTCMinutes()
            return  hr + ":" + min;
          };

          updatedValues[metric.label] = formatTs(lastTs);
        }

        return;
      }

      /* ================= NORMAL ================= */

      const series =
        deviceData?.[metric.label];

      if (
        Array.isArray(series) &&
        series.length > 0
      ) {
        let value =
          Number(series[0]?.value ?? 0);

        /* ===== UNIT CONVERSION ===== */

        if (metric.unit === "MWh") {
          value = value / 1000;
        }

        if (metric.unit === "GWh") {
          value = value / 1000000;
        }

        updatedValues[metric.label] =
          isNaN(value)
            ? "--"
            : value.toFixed(2);
      }
    });

    setValues(updatedValues);

  }, [data, initialValues]);

  /* ================= UI ================= */

  return (
    <Box
      position="relative"
      zIndex={0}
      bg={bgColor}
      overflow="hidden"
      width="100%"
      py={2}
      whiteSpace="nowrap"
      borderBottom="1px solid"
      borderColor={useColorModeValue(
        "gray.200",
        "gray.700"
      )}
    >
      <Box
        display="inline-flex"
        whiteSpace="nowrap"
        onAnimationEnd={() => {
          setAnimate(false);
          // restart after 2 seconds
          delayTimeout.current = window.setTimeout(() => {
            setAnimate(true);
          }, 2000) as unknown as number;
        }}
        sx={{
          animation: animate ? "marquee 60s linear 1" : undefined,
          transform: animate ? undefined : "translateX(100%)",

          "@keyframes marquee": {
            "0%": {
              transform: "translateX(100%)",
            },

            "100%": {
              transform: "translateX(-100%)",
            },
          },
        }}
      >
        <HStack spacing={8} mx={6}>
          {METRICS.map((metric) => (
            <Metric
              key={metric.label}
              label={metric.label}
              value={values[metric.label]}
              unit={metric.unit}
              color={tagColor}
              textColor={textColor}
            />
          ))}
        </HStack>
      </Box>
    </Box>
  );
};

/* ================= HELPER ================= */

const Metric = ({
  label,
  value,
  unit,
  color,
  textColor,
}: {
  label: string;
  value: number | string;
  unit: string;
  color: string;
  textColor: string;
}) => (
  <HStack spacing={2}>
    <Text
      fontWeight="bold"
      fontSize="sm"
      color={color}
    >
      {label}:
    </Text>

    <Text
      fontSize="sm"
      color={textColor}
    >
      {value} {unit}
    </Text>
  </HStack>
);

export default MarqueeNewsHeadline;