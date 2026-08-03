// PCSDetailDashboard.tsx

import React, { useEffect, useState } from "react";
import { useColorModeValue, Text } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { useLocation } from "react-router-dom";

import { useDevices } from "../hooks/useDevices";
import useTimeseriesData from "../hooks/useTimeseriesData";

/* SAME COMPONENTS REUSE */
import InverterHeaderCard from "../components/DashboardComponents/PCS/detailDashboard/InverterHeaderCard";
import DCInputCard from "../components/DashboardComponents/PCS/detailDashboard/DCInputCard";
import ACOutputCard from "../components/DashboardComponents/PCS/detailDashboard/ACOutputCard";
import PerformanceCard from "../components/DashboardComponents/PCS/detailDashboard/PerformanceCard";
import EnvironmentalCard from "../components/DashboardComponents/PCS/detailDashboard/EnvironmentalCard";
import InverterStatusPanel from "../components/DashboardComponents/PCS/detailDashboard/InverterStatusPanel";
import TemperatureCard from "../components/DashboardComponents/PCS/detailDashboard/TemperatureCard";
import TrendChartCard from "../components/DashboardComponents/PCS/detailDashboard/TrendChartCard";
import EnergySummaryCard from "../components/DashboardComponents/PCS/detailDashboard/EnergySummaryCard";
import AlarmEventsCard from "../components/DashboardComponents/PCS/detailDashboard/AlarmEventsCard";

