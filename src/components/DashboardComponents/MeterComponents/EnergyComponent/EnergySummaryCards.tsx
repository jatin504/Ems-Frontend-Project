import {
  Box,
  Text,
  HStack,
  VStack,
  SimpleGrid,
  Circle,
  useColorModeValue,
} from "@chakra-ui/react";

import { ArrowForwardIcon } from "@chakra-ui/icons";

import {
  FiZap,
  FiActivity,
  FiTarget,
} from "react-icons/fi";

import {
  useEffect,
  useMemo,
} from "react";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";

type Props = {
  selectedMeter?: string;
};

const EnergySummaryCards = ({
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
            key: "energy_active_import",
            alias: "energy_active_import",
            keyType: "timeseries",
          },
          {
            key: "energy_active_export",
            alias: "energy_active_export",
            keyType: "timeseries",
          },
          {
            key: "energy_reactive_import_wi",
            alias: "energy_reactive_import_wi",
            keyType: "timeseries",
          },
          {
            key: "energy_reactive_import_we",
            alias: "energy_reactive_import_we",
            keyType: "timeseries",
          },
          {
            key: "energy_reactive_export_wi",
            alias: "energy_reactive_export_wi",
            keyType: "timeseries",
          },
          {
            key: "energy_reactive_export_we",
            alias: "energy_reactive_export_we",
            keyType: "timeseries",
          },
          {
            key: "energy_apparent_import",
            alias: "energy_apparent_import",
            keyType: "timeseries",
          },
          {
            key: "energy_apparent_export",
            alias: "energy_apparent_export",
            keyType: "timeseries",
          },

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
          {
            key: "daily_reactive_energy_import",
            alias: "daily_reactive_energy_import",
            keyType: "timeseries",
          },
          {
            key: "daily_reactive_energy_export",
            alias: "daily_reactive_energy_export",
            keyType: "timeseries",
          },
          {
            key: "daily_apparent_energy_import",
            alias: "daily_apparent_energy_import",
            keyType: "timeseries",
          },
          {
            key: "daily_apparent_energy_export",
            alias: "daily_apparent_energy_export",
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

  const cards = useMemo(() => {
    const meterData =
      (data as any)?.[
        selectedMeter || ""
      ] || {};

    const activeImport = Number(
      meterData?.energy_active_import?.[0]
        ?.value || 0
    );

    const activeExport = Number(
      meterData?.energy_active_export?.[0]
        ?.value || 0
    );

    const reactiveImport =
      Number(
        meterData
          ?.energy_reactive_import_wi?.[0]
          ?.value || 0
      ) +
      Number(
        meterData
          ?.energy_reactive_import_we?.[0]
          ?.value || 0
      );

    const reactiveExport =
      Number(
        meterData
          ?.energy_reactive_export_wi?.[0]
          ?.value || 0
      ) +
      Number(
        meterData
          ?.energy_reactive_export_we?.[0]
          ?.value || 0
      );

    const apparentEnergy =
      Number(
        meterData
          ?.energy_apparent_import?.[0]
          ?.value || 0
      ) +
      Number(
        meterData
          ?.energy_apparent_export?.[0]
          ?.value || 0
      );

    const dailyActiveImport = Number(
      meterData
        ?.daily_active_energy_import?.[0]
        ?.value || 0
    );

    const dailyActiveExport = Number(
      meterData
        ?.daily_active_energy_export?.[0]
        ?.value || 0
    );

    const dailyReactiveImport =
      Number(
        meterData
          ?.daily_reactive_energy_import?.[0]
          ?.value || 0
      );

    const dailyReactiveExport =
      Number(
        meterData
          ?.daily_reactive_energy_export?.[0]
          ?.value || 0
      );

    const dailyApparent =
      Number(
        meterData
          ?.daily_apparent_energy_import?.[0]
          ?.value || 0
      ) +
      Number(
        meterData
          ?.daily_apparent_energy_export?.[0]
          ?.value || 0
      );

    const netToday =
      dailyActiveImport -
      dailyActiveExport;

    const netMonth =
      activeImport -
      activeExport;

    const format = (
      value: number,
      unit: string
    ) =>
      `${value.toLocaleString(
        undefined,
        {
          maximumFractionDigits: 2,
        }
      )} ${unit}`;

    return [
      {
        title:
          "Import Active Energy",
        today: format(
          dailyActiveImport,
          "kWh"
        ),
        month: format(
          activeImport,
          "kWh"
        ),
        color: "#7ED321",
        icon: ArrowForwardIcon,
      },

      {
        title:
          "Export Active Energy",
        today: format(
          dailyActiveExport,
          "kWh"
        ),
        month: format(
          activeExport,
          "kWh"
        ),
        color: "#1890FF",
        icon: ArrowForwardIcon,
      },

      {
        title:
          "Net Active Energy",
        today: format(
          netToday,
          "kWh"
        ),
        month: format(
          netMonth,
          "kWh"
        ),
        color: "#F5B82E",
        icon: FiZap,
      },

      {
        title:
          "Import Reactive Energy",
        today: format(
          dailyReactiveImport,
          "kvarh"
        ),
        month: format(
          reactiveImport,
          "kvarh"
        ),
        color: "#C66BFF",
        icon: FiTarget,
      },

      {
        title:
          "Export Reactive Energy",
        today: format(
          dailyReactiveExport,
          "kvarh"
        ),
        month: format(
          reactiveExport,
          "kvarh"
        ),
        color: "#B56CFF",
        icon: FiTarget,
      },

      {
        title:
          "Apparent Energy",
        today: format(
          dailyApparent,
          "kVAh"
        ),
        month: format(
          apparentEnergy,
          "kVAh"
        ),
        color: "#18D8E4",
        icon: FiActivity,
      },
    ];
  }, [data, selectedMeter]);

  const cardBg = useColorModeValue(
    "#FFFFFF",
    "#082647"
  );

  const borderColor =
    useColorModeValue(
      "#D9E2F0",
      "#123A63"
    );

  const titleColor =
    useColorModeValue(
      "#2D3748",
      "#FFFFFF"
    );

  const labelColor =
    useColorModeValue(
      "#718096",
      "#B7C6DA"
    );

  const dividerColor =
    useColorModeValue(
      "#E2E8F0",
      "rgba(255,255,255,0.08)"
    );

  const monthValueColor =
    useColorModeValue(
      "#2D3748",
      "#FFFFFF"
    );

  return (
    <Box w="100%">
      <Text
        fontSize="14px"
        fontWeight="700"
        color={titleColor}
        mb="12px"
      >
        ENERGY SUMMARY
      </Text>

      <SimpleGrid
        columns={6}
        spacing="12px"
      >
        {cards.map((item) => (
          <Box
            key={item.title}
            h="225px"
            p="16px"
            borderRadius="8px"
            bg={cardBg}
            border={`1px solid ${borderColor}`}
          >
            <Text
              fontSize="14px"
              fontWeight="500"
              color={titleColor}
              mb="22px"
            >
              {item.title}
            </Text>

            <HStack
              justify="space-between"
              align="center"
              mb="8px"
            >
              <VStack
                align="start"
                spacing="2px"
              >
                <Text
                  fontSize="22px"
                  fontWeight="700"
                  color={item.color}
                >
                  {item.today}
                </Text>

                <Text
                  fontSize="12px"
                  color={labelColor}
                >
                  Today
                </Text>
              </VStack>

              <Circle
                size="42px"
                border="2px solid"
                borderColor={
                  item.color
                }
              >
                <Box
                  as={item.icon}
                  color={item.color}
                  fontSize="20px"
                />
              </Circle>
            </HStack>

            <Box
              mt="14px"
              mb="14px"
              h="1px"
              bg={dividerColor}
            />

            <Text
              fontSize="12px"
              color={labelColor}
              mb="6px"
            >
              Cumulative
            </Text>

            <Text
              fontSize="16px"
              fontWeight="600"
              color={monthValueColor}
            >
              {item.month}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default EnergySummaryCards;