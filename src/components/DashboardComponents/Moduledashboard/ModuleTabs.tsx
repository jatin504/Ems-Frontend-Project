import React from "react";
import {
  Box,
  HStack,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  SettingsIcon,
  WarningIcon,
} from "@chakra-ui/icons";

import {
  MdOutlineAssignment,
  MdOutlineAnalytics,
  MdOutlineBatteryChargingFull,
} from "react-icons/md";

import { TbTemperature } from "react-icons/tb";
import { GiHealthNormal } from "react-icons/gi";

interface Props {
  activeTab: string;
  onChange: (tab: string) => void;
  rightContent?: React.ReactNode;
}

const tabs = [
  {
    id: "details",
    title: "Module Details",
    icon: MdOutlineAssignment,
  },
  {
    id: "analytics",
    title: "Cell Analytics",
    icon: MdOutlineAnalytics,
  },
  {
    id: "voltages",
    title: "Voltages",
    icon: MdOutlineBatteryChargingFull,
  },
  {
    id: "temperatures",
    title: "Temperatures",
    icon: TbTemperature,
  },
  {
    id: "alarms",
    title: "Alarms & Events",
    icon: WarningIcon,
  },
  {
    id: "health",
    title: "Lifetime & Health",
    icon: GiHealthNormal,
  },
  {
    id: "settings",
    title: "Settings",
    icon: SettingsIcon,
  },
];

export default function ModuleTabs({
  activeTab,
  onChange,
  rightContent,
}: Props) {
  const bg = useColorModeValue("#F8FAFC", "#071A2B");
  const borderColor = useColorModeValue("#CBD5E1", "#0D2D45");

  return (
    <Box
      w="100%"
      h="42px"
      bg={bg}
      borderRadius="0"
      border={`1px solid ${borderColor}`}
      overflowX="auto"
      whiteSpace="nowrap"
    >
      <HStack spacing={0} h="100%" align="center" px={2}>
        <HStack spacing={0} h="100%" flex={1} overflowX="auto">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;

            return (
              <HStack
                key={tab.id}
                h="100%"
                px="18px"
                spacing="8px"
                cursor="pointer"
                bg={active ? "#0B4D87" : "transparent"}
                borderBottom={
                  active
                    ? "2px solid #4BB3FF"
                    : "2px solid transparent"
                }
                borderRight="1px solid #0D2D45"
                transition=".2s"
                _hover={{
                  bg: active ? "#0B4D87" : useColorModeValue("#E2E8F0", "#0A2438"),
                }}
                onClick={() => onChange(tab.id)}
              >
                <Icon
                  as={tab.icon}
                  boxSize="15px"
                  color={active ? "#FFFFFF" : useColorModeValue("#1E293B", "#C9D4DF")}
                />

                <Text
                  fontSize="14px"
                  fontWeight={500}
                  color={active ? "#FFFFFF" : useColorModeValue("#1E293B", "#C9D4DF")}
                >
                  {tab.title}
                </Text>
              </HStack>
            );
          })}
        </HStack>

        {/** right-side content */}
        {rightContent && (
          <Box ml="auto">
            {rightContent}
          </Box>
        )}
      </HStack>
    </Box>
  );
}