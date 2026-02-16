import React, { useState } from "react";
import { Box, Button, HStack, Text, Divider, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Spacer, useColorModeValue } from "@chakra-ui/react";
import BESSDeviceConfigPanel from "./BESSDeviceConfigPanel";
import GeneralDeviceConfigPanel from "./GeneralDeviceConfigPanel";

export default function DeviceConfigFullScreenForm({
  isOpen,
  onClose,
  devices,
  onSubmit,
  mode = "inline",
}: {
  isOpen?: boolean;
  onClose?: () => void;
  devices: any[]; // Adjust type as needed
  onSubmit?: (devices: any[]) => Promise<void>;
  mode?: "inline" | "drawer";
}) {
  const [activeTab, setActiveTab] = useState<"general" | "bess">("general");

  const isBess = activeTab === "bess";

  const primaryBg = useColorModeValue("primary.light", "primary.dark");
  const primaryColor = useColorModeValue("primaryText.light", "primaryText.dark");
  const secondaryColor = useColorModeValue("secondaryText.light", "secondaryText.dark");

  // Header with Tabs
  const Header = (
    <Box bg={useColorModeValue("#F4F6F6", "#0E1111")} borderBottomWidth="1px" bg={useColorModeValue("#F4F6F6", "#0E1111")} width={"full"} px={6} py={4} >
      <Flex align="center" justifyContent={"space-between"} width={"100%"}>
        <Box>
          <Text fontSize="xl" fontWeight="bold">
            Device Configuration
          </Text>
        </Box>

        <HStack spacing={1} ml={4} p={1} borderRadius="md" display="inline-flex">
          <Button
            size="sm"
            colorScheme={activeTab === "general" ? "green" : "white"}
            bg={activeTab === "general" ? "green.500" : "gray.600"}
            _hover={{ bg: activeTab === "general" ? "green.600" : "gray.500" }}
            onClick={() => setActiveTab("general")}
            fontWeight={activeTab === "general" ? "bold" : "normal"}
            px={4}
          >
            General
          </Button>
          <Button
            size="sm"
            colorScheme={activeTab === "bess" ? "green" : "white"}
            bg={activeTab === "bess" ? "green.500" : "gray.600"}
            _hover={{ bg: activeTab === "bess" ? "green.600" : "gray.500" }}
            onClick={() => setActiveTab("bess")}
            fontWeight={activeTab === "bess" ? "bold" : "normal"}
            px={4}
          >
            BESS
          </Button>
        </HStack>

      </Flex>
    </Box>
  );

  // Body - Conditional Render
  const Body = (
    <Box color={primaryColor} minH="calc(100vh - 60px)">
      {isBess ? (
        <BESSDeviceConfigPanel devices={devices} onSubmit={onSubmit} />
      ) : (
        <GeneralDeviceConfigPanel devices={devices} onSubmit={onSubmit} />
      )}
    </Box>
  );

  const Content = (
    <>
      {Header}
      {Body}
    </>
  );

  if (mode === "inline") {
    return <Box color={primaryColor} borderWidth="1px" rounded="xl" overflow="hidden">{Content}</Box>;
  }

  return (
    <Drawer isOpen={!!isOpen} placement="right" onClose={onClose ?? (() => { })} size="full">
      <DrawerOverlay />
      <DrawerContent color={primaryColor} width={"90vw"}>
        <DrawerHeader py={0} px={0} borderBottom="none" width={"100%"}>
          {Header}
        </DrawerHeader>
        <DrawerBody bg={useColorModeValue("#F4F6F6", "#0E1111")} px={0} py={0}>
          {Body}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}