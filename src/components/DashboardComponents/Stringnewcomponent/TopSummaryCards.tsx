import React, {
  useEffect,
  useMemo,
} from "react";

import {
  Box,
  Flex,
  Grid,
  GridItem,
  Text,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  FaLink,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaBolt,
  FaSun,
  FaTemperatureHigh,
} from "react-icons/fa";

import useTimeseriesData from "../../../hooks/useTimeseriesData";
import StaleIndicator from "../../Common/StaleIndicator";

interface WidgetPoint {
  ts: number;
  value: number;
}

interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}

const stringRows = Array.from(
  { length: 24 },
  (_, i) => i + 1
);

const TopSummaryCards = () => {

  const cardBg = useColorModeValue(
    "#ffffff",
    "#0F2235"
  );

  const borderColor = useColorModeValue(
    "#E6EEF6",
    "#1F3B56"
  );

  const textColor = useColorModeValue(
    "gray.800",
    "white"
  );

  const subText = useColorModeValue(
    "#5A6B78",
    "#8FA8C0"
  );

  const { data, fetchData } =
    useTimeseriesData();

  /* ================= API ================= */

  useEffect(() => {

    const fetchSummary = () => {

      fetchData({
        devices: {
          patterns: ["_inverter_inverter_"],
          ids: [],
        },

        keys: [

          {
            key: "total_dc_power",
            alias: "total_dc_power",
            keyType: "common",
          },

          {
            key: "irradiance",
            alias: "irradiance",
            keyType: "common",
          },

          {
            key: "module_temp",
            alias: "module_temp",
            keyType: "common",
          },

          ...stringRows.map((index) => ({
            key: `string_${index}_current`,
            alias: `string_${index}_current`,
            keyType: "common",
          })),
        ],

        aggregation: {
          func: "none",
          interval: 1,
          intervalType: "minute",
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

    const interval = setInterval(() => {

      fetchSummary();

    }, 60000);

    return () => clearInterval(interval);

  }, []);

  /* ================= MAP DATA ================= */

  const mappedData = useMemo(() => {

    const widgetData =
      data as WidgetData | null;

    if (!widgetData) {

      return {
        totalStrings: 0,
        online: 0,
        offline: 0,
        alarm: 0,
        totalDcPower: 0,
        avgCurrent: 0,
        maxCurrent: 0,
        minCurrent: 0,
        irradiance: 0,
        moduleTemp: 0,
        totalDcPowerTs: 0,
        avgCurrentTs: 0,
        maxCurrentTs: 0,
        minCurrentTs: 0,
        irradianceTs: 0,
        moduleTempTs: 0,
      };

    }

    let totalStrings = 0;

    let online = 0;

    let offline = 0;

    let alarm = 0;

    let totalDcPower = 0;

    let irradiance = 0;

    let moduleTemp = 0;

    let totalDcPowerTs = 0;

    let irradianceTs = 0;

    let moduleTempTs = 0;

    const currentTsList: number[] = [];

    const allCurrents: number[] = [];

    Object.keys(widgetData).forEach(
      (deviceId) => {

        const d = widgetData[deviceId];

        /* ===== TOTAL DC POWER ===== */

        const dcArr =
          d["total_dc_power"];

        if (
          dcArr &&
          dcArr.length > 0
        ) {

          totalDcPower += Number(
            dcArr[dcArr.length - 1]
              ?.value || 0
          );

          totalDcPowerTs =
            dcArr[dcArr.length - 1]
              ?.ts || 0;

        }

        /* ===== IRRADIANCE ===== */

        const irrArr =
          d["irradiance"];

        if (
          irrArr &&
          irrArr.length > 0
        ) {

          irradiance += Number(
            irrArr[irrArr.length - 1]
              ?.value || 0
          );

          irradianceTs =
            irrArr[irrArr.length - 1]
              ?.ts || 0;

        }

        /* ===== MODULE TEMP ===== */

        const tempArr =
          d["module_temp"];

        if (
          tempArr &&
          tempArr.length > 0
        ) {

          moduleTemp += Number(
            tempArr[tempArr.length - 1]
              ?.value || 0
          );

          moduleTempTs =
            tempArr[tempArr.length - 1]
              ?.ts || 0;

        }

        /* ===== STRING DATA ===== */

        stringRows.forEach((index) => {

          totalStrings += 1;

          const arr =
            d[`string_${index}_current`];

          const value =
            arr && arr.length > 0
              ? Number(
                  arr[arr.length - 1]
                    ?.value
                )
              : 0;

          allCurrents.push(value);

          if (
            arr &&
            arr.length > 0
          ) {
            currentTsList.push(
              arr[arr.length - 1]
                ?.ts || 0
            );
          }

          if (value > 0) {

            online += 1;

          } else {

            offline += 1;

          }

          if (
            value > 12 ||
            value < 1
          ) {

            alarm += 1;

          }

        });

      }
    );

    const avgCurrent =
      allCurrents.length > 0
        ? (
            allCurrents.reduce(
              (a, b) => a + b,
              0
            ) / allCurrents.length
          ).toFixed(2)
        : "0";

    const maxCurrent =
      allCurrents.length > 0
        ? Math.max(
            ...allCurrents
          ).toFixed(2)
        : "0";

    const minCurrent =
      allCurrents.length > 0
        ? Math.min(
            ...allCurrents
          ).toFixed(2)
        : "0";

    const currentTs =
      currentTsList.length > 0
        ? Math.max(...currentTsList)
        : 0;

    return {

      totalStrings,

      online,

      offline,

      alarm,

      totalDcPower:
        (totalDcPower / 1000).toFixed(
          2
        ),

      avgCurrent,

      maxCurrent,

      minCurrent,

      irradiance:
        Object.keys(widgetData)
          .length > 0
          ? (
              irradiance /
              Object.keys(widgetData)
                .length
            ).toFixed(0)
          : "0",

      moduleTemp:
        Object.keys(widgetData)
          .length > 0
          ? (
              moduleTemp /
              Object.keys(widgetData)
                .length
            ).toFixed(1)
          : "0",

      totalDcPowerTs,

      avgCurrentTs:
        currentTs,

      maxCurrentTs:
        currentTs,

      minCurrentTs:
        currentTs,

      irradianceTs,

      moduleTempTs,
    };

  }, [data]);

  const topCards = [
    {
      title: "Total Strings",
      value: mappedData.totalStrings,
      icon: FaLink,
      color: "#00C6FF",
    },

    {
      title: "Strings Online",
      value: mappedData.online,
      sub: `${(
        (mappedData.online /
          mappedData.totalStrings) *
        100
      ).toFixed(1)} %`,
      icon: FaCheckCircle,
      color: "#32CD32",
    },

    {
      title: "Strings in Alarm",
      value: mappedData.alarm,
      sub: `${(
        (mappedData.alarm /
          mappedData.totalStrings) *
        100
      ).toFixed(1)} %`,
      icon: FaExclamationTriangle,
      color: "#FF6B35",
    },

    {
      title: "Strings Offline",
      value: mappedData.offline,
      sub: `${(
        (mappedData.offline /
          mappedData.totalStrings) *
        100
      ).toFixed(1)} %`,
      icon: FaTimesCircle,
      color: "#7F8C8D",
    },

    {
      title: "Total DC Power",
      value: mappedData.totalDcPower,
      sub: "MW",
      icon: FaBolt,
      color: "#00BFFF",
      ts: mappedData.totalDcPowerTs,
    },

    {
      title: "Avg. String Current",
      value: mappedData.avgCurrent,
      sub: "A",
      icon: FaBolt,
      color: "#FFD700",
      ts: mappedData.avgCurrentTs,
    },

    {
      title: "Max. String Current",
      value: mappedData.maxCurrent,
      sub: "A",
      icon: FaBolt,
      color: "#FFA500",
      ts: mappedData.maxCurrentTs,
    },

    {
      title: "Min. String Current",
      value: mappedData.minCurrent,
      sub: "A",
      icon: FaBolt,
      color: "#00FFFF",
      ts: mappedData.minCurrentTs,
    },

    {
      title: "Irradiance",
      value: mappedData.irradiance,
      sub: "W/m²",
      icon: FaSun,
      color: "#FFD700",
      ts: mappedData.irradianceTs,
    },

    {
      title: "Module Temp.",
      value: mappedData.moduleTemp,
      sub: "°C",
      icon: FaTemperatureHigh,
      color: "#FF4500",
      ts: mappedData.moduleTempTs,
    },
  ];

  return (
    <Grid
      templateColumns={{
        base: "repeat(2,1fr)",
        md: "repeat(4,1fr)",
        lg: "repeat(10,1fr)",
      }}
      gap={3}
    >
      {topCards.map((item, index) => (
        <GridItem key={index}>
          <Box
            bg={cardBg}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="12px"
            p={3}
          >
            <Flex
              justify="space-between"
              align="center"
              mb={2}
            >
              <Text
                fontSize="11px"
                color={subText}
                fontWeight="600"
              >
                {item.title}
              </Text>

              <Icon
                as={item.icon}
                color={item.color}
                boxSize={4}
              />
            </Flex>

            <Flex
              align="center"
              gap={2}
            >

              <Flex
                align="baseline"
                gap={1}
              >

                <Text
                  color={textColor}
                  fontWeight="700"
                  fontSize="22px"
                >
                  {item.value}
                </Text>

                {item.sub && (
                  <Text
                    color={subText}
                    fontSize="11px"
                  >
                    {item.sub}
                  </Text>
                )}

              </Flex>

              {(item.title ===
                "Total DC Power" ||

                item.title ===
                  "Avg. String Current" ||

                item.title ===
                  "Max. String Current" ||

                item.title ===
                  "Min. String Current" ||

                item.title ===
                  "Irradiance" ||

                item.title ===
                  "Module Temp.") && (

                <StaleIndicator
                  ts={item.ts}
                  value={item.value}
                />

              )}

            </Flex>
          </Box>
        </GridItem>
      ))}
    </Grid>
  );
};

export default TopSummaryCards;