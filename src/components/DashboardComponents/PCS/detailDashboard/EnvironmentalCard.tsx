// EnvironmentalCard.tsx

import {
  useEffect,
  useMemo,
} from "react";

import {
  useColorMode,
} from "@chakra-ui/react";

import {
  FaTemperatureLow,
} from "react-icons/fa";

import {
  BsGrid3X3GapFill,
} from "react-icons/bs";

import {
  WiDaySunny,
} from "react-icons/wi";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";

const EnvironmentalCard = ({
  deviceId,
}: any) => {

  const { colorMode } =
    useColorMode();

  const isDark =
    colorMode === "dark";

  const {
    data,
    fetchData,
  } = useTimeseriesData();

  /* ================= API HIT ================= */

  useEffect(() => {

    if (!deviceId) return;

    fetchData({

      devices: {
        patterns: [],
        ids: [deviceId],
      },

      keys: [

        {
          key:
            "temperature",
          alias:
            "ambient_temperature",
          keyType:
            "common",
        },

        {
          key:
            "module_temperature",
          alias:
            "module_temperature",
          keyType:
            "common",
        },

        {
          key:
            "irradiance",
          alias:
            "irradiance",
          keyType:
            "common",
        },

      ],

      aggregation: {

        func: "last",

        interval: 1,

        intervalType:
          "minute",
      },

      timeRange: {

        type: "relative",

        relativeType:
          "currentDaySoFar",
      },

      orderBy: "ASC",

    } as any);

  }, [deviceId]);

  /* ================= DATA ================= */

  const deviceData =
    (data as any)?.[
      deviceId
    ] || {};

  const environmentalData =
    useMemo(() => {

      const ambient =
        deviceData
          ?.ambient_temperature?.[0]
          ?.value || 0;

      const module =
        deviceData
          ?.module_temperature?.[0]
          ?.value || 0;

      const irradiance =
        deviceData
          ?.irradiance?.[0]
          ?.value || 0;

      return [

        {
          title:
            "Ambient Temp.",

          value:
            Number(ambient)
              ? Number(
                  ambient
                ).toFixed(1)
              : "---",

          unit: "°C",

          icon:
            <FaTemperatureLow />,

          color: "#E74C3C",

          iconSize: "38px",
        },

        {
          title:
            "Module Temp.",

          value:
            Number(module)
              ? Number(
                  module
                ).toFixed(1)
              : "---",

          unit: "°C",

          icon:
            <BsGrid3X3GapFill />,

          color: "#4DA3FF",

          iconSize: "34px",
        },

        {
          title:
            "Irradiance",

          value:
            Number(irradiance)
              ? Number(
                  irradiance
                ).toFixed(0)
              : "---",

          unit: "W/m²",

          icon:
            <WiDaySunny />,

          color: "#F5A623",

          iconSize: "48px",
        },

      ];

    }, [deviceData]);

  return (

    <div
      style={{
        background: isDark
          ? "linear-gradient(180deg,#0A2342 0%, #071B33 100%)"
          : "linear-gradient(180deg,#ffffff 0%, #f8fbff 100%)",

        border: isDark
          ? "1px solid rgba(120,160,210,0.16)"
          : "1px solid #dbe7f3",

        borderRadius: "12px",

        padding: "14px 18px",

        height: "126px",

        boxShadow: isDark
          ? "0 0 20px rgba(0,0,0,0.22)"
          : "0 2px 10px rgba(15,23,42,0.05)",
      }}
    >

      {/* ================= TITLE ================= */}

      <h3
        style={{
          margin: 0,

          marginBottom: "14px",

          color: isDark
            ? "#ffffff"
            : "#0f172a",

          fontSize: "15px",

          fontWeight: 700,
        }}
      >
        Environmental Conditions
      </h3>

      {/* ================= BODY ================= */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(3,1fr)",

          borderTop: isDark
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(15,23,42,0.06)",

          paddingTop: "14px",
        }}
      >

        {environmentalData.map(
          (
            item,
            index
          ) => (

            <div
              key={index}
              style={{
                display: "flex",

                alignItems:
                  "center",

                gap: "14px",

                padding:
                  "0 12px",

                borderRight:
                  index !== 2
                    ? isDark
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid rgba(15,23,42,0.06)"
                    : "none",
              }}
            >

              {/* ================= ICON ================= */}

              <div
                style={{
                  width: "42px",

                  minWidth: "42px",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  color:
                    item.color,

                  fontSize:
                    item.iconSize,

                  filter:
                    "drop-shadow(0 0 6px rgba(255,255,255,0.08))",
                }}
              >
                {item.icon}
              </div>

              {/* ================= TEXT ================= */}

              <div>

                <div
                  style={{
                    color: isDark
                      ? "#C7D4E5"
                      : "#64748b",

                    fontSize:
                      "12px",

                    marginBottom:
                      "5px",

                    fontWeight: 500,

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {item.title}
                </div>

                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "baseline",

                    gap: "4px",
                  }}
                >

                  <span
                    style={{
                      color:
                        isDark
                          ? "#ffffff"
                          : "#0f172a",

                      fontSize:
                        "32px",

                      fontWeight: 700,

                      lineHeight: 1,

                      letterSpacing:
                        "-0.5px",
                    }}
                  >
                    {item.value}
                  </span>

                  <span
                    style={{
                      color:
                        isDark
                          ? "#dbeafe"
                          : "#475569",

                      fontSize:
                        "13px",

                      fontWeight: 600,
                    }}
                  >
                    {item.unit}
                  </span>

                </div>

              </div>

            </div>

          )
        )}

      </div>

    </div>
  );
};

export default EnvironmentalCard;