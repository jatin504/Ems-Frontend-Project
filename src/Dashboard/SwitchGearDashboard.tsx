import {
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

import SwitchGearTabs from "../components/DashboardComponents/SwitchGearDashboard/SwitchGearTabs";

export default function SwitchGearDashboard() {
  const bg = useColorModeValue("#F4F6F6", "#0E1111");

  return (
    <Box bg={bg} minH="100vh" p="20px">
      {/* CONTENT */}
      <SwitchGearTabs />
    </Box>
  );
}