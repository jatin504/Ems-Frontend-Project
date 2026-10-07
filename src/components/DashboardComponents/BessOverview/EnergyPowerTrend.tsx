import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

import SplineGraph from "../../Graphs/RevampCharts/SplineGraph";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";
import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useDevices } from "../../../hooks/useDevices";

import type { ExportFunctions } from "../../../types/graphExport/export";

const EnergyPowerTrend = () => {
  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  const [selectedDevice, setSelectedDevice] =
    useState("ALL");

  const [currentDate, setCurrentDate] =
    useState(new Date());

  const [dateNavEnabled, setDateNavEnabled] =
    useState(true);

  /* =====================================================
     DEVICES
  ===================================================== */

  const { devices, loading } = useDevices();

  /*
   * Get all bank device IDs from useDevices()
   *
   * Example:
   * plant_1_pcs_2_bank_bank_1
   * plant_1_pcs_2_bank_bank_2
   * plant_1_pcs_2_bank_bank_3
   */

  const deviceOptions = useMemo(() => {
    if (!devices) return [];

    return devices
      .filter((device) =>
        /_bank_bank_\d+$/i.test(device.device_id)
      )
      .map((device) => ({
        id: device.device_id,

        label: device.device_id.match(/(bank_\d+)$/i)?.[1] ?? device.device_id,
      }));
  }, [devices]);

  /* =====================================================
     DEFAULT DEVICE
  ===================================================== */

  useEffect(() => {
    if (deviceOptions.length === 0) return;

    /*
     * If currently selected device is not available,
     * select first device.
     */

    const exists = selectedDevice === "ALL" || deviceOptions.some(
      (device) => device.id === selectedDevice
    );

    if (!exists) {
      setSelectedDevice("ALL");
    }
  }, [
    deviceOptions,
    selectedDevice,
  ]);

  /* =====================================================
     TIME WINDOW
  ===================================================== */

  const {
    config: timeWindow,
    handleTimeWindowChange,
    handleReset,
  } = useTimeHandle(
    12,
    "hour",
    "none",
    [1, "minute"],
    60000,
    {
      timeRange: {
        type: "relative",
        relativeType: "currentDaySoFar",
        interval: 1,
        intervalType: "minute",
      },
    }
  );

  const timeWindowRef =
    useRef(timeWindow);

  useEffect(() => {
    timeWindowRef.current =
      timeWindow;
  }, [timeWindow]);

  /* =====================================================
     TIMESERIES
  ===================================================== */

  const { data, fetchData } =
    useTimeseriesData();

  /* =====================================================
     BUILD API REQUEST
  ===================================================== */

  const buildDataSource = () => ({
    devices: {
      patterns: selectedDevice === "ALL"
        ? ["_bank_bank_"]
        : [],

      /*
       * IMPORTANT:
       * Selected device ID directly goes here.
       */

      ids:
        selectedDevice && selectedDevice !== "ALL"
          ? [selectedDevice]
          : [],
    },

    keys: [
      {
        key: "temperature",
        alias: "Temperature",
        keyType: "common",
        type: "spline",
      },

      {
        key: "dc_voltage",
        alias: "DC Voltage",
        keyType: "common",
        type: "spline",
      },
    ],

    aggregation:
      timeWindowRef.current.aggregation,

    timeRange:
      timeWindowRef.current.timeRange,

    orderBy: "ASC",
  });

  /* =====================================================
     FETCH WHEN DEVICE / TIME CHANGES
  ===================================================== */

  useEffect(() => {
    fetchData(
      buildDataSource() as any
    );
  }, [
    selectedDevice,
    timeWindow,
  ]);

  /* =====================================================
     AUTO REFRESH
  ===================================================== */

  useEffect(() => {
    const interval =
      timeWindow.timeRange.interval || 1;

    const intervalType =
      timeWindow.timeRange.intervalType;

    const refreshMs =
      intervalType === "hour"
        ? interval * 60 * 60 * 1000
        : intervalType === "second"
        ? interval * 1000
        : interval * 60 * 1000;

    const id = setInterval(() => {
      fetchData(
        buildDataSource() as any
      );
    }, refreshMs);

    return () =>
      clearInterval(id);
  }, [
    selectedDevice,
    timeWindow.timeRange.interval,
    timeWindow.timeRange.intervalType,
  ]);

  /* =====================================================
     TIME WINDOW → DATE
  ===================================================== */

  useEffect(() => {
    const timeRange =
      timeWindow.timeRange;

    if (
      timeRange.type === "absolute" &&
      timeRange.startTs
    ) {
      setCurrentDate(
        new Date(timeRange.startTs)
      );

      setDateNavEnabled(true);

    } else if (
      timeRange.type === "relative" &&
      timeRange.relativeType ===
        "currentDaySoFar"
    ) {
      setCurrentDate(new Date());

      setDateNavEnabled(true);

    } else {
      setDateNavEnabled(false);
    }
  }, [timeWindow]);

  /* =====================================================
     DATE FORMAT
  ===================================================== */

  const formattedDate = useMemo(() => {
    const year =
      currentDate.getFullYear();

    const month = String(
      currentDate.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      currentDate.getDate()
    ).padStart(2, "0");

    return `${year}/${month}/${day}`;
  }, [currentDate]);

  /* =====================================================
     TODAY
  ===================================================== */

  const isToday = useMemo(() => {
    const today = new Date();

    return (
      currentDate.toDateString() ===
      today.toDateString()
    );
  }, [currentDate]);

  /* =====================================================
     ABSOLUTE DAY
  ===================================================== */

  const applyAbsoluteDay = (
    date: Date
  ) => {
    if (!dateNavEnabled) return;

    const start = new Date(date);

    start.setHours(
      0,
      0,
      0,
      0
    );

    const end = new Date(date);

    end.setHours(
      23,
      59,
      59,
      999
    );

    handleTimeWindowChange({
      aggregation:
        timeWindowRef.current
          .aggregation,

      orderBy: "ASC",

      timeRange: {
        type: "absolute",

        startTs:
          start.getTime(),

        endTs:
          end.getTime(),
      },
    });
  };

  /* =====================================================
     PREVIOUS DAY
  ===================================================== */

  const goPrevDay = () => {
    if (!dateNavEnabled) return;

    setCurrentDate(
      (previousDate) => {
        const date =
          new Date(previousDate);

        date.setDate(
          date.getDate() - 1
        );

        applyAbsoluteDay(date);

        return date;
      }
    );
  };

  /* =====================================================
     NEXT DAY
  ===================================================== */

  const goNextDay = () => {
    if (
      !dateNavEnabled ||
      isToday
    ) {
      return;
    }

    setCurrentDate(
      (previousDate) => {
        const date =
          new Date(previousDate);

        date.setDate(
          date.getDate() + 1
        );

        if (
          date.toDateString() ===
          new Date().toDateString()
        ) {
          handleReset();
        } else {
          applyAbsoluteDay(date);
        }

        return date;
      }
    );
  };

  /* =====================================================
     SELECTED DEVICE DATA
  ===================================================== */

  const selectedDeviceData =
    useMemo(() => {
      if (selectedDevice === "ALL") return data;

      return selectedDevice && data?.[selectedDevice]
        ? { [selectedDevice]: data[selectedDevice] }
        : null;
    }, [
      data,
      selectedDevice,
    ]);

  /* =====================================================
     CHART SERIES
  ===================================================== */

  const seriesForChart =
    useMemo(() => {
      if (!selectedDeviceData) {
        return [];
      }

      const series: any[] = [];

      Object.entries(selectedDeviceData).forEach(
        ([deviceId, deviceData]: [string, any]) => {
          const temperaturePoints = deviceData["Temperature"] ?? [];
          const voltagePoints = deviceData["DC Voltage"] ?? [];

          if (temperaturePoints.length > 0) {
            series.push({
              type: "spline",
              name: selectedDevice === "ALL"
                ? `${deviceId} - Temperature`
                : "Temperature",
              color: "#F97316",
              data: temperaturePoints
                .filter((point: any) => point?.ts != null && point?.value != null && Number.isFinite(Number(point.value)))
                .map((point: any) => [Number(point.ts), Number(point.value)]),
              yAxis: 0,
              marker: { enabled: false },
            });
          }

          if (voltagePoints.length > 0) {
            series.push({
              type: "spline",
              name: selectedDevice === "ALL"
                ? `${deviceId} - DC Voltage`
                : "DC Voltage",
              color: "#3B82F6",
              data: voltagePoints
                .filter((point: any) => point?.ts != null && point?.value != null && Number.isFinite(Number(point.value)))
                .map((point: any) => [Number(point.ts), Number(point.value)]),
              yAxis: 1,
              marker: { enabled: false },
            });
          }
        }
      );

      return series;
    }, [
      selectedDeviceData,
    ]);

  /* =====================================================
     DYNAMIC DC VOLTAGE RANGE
  ===================================================== */

  const dcVoltageRange =
    useMemo(() => {
      const points = Object.values(selectedDeviceData ?? {}).flatMap(
        (deviceData: any) => deviceData["DC Voltage"] ?? []
      );

      if (
        !Array.isArray(points) ||
        points.length === 0
      ) {
        return {
          min: 0,
          max: 100,
        };
      }

      const values =
        points
          .map((point: any) =>
            Number(point.value)
          )
          .filter(
            (value: number) =>
              Number.isFinite(value)
          );

      if (values.length === 0) {
        return {
          min: 0,
          max: 100,
        };
      }

      const minValue =
        Math.min(...values);

      const maxValue =
        Math.max(...values);

      const range =
        maxValue - minValue;

      const padding =
        range > 0
          ? range * 0.1
          : maxValue * 0.1 || 10;

      return {
        min: Math.max(
          0,
          Math.floor(
            minValue - padding
          )
        ),

        max: Math.ceil(
          maxValue + padding
        ),
      };
    }, [
      selectedDeviceData,
    ]);

  /* =====================================================
     COLORS
  ===================================================== */

  const textColor =
    useColorModeValue(
      "#1A202C",
      "#E6E6E6"
    );

  const subTextColor =
    useColorModeValue(
      "#4A5568",
      "#B9B9B9"
    );

  const gridColor =
    useColorModeValue(
      "rgba(0,0,0,0.10)",
      "rgba(255,255,255,0.08)"
    );

  const axisLineColor =
    useColorModeValue(
      "rgba(0,0,0,0.16)",
      "rgba(255,255,255,0.06)"
    );

  /* =====================================================
     UI
  ===================================================== */

  return (
    <GraphLayout
      title={
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          gap="8px"
        >
          {/* TITLE + DEVICE DROPDOWN */}

          <Box
            display="flex"
            alignItems="center"
            gap="8px"
          >
            <Box fontWeight="600">
              Temperature & DC Voltage
            </Box>

            <Menu
              placement="bottom-start"
              closeOnSelect
              isLazy
            >
              <MenuButton
                as={Button}
                size="xs"
                minW="105px"
                width="105px"
                height="24px"
                px="8px"
                fontSize="11px"
                fontWeight="500"
                textAlign="left"
                bg={useColorModeValue("gray.100", "gray.700")}
                borderRadius="4px"
                isDisabled={
                  loading ||
                  deviceOptions.length === 0
                }
                rightIcon={<ChevronDownIcon />}
              >
                {loading ? "Loading..." : selectedDevice === "ALL"
                  ? "ALL"
                  : deviceOptions.find(
                      (device) => device.id === selectedDevice
                    )?.label ?? "Select device"}
              </MenuButton>

              <MenuList
                minW="105px"
                width="105px"
                maxH="150px"
                overflowY="auto"
                py="1"
                zIndex={20}
              >
                {[
                  { id: "ALL", label: "ALL" },
                  ...deviceOptions,
                ].map((device) => (
                  <MenuItem
                    key={device.id}
                    value={device.id}
                    fontSize="11px"
                    minH="28px"
                    onClick={() => setSelectedDevice(device.id)}
                  >
                    {device.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>

          {/* DATE NAVIGATOR */}

          <Box
            opacity={
              dateNavEnabled
                ? 1
                : 0.4
            }
            pointerEvents={
              dateNavEnabled
                ? "auto"
                : "none"
            }
            display="flex"
            alignItems="center"
            bg={useColorModeValue(
              "gray.100",
              "gray.700"
            )}
            borderRadius="6px"
            px={2}
            height="22px"
            gap={2}
          >
            <Box
              cursor="pointer"
              fontSize="12px"
              onClick={goPrevDay}
            >
              ‹
            </Box>

            <Box
              fontSize="12px"
              fontWeight="600"
              minW="100px"
              textAlign="center"
            >
              {formattedDate}
            </Box>

            <Box
              cursor={
                isToday
                  ? "not-allowed"
                  : "pointer"
              }
              opacity={
                isToday ? 0.35 : 1
              }
              fontSize="12px"
              onClick={goNextDay}
            >
              ›
            </Box>
          </Box>
        </Box>
      }

      width={["590px"]}
      height="334px"
      mt="0"
      fullScreen
      timeWindow
      onTimeWindowChange={
        handleTimeWindowChange
      }
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <SplineGraph
        key={selectedDevice}
        apiData={seriesForChart}
        height={280}
        onExportReady={
          setExportFunctions
        }
        props={{
          xAxis: {
            type: "datetime",

            tickAmount: 7,

            labels: {
              style: {
                color:
                  subTextColor,
              },
            },

            lineColor:
              axisLineColor,

            gridLineColor:
              gridColor,
          },

          yAxis: [
            {
              title: {
                text:
                  "Temperature (°C)",
              },

              min: 0,

              max: 250,

              tickAmount: 6,

              gridLineColor:
                gridColor,

              labels: {
                style: {
                  color:
                    textColor,
                },
              },
            },

            {
              title: {
                text:
                  "DC Voltage (V)",
              },

              opposite: true,

              min:
                dcVoltageRange.min,

              max:
                dcVoltageRange.max,

              tickAmount: 5,

              labels: {
                style: {
                  color:
                    textColor,
                },
              },
            },
          ],

          plotOptions: {
            spline: {
              marker: {
                enabled: false,
              },
              lineWidth: 3,
            },
          },

          tooltip: {
            shared: true,
          },

          legend: {
            align: "center",
            verticalAlign:
              "bottom",
          },
        }}
      />
    </GraphLayout>
  );
};

export default EnergyPowerTrend;