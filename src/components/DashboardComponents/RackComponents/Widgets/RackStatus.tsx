import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";

const Dot = ({ color }: { color: string }) => (
  <Box w="10px" h="10px" borderRadius="full" bg={color} />
);



export default function RackStatus() {
  const cardBg = useColorModeValue("#ffffff", "#161B1B");
  const cardBorder = useColorModeValue("#e5e7eb", "#1c2635");
  const headingColor = useColorModeValue("#0f172a", "#ffffff");
  const labelColor = useColorModeValue("#475569", "#A7B0BA");

  return (
    <Box
      w="380px"
      h="535.5825px"
      bg={cardBg}
      border={`1px solid ${cardBorder}`}
      borderRadius="12px"
      p="16px"
      display="flex"
      flexDirection="column"
      gap="20px"
    >
      <Text fontSize="14px" fontWeight="600" color={headingColor}>
        Status
      </Text>

      <Flex gap="20px" align="flex-start">
        {[
          ["Comm error", "Temp. alarm", "Temp. warning", "Charge alarm", "Charge warning", "Fan error", "Discharge alarm", "Discharge warning", "Volt alarm", "Volt warning", "SoC Min alarm", "SoC Min warning"],
          ["SoC Max alarm", "SoC Max warning", "Voltage warning", "Temp alarm", "Contactor error", "Ground fault", "Door error", "Reserved 1", "Other warning", "Reserved 2", "Config alarm", "Config warning"],
        ].map((col, i) => (
          <Flex key={i} direction="column" gap="20px">
            {col.map((label) => (
              <Flex key={label} align="center" gap="10px">
                <Dot color="#6DD17C" />
                <Text fontSize="14px" color={labelColor}>
                  {label}
                </Text>
              </Flex>
            ))}
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}
