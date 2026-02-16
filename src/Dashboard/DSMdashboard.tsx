import { Box, Flex, VStack, useBreakpointValue, Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text, } from "@chakra-ui/react";
import DSMGraph from "../components/DSMGraph";
import ControlRecommendation from "../components/ControlRecommendation";
import HistoricalDataTable from "../components/HistoricalDataTable";
import DSMStatsCard from "../components/DSMStatsCard";
import SOCDisplay from "../components/SOCDisplay";
import TariffDisplay from "../components/TariffDisplay";
import { useEffect, useState } from "react";
import { ChevronRightIcon } from '@chakra-ui/icons';
import { Link } from "react-router-dom";


export default function DSMdashboard() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const stateName = "Maharashtra";
  const stateTariff = 4.5;             // ₹/kWh
  const tariffType = "Peak";           // "Peak" | "Off-peak" | "Mid-peak" | custom (e.g., "TOD-Slot A")
  const startTime = "12:15";           // tariff start (24h)
  const endTime = "12:30";             // tariff end (24h)
  const lastUpdatedISO = new Date().toISOString();

  // 🔹 Date & Time state
    const [dateTime, setDateTime] = useState<string>("");
useEffect(() => {
  const formatDateTime = (date: Date) => {
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
      const yyyy = date.getFullYear();

      const hh = String(date.getHours()).padStart(2, "0");
      const min = String(date.getMinutes()).padStart(2, "0");
      const ss = String(date.getSeconds()).padStart(2, "0");

      return `${dd}-${mm}-${yyyy} | ${hh}:${min}:${ss}`;
    };

    const interval = setInterval(() => {
      const now = new Date();
      setDateTime(formatDateTime(now));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box bg="gray.900" color="white" p={[4, 6]} minH="100vh" overflow="auto">
      <Flex
              w="100%"
              mx="auto"
              bg="gray.800"
              borderRadius="lg"
              p={6}
              shadow="lg"
              justifyContent={"space-between"}
            >
      <Breadcrumb
                  spacing="8px"
                  separator={<ChevronRightIcon color="gray.500" />}
                  fontWeight="medium"
                  fontSize="sm"
                >
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      as={Link}
                      to="/"
                      _hover={{
                        bg: 'gray.700',
                        px: 2,
                        py: 1,
                        borderRadius: 'md',
                      }}
                    >
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      as={Link}
                      to="/dsm"
                      _hover={{
                        bg: 'gray.700',
                        px: 2,
                        py: 1,
                        borderRadius: 'md',
                      }}
                    >
                      DSM
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </Breadcrumb>
      
                {/* 📅 Date & Time */}
                <Text fontSize="sm" fontWeight="medium" color="gray.300">
                  {dateTime}
                </Text>
              </Flex>
      <Flex
        direction={isMobile ? "column" : "row"}
        gap={6}
        align="stretch"
        wrap="wrap"
      >
        {/* Left Panel */}
        <VStack
          align="stretch"
          flex={isMobile ? "none" : 2}
          spacing={4}
          w={isMobile ? "100%" : "65%"}
        >
          <DSMGraph />
          <ControlRecommendation />
          <HistoricalDataTable />
        </VStack>

        {/* Right Panel */}
        <VStack
          align="stretch"
          flex={isMobile ? "none" : 1}
          spacing={4}
          w={isMobile ? "100%" : "35%"}
        >
          <DSMStatsCard />
          <TariffDisplay
            state={stateName}
            tariff={stateTariff}
            tariffType={tariffType}
            startTime={startTime}
            endTime={endTime}
            lastUpdatedISO={lastUpdatedISO}
          />
        </VStack>
      </Flex>
    </Box>
  );
}
