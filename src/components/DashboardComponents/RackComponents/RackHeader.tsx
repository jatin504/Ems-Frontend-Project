import React from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Badge,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";

const Item = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  const labelColor = useColorModeValue("#64748B", "#94A3B8");
  const valueColor = useColorModeValue("#1E293B", "#F8FAFC");

  return (
    <VStack align="start" spacing={0}>
      <Text fontSize="10px" color={labelColor}>
        {label}
      </Text>

      <Text
        fontSize="13px"
        fontWeight="600"
        color={valueColor}
      >
        {value}
      </Text>
    </VStack>
  );
};

export default function RackHeader() {
  const bg = useColorModeValue("#ffffff", "#111827");
  const border = useColorModeValue("#E2E8F0", "#1E293B");
  const title = useColorModeValue("#1E293B", "#F8FAFC");
  const divider = useColorModeValue("#E2E8F0", "#334155");

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="10px"
      px={6}
      py={3}
      mb={0}
      boxShadow="sm"
    >
      <HStack spacing={5} w="100%">

        <HStack spacing={3}>
          <Text
            fontSize="24px"
            fontWeight="700"
            color={title}
          >
            Rack-03
          </Text>

          <Badge
            colorScheme="green"
            borderRadius="full"
            px={3}
            py={1}
          >
            Healthy
          </Badge>
        </HStack>

        <Divider orientation="vertical" h="36px" borderColor={divider} />

        <Item label="Bank Name" value="PCS-2 Bank 1" />

        <Divider orientation="vertical" h="36px" borderColor={divider} />

        <Item label="Rack ID" value="Rack-03" />

        <Divider orientation="vertical" h="36px" borderColor={divider} />

        <Item label="Rated Energy" value="215.04 kWh" />

        <Divider orientation="vertical" h="36px" borderColor={divider} />

        <Item label="Rated Voltage" value="768 V" />

        <Divider orientation="vertical" h="36px" borderColor={divider} />

        <Item label="Total Modules" value="LFP-280Ah 10" />

        <Divider orientation="vertical" h="36px" borderColor={divider} />

        <Item label="Firmware" value="10" />

        <Divider orientation="vertical" h="36px" borderColor={divider} />

        <Item label="Last Update" value="V1.8.2" />

      </HStack>
    </Box>
  );
}
