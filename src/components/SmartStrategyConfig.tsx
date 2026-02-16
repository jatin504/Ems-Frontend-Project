// src/components/SmartStrategyConfig.tsx

import { Box, Text, VStack, HStack, Switch, Flex, useBreakpointValue } from "@chakra-ui/react";
import { useState } from "react";

export default function SmartStrategyConfig() {
  const [settings, setSettings] = useState({
    restoreOnGridDrop: true,
    livePowerFlows: true,
    dischargeRampRate1: true,
    dischargeRampRate2: true,
    peakShavingStrategy: true,
    lockSettings: false,
  });

  const toggle = (key: keyof typeof settings) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const direction = useBreakpointValue({ base: "column", md: "row" }); // Responsive layout

  return (
    <Box
      bg="gray.900"
      color="white"
      p={4}
      borderRadius="md"
      overflowX="auto"
      w="100%"
    >
      <Flex direction={direction} gap={6} wrap="wrap">
        {[
          {
            title: "Peak Shaving Strategy",
            content: (
              <>
                <Text>Threshold Load: 800 kW</Text>
                <Text>Discharge Range SOC: 80%</Text>
                <Text>Discharge @ Ramp Rate: 50 kW/s</Text>
                <HStack>
                  <Text>Restore on Grid Drop:</Text>
                  <Switch
                    isChecked={settings.restoreOnGridDrop}
                    onChange={() => toggle("restoreOnGridDrop")}
                    size="sm"
                    colorScheme="teal"
                  />
                </HStack>
              </>
            ),
          },
          {
            title: "SmarCnia Activate",
            content: (
              <>
                <HStack>
                  <Text>Live Power Flows:</Text>
                  <Switch
                    isChecked={settings.livePowerFlows}
                    onChange={() => toggle("livePowerFlows")}
                    size="sm"
                    colorScheme="teal"
                  />
                </HStack>
                <Text>Threshold Load: 800 kW</Text>
                <Text>Discharge Trigger SOC: {'>'}50%</Text>
                <HStack>
                  <Text>Discharge @ Ramp Rate:</Text>
                  <Switch
                    isChecked={settings.dischargeRampRate1}
                    onChange={() => toggle("dischargeRampRate1")}
                    size="sm"
                    colorScheme="teal"
                  />
                </HStack>
              </>
            ),
          },
          {
            title: "Smart Strategy Sets",
            content: (
              <>
                <Text>Threshold Load: 800 kW</Text>
                <Text>Discharge Range SOC: 60%</Text>
                <Text>Discharge @ Ramp Rate: 50 kW/s</Text>
                <HStack>
                  <Text>Resolve on Grid Drop:</Text>
                  <Switch
                    isChecked={settings.restoreOnGridDrop}
                    onChange={() => toggle("restoreOnGridDrop")}
                    size="sm"
                    colorScheme="teal"
                  />
                </HStack>
              </>
            ),
          },
          {
            title: "Smart Strategy Settings",
            content: (
              <>
                <HStack>
                  <Text>Peak Shaving Strategy:</Text>
                  <Switch
                    isChecked={settings.peakShavingStrategy}
                    onChange={() => toggle("peakShavingStrategy")}
                    size="sm"
                    colorScheme="teal"
                  />
                </HStack>
                <Text>Threshold Load: 800 kW</Text>
                <Text>Discharge Trigger SOC: 0%</Text>
                <HStack>
                  <Text>Discharge Ramp Rate:</Text>
                  <Switch
                    isChecked={settings.dischargeRampRate2}
                    onChange={() => toggle("dischargeRampRate2")}
                    size="sm"
                    colorScheme="teal"
                  />
                </HStack>
              </>
            ),
          },
          {
            title: "Access & Audit",
            content: (
              <>
                <Text>User Role: Operator</Text>
                <Text>Last Configured By: Admin</Text>
                <Text>Last Updated: 2025-06-17 22:10</Text>
                <HStack>
                  <Text>Lock Settings:</Text>
                  <Switch
                    isChecked={settings.lockSettings}
                    onChange={() => toggle("lockSettings")}
                    size="sm"
                    colorScheme="red"
                  />
                </HStack>
              </>
            ),
          },
        ].map(({ title, content }, i) => (
          <VStack
            key={i}
            align="start"
            spacing={2}
            minW="220px"
            flex="1"
            bg="gray.800"
            p={4}
            borderRadius="md"
            boxShadow="sm"
          >
            <Text fontWeight="bold" fontSize="md">
              {title}
            </Text>
            {content}
          </VStack>
        ))}
      </Flex>
    </Box>
  );
}
