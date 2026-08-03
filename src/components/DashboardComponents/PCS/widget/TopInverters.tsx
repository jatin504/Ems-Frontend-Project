import React, { useEffect, useMemo, useState } from "react";
import { useColorMode } from "@chakra-ui/react";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";

interface WidgetPoint {
  ts: number;
  value: number | null;
}

interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}

const inverterRows = Array.from(
  { length: 20 },
  (_, i) => i + 1
);

const TopInverters = () => {

  const { colorMode } =
    useColorMode();

  const isDark =
    colorMode === "dark";

  const { data, fetchData } =
    useTimeseriesData();

  const [selectedTab, setSelectedTab] =
    useState("today");

  const [sortOrder, setSortOrder] =
    useState<"desc" | "asc">("desc");

  const tabs = ["today", "yesterday", "month", "year"];

  const getDeviceIds = () => {
    switch (selectedTab) {
      case "today":
        return inverterRows.map((i) => `plant_1_block_1_inverter_inverter_${i}`);
      case "yesterday":
        return inverterRows.map((i) => `plant_1_block_1_inverter_inverter_${i}_1_day`);
      case "month":
        return inverterRows.map((i) => `plant_1_block_1_inverter_inverter_${i}_1_month`);
      case "year":
        return inverterRows.map((i) => `plant_1_block_1_inverter_inverter_${i}_1_year`);
      default:
        return inverterRows.map((i) => `plant_1_block_1_inverter_inverter_${i}`);
    }
  };

  /* ================= TIME RANGE ================= */

  const getTimeRange = () => {

    switch (selectedTab) {

      case "today":

        return {
          type: "relative",
          relativeType:
            "currentDaySoFar",
          interval: 1,
          intervalType:
            "minute",
        };

      case "yesterday":

        return {
          type: "relative",
          relativeType:
            "currentMonthSoFar",
          interval: 1,
          intervalType:
            "day",
        };

      case "month":

        return {
          type: "relative",
          relativeType:
            "currentMonthSoFar",
          interval: 1,
          intervalType:
            "month",
        };

      case "year":

        return {

          type: "absolute",

          startTs: new Date(
            new Date().getFullYear(),
            0,
            1
          ).getTime(),

          endTs: Date.now(),

        };

      default:

        return {
          type: "relative",
          relativeType:
            "currentDaySoFar",
          interval: 1,
          intervalType:
            "minute",
        };

    }

  };

  /* ================= API ================= */

  useEffect(() => {

    const fetchTopInverters =
      () => {

        fetchData({
          devices: {
            patterns: [],
            ids: getDeviceIds(),
          },

          keys: [
            {
              key: "daily_energy",
              alias:
                "daily_energy",
              keyType:
                "common",
            },
          ],

          aggregation: {
            func: "last",
            interval: 1,
            intervalType:
              "day",
          },

          timeRange:
            getTimeRange(),

          orderBy: "DESC",
        } as any);

      };

    fetchTopInverters();

    const interval =
      setInterval(() => {

        fetchTopInverters();

      }, 60000);

    return () =>
      clearInterval(interval);

  }, [selectedTab]);

  /* ================= MAP ================= */

  const allData = useMemo(() => {

    const widgetData =
      data as WidgetData | null;

    if (!widgetData) return [];

    const allInverters: any[] = [];

    Object.keys(widgetData)

      .sort((a, b) =>
        a.localeCompare(
          b,
          undefined,
          {
            numeric: true,
          }
        )
      )

      .forEach((deviceId) => {

        const device =
          widgetData[deviceId];

        const arr =
          device["daily_energy"];

        let value = 0;

        /* TODAY */

        if (
          selectedTab ===
          "today"
        ) {

          value =
            arr &&
            arr.length > 0
              ? Number(
                  arr[0]
                    ?.value ?? 0
                )
              : 0;

        }

        /* YESTERDAY */

        else if (
          selectedTab ===
          "yesterday"
        ) {

          value =
            arr &&
            arr.length > 1
              ? Number(
                  arr[1]
                    ?.value ?? 0
                )
              : arr &&
                arr.length > 0
              ? Number(
                  arr[0]
                    ?.value ?? 0
                )
              : 0;

        }

        /* MONTH + YEAR */

        else {

          value =
            arr &&
            arr.length > 0
              ? Number(
                  arr[0]
                    ?.value ?? 0
                )
              : 0;

        }

        const cleanId =
  deviceId
    .replace("_1_day", "")
    .replace("_1_month", "")
    .replace("_1_year", "");

        allInverters.push({

          id:
            cleanId
              ?.split(
                "_inverter_"
              )
              ?.pop()
              ?.replace(
                "inverter_",
                "PCS-"
              ) || cleanId,

          value,

        });

      });

    return allInverters

      .filter((item) => item.value !== null)

      .sort((a, b) =>
        sortOrder === "desc" ? b.value - a.value : a.value - b.value
      );

  }, [data, selectedTab, sortOrder]);

  /* ================= TOP 5 ================= */

  const topData =
    allData.slice(0, 5);

  /* ================= MAX ================= */

  const maxValue = Math.max(
    ...topData.map(
      (d) => d.value
    ),
    1
  );

  /* ================= TOTAL ================= */

  const totalEnergy =
    allData.reduce(
      (sum, item) =>
        sum + item.value,
      0
    );

  return (
    <div
      style={{
        background: isDark
          ? "radial-gradient(circle at top right, #123b63 0%, #081c33 45%, #051525 100%)"
          : "#ffffff",

        border: isDark
          ? "1px solid #123457"
          : "1px solid #d5e6f7",

        borderRadius: "10px",

        padding: "10px",

        height: "280px",

        boxSizing:
          "border-box",

        overflow: "hidden",

        display: "flex",

        flexDirection:
          "column",

        boxShadow: isDark
          ? "inset 0 0 30px rgba(0,0,0,0.25)"
          : "0 4px 18px rgba(15,23,42,0.08)",

        transition:
          "0.3s ease",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          marginBottom: "8px",
        }}
      >
        <h3
          style={{
            margin: 0,

            fontSize: "12px",

            fontWeight: 700,

            letterSpacing:
              "0.5px",

            color: isDark
              ? "#d7e8ff"
              : "#1e293b",
          }}
        >
          TOP 5 PCS
        </h3>

        <span
          style={{
            fontSize: "10px",

            fontWeight: 600,

            color: isDark
              ? "#cbd5e1"
              : "#64748b",
          }}
        >
          kWh
        </span>
      </div>

      {/* TABS */}

      <div
        style={{
          display: "flex",

          justifyContent: "space-between",

          alignItems: "center",

          marginBottom: "10px",
        }}
      >
        <div
          style={{
            display: "flex",

            gap: "6px",

            flexWrap: "wrap",
          }}
        >
          {tabs.map((tab) => (

            <div
              key={tab}
              onClick={() => setSelectedTab(tab)}
              style={{
                padding: "4px 10px",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "10px",
                fontWeight: 600,
                textTransform: "capitalize",
                transition: "0.25s ease",
                background: selectedTab === tab ? "#84cc16" : isDark ? "#163453" : "#e2e8f0",
                color: selectedTab === tab ? "#ffffff" : isDark ? "#cbd5e1" : "#334155",
                border: selectedTab === tab ? "1px solid #84cc16" : isDark ? "1px solid #21496f" : "1px solid #cbd5e1",
              }}
            >
              {tab}
            </div>

          ))}
        </div>

        {/* SORT ICON */}

        {/* SORT ICON */}

{/* SORT ICON */}

{/* SORT ICON */}

<div
  onClick={() =>
    setSortOrder(
      sortOrder === "desc"
        ? "asc"
        : "desc"
    )
  }
  title={
    sortOrder === "desc"
      ? "Top 5"
      : "Lowest 5"
  }
  style={{
    cursor: "pointer",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    width: "28px",

    height: "28px",

    borderRadius: "6px",

    background: isDark
      ? "#163453"
      : "#f8fafc",

    border: isDark
      ? "1px solid #21496f"
      : "1px solid #cbd5e1",
  }}
>
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      transform:
        sortOrder === "asc"
          ? "rotate(180deg)"
          : "rotate(0deg)",

      transition:
        "0.25s ease",
    }}
  >
    <path
      d="M7 16L7 5"
      stroke={
        sortOrder === "desc"
          ? "#22c55e"
          : "#ea0817"
      }
      strokeWidth="2.8"
      strokeLinecap="round"
    />

    <path
      d="M7 5L4 8"
      stroke={
        sortOrder === "desc"
          ? "#22c55e"
          : "#ea0817"
      }
      strokeWidth="2.8"
      strokeLinecap="round"
    />

    <path
      d="M15 8L15 19"
      stroke={
        sortOrder === "desc"
          ? "#22c55e"
          : "#ea0817"
      }
      strokeWidth="2.8"
      strokeLinecap="round"
    />

    <path
      d="M15 19L18 16"
      stroke={
        sortOrder === "desc"
          ? "#22c55e"
          : "#ea0817"
      }
      strokeWidth="2.8"
      strokeLinecap="round"
    />
  </svg>
