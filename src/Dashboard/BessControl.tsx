import { Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BessOverview from "../components/BessOverview";
import BessWidget from "../components/BessWidget";
import BatterySettings from "../components/BatterySettings";
import AnalyticsChart from "../components/AnalyticsChart";
import BarComparisonChart from "../components/BarComparisonChart";
import ManualOverridePanel from "../components/ManualOverridePanel";
import ScheduledCommandPanel from "../components/ScheduledCommandPanel";
import SmartStrategyConfig from "../components/SmartStrategyConfig";
import InverterWidgetDemo from "../components/InverterWidgets"; // <-- NEW

export default function BessControl() {
  const navigate = useNavigate();

  // Live date-time for the right side of the top bar
  const [dateTime, setDateTime] = useState(
    new Date().toLocaleString("en-GB", { hour12: false })
  );

  useEffect(() => {
    const id = setInterval(() => {
      setDateTime(new Date().toLocaleString("en-GB", { hour12: false }));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Box bg="gray.900" color="white" p={4} minH="100vh">
      <Box
        maxW="1600px"
        mx="auto"
        p={4}
        bg="gray.800"
        borderRadius="md"
        boxShadow="md"
      >
        {/* Top Navigation Bar: Home > BessDashboard  |  date + time */}
        <Flex justify="space-between" align="center" mb={6}>
          {/* Breadcrumbs */}
          <Flex gap={2} align="center">
            <Text
              fontSize="sm"
              color="blue.300"
              cursor="pointer"
              onClick={() => navigate("/")}
              _hover={{ textDecoration: "underline" }}
            >
              Home
            </Text>

            <Text color="gray.500">{">"}</Text>
            <Text fontSize="sm" fontWeight="bold" color="white">
              BessControl
            </Text>
          </Flex>

          {/* Right side Date + Time */}
          <Text fontSize="sm" color="gray.300">
            {dateTime}
          </Text>
        </Flex>

        {/* Row 1: BessOverview + BessWidget */}
        <Box mb={6} height="360px">
          <Flex gap={4} height="100%">
            <Box width="50%" height="100%">
              <BessOverview />
            </Box>
            <Box width="50%" height="100%">
              <BessWidget />
            </Box>
          </Flex>
        </Box>

        {/* Row 2: BatterySettings + AnalyticsChart + BarComparisonChart */}
        <Box mb={6} height="380px">
          <Flex gap={4} height="100%">
            <Box width="33.33%" height="100%">
              <BatterySettings />
            </Box>
            <Box width="33.33%" height="100%">
              <AnalyticsChart />
            </Box>
            <Box width="33.33%" height="100%">
              <BarComparisonChart />
            </Box>
          </Flex>
        </Box>

        {/* Row 3 (NEW): Inverter Control Widgets */}
        <Box mb={6} height="400px">
          <InverterWidgetDemo />
        </Box>

        {/* Row 4: ManualOverridePanel + ScheduledCommandPanel */}
        <Box mb={6} height="600px">
          <Flex gap={4} height="100%">
            <Box width="35%" height="100%">
              <ManualOverridePanel />
            </Box>
            <Box width="65%" height="100%">
              <ScheduledCommandPanel />
            </Box>
          </Flex>
        </Box>

        {/* Row 5: SmartStrategyConfig */}
        {/* <Box mb={2}>
          <SmartStrategyConfig />
        </Box> */}
      </Box>
    </Box>
  );
}
