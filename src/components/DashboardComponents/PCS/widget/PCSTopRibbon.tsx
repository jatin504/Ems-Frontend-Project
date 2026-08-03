import React, { useEffect, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  FiServer,
  FiActivity,
  FiCpu,
  FiZap,
} from "react-icons/fi";

import {
  MdBolt,
  MdFlashOn,
  MdOutlinePower,
  MdElectricalServices,
} from "react-icons/md";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import { useDevices } from "../../../../hooks/useDevices";

interface PCSTopRibbonProps {
  selectedDevice: string;
}

const PCSTopRibbon = (_props: PCSTopRibbonProps) => {

  const cardBg = useColorModeValue("#FFFFFF", "#0F1C2E");

  const border = useColorModeValue(
    "rgba(15,23,42,0.08)",
    "rgba(255,255,255,0.08)"
  );

  const titleColor = useColorModeValue(
    "#64748B",
    "#94A3B8"
  );

  const valueColor = useColorModeValue(
    "#0F172A",
    "white"
  );

  const unitColor = useColorModeValue(
    "#475569",
    "#CBD5E1"
  );

  const footerColor = useColorModeValue(
    "#64748B",
    "#94A3B8"
  );

  const { data, fetchData } = useTimeseriesData();
  const { devices } = useDevices();

  const totalPCS = useMemo(() => {
    if (!devices) return 0;

    return devices.filter((d: any) =>
      d.device_id?.toLowerCase().includes("_pcs_pcs_")
    ).length;
  }, [devices]);

  useEffect(() => {
    const payload = {

      devices: {
        ids: ["plant_1_plant_device"],
        patterns: [],
      },

      keys: [

        {
          key: "pcs_total_ac_power",
          alias: "Active Power",
          keyType: "timeseries",
        },

        {
          key: "pcs_total_reactive_power",
          alias: "Reactive Power",
          keyType: "timeseries",
        },

        {
          key: "pcs_total_apparent_power",
          alias: "Apparent Power",
          keyType: "timeseries",
        },

        {
          key: "pcs_average_efficiency",
          alias: "Efficiency",
          keyType: "timeseries",
        },

        {
          key: "pcs_total_dc_power",
          alias: "DC Power",
          keyType: "timeseries",
        },

        {
          key: "pcs_total_dc_voltage",
          alias: "DC Voltage",
          keyType: "timeseries",
        },

        {
          key: "pcs_total_dc_current",
          alias: "DC Current",
          keyType: "timeseries",
        },

      ],

      aggregation: {
        func: "avg",
        interval: 5,
        intervalType: "minute",
      },

      timeRange: {
        type: "last",
        interval: 1,
        intervalType: "day",
      },

      orderBy: "ASC",

    } as any;

    const load = () => {
      console.log("PCS payload:", payload);
      fetchData(payload);
    };

    load();

    const timer = setInterval(load, 60000);

    return () => clearInterval(timer);
  }, []);

  const getLatest = (key: string) => {
    if (!data) return "--";

    let total = 0;
    let found = false;

    Object.values(data).forEach((device: any) => {
      const arr = device?.[key];

      if (arr?.length) {
        const value = Number(arr[arr.length - 1].value);

        if (!isNaN(value)) {
          total += value;
          found = true;
        }
      }
    });

    return found ? total.toFixed(2) : "--";
  };
    const ribbonData = [
    {
      title: "Total PCS",
      value: totalPCS,
      unit: "",
      icon: FiServer,
      color: "#6C7A89",
      footer: (
        <HStack spacing={2} mt={1}>
          <Text fontSize="10px" color="#22C55E">
            Online {totalPCS}
          </Text>
          <Text fontSize="10px" color="#EF4444">
            Offline 0
          </Text>
        </HStack>
      ),
    },

    {
      title: "Total AC Power",
      value: getLatest("Active Power"),
      unit: "kW",
      icon: FiActivity,
      color: "#00C2A8",
    },

    {
      title: "Total Reactive Power",
      value: getLatest("Reactive Power"),
      unit: "kVAR",
      icon: FiCpu,
      color: "#A855F7",
    },

    {
      title: "Total Apparent Power",
      value: getLatest("Apparent Power"),
      unit: "kVA",
      icon: MdOutlinePower,
      color: "#60A5FA",
    },

    {
      title: "Average Efficiency",
      value: getLatest("Efficiency"),
      unit: "%",
      icon: MdFlashOn,
      color: "#4ADE80",
    },

    {
      title: "Total DC Power",
      value: getLatest("DC Power"),
      unit: "kW",
      icon: MdBolt,
      color: "#FACC15",
    },

    {
      title: "Total DC Voltage",
      value: getLatest("DC Voltage"),
      unit: "V",
      icon: MdElectricalServices,
      color: "#C084FC",
    },

    {
      title: "Total DC Current",
      value: getLatest("DC Current"),
      unit: "A",
      icon: FiZap,
      color: "#EF4444",
      status: true,
    },
  ];

  return (
    <Flex gap={2} wrap="nowrap" overflowX="auto">
      {ribbonData.map((item) => (
        <Box
          key={item.title}
          flex="1"
          minW="155px"
          bg={cardBg}
          border="1px solid"
          borderColor={border}
          borderRadius="10px"
          px={3}
          py={2}
        >
          <HStack align="flex-start" spacing={3}>
            <Flex
              w="28px"
              h="28px"
              borderRadius="8px"
              bg={`${item.color}20`}
              justify="center"
              align="center"
            >
              <Icon
                as={item.icon}
                color={item.color}
                boxSize={4}
              />
            </Flex>

            <VStack
              align="start"
              spacing={0}
              flex={1}
            >
              <Text
                fontSize="10px"
                color={titleColor}
                fontWeight="500"
                lineHeight="14px"
              >
                {item.title}
              </Text>

              <HStack
                spacing={1}
                align="baseline"
              >
                <Text
                  color={valueColor}
                  fontSize="22px"
                  fontWeight="700"
                  lineHeight="24px"
                >
                  {item.value}
                </Text>

                {item.unit && (
                  <Text
                    color={unitColor}
                    fontSize="11px"
                    fontWeight="600"
                  >
                    {item.unit}
                  </Text>
                )}
              </HStack>

              {item.footer}

              {item.status && (
                <Text
                  mt={1}
                  fontSize="10px"
                  color={footerColor}
                >
                  Status:&nbsp;
                  <Text
                    as="span"
                    color="#22C55E"
                    fontWeight="700"
                  >
                    ONLINE
                  </Text>
                </Text>
              )}
            </VStack>
          </HStack>
        </Box>
      ))}
    </Flex>
  );
};

export default PCSTopRibbon;