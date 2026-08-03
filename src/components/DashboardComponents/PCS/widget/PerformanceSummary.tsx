import React, {
  useEffect,
  useMemo,
} from "react";

import {
  useColorMode,
} from "@chakra-ui/react";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";
// import StaleIndicator from "../../../Common/StaleIndicator";
// import NonCommunicationIndicator from "../../../Common/NonCommunicationIndicator";

interface WidgetPoint {
  ts: number;
  value: number | null;
}

interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}

const PerformanceSummary = () => {

  const { colorMode } =
    useColorMode();

  const isDark =
    colorMode === "dark";

  const cardBg = isDark
    ? "radial-gradient(circle at top right, #123b63 0%, #081c33 45%, #051525 100%)"
    : "#ffffff";

  const border = isDark
    ? "1px solid #123457"
    : "1px solid #d5e6f7";

  const titleColor = isDark
    ? "#d7e8ff"
    : "#1e293b";

  const labelColor = isDark
    ? "#b8c7d9"
    : "#64748b";

  const green = "#7CFC00";

  const blue = "#4DA6FF";

  const purple = "#B388FF";

  const { data, fetchData } =
    useTimeseriesData();

  const nonCommStorage = JSON.parse(
    sessionStorage.getItem("non_comm_info") || "{}"
  );

  const pcsInfo = nonCommStorage?.pcs;

  const showNonComm = pcsInfo?.status === 1;

  /* ================= API ================= */

  useEffect(() => {

    const fetchSummary =
      () => {

        fetchData({
          devices: {
            patterns: [
              "_inverter_inverter_",
            ],
            ids: [],
          },

          keys: [

            {
              key: "total_dc_power",
              alias: "dc_power",
              keyType: "common",
            },

            {
              key: "active_power",
              alias: "active_power",
              keyType: "common",
            },

            {
              key: "daily_energy",
              alias: "daily_energy",
              keyType: "common",
            },

            {
              key: "inv_pr",
              alias: "pr_percent",
              keyType: "common",
            },

            {
              key: "inv_availability",
              alias: "availability",
              keyType: "common",
            },

          ],

          aggregation: {
            func: "none",
            interval: 1,
            intervalType:
              "minute",
          },

          timeRange: {
        type: "last",
        
        interval: 1,
        intervalType: "minute",
          },

          orderBy: "ASC",

        } as any);

      };

    fetchSummary();

    const interval =
      setInterval(() => {

        fetchSummary();

      }, 60000);

    return () =>
      clearInterval(interval);

  }, []);

  /* ================= MAP ================= */

  const summaryData =
    useMemo(() => {

      const widgetData =
        data as WidgetData | null;

      if (!widgetData)
        return [];

      let totalDCPower = 0;

      let totalACPower = 0;

      let totalEnergy = 0;

      let totalPR = 0;

      let totalAvailability = 0;

      let inverterCount = 0;

      const now = Date.now();

      const getLatestPoint = (
        device: any,
        key: string
      ) => {
        return (
          device[key]?.[
            device[key]?.length - 1
          ] || null
        );
      };

      // track latest ts per metric across all devices
      let dcLatestTs = 0;
      let acLatestTs = 0;
      let energyLatestTs = 0;
      let prLatestTs = 0;
      let availabilityLatestTs = 0;

      Object.keys(widgetData)
        .sort((a, b) =>
          a.localeCompare(b, undefined, {
            numeric: true,
          })
        )
        .forEach((deviceId) => {
          const device = widgetData[deviceId];

          const dcPowerPoint =
            getLatestPoint(device, "dc_power");

          const acPowerPoint =
            getLatestPoint(device, "active_power");

          const energyPoint =
            getLatestPoint(device, "daily_energy");

          const prPoint =
            getLatestPoint(device, "pr_percent");

          const availabilityPoint =
            getLatestPoint(device, "availability");

          const dcPower = Number(
            dcPowerPoint?.value ?? 0
          );

          const acPower = Number(
            acPowerPoint?.value ?? 0
          );

          const dailyEnergy = Number(
            energyPoint?.value ?? 0
          );

          const pr = Number(prPoint?.value ?? 0);

          const availability = Number(
            availabilityPoint?.value ?? 0
          );

          // update latest timestamps per metric
          dcLatestTs = Math.max(
            dcLatestTs,
            dcPowerPoint?.ts || 0
          );

          acLatestTs = Math.max(
            acLatestTs,
            acPowerPoint?.ts || 0
          );

          energyLatestTs = Math.max(
            energyLatestTs,
            energyPoint?.ts || 0
          );

          prLatestTs = Math.max(
            prLatestTs,
            prPoint?.ts || 0
          );

          availabilityLatestTs = Math.max(
            availabilityLatestTs,
            availabilityPoint?.ts || 0
          );

          totalDCPower += dcPower;

          totalACPower += acPower;

          totalEnergy += dailyEnergy;

          totalPR += pr;

          totalAvailability += availability;

          inverterCount++;
        });



      const averagePR =
        inverterCount > 0
          ? totalPR /
            inverterCount
          : 0;

      const averageAvailability =
        inverterCount > 0
          ? totalAvailability /
            inverterCount
          : 0;

      return [

        {
          label: "Total PCS",

          value: inverterCount.toFixed(0),

          unit: "",

          color: blue,

          // ts: Date.now(),
        },

        {
          label: "Total DC Power",

          value: totalDCPower.toFixed(2),

          unit: "KW",

          color: green,

          ts: dcLatestTs,
        },

        {
          label: "Total AC Power",


          value: totalACPower.toFixed(2),

          unit: "kW",

          color: blue,

          ts: acLatestTs,
        },

        {
          label: "Total Energy Today",

          value: (totalEnergy / 1000).toFixed(2),

          unit: "MWh",

          color: green,

          ts: energyLatestTs,
        },

        {
          label: "Average PR",

          value: averagePR.toFixed(1),

          unit: "%",

          color: purple,

          ts: prLatestTs,
        },

        {
          label: "Average Availability",

          value: averageAvailability.toFixed(1),

          unit: "%",

          color: green,

          ts: availabilityLatestTs,
        },

      ];

    }, [data]);

  return (
    <div
      style={{
        background:
          cardBg,

        border,

        fontFamily: "Poppins, sans-serif",

        borderRadius:
          "10px",

        padding: "16px",

        height: "280px",

        boxShadow: isDark
          ? "inset 0 0 40px rgba(0,0,0,0.25)"
          : "0 4px 18px rgba(15,23,42,0.08)",

        transition:
          "0.3s ease",
      }}
    >

      {/* TITLE */}

      <h3
        style={{
          margin: 0,
          marginBottom: "24px",
          fontSize: "14px",
          fontWeight: 700,
          letterSpacing: "0.5px",
          color: titleColor,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        PCS PERFORMANCE SUMMARY

        {/* {showNonComm && (
          <NonCommunicationIndicator
            status={showNonComm}
            message={`Data can be wrong due to non-communication instances.\n\nTimestamp : ${pcsInfo?.time || "--"}`}
          />
        )} */}

      </h3>

      {/* GRID */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(3, minmax(0,1fr))",

          gap: "28px 18px",
        }}
      >

        {summaryData.map(
          (
            item,
            index
          ) => (

            <div key={index}>

              {/* LABEL */}

              <p
                style={{
                  margin: 0,

                  marginBottom:
                    "8px",

                  fontSize:
                    "13px",

                  fontWeight: 500,

                  color:
                    labelColor,

                  whiteSpace:
                    "nowrap",
                }}
              >
                {item.label}
              </p>

              {/* VALUE */}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "4px",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "28px",
                      lineHeight: 1,
                      fontWeight: 700,
                      color: item.color,
                      letterSpacing: "-1px",
                    }}
                  >
                    {item.value}
                  </h2>

                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: isDark ? "#d7e8ff" : "#475569",
                    }}
                  >
                    {item.unit}
                  </span>
                </div>

                {/* <StaleIndicator
  ts={item.ts}
  value={item.value}
/> */}

                {item.label === "Average Availability" && null}

              </div>

            </div>

          )
        )}

      </div>

    </div>
  );
};

export default PerformanceSummary;