import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Flex,
  HStack,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useLocation, useNavigate } from "react-router-dom";
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

  const { devices, loading } = useDevices();
  const location = useLocation();
  const navigate = useNavigate();
  const incomingBank = (location.state as { currentBank?: string })?.currentBank;
  const [selectedDevice, setSelectedDevice] = useState("");

  const deviceOptions = useMemo(() => {
    console.log("All devices from useDevices:", devices);

    const options = devices
      ? devices
          .filter((device) => /_bank_bank_\d+$/i.test(device.device_id))
          .map((device) => ({
            id: device.device_id,
            label: device.device_id.replace(
              /^plant_\d+_pcs_\d+_/i,
              ""
            ),
          }))
      : [];

    console.log("Filtered bank device options:", options);
    console.log(
      "Device IDs:",
      options.map((option) => option.id)
    );

    return options;
  }, [devices]);

  const rackDevices = useMemo(() => {
    return (
      devices?.filter(
        (device) => device.deviceType === "rack"
      ) || []
    );
  }, [devices]);

  useEffect(() => {
    if (deviceOptions.length === 0) return;

    const bank =
      incomingBank &&
      deviceOptions.some((d) => d.id === incomingBank)
        ? incomingBank
        : deviceOptions[0].id;

    setSelectedDevice((prev) => {
      if (prev === bank) return prev;
      return bank;
    });
  }, [incomingBank, deviceOptions]);

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

      </Flex>

      <Box px="12px" pt="12px">
        <BankTopSummary selectedDevice={selectedDevice} />
      </Box>

      <>
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
              <StringsSummary
                selectedDevice={selectedDevice}
                rackDevices={rackDevices}
                onRackSelect={(rackId) =>
                  navigate("/batteryrackk", {
                    state: { currentRack: rackId },
                  })
                }
              />
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

            <Box w="322px">
              <LimitsRealtime selectedDevice={selectedDevice} />
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

            <Box w="590px">
              <EnvironmentCooling />
            </Box>
          </HStack>
        </Box>
      </>

      
    </Box>
  );
};

export default PCSBankDashboard;