</div>
      </div>

      {/* LIST */}

      <div
        style={{
          display: "flex",

          flexDirection:
            "column",

          gap: "8px",

          flex: 1,

          justifyContent:
            "space-evenly",
        }}
      >
        {topData.map(
          (item, index) => {

            const width =
              (item.value /
                maxValue) *
              100;

            return (
              <div
                key={item.id}
                style={{
                  display: "grid",

                  gridTemplateColumns:
                    "14px 55px 1fr 75px",

                  alignItems:
                    "center",

                  gap: "8px",
                }}
              >

                {/* RANK */}

                <span
                  style={{
                    fontSize:
                      "11px",

                    fontWeight: 600,

                    color: isDark
                      ? "#ffffff"
                      : "#0f172a",
                  }}
                >
                  {index + 1}
                </span>

                {/* ID */}

                <span
                  style={{
                    fontSize:
                      "11px",

                    fontWeight: 700,

                    color: isDark
                      ? "#ffffff"
                      : "#0f172a",

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {item.id}
                </span>

                {/* BAR */}

                <div
                  style={{
                    width: "100%",

                    height: "10px",

                    borderRadius:
                      "2px",

                    overflow:
                      "hidden",

                    background:
                      isDark
                        ? "#163453"
                        : "#dbeafe",
                  }}
                >
                  <div
                    style={{
                      width: `${width}%`,

                      height: "100%",

                      background:
                        "linear-gradient(90deg, #84cc16 0%, #5ca82f 100%)",

                      transition:
                        "width 0.4s ease",
                    }}
                  />
                </div>

                {/* VALUE */}

                <span
                  style={{
                    textAlign:
                      "right",

                    fontSize:
                      "11px",

                    fontWeight: 700,

                    color: isDark
                      ? "#ffffff"
                      : "#0f172a",

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {item.value.toFixed(
                    2
                  )}
                </span>

              </div>
            );

          }
        )}
      </div>

      {/* TOTAL ENERGY */}

      <div
        style={{
          marginTop: "auto",

          paddingTop: "8px",

          borderTop: isDark
            ? "1px solid #21496f"
            : "1px solid #cbd5e1",

          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "12px",

            fontWeight: 700,

            color: isDark
              ? "#dce7f5"
              : "#0f172a",
          }}
        >
          Total Energy
        </span>

        <span
          style={{
            fontSize: "14px",

            fontWeight: 700,

            color: "#84cc16",
          }}
        >
          {totalEnergy.toFixed(
            2
          )}{" "}
          kWh
        </span>
      </div>
    </div>
  );
};

export default TopInverters;