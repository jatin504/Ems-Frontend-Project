import {
  Box,
  Grid,
  Flex,
  Text,
  Circle,
  VStack,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  useEffect,
  useMemo,
} from "react";

import {
  FiZap,
  FiCpu,
  FiActivity,
  FiTarget,
} from "react-icons/fi";

import useTimeseriesData from "../../../hooks/useTimeseriesData";

type SummaryCardsProps = {
  normal?: number;
  alarm?: number;
  offline?: number;
};

const SummaryCards = ({
  normal = 1,
  alarm = 0,
  offline = 0,
}: SummaryCardsProps) => {

  /* ================= API ================= */

  const {
    data,
    fetchData,
  } = useTimeseriesData();

  useEffect(() => {

    fetchData({

      devices: {
        patterns: [],
        ids: [
          "plant_1_ht_outgoing_meter_1",
          "plant_1_ht_auxilary_meter_1",
          "plant_1_ht_lt_meter_1",
        ],
      },

      keys: [

        {
          key:
            "total_active_power",

          alias:
            "total_active_power",

          keyType:
            "common",
        },

        {
          key:
            "daily_active_energy_export",

          alias:
            "daily_active_energy_export",

          keyType:
            "common",
        },

        {
          key:
            "daily_active_energy_import",

          alias:
            "daily_active_energy_import",

          keyType:
            "common",
        },

        {
          key:
            "total_reactive_power",

          alias:
            "total_reactive_power",

          keyType:
            "common",
        },

      ],

      aggregation: {
        func: "none",
        interval: 1,
        intervalType:
          "minute",
      },

      timeRange: {
        type: "relative",
        relativeType: "currentDaySoFar",
        interval: 1,
        intervalType: "minute",
      },

      orderBy:
        "DESC",

    } as any);

  }, []);

  useEffect(() => {
    console.log("========== Summary Data ==========");
    console.log(data);
    if (data && typeof data === "object") {
      Object.entries(data).forEach(([deviceId, device]: any) => {
        console.log("Device :", deviceId);
        console.log("Data :", device);
        console.log("Power :", device?.total_active_power?.[0]?.value);
        console.log("Export :", device?.daily_active_energy_export?.[0]?.value);
        console.log("Import :", device?.daily_active_energy_import?.[0]?.value);
        console.log("Reactive :", device?.total_reactive_power?.[0]?.value);
      });
    }
  }, [data]);

  /* ================= MAP DATA ================= */

  const mappedValues =
    useMemo(() => {

      if (
        !data ||
        typeof data !==
          "object"
      ) {

        return {

          totalOutgoingPower: 0,
          totalAuxPower: 0,
          totalLTPower: 0,
          totalEnergyToday: 0,
          exportPower: 0,
          importPower: 0,
          todayEnergy: 0,
          monthEnergy: 0,
          totalActivePower: 0,
          totalReactivePower: 0,

        };

      }

      let totalOutgoingPower = 0;

      let totalAuxPower = 0;

      let totalLTPower = 0;

      let totalEnergyToday = 0;

      let auxTodayEnergy = 0;

      let ltTodayEnergy = 0;

      let totalReactivePower = 0;

      let totalExportEnergy = 0;

      let totalImportEnergy = 0;

      Object.entries(data).forEach(([devId, device]: any) => {
        const p = Number(device?.total_active_power?.[0]?.value || 0);
        const dailyExport = Number(device?.daily_active_energy_export?.[0]?.value || 0);
        const dailyImport = Number(device?.daily_active_energy_import?.[0]?.value || 0);

        console.log("Device ID :", devId);
        console.log({
          power: p,
          export: dailyExport,
          import: dailyImport,
          reactive: device?.total_reactive_power?.[0]?.value,
        });

        totalReactivePower += Number(device?.total_reactive_power?.[0]?.value || 0);

        if (devId === "plant_1_ht_outgoing_meter_1") {
          totalOutgoingPower = p;
          totalEnergyToday += dailyExport;
          totalExportEnergy += dailyExport;
          totalImportEnergy += dailyImport;
        }

        if (devId === "plant_1_ht_auxilary_meter_1") {
          totalAuxPower = p;
          auxTodayEnergy = dailyExport;
        }

        if (devId === "plant_1_ht_lt_meter_1") {
          totalLTPower = p;
          ltTodayEnergy = dailyExport;
        }
      });

      // Do not fallback to estimates — keep aux/lt today/month as 0 when unmapped

      return {

        totalOutgoingPower,

        totalAuxPower,

        totalLTPower,

        totalEnergyToday,

        // export/import energy (daily) from timeseries
        exportPower: totalOutgoingPower,

        importPower: 0,

        totalExportEnergy,

        totalImportEnergy,

        todayEnergy: totalEnergyToday,

        monthEnergy: totalEnergyToday / 1000,

        // aux/lt specific today/month (0 when not present)
        auxTodayEnergy,

        auxMonthEnergy: auxTodayEnergy / 1000,

        ltTodayEnergy,

        ltMonthEnergy: ltTodayEnergy / 1000,

        totalActivePower: totalOutgoingPower,

        totalReactivePower,

      };

    }, [data]);

    /* ================= METER STATUS ================= */

    const meterStatus =
      useMemo(() => {

        let normal = 0;

        let offline = 0;

        if (!data || typeof data !== "object") {

          return {
            normal: 0,
            offline: 0,
          };

        }

        Object.values(data).forEach((device: any) => {

          const value = Number(device?.total_active_power?.[0]?.value ?? 0);

          if (value !== 0) normal++;
          else offline++;

        });

        return { normal, offline };

      }, [data]);

  /* ================= CARDS ================= */

  const cards = [

    {

      title:
        "Total HT Power",

      value: (mappedValues.totalOutgoingPower ?? 0).toFixed(2),

      unit:
        "kW",

      color:
        "#4da3ff",

      icon:
        FiZap,

      footer: [

        {

          label:
            "Export",

          value: (mappedValues.totalExportEnergy ?? 0).toFixed(2),

          unit:
            "kWh",

          color:
            "#6dd400",

        },

        {

          label:
            "Import",

          value: (mappedValues.totalImportEnergy ?? 0).toFixed(2),

          unit:
            "kWh",

          color:
            "#ff4d4f",

        },

      ],

    },

    {

      title:
        "Total Auxiliary Power",

      value: (mappedValues.totalAuxPower ?? 0).toFixed(2),

      unit:
        "kW",

      color:
        "#d26bff",

      icon:
        FiCpu,

      footer: [

        {

          label: "Today",

          value: (mappedValues.auxTodayEnergy ?? 0).toFixed(2),

          unit: "kWh",

          color: "#d26bff",

        },

        {

          label: "This Month",

          value: (mappedValues.auxMonthEnergy ?? 0).toFixed(2),

          unit: "MWh",

          color: "#d26bff",

        },

      ],

    },

    {

      title:
        "Total LT Power",

      value: (mappedValues.totalLTPower ?? 0).toFixed(2),

      unit:
        "kW",

      color:
        "#ffb020",

      icon:
        FiActivity,

      footer: [

        {

          label: "Today",

          value: (mappedValues.ltTodayEnergy ?? 0).toFixed(2),

          unit: "kWh",

          color: "#ffb020",

        },

        {

          label: "This Month",

          value: (mappedValues.ltMonthEnergy ?? 0).toFixed(2),

          unit: "MWh",

          color: "#ffb020",

        },

      ],

    },

    {

      title:
        "Total Energy (Today)",

      value: ((mappedValues.totalEnergyToday ?? 0) / 1000).toFixed(2),

      unit:
        "MWh",

      color:
        "#7CFC00",

      icon:
        FiTarget,

      footer: [

        {

          label:
            "Total Active Power",

          value: (mappedValues.totalActivePower ?? 0).toFixed(2),

          unit:
            "kW",

          color:
            "#7CFC00",

        },

        {

          label:
            "Total Reactive Power",

          value: (mappedValues.totalReactivePower ?? 0).toFixed(2),

          unit:
            "kvar",

          color:
            "#7CFC00",

        },

      ],

    },

  ];

  /* ================= COLORS ================= */

  const statusBg =
    useColorModeValue(
      "linear-gradient(180deg,#ffffff,#f8fbff)",
      "primary.dark"
    );

  const statusBorderClr =
    useColorModeValue(
      "#dbe7f3",
      "#16365f"
    );

  const statusTitleColor =
    useColorModeValue(
      "#1A202C",
      "#d6e4ff"
    );

  const statusTextColor =
    useColorModeValue(
      "#1A202C",
      "white"
    );

  const innerCircleBg =
    useColorModeValue(
      "#ffffff",
      "#0b2342"
    );

  const smallLabelColor =
    useColorModeValue(
      "#475569",
      "#c8d7ef"
    );

  return (

    <Grid
      templateColumns={{
        base: "1fr",
        md: "repeat(2,1fr)",
        xl: "repeat(5,1fr)",
      }}

      gap="12px"
    >

      {cards.map(
        (
          item,
          index
        ) => {

          const Icon =
            item.icon;

          const cardBg =
            useColorModeValue(
              "linear-gradient(180deg,#ffffff,#f8fbff)",
              "primary.dark"
            );

          const borderClr =
            useColorModeValue(
              "#dbe7f3",
              "#16365f"
            );

          const titleColor =
            useColorModeValue(
              "#1A202C",
              "#d6e4ff"
            );

          return (

            <Grid
              key={index}
              bg={cardBg}
              border={`1px solid ${borderClr}`}
              borderRadius="10px"
              p="14px"
              minH="145px"
            >

              <Flex justify="space-between">

                <Box>

                  <Text
                    color={titleColor}
                    fontSize="14px"
                  >
                    {item.title}
                  </Text>

                  <HStack
                    spacing="8px"
                    align="baseline"
                    mt="8px"
                  >

                    <Text
                      color={item.color}
                      mb="6px"
                      fontSize="28px"
                      fontWeight="700"
                    >
                      {item.value}
                    </Text>

                    <Text
                      color={item.color}
                      fontSize="16px"
                      mt="6px"
                    >
                      {item.unit}
                    </Text>

                  </HStack>

                </Box>

                <Circle
                  size="54px"
                  border={`1px solid ${item.color}`}
                >

                  <Icon
                    size={24}
                    color={item.color}
                  />

                </Circle>

              </Flex>

              <Box
                mt="14px"
                borderTop={`1px solid ${borderClr}`}
                pt="10px"
              >

                <Grid
                  templateColumns="repeat(2,1fr)"
                  gap="10px"
                >

                  {item.footer.map(
                    (
                      sub,
                      i
                    ) => (

                      <Box key={i}>

                        <Text
                          color={smallLabelColor}
                          fontSize="12px"
                        >
                          {sub.label}
                        </Text>

                        <HStack
                          spacing="4px"
                        >

                          <Text
                            color={statusTextColor}
                            fontWeight="700"
                            fontSize="28px"
                          >
                            {sub.value}
                          </Text>

                          <Text
                            color={statusTextColor}
                            fontSize="14px"
                            mt="8px"
                          >
                            {sub.unit}
                          </Text>

                        </HStack>

                      </Box>

                    )
                  )}

                </Grid>

              </Box>

            </Grid>

          );

        }
      )}

      {/* STATUS CARD */}

      <Box
        bg={statusBg}
        border={`1px solid ${statusBorderClr}`}
        borderRadius="10px"
        p="14px"
      >

        <Text
          color={statusTitleColor}
          fontSize="14px"
        >
          Meter Status
        </Text>

        <Flex
          align="center"
          justify="space-between"
          mt="10px"
        >

          <Box
            w="120px"
            h="120px"
            borderRadius="50%"

              background={(() => {

              const total =
                meterStatus.normal +
                meterStatus.offline;

              const nDeg =
                (meterStatus.normal / total) * 360 || 0;

              return `conic-gradient(
                #8ad63d 0deg ${nDeg}deg,
                #b5b5b5 ${nDeg}deg 360deg
              )`;

            })()}

            display="flex"
            alignItems="center"
            justifyContent="center"
          >

            <Box
              w="82px"
              h="82px"
              borderRadius="50%"
              bg={innerCircleBg}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >

              <Text
                color={statusTextColor}
                fontSize="34px"
                fontWeight="700"
              >
                {
                  meterStatus.normal +
                  meterStatus.offline
                }
              </Text>

              <Text
                color={smallLabelColor}
                fontSize="13px"
              >
                Total
              </Text>

            </Box>

          </Box>

          <VStack
            align="start"
            spacing="10px"
          >

            <HStack>

              <Box
                w="10px"
                h="10px"
                bg="#8ad63d"
              />

              <Text
                color={statusTitleColor}
              >
                Normal
              </Text>

              <Text
                color={statusTextColor}
              >
                {meterStatus.normal}
              </Text>

            </HStack>

            <HStack>

              <Box
                w="10px"
                h="10px"
                bg="#b5b5b5"
              />

              <Text
                color={statusTitleColor}
              >
                Offline
              </Text>

              <Text
                color={statusTextColor}
              >
                {meterStatus.offline}
              </Text>

            </HStack>

          </VStack>

        </Flex>

      </Box>

    </Grid>

  );

};

export default SummaryCards;