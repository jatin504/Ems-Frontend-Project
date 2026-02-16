import React from "react";
import {
  Box,
  Flex,
  Spacer,
  HStack,
  Button,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDevices } from "../hooks/useDevices";
import DeviceConfigFullScreenForm, {
  type DeviceConfig,
} from "../components/DeviceConfig/DeviceConfigFullScreenForm";
import PlantConfigFullScreenForm, {
  type PlantConfig,
} from "../components/DeviceConfig/PlantConfigFullScreenForm";

export default function ConfigDashboard() {
  const toast = useToast();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isDeviceRoute = pathname.startsWith("/config/device");
  const isListRoute = pathname.startsWith("/config/list");
  const isPlantRoute = pathname.startsWith("/config/plant");

  const { devices, addDevice } = useDevices();

  return (
    <Box
      bg={useColorModeValue("#F4F6F6", "#0E1111")}
      p={3}
      minH="100vh"
    >
      <Flex align="center" mb={4}>
        <Spacer />
        <HStack spacing={3}>
          <Button
            size="sm"
            colorScheme="teal"
            variant={isDeviceRoute ? "solid" : "outline"}
            onClick={() => navigate("/config/device")}
          >
            Device Config
          </Button>

          <Button
            size="sm"
            colorScheme="teal"
            variant={isPlantRoute ? "solid" : "outline"}
            onClick={() => navigate("/config/plant")}
          >
            Plant Config
          </Button>

          <Button
            size="sm"
            colorScheme="teal"
            variant={isListRoute ? "solid" : "outline"}
            onClick={() => navigate("/config/list")}
          >
            Config List
          </Button>
        </HStack>
      </Flex>

      {isDeviceRoute && (
        <DeviceConfigFullScreenForm
          mode="inline"
          devices={devices || []}
          onSubmit={async (device: DeviceConfig[]) => {
            addDevice(device);
            toast({
              title: "Saved device config",
              status: "success",
              position: "top-left",
            });
          }}
        />
      )}

      {isPlantRoute && (
        <PlantConfigFullScreenForm
          mode="inline"
          onSubmit={(plant) => {
            toast({
              title: "Saved plant config",
              status: "success",
              position: "top-left",
            });
          }}
        />
      )}
    </Box>
  );
}
