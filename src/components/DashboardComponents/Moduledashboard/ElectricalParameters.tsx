import React from "react";
import {
  Box,
  Divider,
  Flex,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

export default function ElectricalParameters() {
  const bg = useColorModeValue(
    "linear-gradient(180deg,#F8FAFC 0%,#EAF4FF 100%)",
    "linear-gradient(180deg,#102537 0%,#0C1C2A 100%)"
  );

  const border = useColorModeValue("#D1E3F5", "#183448");
  const title = useColorModeValue("#0F172A", "#F8FAFC");
  const label = useColorModeValue("#64748B", "#AAB7C5");
  const value = useColorModeValue("#0F172A", "#FFFFFF");

  const row = (
    name: string,
    val: string
  ) => (
    <>
      <Flex
        justify="space-between"
        align="center"
        py="8px"
      >
        <Text
          color={label}
          fontSize="13px"
        >
          {name}
        </Text>

        <Text
          color={value}
          fontSize="13px"
          fontWeight="700"
          textAlign="right"
        >
          {val}
        </Text>
      </Flex>

      <Divider borderColor={border} />
    </>
  );

  return (
    <Box
      w="300px"
      h="650px"
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="12px"
      overflow="hidden"
      p="16px"
      boxShadow="0 6px 16px rgba(0,0,0,0.08)"
    >
      <Text
        fontSize="18px"
        fontWeight="700"
        color={title}
        mb="12px"
      >
        Electrical Parameters
      </Text>

      <Flex
        justify="space-between"
        mb="8px"
      >
        <Text
          color={label}
          fontSize="12px"
          fontWeight="600"
        >
          Parameter
        </Text>

        <Text
          color={label}
          fontSize="12px"
          fontWeight="600"
        >
          Value
        </Text>
      </Flex>

      <Divider borderColor={border} mb="4px" />

      <VStack
        spacing={0}
        align="stretch"
      >
        {row("Module Voltage", "76.79 V")}

        {row("Module Current", "149.20 A")}

        {row("Module Power", "11.47 kW")}

        {row("SOC", "78.50 %")}

        {row("SOE", "72.10 % (15.25 kWh)")}

        {row("SOH", "96.35 %")}
                {row("Cell Voltage Max", "3.365 V (Cell 23)")}

        {row("Cell Voltage Min", "3.347 V (Cell 12)")}

        {row("Cell Voltage Avg", "3.356 V")}

        {row("Cell Voltage Delta", "18 mV")}

        {row("Insulation Resistance", "> 1000 MΩ")}

        {row("Internal Resistance Avg", "0.28 mΩ")}
      </VStack>
    </Box>
  );
}