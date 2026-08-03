import {
  Box,
  Text,
  VStack,
  HStack,
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

const CumulativeEnergy = ({
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

  const energyData = useMemo(() => {
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

    const netActive =
      activeImport - activeExport;

    return [
      {
        label: "Import Active Energy",
        value: `${activeImport.toLocaleString(
          undefined,
          {
            maximumFractionDigits: 2,
          }
        )} kWh`,
        color: "#7ED321",
        icon: ArrowForwardIcon,
      },

      {
        label: "Export Active Energy",
        value: `${activeExport.toLocaleString(
          undefined,
          {
            maximumFractionDigits: 2,
          }
        )} kWh`,
        color: "#1E88FF",
        icon: ArrowForwardIcon,
      },

      {
        label: "Net Active Energy",
        value: `${netActive.toLocaleString(
          undefined,
          {
            maximumFractionDigits: 2,
          }
        )} kWh`,
        color: "#F5B82E",
        icon: FiZap,
      },

      {
        label: "Import Reactive Energy",
        value: `${reactiveImport.toLocaleString(
          undefined,
          {
            maximumFractionDigits: 2,
          }
        )} kvarh`,
        color: "#C66BFF",
        icon: FiTarget,
      },

      {
        label: "Export Reactive Energy",
        value: `${reactiveExport.toLocaleString(
          undefined,
          {
            maximumFractionDigits: 2,
          }
        )} kvarh`,
        color: "#B56CFF",
        icon: FiTarget,
      },

      {
        label: "Apparent Energy",
        value: `${apparentEnergy.toLocaleString(
          undefined,
          {
            maximumFractionDigits: 2,
          }
        )} kVAh`,
        color: "#18D8E4",
        icon: FiActivity,
      },
    ];
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

  const dividerColor =
    useColorModeValue(
      "#E2E8F0",
      "rgba(255,255,255,0.08)"
    );

  const labelColor =
    useColorModeValue(
      "#4A5568",
      "#D7E4FF"
    );

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
        mb="18px"
      >
        CUMULATIVE ENERGY
      </Text>

      <VStack
        spacing="0"
        align="stretch"
      >
        {energyData.map(
          (item, index) => (
            <Box key={index}>
              <HStack
                justify="space-between"
                py="12px"
              >
                <HStack spacing="12px">
                  <Circle
                    size="28px"
                    border="2px solid"
                    borderColor={
                      item.color
                    }
                  >
                    <Box
                      as={item.icon}
                      color={item.color}
                      fontSize="14px"
                    />
                  </Circle>

                  <Text
                    fontSize="15px"
                    color={labelColor}
                    fontWeight="500"
                  >
                    {item.label}
                  </Text>
                </HStack>

                <Text
                  fontSize="15px"
                  fontWeight="600"
                  color={textColor}
                >
                  {item.value}
                </Text>
              </HStack>

              {index !==
                energyData.length -
                  1 && (
                <Box
                  h="1px"
                  bg={dividerColor}
                />
              )}
            </Box>
          )
        )}
      </VStack>
    </Box>
  );
};

export default CumulativeEnergy;