// EnergySummaryCard.tsx

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useColorMode,
} from "@chakra-ui/react";

import {
  FiCalendar,
} from "react-icons/fi";

import {
  HiOutlineChartBar,
} from "react-icons/hi";

import {
  BsInfinity,
} from "react-icons/bs";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import NonCommunicationIndicator from "../../../Common/NonCommunicationIndicator";

const commonIconColor =
  "#60a5fa";

const EnergySummaryCard = ({
  deviceId,
  selectedDeviceId,
}: any) => {

  const { colorMode } =
    useColorMode();

  const isDark =
    colorMode === "dark";

  const {
    data,
    fetchData,
  } = useTimeseriesData();

  const nonCommStorage = JSON.parse(
    sessionStorage.getItem("non_comm_info") || "{}"
  );

  const inverterInfo = nonCommStorage?.inverter;

  const showNonComm =
    inverterInfo?.status === 1 &&
    inverterInfo?.device === selectedDeviceId;

  const nonCommMessage =
    inverterInfo
      ? `${inverterInfo.message}
${
  inverterInfo.time
    ? `\nTime : ${inverterInfo.time}`
    : ""
}`
      : "";

  const [
    energyData,
    setEnergyData,
  ] = useState<any>({
    today: 0,
    month: 0,
    year: 0,
    total: 0,
  });

  /* ================= FORMAT ================= */

  const formatEnergy = (
    value: number
  ) => {

    if (value >= 1000000) {

      return `${(
        value / 1000000
      ).toFixed(2)} GWh`;

    }

    if (value >= 1000) {

      return `${(
        value / 1000
      ).toFixed(2)} MWh`;

    }

    return `${value.toFixed(
      2
    )} kWh`;

  };

  /* ================= FETCH ALL (single call) ================= */

  useEffect(() => {

    if (!deviceId) return;

    const ids = [
      deviceId,
      `${deviceId}_1_month`,
      `${deviceId}_1_year`,
      `${deviceId}_total`,
    ];

    const fetchAll = async () => {
      try {
        await fetchData({
          devices: {
            patterns: [],
            ids,
          },
          keys: [
            {
              key: "daily_energy",
              alias: "daily_energy",
              keyType: "common",
            },
          ],
          aggregation: {
            func: "last",
            interval: 1,
            intervalType: "day",
          },
          timeRange: {
            type: "absolute",
            startTs: 0,
            endTs: Date.now(),
          },
          orderBy: "DESC",
        } as any);
      } catch (err) {
        console.log("Energy fetch error", err);
      }
    };

    /* FIRST HIT */

    fetchAll();

    /* EVERY 1 MIN */

    const interval =
      setInterval(() => {

        fetchAll();

      }, 60000);

    return () =>
      clearInterval(interval);

  }, [deviceId]);

  useEffect(() => {

    if (!data || !deviceId)
      return;

    const monthId =
      `${deviceId}_1_month`;

    const yearId =
      `${deviceId}_1_year`;

    const totalId =
      `${deviceId}_total`;

    setEnergyData({

      today: Number(

        (data as any)?.[
          deviceId
        ]?.daily_energy?.[0]
          ?.value || 0

      ),

      month: Number(

        (data as any)?.[
          monthId
        ]?.daily_energy?.[0]
          ?.value || 0

      ),

      year: Number(

        (data as any)?.[
          yearId
        ]?.daily_energy?.[0]
          ?.value || 0

      ),

      total: Number(

        (data as any)?.[
          totalId
        ]?.daily_energy?.[0]
          ?.value || 0

      ),

    });

  }, [data, deviceId]);

  /* ================= ROWS ================= */

  const rows =
    useMemo(() => {

      return [

        {
          title:
            "Today",

          value:
            formatEnergy(
              energyData.today
            ),

          icon:
            <FiCalendar />,

          color:
            commonIconColor,
        },

        {
          title:
            "This Month",

          value:
            formatEnergy(
              energyData.month
            ),

          icon:
            <HiOutlineChartBar />,

          color:
            commonIconColor,
        },

        {
          title:
            "This Year",

          value:
            formatEnergy(
              energyData.year
            ),

          icon:
            <FiCalendar />,

          color:
            commonIconColor,
        },

        {
          title:
            "Lifetime",

          value:
            formatEnergy(
              energyData.total
            ),

          icon:
            <BsInfinity />,

          color:
            commonIconColor,
        },

      ];

    }, [energyData]);

  return (

    <div
      style={{
        background: isDark
          ? "linear-gradient(135deg,#0a2744 0%, #081f37 45%, #06172d 100%)"
          : "linear-gradient(135deg,#ffffff 0%, #f7fafc 50%, #edf4fb 100%)",

        border: isDark
          ? "1px solid #16395c"
          : "1px solid #dbe7f3",

        borderRadius: "10px",

        padding: "14px",

        height: "100%",

        boxShadow: isDark
          ? "inset 0 0 35px rgba(0,0,0,0.18)"
          : "0 2px 10px rgba(15,23,42,0.05)",

        overflow: "hidden",
      }}
    >

      <h3
        style={{
          margin: 0,

          marginBottom: "14px",

          color: isDark
            ? "#ffffff"
            : "#0f172a",

          fontSize: "15px",

          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        Inverter Energy

        <NonCommunicationIndicator
          status={showNonComm}
          message={nonCommMessage}
        />

      </h3>

      <div
        style={{
          height: "1px",

          background: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(15,23,42,0.08)",

          marginBottom: "18px",
        }}
      />

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(4,1fr)",

          height:
            "calc(100% - 58px)",
        }}
      >

        {rows.map(
          (
            row,
            index
          ) => (

            <div
              key={row.title}
              style={{
                display: "flex",

                flexDirection:
                  "column",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                borderRight:
                  index !== 3
                    ? isDark
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid rgba(15,23,42,0.08)"
                    : "none",

                padding:
                  "0 12px",
              }}
            >

              <div
                style={{
                  color: isDark
                    ? "#dbeafe"
                    : "#334155",

                  fontSize: "13px",

                  fontWeight: 500,

                  marginBottom:
                    "18px",
                }}
              >
                {row.title}
              </div>

              <div
                style={{
                  fontSize: "34px",

                  color:
                    row.color,

                  marginBottom:
                    "18px",

                  display: "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",
                }}
              >
                {row.icon}
              </div>

              <div
                style={{
                  color: isDark
                    ? "#ffffff"
                    : "#0f172a",

                  fontSize: "18px",

                  fontWeight: 500,

                  letterSpacing:
                    "0.2px",

                  whiteSpace:
                    "nowrap",
                }}
              >
                {row.value}
              </div>

            </div>

          )
        )}

      </div>

    </div>

  );
};

export default EnergySummaryCard;