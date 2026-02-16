import { useState } from "react";
import { Box, Flex, Icon, Text, Button } from "@chakra-ui/react";
import { WarningTwoIcon } from "@chakra-ui/icons"; 

const modes = ["CHARGE", "DISCHARGE", "IDLE"] as const;
type Mode = typeof modes[number];

export default function AlertsCard() {
  const [activeMode, setActiveMode] = useState<Mode>("CHARGE");

  return (
    <Box bg="gray.900" p={4} borderRadius="xl" shadow="md" color="white">
      <Text color="gray.400" fontSize="sm" mb={2}>
        Alerts
      </Text>

      <Flex align="center" justify="space-between" flexWrap="wrap" gap={4}>
        <Flex align="center" color="yellow.400" fontWeight="medium">
          <Icon as={WarningTwoIcon} boxSize={5} mr={2} /> 
          <Text>Battery Temperature High</Text>
        </Flex>

        <Flex gap={2}>
          {modes.map((mode) => (
            <Button
              key={mode}
              onClick={() => setActiveMode(mode)}
              size="sm"
              px={5}
              bg={
                activeMode === mode
                  ? mode === "CHARGE"
                    ? "teal.700"  
                    : "teal.600"
                  : "gray.700"
              }
              _hover={{
                bg:
                  activeMode === mode
                    ? mode === "CHARGE"
                      ? "teal.800"  
                      : "teal.700"
                    : "gray.600",
              }}
              color="white"
            >
              {mode}
            </Button>
          ))}
        </Flex>
      </Flex>
    </Box>
  );
}
