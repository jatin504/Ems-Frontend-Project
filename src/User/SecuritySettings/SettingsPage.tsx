import { Box, Heading, HStack, Button, Spacer, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import ChangePasswordPanel from "./ChangePasswordPanel";
import PolicyPanel from "./PolicyPanel";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<"policy" | "change">("policy");

  // Colors adapt based on color mode
  const pageBg = useColorModeValue("gray.50", "gray.900");
  const pageColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const headerColor = useColorModeValue("gray.700", "gray.200");

  return (
    <Box bg={pageBg} color={pageColor} minH="100vh" p={{ base: 4, md: 6 }}>
      {/* Header without theme toggle */}
      <HStack mb={6}>
        <Heading size="lg" color={headerColor}>
          Security Settings
        </Heading>
        <Spacer />
      </HStack>

      {/* Top buttons to switch sections */}
      <HStack mb={6} spacing={4}>
        <Button
          colorScheme={activeSection === "policy" ? "blue" : "gray"}
          onClick={() => setActiveSection("policy")}
        >
          Password &amp; Security Policy
        </Button>
        <Button
          colorScheme={activeSection === "change" ? "blue" : "gray"}
          onClick={() => setActiveSection("change")}
        >
          Change Password
        </Button>
      </HStack>

      {activeSection === "policy" && <PolicyPanel />}
      {activeSection === "change" && <ChangePasswordPanel />}
    </Box>
  );
}