const PCSDetailDashboard: React.FC = () => {
  const location = useLocation();

  const selectedDevice =
    location.state?.selectedDevice;

  const pcsPattern = /pcs/i;
  const inverterPattern = /block_(\d+)_inverter_inverter_(\d+)$/i;

  let initialId = "";
  if (selectedDevice && selectedDevice.device_id) {
    const id = String(selectedDevice.device_id);
    if (pcsPattern.test(id) || inverterPattern.test(id) || /inverter/i.test(id)) {
      initialId = id;
    }
  }

  const [selectedDeviceId, setSelectedDeviceId] =
    useState<string>(initialId);

  const pageBg =
    useColorModeValue(
      "#f3f7fb",
      "#06172d"
    );

  const { devices } =
    useDevices();

  const filteredDevices = (devices || []).filter((d: any) => {
    const id = String(d.device_id || "");
    return pcsPattern.test(id) || inverterPattern.test(id) || /inverter/i.test(id);
  });

  const formatPCSName = (deviceId: string) => {
    const pcsMatch = deviceId.match(/pcs_(\d+)$/i);
    if (pcsMatch) return `PCS-${pcsMatch[1]}`;

    const invMatch = deviceId.match(/block_(\d+)_inverter_inverter_(\d+)$/i);
    if (invMatch) return `B.${invMatch[1]}-Inverter-${invMatch[2]}`;

    return deviceId;
  };

  useEffect(() => {
    if (
      (!selectedDeviceId ||
        selectedDeviceId === "") &&
      filteredDevices &&
      filteredDevices.length > 0
    ) {
      setSelectedDeviceId(
        String(
          filteredDevices[0]
            .device_id
        )
      );
    }
  }, [filteredDevices]);

  const {
    data,
    fetchData,
  } = useTimeseriesData();

  const pcsOptions =
    (
      filteredDevices || []
    ).map((device: any) => ({
      value:
        device.device_id,
      label:
        formatPCSName(
          device.device_id
        ),
    }));

  const selectedOption =
    pcsOptions.find(
      (o: any) =>
        o.value ===
        selectedDeviceId
    ) || null;

  const selectedConfig =
    filteredDevices?.find(
      (d: any) =>
        String(
          d.device_id
        ).trim() ===
        String(
          selectedDeviceId
        ).trim()
    ) ||
    devices?.find(
      (d: any) =>
        String(
          d.device_id
        ).trim() ===
        String(
          selectedDeviceId
        ).trim()
    );

  useEffect(() => {
    if (
      !selectedDeviceId
    )
      return;

    const fetchDashboardData =
      () => {
        fetchData({
          devices: {
            patterns: [],
            ids: [
              selectedDeviceId,
            ],
          },

          keys: [
            {
              key: "active_power",
              alias:
                "Active_Power",
              keyType:
                "common",
            },

            {
              key: "reactive_power",
              alias:
                "Reactive_Power",
              keyType:
                "common",
            },

            {
              key: "daily_energy",
              alias:
                "Daily_Energy",
              keyType:
                "common",
            },

            {
              key: "availability",
              alias:
                "Availability",
              keyType:
                "common",
            },

            {
              key: "soc",
              alias: "SoC",
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
      };

    fetchDashboardData();

    const interval =
      setInterval(
        () => {
          fetchDashboardData();
        },
        60000
      );

    return () =>
      clearInterval(
        interval
      );
  }, [selectedDeviceId]);

  const deviceData =
    (data as any)?.[
      selectedDeviceId
    ];

  return (
    <div
      style={{
        padding: "12px",
        background:
          pageBg,
        minHeight:
          "100vh",
        display: "flex",
        flexDirection:
          "column",
        gap: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "flex-start",
          alignItems:
            "center",
          gap: "8px",
          marginBottom:
            "2px",
        }}
      >
        <Text
          fontSize="13px"
          fontWeight="600"
          color={useColorModeValue(
            "#4A5568",
            "#9FB4D1"
          )}
        >
          Select PCS:
        </Text>

        <Select
          size="sm"
          options={pcsOptions}
          value={
            selectedOption
          }
          onChange={(
            opt: any
          ) =>
            setSelectedDeviceId(
              opt?.value ||
                ""
            )
          }
          w="160px"
          minW="160px"
          bg={useColorModeValue(
            "white",
            "gray.700"
          )}
          placeholder="Select PCS"
          isSearchable
        />
      </div>

      {/* TOP */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "12px",
        }}
      >
        <InverterHeaderCard
          deviceId={
            selectedDeviceId
          }
          data={deviceData}
          config={
            selectedConfig
          }
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(5,1fr)",
            gap: "10px",
          }}
        >
          <PerformanceCard
            title="PCS Active Power"
            value={
              deviceData
                ?.Active_Power?.[
                deviceData
                  ?.Active_Power
                  ?.length - 1
              ]?.value || 0
            }
            unit="kW"
            color="#60a5fa"
          />

          <PerformanceCard
            title="Reactive Power"
            value={
              deviceData
                ?.Reactive_Power?.[
                deviceData
                  ?.Reactive_Power
                  ?.length - 1
              ]?.value || 0
            }
            unit="kVAR"
            color="#a855f7"
          />

          <PerformanceCard
            title="Energy Today"
            value={
              deviceData
                ?.Daily_Energy?.[
                deviceData
                  ?.Daily_Energy
                  ?.length - 1
              ]?.value || 0
            }
            unit="kWh"
            color="#84cc16"
          />

          <PerformanceCard
            title="Availability"
            value={
              deviceData
                ?.Availability?.[
                deviceData
                  ?.Availability
                  ?.length - 1
              ]?.value || 0
            }
            unit="%"
            color="#22c55e"
          />

          <PerformanceCard
            title="SOC"
            value={
              deviceData
                ?.SoC?.[
                deviceData
                  ?.SoC
                  ?.length - 1
              ]?.value || 0
            }
            unit="%"
            color="#f59e0b"
          />
        </div>
      </div>

      {/* MIDDLE */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1.4fr 1fr",
          gap: "12px",
        }}
      >
        <DCInputCard
          deviceId={
            selectedDeviceId
          }
        />

        <ACOutputCard
          deviceId={
            selectedDeviceId
          }
        />

        <div
          style={{
            display: "flex",
            flexDirection:
              "column",
            gap: "12px",
            marginTop:
              "-18px",
          }}
        >
          <PerformanceCard
            isChart
            deviceId={
              selectedDeviceId
            }
            selectedDeviceId={
              selectedDeviceId
            }
          />

          <EnvironmentalCard
            deviceId={
              selectedDeviceId
            }
          />
        </div>
      </div>

      {/* LOWER */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "260px 1fr 1fr",
          gap: "12px",
        }}
      >
        <InverterStatusPanel
          deviceId={
            selectedDeviceId
          }
        />

        <TemperatureCard
          deviceId={
            selectedDeviceId
          }
          selectedDeviceId={
            selectedDeviceId
          }
        />

        <div
          style={{
            marginTop:
              "-18px",
            marginLeft:
              "-198px",
          }}
        >
          <TrendChartCard
            deviceId={
              selectedDeviceId
            }
            selectedDeviceId={
              selectedDeviceId
            }
          />
        </div>
      </div>

      {/* BOTTOM */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1.5fr",
          gap: "12px",
        }}
      >
        <EnergySummaryCard
          deviceId={
            selectedDeviceId
          }
          selectedDeviceId={
            selectedDeviceId
          }
        />

        <AlarmEventsCard
          deviceId={
            selectedDeviceId
          }
        />
      </div>
    </div>
  );
};

export default PCSDetailDashboard;