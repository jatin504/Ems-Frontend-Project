import {
  Box,
  Text,
  HStack,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import {
  useEffect,
  useMemo,
} from "react";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";

type Props = {
  selectedMeter?: string;
};

const EnergyBreakdown = ({
  selectedMeter,
}: Props) => {
  const { data, fetchData } =
    useTimeseriesData();

  useEffect(() => {
    if (!selectedMeter) return;

    const doFetch = () => {
      fetchData({
        devices: {
          patterns: [],
          ids: [selectedMeter],
        },

        keys: [
          {
            key: "daily_active_energy_import",
            alias: "daily_active_energy_import",
            keyType: "timeseries",
          },
          {
            key: "daily_active_energy_export",
            alias: "daily_active_energy_export",
            keyType: "timeseries",
          },
        ],

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
      } as any);
    };

    doFetch();

    const interval = setInterval(
      doFetch,
      60000
    );

    return () =>
      clearInterval(interval);
  }, [selectedMeter]);

  const chartData = useMemo(() => {
    const meterData =
      (data as any)?.[
        selectedMeter || ""
      ] || {};

    const importValue = Number(
      meterData
        ?.daily_active_energy_import?.[0]
        ?.value || 0
    );

    const exportValue = Number(
      meterData
        ?.daily_active_energy_export?.[0]
        ?.value || 0
    );

    const total =
      importValue + exportValue;

    const importPct =
      total > 0
        ? (
            (importValue / total) *
            100
          ).toFixed(1)
        : "0.0";

    const exportPct =
      total > 0
        ? (
            (exportValue / total) *
            100
          ).toFixed(1)
        : "0.0";

    return {
      importValue,
      exportValue,
      total,
      importPct,
      exportPct,
    };
  }, [data, selectedMeter]);

  const bg = useColorModeValue(
    "#FFFFFF",
    "#082647"
  );

  const borderColor =
    useColorModeValue(
      "#D9E2F0",
      "#123A63"
    );

  const textColor =
    useColorModeValue(
      "#1A202C",
      "#FFFFFF"
    );

  const subTextColor =
    useColorModeValue(
      "#4A5568",
      "#C8D4E3"
    );

  const options: Highcharts.Options =
    {
      chart: {
        type: "pie",
        backgroundColor:
          "transparent",
        height: 220,
        spacing: [0, 0, 0, 0],
      },

      title: undefined,

      credits: {
        enabled: false,
      },

      exporting: {
        enabled: false,
      },

      tooltip: {
        pointFormat:
          "<b>{point.y:.2f} kWh</b><br/>{point.percentage:.1f}%",
      },

      legend: {
        enabled: false,
      },

      plotOptions: {
        pie: {
          innerSize: "65%",
          borderWidth: 0,

          dataLabels: {
            enabled: false,
          },
        },
      },

      series: [
        {
          type: "pie",

          data: [
            {
              name: "Import",
              y: chartData.importValue,
              color: "#7ED321",
            },

            {
              name: "Export",
              y: chartData.exportValue,
              color: "#1E88FF",
            },
          ],
        },
      ],
    };

  return (
    <Box
      bg={bg}
      border={`1px solid ${borderColor}`}
      borderRadius="10px"
      p="16px"
      h="100%"
    >
      <Text
        fontSize="15px"
        fontWeight="700"
        color={textColor}
        mb="16px"
      >
        ENERGY BREAKDOWN (TODAY)
      </Text>

      <HStack
        align="center"
        justify="space-between"
        spacing="20px"
      >
        <Box
          position="relative"
          w="220px"
          h="220px"
        >
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
          />

          <VStack
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%,-50%)"
            spacing="0"
          >
            <Text
              fontSize="14px"
              color={subTextColor}
              textAlign="center"
            >
              Total
            </Text>

            <Text
              fontSize="14px"
              color={subTextColor}
              textAlign="center"
            >
              (Today)
            </Text>

            <Text
              fontSize="26px"
              lineHeight="1"
              fontWeight="700"
              color={textColor}
            >
              {chartData.total.toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </Text>

            <Text
              fontSize="14px"
              color={subTextColor}
            >
              kWh
            </Text>
          </VStack>
        </Box>

        <VStack
          align="start"
          spacing="24px"
          flex={1}
        >
          <Box w="100%">
            <HStack mb="8px">
              <Box
                w="12px"
                h="12px"
                borderRadius="50%"
                bg="#7ED321"
              />

              <Text
                fontSize="15px"
                fontWeight="500"
                color={textColor}
              >
                Import Active Energy
              </Text>
            </HStack>

            <HStack
              justify="space-between"
              w="100%"
            >
              <Text
                fontSize="16px"
                fontWeight="600"
                color={textColor}
              >
                {chartData.importValue.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}{" "}
                kWh
              </Text>

              <Text
                fontSize="16px"
                fontWeight="600"
                color={textColor}
              >
                ({chartData.importPct}%)
              </Text>
            </HStack>
          </Box>

          <Box w="100%">
            <HStack mb="8px">
              <Box
                w="12px"
                h="12px"
                borderRadius="50%"
                bg="#1E88FF"
              />

              <Text
                fontSize="15px"
                fontWeight="500"
                color={textColor}
              >
                Export Active Energy
              </Text>
            </HStack>

            <HStack
              justify="space-between"
              w="100%"
            >
              <Text
                fontSize="16px"
                fontWeight="600"
                color={textColor}
              >
                {chartData.exportValue.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}{" "}
                kWh
              </Text>

              <Text
                fontSize="16px"
                fontWeight="600"
                color={textColor}
              >
                ({chartData.exportPct}%)
              </Text>
            </HStack>
          </Box>
        </VStack>
      </HStack>
    </Box>
  );
};

export default EnergyBreakdown;