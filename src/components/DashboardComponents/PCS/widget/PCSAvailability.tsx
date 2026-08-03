import WidgetTitle from "../../../Common/WidgetTitle";
import {
  Box,
  Flex,
  HStack,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Bar,
} from "recharts";

const data = [
  { day: "29 May", availability: 99.0, target: 95 },
  { day: "30 May", availability: 98.8, target: 95 },
  { day: "31 May", availability: 99.1, target: 95 },
  { day: "01 Jun", availability: 98.7, target: 95 },
  { day: "02 Jun", availability: 99.4, target: 95 },
  { day: "03 Jun", availability: 98.9, target: 95 },
  { day: "04 Jun", availability: 99.2, target: 95 },
];

const StatCard = ({
  title,
  value,
  mutedColor,
  valueColor,
}: {
  title: string;
  value: string;
  mutedColor: string;
  valueColor: string;
}) => (
  <VStack
    spacing={1}
    align="center"
    flex={1}
  >
    <Text
      color={mutedColor}
      fontSize="9px"
    >
      {title}
    </Text>

    <Text
      color={valueColor}
      fontSize="22px"
      fontWeight="700"
      lineHeight="20px"
    >
      {value}
    </Text>
  </VStack>
);

const PCSAvailability = () => {
  const cardBg = useColorModeValue("#FFFFFF", "#0B2239");
  const borderColor = useColorModeValue("rgba(15,23,42,.08)", "rgba(255,255,255,.06)");
  const titleColor = useColorModeValue("#0F172A", "white");
  const mutedColor = useColorModeValue("#64748B", "#A8B6C5");
  const valueColor = useColorModeValue("#0F172A", "white");
  const gridColor = useColorModeValue("#E2E8F0", "#28445E");
  const axisColor = useColorModeValue("#64748B", "#B8C4D4");
  const legendColor = useColorModeValue("#475569", "#C7D2E0");
  const tooltipBg = useColorModeValue("#FFFFFF", "#10253D");
  const tooltipText = useColorModeValue("#0F172A", "#fff");

  return (
    <Box
      bg={cardBg}
      border={`1px solid ${borderColor}`}
      borderRadius="10px"
      h="300px"
      p={4}
    >
      <WidgetTitle color={titleColor}>
        PCS Availability
      </WidgetTitle>

      {/* Top Stats */}

      <HStack
        mt={4}
        mb={3}
      >
        <StatCard
          title="Today"
          value="99.2 %"
          mutedColor={mutedColor}
          valueColor={valueColor}
        />

        <StatCard
          title="This Month"
          value="98.6 %"
          mutedColor={mutedColor}
          valueColor={valueColor}
        />

        <StatCard
          title="This Year"
          value="97.8 %"
          mutedColor={mutedColor}
          valueColor={valueColor}
        />

        <StatCard
          title="Lifetime"
          value="96.3 %"
          mutedColor={mutedColor}
          valueColor={valueColor}
        />
      </HStack>

      <Box h="165px">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <ComposedChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid
              stroke={gridColor}
              vertical={false}
              strokeDasharray="2 2"
            />

            <XAxis
              dataKey="day"
              tick={{
                fill: axisColor,
                fontSize: 9,
              }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              domain={[0, 100]}
              ticks={[0, 50, 100]}
              tick={{
                fill: axisColor,
                fontSize: 9,
              }}
              tickLine={false}
              axisLine={false}
              width={26}
            />
                        <Tooltip
              contentStyle={{
                background: tooltipBg,
                border: "none",
                borderRadius: 8,
                color: tooltipText,
              }}
            />

            <Bar
              dataKey="availability"
              fill="#7AC943"
              radius={[3, 3, 0, 0]}
              barSize={14}
            />

            <Line
              type="monotone"
              dataKey="target"
              stroke="#7DB8FF"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>

      {/* Legend */}
      <Flex
        justify="center"
        align="center"
        gap={6}
        mt={2}
      >
        <Flex align="center">
          <Box
            w="10px"
            h="10px"
            bg="#7AC943"
            borderRadius="2px"
            mr={2}
          />
          <Text
            color={legendColor}
            fontSize="10px"
          >
            Availability (%)
          </Text>
        </Flex>

        <Flex align="center">
          <Box
            w="18px"
            borderTop="2px dashed #7DB8FF"
            mr={2}
          />
          <Text
            color={legendColor}
            fontSize="10px"
          >
            Target (95%)
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default PCSAvailability;