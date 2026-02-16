// layouts/ProtectionRelayLayout.tsx
import { Box, Flex, Text } from "@chakra-ui/react";

export default function ProtectionRelayLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box minH="100vh" bg="#0E1111">
      {/* Header */}
      <Flex
        h="48px"
        bg="linear-gradient(#3A3F46, #1F2429)"
        align="center"
        px={4}
        justify="space-between"
        color="white"
        fontSize="13px"
      >
        <Text fontWeight="bold">
          Protection Relay Monitoring - SAO MAI SOLAR 106 MW
        </Text>
        <Text>
          Substation: 33 kV &nbsp; Feeder-03 &nbsp; Mode: REMOTE &nbsp; 11:50:22 IST
        </Text>
      </Flex>

      {children}
    </Box>
  );
}
