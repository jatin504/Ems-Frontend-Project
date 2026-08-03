import React, { useEffect } from "react";
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import useTimeseriesData from "../../../hooks/useTimeseriesData";

import {
  BatteryCharging,
  Activity,
  BatteryFull,
  Shield,
  HeartPulse,
  Zap,
  Gauge,
  CircleCheck,
} from "lucide-react";

type SummaryCardProps = {
  title: string;
  value: string;
  unit?: string;
  icon: any;
  color: string;
  status?: boolean;
};

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  unit,
  icon,
  color,
  status,
}) => {
  const cardBg = useColorModeValue("#F8FAFC", "#111827");
  const border = useColorModeValue("#D9E2EC", "#243244");
  const titleColor = useColorModeValue("#64748B", "#A8B3C2");
  const valueColor = useColorModeValue("#0F172A", "#FFFFFF");

  return (
    <Flex
      flex="1"
      minW="145px"
      h="78px"
      px="14px"
      align="center"
      bg={cardBg}
      border="1px solid"
      borderColor={border}
      borderRadius="10px"
      gap="12px"
    >
      <Flex
        w="36px"
        h="36px"
        borderRadius="full"
        border="2px solid"
        borderColor={color}
        align="center"
        justify="center"
        flexShrink={0}
      >
        <Icon
          as={icon}
          boxSize="18px"
          color={color}
        />
      </Flex>

      <VStack
        align="start"
        spacing={0}
        flex="1"
      >
        <Text
          fontSize="12px"
          color={titleColor}
          fontWeight="500"
        >
          {title}
        </Text>

        {status ? (
          <Text
            fontSize="20px"
            fontWeight="700"
            color={color}
            lineHeight="22px"
          >
            {value}
          </Text>
        ) : (
          <HStack spacing="4px" align="baseline">
            <Text
              fontSize="24px"
              fontWeight="700"
              color={valueColor}
              lineHeight="24px"
            >
              {value}
            </Text>

            {unit && (
              <Text
                fontSize="14px"
                color={valueColor}
                fontWeight="600"
              >
                {unit}
              </Text>
            )}
          </HStack>
        )}
      </VStack>
    </Flex>
  );
};

interface Props {
  selectedDevice: string;
}

const BankTopSummary: React.FC<Props> = ({ selectedDevice }) => {
  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    if (!selectedDevice) return;

    fetchData({
      devices: {
        patterns: [],
        ids: [selectedDevice],
      },
      keys: [
        { key: "phase_a_voltage", alias: "BankVoltage", keyType: "common" },
        { key: "dc_bus_current", alias: "BankCurrent", keyType: "common" },
        { key: "bcu_1_soc", alias: "SOC", keyType: "common" },
        { key: "bcu_1_soe", alias: "SOE", keyType: "common" },
        { key: "bcu_1_soh", alias: "SOH", keyType: "common" },
        { key: "energy_charged_today", alias: "AvailableEnergy", keyType: "common" },
        { key: "active_power", alias: "BankPower", keyType: "common" },
        { key: "", alias: "Status", keyType: "common" },
      ],
      aggregation: {
        func: "last",
        interval: 1,
        intervalType: "minute",
      },
      timeRange: {
        type: "relative",
        relativeType: "currentDaySoFar",
      },
      orderBy: "ASC",
    } as any);
  }, [selectedDevice]);

  const deviceData = (data as any)?.[selectedDevice];

  const latest = (alias: string) =>
    String(
      deviceData?.[alias]?.[(deviceData?.[alias]?.length || 1) - 1]?.value ?? "--"
    );

  const powerValue = Number(latest("BankPower"));
  const statusValue = Number.isFinite(powerValue) && powerValue > 0 ? "Normal" : "Offline";

  return (
    <Box>
      <Flex gap="10px" wrap="nowrap">
                <SummaryCard
          title="Bank Voltage"
          value={latest("BankVoltage")}
          unit="V"
          icon={BatteryCharging}
          color="#62D01E"
        />

        <SummaryCard
          title="Bank Current"
          value={latest("BankCurrent")}
          unit="A"
          icon={Activity}
          color="#2F80ED"
        />

        <SummaryCard
          title="SOC"
          value={latest("SOC")}
          unit="%"
          icon={BatteryFull}
          color="#84CC16"
        />

        <SummaryCard
          title="SOE"
          value={latest("SOE")}
          unit="%"
          icon={Shield}
          color="#C084FC"
        />

        <SummaryCard
          title="SOH"
          value={latest("SOH")}
          unit="%"
          icon={HeartPulse}
          color="#4ADE80"
        />

        <SummaryCard
          title="Available Energy"
          value={latest("AvailableEnergy")}
          unit="kWh"
          icon={Zap}
          color="#F59E0B"
        />

        <SummaryCard
          title="Bank Power"
          value={latest("BankPower")}
          unit="kW"
          icon={Gauge}
          color="#06B6D4"
        />

        <SummaryCard
          title="Status"
          value={statusValue}
          icon={CircleCheck}
          color="#5AC53B"
          status
        />
      </Flex>
    </Box>
  );
};

export default BankTopSummary;
      