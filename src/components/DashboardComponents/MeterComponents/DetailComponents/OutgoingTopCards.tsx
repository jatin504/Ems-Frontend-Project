import {
  Grid,
  Box,
  Text,
  VStack,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";

import StaleIndicator from "../../../../components/Common/StaleIndicator";

import {
  useEffect,
  useMemo,
} from "react";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";

type Props = {
  selectedMeter?: string;
};

const OutgoingTopCards = ({
  selectedMeter,
}: Props) => {

  const {
    data,
    fetchData,
  } = useTimeseriesData();

  const fetchingToServerObj = {

    dataSource: {

      devices: {
        patterns: [],
        ids: selectedMeter
          ? [selectedMeter]
          : [],
      },

      keys: [

        {
          key:
            "total_active_power",
          alias:
            "Active Power",
          keyType:
            "timeseries",
        },
        {
          key:
            "daily_active_energy_import",
          alias:
            "Active Power Import",
          keyType:
            "timeseries",
        },

        {
          key:
            "daily_active_energy_export",
          alias:
            "Active Power Export",
          keyType:
            "timeseries",
        },

        {
          key:
            "total_apparent_power",
          alias:
            "Apparent Power",
          keyType:
            "timeseries",
        },
        {
          key:
            "daily_apparent_energy_import",
          alias:
            "Apparent Power Import",
          keyType:
            "timeseries",
        },

        {
          key:
            "daily_apparent_energy_export",
          alias:
            "Apparent Power Export",
          keyType:
            "timeseries",
        },

        {
          key:
            "total_reactive_power",
          alias:
            "Reactive Power",
          keyType:
            "timeseries",
        },
        {
          key:
            "daily_reactive_energy_import",
          alias:
            "Reactive Power Import",
          keyType:
            "timeseries",
        },

        {
          key:
            "daily_reactive_energy_export",
          alias:
            "Reactive Power Export",
          keyType:
            "timeseries",
        },

        {
          key:
            "avg_pf",
          alias:
            "Power Factor",
          keyType:
            "timeseries",
        },

        {
          key:
            "avg_voltage_l",
          alias:
            "Voltage Avg",
          keyType:
            "timeseries",
        },

        {
          key:
            "avg_current_l",
          alias:
            "Current Avg",
          keyType:
            "timeseries",
        },

        {
          key:
            "frequency",
          alias:
            "Frequency",
          keyType:
            "timeseries",
        },

        {
          key:
            "daily_active_energy_export",
          alias:
            "Energy Today",
          keyType:
            "timeseries",
        },
        {
          key:
            "daily_active_energy_import",
          alias:
            "Import Energy Today",
          keyType:
            "timeseries",
        },

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

      orderBy: "ASC" as const,

    },

  };

  useEffect(() => {

    if (!selectedMeter) return;

    const fetchTopCards = () => {

      

      fetchData(fetchingToServerObj.dataSource);

    };

    // Initial API Call
    fetchTopCards();

    // Auto Refresh Every 1 Minute
    const interval = setInterval(() => {
      fetchTopCards();
    }, 60000);

    // Cleanup
    return () => clearInterval(interval);

  }, [selectedMeter]);

  const latestValues =
    useMemo(() => {

      if (
        !data ||
        typeof data !== "object"
      ) {
        return {};
      }

      const deviceKeys =
        Object.keys(data);

      if (!deviceKeys.length)
        return {};

      const deviceData =
        data[deviceKeys[0]];

      const getLatest =
        (alias: string) => {

          const arr =
            deviceData?.[alias];

          if (
            Array.isArray(arr) &&
            arr.length > 0
          ) {

            return Number(
              arr[0]?.value || 0
            );

          }

          return 0;

        };

      return {

        activePower:
          getLatest(
            "Active Power"
          ),

        apparentPower:
          getLatest(
            "Apparent Power"
          ),

        reactivePower:
          getLatest(
            "Reactive Power"
          ),

        reactivePowerImport:
          getLatest(
            "Reactive Power Import"
          ),

        reactivePowerExport:
          getLatest(
            "Reactive Power Export"
          ),

        activePowerImport:
          getLatest(
            "Active Power Import"
          ),

        activePowerExport:
          getLatest(
            "Active Power Export"
          ),

        apparentPowerImport:
          getLatest(
            "Apparent Power Import"
          ),

        apparentPowerExport:
          getLatest(
            "Apparent Power Export"
          ),

        powerFactor:
          getLatest(
            "Power Factor"
          ),

        voltageAvg:
          getLatest(
            "Voltage Avg"
          ),

        currentAvg:
          getLatest(
            "Current Avg"
          ),

        frequency:
          getLatest(
            "Frequency"
          ),

        energyToday:
          getLatest(
            "Energy Today"
          ),

        importEnergyToday:
          getLatest(
            "Import Energy Today"
          ),

        // timestamps for stale indicator
        activePowerTs:
          deviceData?.["Active Power"]?.[0]?.ts || 0,

        apparentPowerTs:
          deviceData?.["Apparent Power"]?.[0]?.ts || 0,

        reactivePowerTs:
          deviceData?.["Reactive Power"]?.[0]?.ts || 0,

        powerFactorTs:
          deviceData?.["Power Factor"]?.[0]?.ts || 0,

        voltageAvgTs:
          deviceData?.["Voltage Avg"]?.[0]?.ts || 0,

        currentAvgTs:
          deviceData?.["Current Avg"]?.[0]?.ts || 0,

        frequencyTs:
          deviceData?.["Frequency"]?.[0]?.ts || 0,

        energyTodayTs:
          deviceData?.["Energy Today"]?.[0]?.ts || 0,

      };

    }, [data]);

  const cards = [

    {
      title:
        "Active Power",

      value:
        latestValues.activePower?.toFixed(
          2
        ) || "0",

      unit: "kW",

      color: "#25b7ff",

      ts: latestValues.activePowerTs,

      sub1: "Import",

      sub1Value:
        `${latestValues.activePowerImport?.toFixed(2) || 0} kW`,

      sub2: "Export",

      sub2Value:
        `${latestValues.activePowerExport?.toFixed(2) || 0} kW`,
    },

    {
      title:
        "Apparent Power",

      value:
        latestValues.apparentPower?.toFixed(
          2
        ) || "0",

      unit: "kVA",

      color: "#c97cff",

      ts: latestValues.apparentPowerTs,

      sub1: "Import",

      sub1Value:
        `${latestValues.apparentPowerImport?.toFixed(2) || 0} kVA`,

      sub2: "Export",

      sub2Value:
        `${latestValues.apparentPowerExport?.toFixed(2) || 0} kVA`,
    },

    {
      title:
        "Reactive Power",

      value:
        latestValues.reactivePower?.toFixed(
          2
        ) || "0",

      unit: "kvar",

      color: "#ff8b4d",

      ts: latestValues.reactivePowerTs,

      sub1: "Import",

      sub1Value:
        `${latestValues.reactivePowerImport?.toFixed(2) || 0} kvar`,

      sub2: "Export",

      sub2Value:
        `${latestValues.reactivePowerExport?.toFixed(2) || 0} kvar`,

      extra:
        (latestValues.reactivePower ?? 0) >= 0
          ? "Inductive"
          : "Capacitive",
    },

    {
      title:
        "Power Factor",

      value:
        latestValues.powerFactor?.toFixed(
          2
        ) || "0",

      unit: "",

      color: "#00d084",

      ts: latestValues.powerFactorTs,

      sub1: "",

      sub1Value: "",

      sub2: "",

      sub2Value: "",

      extra:
        (latestValues.powerFactor ?? 0) >= 0
          ? "Leading"
          : "Lagging",
    },

    {
      title:
        "Voltage (Avg)",

      value:
        latestValues.voltageAvg?.toFixed(
          2
        ) || "0",

      unit: "V",

      color: "#ffd34d",

      ts: latestValues.voltageAvgTs,

      sub1: "",

      sub1Value: "",

      sub2: "",

      sub2Value: "",

      extra: "",
    },

    {
      title:
        "Current (Avg)",

      value:
        latestValues.currentAvg?.toFixed(
          2
        ) || "0",

      unit: "A",

      color: "#84cc16",

      ts: latestValues.currentAvgTs,

      sub1: "",

      sub1Value: "",

      sub2: "",

      sub2Value: "",
    },

    {
      title:
        "Frequency",

      value:
        latestValues.frequency?.toFixed(
          2
        ) || "0",

      unit: "Hz",

      color: "#e879f9",

      ts: latestValues.frequencyTs,

      sub1: "",

      sub1Value: "",

      sub2: "",

      sub2Value: "",
    },

    {
      title:
        "Energy (Today)",

      value:
        latestValues.energyToday?.toFixed(
          2
        ) || "0",

      unit: "kWh",

      color: "#f59e0b",

      ts: latestValues.energyTodayTs,

      sub1: "Export",

      sub1Value:
        `${latestValues.energyToday?.toFixed(2) || 0} kWh`,

      sub2: "Import",

      sub2Value:
        `${latestValues.importEnergyToday?.toFixed(2) || 0} kWh`,
    },

  ];

  const cardBg = useColorModeValue(
    "#ffffff",
    "primary.dark"
  );

  const borderColor = useColorModeValue(
    "#d9e2f0",
    "#12345a"
  );

  const titleColor = useColorModeValue(
    "#4A5568",
    "#8ea6c9"
  );

  const subLabel = useColorModeValue(
    "#718096",
    "#5f7ea6"
  );

  const subValue = useColorModeValue(
    "#1A202C",
    "#d7e4ff"
  );

  return (

    <Grid
      templateColumns={{
        base:
          "repeat(1,1fr)",

        sm:
          "repeat(2,1fr)",

        md:
          "repeat(4,1fr)",

        xl:
          "repeat(8,1fr)",
      }}

      gap="2px"
    >

      {cards.map(
        (
          card,
          index
        ) => (

          <Box
            key={index}
            bg={cardBg}
            border={`1px solid ${borderColor}`}
            borderRadius="4px"
            px="12px"
            py="10px"
            minH="118px"
            position="relative"
            overflow="hidden"
          >

            <Text
              fontSize="10px"
              fontWeight="500"
              color={titleColor}
              mb="10px"
              textAlign="center"
            >
              {card.title}
            </Text>

            <VStack
              spacing="0px"
              mb="12px"
            >

              <HStack
                spacing="6px"
                align="center"
              >

                <Text
                  fontSize="34px"
                  lineHeight="1"
                  fontWeight="700"
                  color={card.color}
                  letterSpacing="-1px"
                >
                  {card.value}
                </Text>

                <Text
                  fontSize="13px"
                  fontWeight="600"
                  color={card.color}
                  pb="3px"
                >
                  {card.unit}
                </Text>

                <StaleIndicator
                  ts={card.ts}
                  value={card.value}
                />

              </HStack>

              {card.extra && (

                <Text
                  fontSize="11px"
                  color={titleColor}
                  mt="2px"
                >
                  {card.extra}
                </Text>

              )}

            </VStack>

            {(card.sub1 ||
              card.sub2) && (

                <HStack
                  justify="space-between"
                  align="start"
                  mt="auto"
                >

                  <VStack
                    spacing="0px"
                    align="start"
                  >

                    <Text
                      fontSize="9px"
                      color={subLabel}
                    >
                      {card.sub1}
                    </Text>

                    <Text
                      fontSize="11px"
                      fontWeight="600"
                      color={subValue}
                    >
                      {card.sub1Value}
                    </Text>

                  </VStack>

                  <VStack
                    spacing="0px"
                    align="start"
                  >

                    <Text
                      fontSize="9px"
                      color={subLabel}
                    >
                      {card.sub2}
                    </Text>

                    <Text
                      fontSize="11px"
                      fontWeight="600"
                      color={subValue}
                    >
                      {card.sub2Value}
                    </Text>

                  </VStack>

                </HStack>

              )}

          </Box>

        )
      )}

    </Grid>

  );

};

export default OutgoingTopCards;
