import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Flex,
  HStack,
  Text,
  Switch,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useLocation } from "react-router-dom";
import { useDevices } from "../../hooks/useDevices";

import BankTopSummary from "../../components/DashboardComponents/PCSBankComponents/BankTopSummary";
import BankHealthSummary from "../../components/DashboardComponents/PCSBankComponents/BankHealthSummary";
import Powergraph from "../../components/DashboardComponents/PCSBankComponents/Powergraph";
import LimitsRealtime from "../../components/DashboardComponents/PCSBankComponents/LimitsRealtime";
import PowerEnergyTrend from "../../components/DashboardComponents/PCSBankComponents/PowerEnergyTrend";
import BankStatus from "../../components/DashboardComponents/PCSBankComponents/BankStatus";
import StringsSummary from "../../components/DashboardComponents/PCSBankComponents/StringsSummary";
import EnvironmentCooling from "../../components/DashboardComponents/PCSBankComponents/EnvironmentCooling";
import BatteryHealthOverview from "../../components/DashboardComponents/PCSBankComponents/BatteryHealthOverview";
import VoltageCurrentGraph from "../../components/DashboardComponents/PCSBankComponents/voltageCurrentgraph";
import SocGraph from "../../components/DashboardComponents/PCSBankComponents/socgraph";

const PCSBankDashboard: React.FC = () => {
  const bg = useColorModeValue("#f4f7fb", "#0b0f14");
  const headerBg = useColorModeValue("#ffffff", "#061727");
  const headerBorder = useColorModeValue(
    "1px solid #E2E8F0",
    "1px solid #17334c"
  );
  const titleColor = useColorModeValue("#1A202C", "white");
  const infoColor = useColorModeValue("#4A5568", "#D4DDE6");
  const textColor = useColorModeValue("#1A202C", "white");
  const dividerColor = useColorModeValue("#CBD5E0", "#35506A");

  const { devices, loading } = useDevices();
  const location = useLocation();
  const incomingBank = (location.state as { currentBank?: string })?.currentBank;
  const [selectedDevice, setSelectedDevice] = useState("");

  const deviceOptions = useMemo(
    () =>
      devices
        ? devices
            .filter(
              (device) =>
                device.deviceType === "bank" &&
                /^plant_1_pcs_\d+_bank_bank_\d+$/.test(device.device_id)
            )
            .map((device) => ({
              id: device.device_id,
              label: device.device_id,
            }))
        : [],
    [devices]
  );

  useEffect(() => {
    if (deviceOptions.length === 0) return;

    if (
      incomingBank &&
      deviceOptions.some((d) => d.id === incomingBank)
    ) {
      setSelectedDevice(incomingBank);
    } else {
      setSelectedDevice(deviceOptions[0].id);
    }
  }, [incomingBank, deviceOptions, location.key]);

  return (
    <Box w="100%" minH="100vh" bg={bg}>
      {/* Header */}
      <Flex
        h="38px"
        bg={headerBg}
        px="14px"
        align="center"
        justify="space-between"
        borderBottom={headerBorder}
      >
        <HStack spacing="10px">
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              w="200px"
              h="30px"
              px={2}
              fontSize="11px"
              fontWeight="400"
              textAlign="left"
              justifyContent="space-between"
              bg={useColorModeValue("#F8FAFC", "#102133")}
              border="1px solid"
              borderColor={useColorModeValue("#D7E2EC", "#23435C")}
            >
              {selectedDevice || "Select Bank"}
            </MenuButton>

            <Portal>
              <MenuList
                minW="unset"
                w="200px"
                maxW="200px"
                maxH="160px"
                overflowY="auto"
                p={0}
                zIndex={9999}
              >
                {loading ? (
                  <MenuItem isDisabled>Loading devices...</MenuItem>
                ) : (
                  deviceOptions.map((option) => (
                    <MenuItem
                      key={option.id}
                      onClick={() => setSelectedDevice(option.id)}
                      h="26px"
                      px={2}
                      fontSize="11px"
                    >
                      {option.label}
                    </MenuItem>
                  ))
                )}
              </MenuList>
            </Portal>
          </Menu>

          <HStack
            h="30px"
            px="12px"
            spacing="6px"
            borderRadius="8px"
            bg={useColorModeValue("#ECFDF3", "#163820")}
            border="1px solid #2D9D50"
          >
            <Flex
              w="16px"
              h="16px"
              borderRadius="full"
              bg="#2EAF55"
              align="center"
              justify="center"
            >
              <Box
                w="6px"
                h="6px"
                borderRadius="full"
                bg="white"
              />
            </Flex>

            <Text
              fontSize="13px"
              fontWeight="600"
              color={titleColor}
            >
              Healthy
            </Text>
          </HStack>
        </HStack>

        <HStack spacing="10px">
          <Text color={infoColor} fontSize="13px">
            Auto Refresh
          </Text>

          <Switch
            size="sm"
            colorScheme="green"
            defaultChecked
          />

          <Text
            color={textColor}
            fontSize="13px"
            fontWeight="600"
          >
            ON
          </Text>

          <Box
            w="1px"
            h="16px"
            bg={dividerColor}
          />

          <Text color={infoColor} fontSize="13px">
            Last Update:
          </Text>

          <Text
            color={textColor}
            fontSize="13px"
            fontWeight="500"
          >
            11:28:40
          </Text>

          <Text
            color={textColor}
            fontSize="16px"
            cursor="pointer"
          >
            ⛶
          </Text>
        </HStack>
      </Flex>

      {/* Top Summary */}
      <Box px="12px" pt="12px">
        <BankTopSummary selectedDevice={selectedDevice} />
      </Box>

      {/* First Row */}
      <Box px="12px" mt="12px">
        <HStack
          spacing="16px"
          align="stretch"
          w="1896px"
        >
          <Box w="430px" mt="-20px">
            <BankHealthSummary selectedDevice={selectedDevice} />
          </Box>

          <Box w="525px">
            <BatteryHealthOverview selectedDevice={selectedDevice} />
          </Box>

          <Box w="880px">
            <StringsSummary selectedDevice={selectedDevice} />
          </Box>
        </HStack>
      </Box>

      {/* Second Row */}
      <Box px="12px" mt="16px">
        <HStack
          spacing="16px"
          align="stretch"
          w="1896px"
        >
          <Box w="662px" mt="-20px">
            <Powergraph selectedDevice={selectedDevice} />
          </Box>

          <Box w="522px" mt="-18px" ml="-26px">
            <PowerEnergyTrend selectedDevice={selectedDevice} />
          </Box>

          <Box w="342px">
            <BankStatus />
          </Box>

          <Box w="312px">
            <LimitsRealtime />
          </Box>
        </HStack>
      </Box>

      {/* Third Row */}
      <Box px="12px" mt="16px">
        <HStack spacing="16px" align="stretch" w="1896px">
          <Box w="620px" mt="-16px">
            <SocGraph selectedDevice={selectedDevice} />
          </Box>

          <Box w="620px" mt="-16px">
            <VoltageCurrentGraph selectedDevice={selectedDevice} />
          </Box>

          <Box w="620px">
            <EnvironmentCooling />
          </Box>
        </HStack>
      </Box>

      {/* Remaining Dashboard */}
      <Box p="12px">
        {/* Next widgets */}
      </Box>
    </Box>
  );
};

export default PCSBankDashboard;