import {
  Box,
  Flex,
  HStack,
  Text,
  VStack,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import WidgetTitle from "../../../Common/WidgetTitle";

const data = [
  {
    name: "Grid Forming (GFM)",
    value: 11,
    color: "#71C341",
  },
  {
    name: "Grid Following (GFL)",
    value: 1,
    color: "#4F93FF",
  },
  {
    name: "Standby",
    value: 0,
    color: "#A5AAB3",
  },
];

const total = data.reduce((s, i) => s + i.value, 0);

const PCSModeDistribution = () => {
  const bg = useColorModeValue("#FFFFFF", "#0B2239");
  const borderColor = useColorModeValue("rgba(15,23,42,.08)", "rgba(255,255,255,.06)");
  const titleColor = useColorModeValue("#0F172A", "white");
  const textColor = useColorModeValue("#0F172A", "white");
  const mutedColor = useColorModeValue("#64748B", "#AAB6C5");
  const dividerColor = useColorModeValue("rgba(15,23,42,.08)", "rgba(255,255,255,.08)");

  return (
    <Box
      bg={bg}
      borderRadius="10px"
      border={`1px solid ${borderColor}`}
      h="300px"
      overflow="hidden"
    >
      {/* Header */}
      <WidgetTitle color={titleColor} px={4} py={3}>
        PCS Mode Distribution
      </WidgetTitle>

      {/* Chart */}
      <Flex px={3} pb={3}>
        <Box
          w="120px"
          h="120px"
          position="relative"
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Tooltip
                position={{ x: 0, y: -20 }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;

                  const item = payload[0];
                  const name = item?.name ?? "PCS";
                  const value = item?.value ?? 0;

                  return (
                    <Box
                      bg="white"
                      sx={{ color: "#0F172A" }}
                      px={3}
                      py={2}
                      borderRadius="8px"
                      border="1px solid rgba(15,23,42,0.12)"
                      boxShadow="0 8px 20px rgba(15,23,42,0.12)"
                      fontSize="12px"
                    >
                      <Text fontWeight="700" mb={1}>
                        {name}
                      </Text>
                      <Text>
                        {value} PCS
                      </Text>
                    </Box>
                  );
                }}
                cursor={false}
              />
              <Pie
                data={data as any}
                dataKey="value"
                innerRadius={38}
                outerRadius={55}
                paddingAngle={2}
                stroke="none"
                isAnimationActive={false}
              >
                {data.map((item) => (
                  <Cell
                    key={item.name}
                    fill={item.color}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <Flex
            position="absolute"
            inset={0}
            justify="center"
            align="center"
            direction="column"
            pointerEvents="none"
          >
            <Text
              color={textColor}
              fontWeight="700"
              fontSize="30px"
              lineHeight="28px"
            >
              {total}
            </Text>

            <Text
              color={mutedColor}
              fontSize="11px"
            >
              PCS
            </Text>
          </Flex>
        </Box>

        {/* Legend */}
        <VStack
          flex={1}
          align="stretch"
          spacing={3}
          ml={2}
          mt={3}
        >
          {data.map((item) => (
            <HStack
              key={item.name}
              justify="space-between"
            >
              <HStack spacing={2}>
                <Box
                  w="10px"
                  h="10px"
                  borderRadius="full"
                  bg={item.color}
                />

                <Text
                  color={textColor}
                  fontSize="12px"
                  w="16px"
                >
                  {item.value}
                </Text>

                <Text
                  color={mutedColor}
                  fontSize="11px"
                >
                  {item.name}
                </Text>
              </HStack>

              <Text
                color={textColor}
                fontSize="11px"
              >
                {(
                  (item.value / total) *
                  100
                ).toFixed(1)}
                %
              </Text>
            </HStack>
          ))}
        </VStack>
      </Flex>

      <Divider borderColor={dividerColor} />

      {/* Bottom Summary */}
      <Box px={4} py={3}>
        <Text
          color={titleColor}
          fontSize="12px"
          fontWeight="600"
          mb={3}
        >
          DC Bus Summary
        </Text>

        <HStack
          justify="space-between"
          spacing={2}
        >
          <VStack spacing={0} align="start">
            <Text
              color={mutedColor}
              fontSize="9px"
            >
              Avg DC Voltage
            </Text>

            <Text
              color={textColor}
              fontWeight="600"
              fontSize="15px"
            >
              1102.4{" "}
              <Text
                as="span"
                fontSize="11px"
              >
                V
              </Text>
            </Text>
          </VStack>

          <VStack spacing={0} align="start">
            <Text
              color={mutedColor}
              fontSize="9px"
            >
              Max DC Voltage
            </Text>

            <Text
              color={textColor}
              fontWeight="600"
              fontSize="15px"
            >
              1103.2{" "}
              <Text
                as="span"
                fontSize="11px"
              >
                V
              </Text>
            </Text>
          </VStack>

          <VStack spacing={0} align="start">
            <Text
              color={mutedColor}
              fontSize="9px"
            >
              Min DC Voltage
            </Text>

            <Text
              color={textColor}
              fontWeight="600"
              fontSize="15px"
            >
              1101.2{" "}
              <Text
                as="span"
                fontSize="11px"
              >
                V
              </Text>
            </Text>
          </VStack>

          <VStack spacing={0} align="start">
            <Text
              color={mutedColor}
              fontSize="9px"
            >
              Avg DC Current
            </Text>

            <Text
              color={textColor}
              fontWeight="600"
              fontSize="15px"
            >
              842.6{" "}
              <Text
                as="span"
                fontSize="11px"
              >
                A
              </Text>
            </Text>
          </VStack>
        </HStack>
      </Box>
    </Box>
  );
};

export default PCSModeDistribution;