import React, { useMemo } from "react";
import {
  Box,
  Flex,
  HStack,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { useDevices } from "../../../../hooks/useDevices";

const PCSFleetStatus = () => {
  const { devices } = useDevices();

  const pcsStats = useMemo(() => {
    if (!devices) {
      return {
        total: 0,
        online: 0,
        offline: 0,
        standby: 0,
        fault: 0,
      };
    }

    const pcsDevices = devices.filter((d: any) =>
      d.device_id?.toLowerCase().includes("_pcs_pcs_")
    );

    const total = pcsDevices.length;
    const online = total;
    const offline = 0;
    const standby = 0;
    const fault = 0;

    return {
      total,
      online,
      offline,
      standby,
      fault,
    };
  }, [devices]);

  const data = [
    { name: "Online", value: pcsStats.online, color: "#6CC04A" },
    { name: "Offline", value: pcsStats.offline, color: "#FF4D4F" },
    { name: "Standby", value: pcsStats.standby, color: "#8C8C8C" },
    { name: "Fault", value: pcsStats.fault, color: "#F59E0B" },
  ];

  const total = pcsStats.total;
  const bg = useColorModeValue("#FFFFFF", "#0B2239");
  const border = useColorModeValue("rgba(15,23,42,0.08)", "rgba(255,255,255,0.06)");
  const titleColor = useColorModeValue("#0F172A", "white");
  const mutedColor = useColorModeValue("#64748B", "#A0AEC0");
  const legendColor = useColorModeValue("#475569", "#CBD5E1");

  return (
    <Box
      bg={bg}
      borderRadius="10px"
      border="1px solid"
      borderColor={border}
      h="300px"
      p={4}
    >
      <Text
        color={titleColor}
        fontSize="13px"
        fontWeight="600"
        mb={4}
      >
        PCS Fleet Status
      </Text>

      <Flex h="calc(100% - 30px)" align="center">
        {/* Donut */}
        <Box position="relative" w="130px" h="130px">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(value: any) => [`${value ?? 0}`, "PCS"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid rgba(15, 23, 42, 0.08)",
                  backgroundColor: "#FFFFFF",
                }}
                itemStyle={{ color: "#0F172A" }}
              />
              <Pie
                data={data}
                innerRadius={42}
                outerRadius={58}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.color}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <Flex
            position="absolute"
            inset="0"
            align="center"
            justify="center"
            direction="column"
            pointerEvents="none"
          >
            <Text
              color={titleColor}
              fontSize="34px"
              fontWeight="700"
              lineHeight="34px"
            >
              {total}
            </Text>

            <Text
              color={mutedColor}
              fontSize="11px"
            >
              PCS Total
            </Text>
          </Flex>
        </Box>

        {/* Legend */}
        <VStack
          align="stretch"
          spacing={3}
          ml={5}
          flex={1}
        >
          {data.map((item) => (
            <HStack
              key={item.name}
              justify="space-between"
            >
              <HStack spacing={3}>
                <Box
                  w="10px"
                  h="10px"
                  borderRadius="full"
                  bg={item.color}
                />

                <Text
                  color={titleColor}
                  fontSize="13px"
                  minW="12px"
                >
                  {item.value}
                </Text>

                <Text
                  color={legendColor}
                  fontSize="12px"
                >
                  {item.name}
                </Text>
              </HStack>

              <Text
                color={legendColor}
                fontSize="12px"
              >
                {total === 0
                  ? "0%"
                  : `${(
                      (item.value / total) *
                      100
                    ).toFixed(1)}%`}
              </Text>
            </HStack>
          ))}
        </VStack>
      </Flex>
    </Box>
  );
};

export default PCSFleetStatus;