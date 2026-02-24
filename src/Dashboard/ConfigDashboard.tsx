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
import usePermissions from "../hooks/usePermissions";
import ConfirmPasswordModal from "../components/Common/ConfirmPasswordModal";

import DeviceConfigFullScreenForm, {
  type DeviceConfig,
} from "../components/DeviceConfig/DeviceConfigFullScreenForm";

import PlantConfigFullScreenForm from "../components/DeviceConfig/PlantConfigFullScreenForm";

export default function ConfigDashboard() {
  const toast = useToast();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isDeviceRoute = pathname.startsWith("/config/device");
  const isListRoute = pathname.startsWith("/config/list");
  const isPlantRoute = pathname.startsWith("/config/plant");

  const { devices, addDevice } = useDevices();

  // ---------------- PERMISSIONS ----------------
  const { permissions } = usePermissions();
  const role = (sessionStorage.getItem("role") || "").toLowerCase();

  const myPermission = (permissions || []).find(
    (p: any) => (p.role_name || "").toLowerCase() === role
  );

  const canPlantConfig =
    myPermission?.can_control_plant_config === true;

  const [isPasswordOpen, setIsPasswordOpen] =
    React.useState(false);

  // ---------------- UI ----------------
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
            isDisabled={!canPlantConfig}
            onClick={() => {
              if (!canPlantConfig) return;
              setIsPasswordOpen(true);
            }}
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
          onSubmit={() => {
            toast({
              title: "Saved plant config",
              status: "success",
              position: "top-left",
            });
          }}
        />
      )}

      {/* PASSWORD MODAL */}
      <ConfirmPasswordModal
        isOpen={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
        onConfirm={() => {
          setIsPasswordOpen(false);
          navigate("/config/plant");
        }}
      />
    </Box>
  );
}