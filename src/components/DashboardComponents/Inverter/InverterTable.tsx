// components/InverterTable.jsx
import React from "react";
import { Box, Flex, Text, Table, Thead, Tbody, Tr, Th, Td, Spacer, Flex as CFlex } from "@chakra-ui/react";
import MiniBar from "./MiniBar";

interface InverterData {
  name: string;
  status: string;
  dcPower: number | string;
  acPower: number | string;
  performancePct: number | string;
  yieldToday: number | string;
  lifetime: number | string;
  group?: string;
}

type InverterTableProps = {
  title?: string;
  data?: InverterData[];
};

export default function InverterTable({ title = "Inverters", data = [] }: InverterTableProps) {
  // Only show inverters from group A
  const filteredData = data.filter((inv) => !inv.group || inv.group === 'A');
  return (
    <Box bg="white" rounded="md" shadow="sm" overflow="hidden" border="1px solid" borderColor="gray.200">
      <Flex align="center" bg="#e9f2fb" px={3} py={2} borderBottom="1px solid" borderColor="gray.200">
        <Text fontWeight="bold" fontSize="sm">{title}</Text>
        <Box ml={4} fontSize="12px" color="gray.700">EVN Setpoint - P:42000.0 kW &nbsp; Q: 0.000 Val kVar</Box>
        <Spacer />
        <Box fontSize="12px" color="gray.600" mr={3}>Inverters setpoint - P:42000kW &nbsp; Q:0.000kVar</Box>
        <Box bg="white" px={3} py={1} border="1px solid" borderColor="gray.300" borderRadius="4px" fontSize="12px">Analysis</Box>
      </Flex>

      <Box px={3} py={2} bg="#fbfcfd">
        <Table variant="simple" size="sm" sx={{ tableLayout: "fixed" }}>
          <Thead>
            <Tr>
              <Th fontSize="12px" width="180px">Inverter</Th>
              <Th fontSize="12px" width="60px">Status</Th>
              <Th fontSize="12px" width="60px">Alarm</Th>
              <Th fontSize="12px" width="120px">PR Actual/Estimation</Th>
              <Th fontSize="12px" width="130px">DC Power</Th>
              <Th fontSize="12px" width="130px">AC Power</Th>
              <Th fontSize="12px" width="90px">'Q' KVAR</Th>
              <Th fontSize="12px" width="110px">Setpoint (P/Q)</Th>
              <Th fontSize="12px" width="110px">Sp.Power (kW/kWp)</Th>
              <Th fontSize="12px" width="110px">Yield Today</Th>
              <Th fontSize="12px" width="110px">Yield Lifetime</Th>
            </Tr>
          </Thead>
        </Table>
      </Box>

      <Box maxH="320px" overflowY="auto">
        <Table variant="simple" size="sm" sx={{ tableLayout: "fixed" }}>
          <Tbody>
            {filteredData.map((inv, idx) => (
              <Tr key={idx} _hover={{ bg: "gray.50" }}>
                <Td fontSize="13px" width="180px" py={2}>
                  <Text color="#1f6feb" fontWeight="semibold">{inv.name}</Text>
                </Td>

                <Td width="60px" py={2}>
                  <Box w="8px" h="8px" rounded="full" bg={inv.status === "ok" ? "green.400" : inv.status === "warn" ? "yellow.400" : "red.400"} />
                </Td>

                <Td width="60px" py={2}>
                  <Text fontSize="14px" color={idx % 4 === 0 ? "red.500" : "green.400"}>{idx % 4 === 0 ? "!" : "✓"}</Text>
                </Td>

                <Td width="120px" py={2}>
                  <Box fontSize="11px" color="gray.600">0.000 % / 0.000 %</Box>
                  <MiniBar value={0.03} />
                </Td>

                <Td width="130px" py={2}>
                  <CFlex direction="column">
                    <MiniBar value={(Number(inv.dcPower) - 2000) / 600} max={1} />
                    <Text fontSize="12px" color="gray.700" mt={1}>{inv.dcPower} kW</Text>
                  </CFlex>
                </Td>

                <Td width="130px" py={2}>
                  <CFlex direction="column">
                    <MiniBar value={(Number(inv.acPower) - 2000) / 600} max={1} />
                    <Text fontSize="12px" color="gray.700" mt={1}>{inv.acPower} kW</Text>
                  </CFlex>
                </Td>

                <Td width="90px" py={2}>
                  <Text fontSize="12px" color="gray.700">-5.00 KVAR</Text>
                </Td>

                <Td width="110px" py={2}>
                  <Text fontSize="12px" color="gray.700">0.00 kW / -5.0 kVAR</Text>
                </Td>

                <Td width="110px" py={2}>
                  <CFlex direction="column">
                    <MiniBar value={Number(inv.performancePct)} max={1} />
                    <Text fontSize="12px" color="gray.700" mt={1}>{inv.performancePct}</Text>
                  </CFlex>
                </Td>

                <Td width="110px" py={2}>
                  <CFlex direction="column">
                    <MiniBar value={Math.min(1, Number(inv.yieldToday) / 20)} max={1} />
                    <Text fontSize="12px" color="gray.700" mt={1}>{inv.yieldToday} MWh</Text>
                  </CFlex>
                </Td>

                <Td width="110px" py={2}>
                  <Text fontSize="12px" color="gray.700">{inv.lifetime} MWh</Text>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
