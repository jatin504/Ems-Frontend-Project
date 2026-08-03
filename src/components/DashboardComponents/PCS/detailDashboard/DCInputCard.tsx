// DCInputCard.tsx

import React, { useEffect, useMemo } from "react";

import { useColorMode } from "@chakra-ui/react";
import NonCommunicationIndicator from "../../../Common/NonCommunicationIndicator";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";

const chunkArray = (arr: any[], size: number) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

const DCInputCard = ({ deviceId }: any) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const { data, fetchData } = useTimeseriesData();

  const nonCommStorage = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("non_comm_info") || "{}");
    } catch (e) {
      return {} as any;
    }
  }, []);

  const inverterInfo = (nonCommStorage as any)?.inverter;
  const showNonComm = inverterInfo?.status === 1 && inverterInfo?.device === deviceId;
  const nonCommMessage = inverterInfo
    ? `${inverterInfo.message || "Data can be wrong due to non-communication instances."}${inverterInfo.time ? `\nTime : ${inverterInfo.time}` : ""}`
    : "";

  /* ================= API HIT ================= */

  useEffect(() => {
    if (!deviceId) return;

    fetchData({
      devices: { patterns: [], ids: [deviceId] },

      keys: [
        ...Array.from({ length: 30 }, (_, i) => ({
          key: `mppt_${i + 1}_voltage`,
          alias: `mppt_${i + 1}_voltage`,
          keyType: "common",
        })),

        ...Array.from({ length: 30 }, (_, i) => ({
          key: `mppt_${i + 1}_current`,
          alias: `mppt_${i + 1}_current`,
          keyType: "common",
        })),
      ],

      aggregation: { func: "none", interval: 1, intervalType: "minute" },
      timeRange: {
        type: "last",
        interval: 1,
        intervalType: "minute",
      },
      orderBy: "ASC",
    } as any);
  }, [deviceId]);

  /* ================= DEVICE DATA ================= */

  const deviceData =
    (data as any)?.[
      deviceId
    ] || {};

  /* ================= MAP ================= */

  const dcData = useMemo(() => {

    const voltageKeys =
      Object.keys(deviceData)

        .filter((key) =>
          key.includes("_voltage")
        )

        .sort((a, b) => {

          const aNum =
            Number(
              a.match(/\d+/)?.[0]
            );

          const bNum =
            Number(
              b.match(/\d+/)?.[0]
            );

          return aNum - bNum;

        });

    return voltageKeys.map(
      (voltageKey: any) => {

        const mpptNo =
          voltageKey.match(
            /\d+/
          )?.[0];

        const currentKey =
          `mppt_${mpptNo}_current`;

        const voltage = deviceData[voltageKey]?.[0]?.value ?? null;

        const current = deviceData[currentKey]?.[0]?.value ?? null;

        const ts =
          deviceData[
            voltageKey
          ]?.[0]?.ts ?? 0;

        const now = Date.now();

        const value = voltage === null || voltage === undefined ? null : Number(voltage);

        const isNonComm =
          !ts ||
          now - ts > 4 * 60 * 1000 ||
          value === null;

        const isOnline =
          !isNonComm &&
          value > 0;

        return {

          id:
            `MPPT ${mpptNo}`,


          voltage: voltage !== null && voltage !== undefined ? `${Number(voltage).toFixed(1)} V` : "---",

          current: current !== null && current !== undefined ? `${Number(current).toFixed(1)} A` : "---",

          voltageValue: voltage !== null && voltage !== undefined ? Number(voltage) : null,

          currentValue: current !== null && current !== undefined ? Number(current) : null,

          status: isOnline,
          isNonComm,
        };

      }
    );

  }, [deviceData]);

  /* ================= SUMMARY ================= */

  const voltageValues =
    dcData

      .map(
        (d: any) =>
          d.voltageValue
      )

      .filter(
        (v: number) =>
          v !== null && v !== undefined
      );

  const currentValues =
    dcData

      .map(
        (d: any) =>
          d.currentValue
      )

      .filter(
        (v: number) =>
          v !== null && v !== undefined
      );

  const summaryRows = [

    {
      label:
        "Max. MPPT Voltage",

      value:
        voltageValues.length
          ? `${Math.max(
              ...voltageValues
            ).toFixed(1)} V`
          : "---",
    },

    {
      label:
        "Total MPPT Voltage",

      value:
        voltageValues.length
          ? `${voltageValues
              .reduce(
                (
                  a: number,
                  b: number
                ) => a + b,
                0
              )
              .toFixed(1)} V`
          : "---",
    },

    {
      label:
        "Min. MPPT Voltage",

      value:
        voltageValues.length
          ? `${Math.min(
              ...voltageValues
            ).toFixed(1)} V`
          : "---",
    },

    {
      label:
        "Total MPPT Current",

      value:
        currentValues.length
          ? `${currentValues
              .reduce(
                (
                  a: number,
                  b: number
                ) => a + b,
                0
              )
              .toFixed(1)} A`
          : "---",
    },

    {
      label:
        "Max. MPPT Current",

      value:
        currentValues.length
          ? `${Math.max(
              ...currentValues
            ).toFixed(1)} A`
          : "---",
    },

    {
      label:
        "Total MPPT",

      value:
        dcData.length || "---",
    },

  ];

  /* ================= SLIDE ================= */

  const groupedData =
    chunkArray(dcData, 3);

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

        overflow: "hidden",

        boxShadow: isDark
          ? "inset 0 0 35px rgba(0,0,0,0.16)"
          : "0 2px 10px rgba(15,23,42,0.05)",
      }}
    >

      <h3
        style={{
          margin: 0,
          marginBottom: "16px",
          color: isDark
            ? "#dbeafe"
            : "#0f172a",
          fontSize: "15px",
          fontWeight: 700,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span>DC Input</span>
          <span>
            <NonCommunicationIndicator
              status={!!showNonComm}
              message={nonCommMessage}
            />
          </span>
        </span>
      </h3>

      {/* TOP CARD */}

      <div
        style={{
          overflow: "hidden",

          borderRadius: "12px",

          border: isDark
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid #dbe4ef",

          background: isDark
            ? "rgba(255,255,255,0.02)"
            : "#ffffff",

          padding: "12px 0",
        }}
      >

        <div
          style={{
            display: "flex",

            width: `${groupedData.length * 100}%`,

            animation:
              groupedData.length > 1
                ? `slideDCGroup_${groupedData.length} 16s infinite`
                : "none",
          }}
        >

          {groupedData.map(
            (group, groupIndex) => (

              <div
                key={groupIndex}
                style={{
                  width: "100%",

                  display: "grid",

                  gridTemplateColumns:
                    "repeat(3,1fr)",
                }}
              >

                {group.map(
                  (
                    dc: any,
                    index: number
                  ) => (

                    <div
                      key={index}
                      style={{
                        padding: "0 22px",

                        borderRight:
                          index !== 2
                            ? isDark
                              ? "1px solid rgba(255,255,255,0.08)"
                              : "1px solid #e2e8f0"
                            : "none",
                      }}
                    >

                      <div
                        style={{
                          display:
                            "flex",

                          alignItems:
                            "center",

                          justifyContent:
                            "center",

                          gap: "8px",

                          marginBottom:
                            "18px",
                        }}
                      >

                        <span
                          style={{
                            color:
                              isDark
                                ? "#ffffff"
                                : "#0f172a",

                            fontSize:
                              "16px",

                            fontWeight: 700,
                          }}
                        >
                          {dc.id}
                        </span>

                        <span
                          style={{
                            width:
                              "12px",

                            height:
                              "12px",

                            borderRadius:
                              "50%",

                            background:
                              dc.isNonComm
                                ? "#9ca3af"
                                : dc.status
                                ? "#84cc16"
                                : "#ef4444",

                            boxShadow:
                              dc.isNonComm
                                ? "0 0 12px #9ca3af"
                                : dc.status
                                ? "0 0 12px #84cc16"
                                : "0 0 12px #ef4444",
                          }}
                        />

                      </div>

                      <div
                        style={{
                          display:
                            "grid",

                          gridTemplateColumns:
                            "1fr 1fr",

                          gap: "24px",
                        }}
                      >

                        <div>

                          <div
                            style={{
                              fontSize:
                                "12px",

                              color:
                                isDark
                                  ? "#8FA8C0"
                                  : "#64748b",

                              marginBottom:
                                "10px",

                              textAlign:
                                "center",
                            }}
                          >
                            Voltage
                          </div>

                          <div
                            style={{
                              textAlign:
                                "center",

                              color:
                                isDark
                                  ? "#ffffff"
                                  : "#0f172a",

                              fontWeight: 700,

                              fontSize:
                                "14px",
                            }}
                          >
                            {
                              dc.voltage
                            }
                          </div>

                        </div>

                        <div>

                          <div
                            style={{
                              fontSize:
                                "12px",

                              color:
                                isDark
                                  ? "#8FA8C0"
                                  : "#64748b",

                              marginBottom:
                                "10px",

                              textAlign:
                                "center",
                            }}
                          >
                            Current
                          </div>

                          <div
                            style={{
                              textAlign:
                                "center",

                              color:
                                isDark
                                  ? "#ffffff"
                                  : "#0f172a",

                              fontWeight: 700,

                              fontSize:
                                "14px",
                            }}
                          >
                            {
                              dc.current
                            }
                          </div>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )
          )}

        </div>

      </div>

      {/* SUMMARY */}

      <div
        style={{
          marginTop: "20px",

          display: "grid",

          gridTemplateColumns:
            "1fr 1fr",

          columnGap: "28px",

          rowGap: "14px",
        }}
      >

        {summaryRows.map(
          (row, index) => (

            <div
              key={index}
              style={{
                display: "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",

                borderBottom:
                  isDark
                    ? "1px solid rgba(255,255,255,0.05)"
                    : "1px solid #e8eef5",

                paddingBottom:
                  "8px",
              }}
            >

              <span
                style={{
                  color: isDark
                    ? "#9FB2C8"
                    : "#64748b",

                  fontSize:
                    "13px",
                }}
              >
                {row.label}
              </span>

              <span
                style={{
                  color: isDark
                    ? "#ffffff"
                    : "#0f172a",

                  fontSize:
                    "15px",

                  fontWeight: 700,
                }}
              >
                {row.value}
              </span>

            </div>

          )
        )}

      </div>

      <style>
        {(() => {
          const m = groupedData.length || 1;
          if (m <= 1) return "";

          const name = `slideDCGroup_${m}`;
          const segment = 100 / m;
          const holdPct = segment * 0.8;
          const transPct = segment * 0.2;

          let keyframes = `@keyframes ${name} {\n`;

          for (let i = 0; i < m; i++) {
            const holdStart = +(i * segment).toFixed(4);
            const holdEnd = +((i * segment) + holdPct).toFixed(4);
            const nextPos = +(((i + 1) * segment)).toFixed(4);
            const translateCurrent = -(i * segment);
            const translateNext = -( (i + 1) * segment );

            keyframes += `  ${holdStart}% { transform: translateX(${translateCurrent}%); }\n`;
            keyframes += `  ${holdEnd}% { transform: translateX(${translateCurrent}%); }\n`;

            if (i === m - 1) {
              // last slide: transition back to 0 at 100%
              keyframes += `  100% { transform: translateX(0%); }\n`;
            } else {
              keyframes += `  ${nextPos}% { transform: translateX(${translateNext}%); }\n`;
            }
          }

          keyframes += `}`;

          return keyframes;
        })()}
      </style>

    </div>
  );
};

export default DCInputCard;