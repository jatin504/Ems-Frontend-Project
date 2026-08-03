import React from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  FaBolt,
  FaBatteryThreeQuarters,
  FaLeaf,
  FaCheckCircle,
} from "react-icons/fa";

import {
  MdElectricBolt,
  MdOutlinePower,
} from "react-icons/md";

import {
  BsLightningCharge,
} from "react-icons/bs";

import {
  GiBatteryPack,
} from "react-icons/gi";

interface CardProps {
  icon: any;
  iconColor: string;
  title: string;
  value: string;
  unit?: string;
}

const SummaryCard = ({
  icon,
  iconColor,
  title,
  value,
  unit,
}: CardProps) => {
  const bg = useColorModeValue("#ffffff", "#0F172A");
  const border = useColorModeValue("#E2E8F0", "#233244");
  const titleColor = useColorModeValue("#64748B", "#94A3B8");
  const valueColor = useColorModeValue("#1E293B", "#F8FAFC");

  return (
    <Box
      flex="1"
      h="76px"
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="10px"
      px={4}
      display="flex"
      alignItems="center"
    >
      <HStack spacing={3} w="100%">
        <Box
          w="38px"
          h="38px"
          borderRadius="full"
          border="1px solid"
          borderColor={iconColor}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon
            as={icon}
            color={iconColor}
            boxSize={4}
          />
        </Box>

        <VStack
          spacing={0}
          align="start"
        >
          <Text
            fontSize="11px"
            color={titleColor}
          >
            {title}
          </Text>

          <Text
            fontSize="18px"
            fontWeight="700"
            color={valueColor}
            lineHeight="20px"
          >
            {value}
            {unit && (
              <Text
                as="span"
                ml={1}
                fontSize="13px"
                fontWeight="500"
              >
                {unit}
              </Text>
            )}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

export default function RackSummary() {
  return (
    <HStack spacing={4} mb={5}>
      <SummaryCard
        icon={FaBolt}
        iconColor="#22C55E"
        title="Rack Voltage"
        value="768.32"
        unit="V"
      />

      <SummaryCard
        icon={MdElectricBolt}
        iconColor="#38BDF8"
        title="Rack Current"
        value="149.43"
        unit="A"
      />

      <SummaryCard
        icon={FaBatteryThreeQuarters}
        iconColor="#84CC16"
        title="SOC"
        value="78.50"
        unit="%"
      />

      <SummaryCard
        icon={GiBatteryPack}
        iconColor="#A855F7"
        title="SOE"
        value="72.10"
        unit="%"
      />
            <SummaryCard
        icon={FaLeaf}
        iconColor="#22C55E"
        title="SOH"
        value="96.35"
        unit="%"
      />

      <SummaryCard
        icon={BsLightningCharge}
        iconColor="#F59E0B"
        title="Available Energy"
        value="155.25"
        unit="kWh"
      />

      <SummaryCard
        icon={MdOutlinePower}
        iconColor="#06B6D4"
        title="Rack Power"
        value="114.80"
        unit="kW"
      />

      <SummaryCard
        icon={FaCheckCircle}
        iconColor="#22C55E"
        title="Status"
        value="Normal"
      />
    </HStack>
  );
}