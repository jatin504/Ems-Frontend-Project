import {
  Box,
  Grid,
  GridItem,
  Text,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  HStack,
  Select,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useState, useMemo } from "react";

import BayLocalRemote from "../components/DashboardComponents/IndividualTransformerDashboard/BayLocalRemote";
import CircuitBreaker from "../components/DashboardComponents/IndividualTransformerDashboard/CircuitBreaker";
import Cubical from "../components/DashboardComponents/IndividualTransformerDashboard/Cubical";
import TransformerSection from "../components/DashboardComponents/IndividualTransformerDashboard/TransformerSection";
import Cooler from "../components/DashboardComponents/IndividualTransformerDashboard/Cooler";
import Metering from "../components/DashboardComponents/IndividualTransformerDashboard/Metering";
import SynchroCheck from "../components/DashboardComponents/IndividualTransformerDashboard/SynchroCheck";
import Led87T from "../components/DashboardComponents/IndividualTransformerDashboard/Led87T";
import Led99 from "../components/DashboardComponents/IndividualTransformerDashboard/Led99";
import TemperatureTrendChart from "../components/DashboardComponents/IndividualTransformerDashboard/TemperatureTrendChart";
import TripRelayReset from "../components/DashboardComponents/IndividualTransformerDashboard/TripRelayReset";
import SynchroCheckValues from "../components/DashboardComponents/IndividualTransformerDashboard/SynchroCheckValues";

/* ================= DATA ================= */
const transformers = [
  { id: 1, name: "IR-1 TRANSFORMER" },
  { id: 2, name: "IR-2 TRANSFORMER" },
  { id: 3, name: "IR-3 TRANSFORMER" },
];

export default function IndividualTransformerDashboard() {
  const [selectedTransformer, setSelectedTransformer] = useState("1");

  const selectedTransformerName = useMemo(
    () =>
      transformers.find(
        (t) => t.id.toString() === selectedTransformer
      )?.name || "TRANSFORMER",
    [selectedTransformer]
  );

  const bgColor = useColorModeValue("#f4f4f4", "gray.900");
  const titleColor = useColorModeValue(
    "rgba(0,0,0,0.85)",
    "rgba(255,255,255,0.9)"
  );
  const mutedColor = useColorModeValue(
    "rgba(0,0,0,0.6)",
    "rgba(255,255,255,0.6)"
  );

  return (
    <Box p="16px" bg={bgColor} minH="100vh">
      {/* ================= BREADCRUMB ================= */}
      <Breadcrumb
        spacing="6px"
        separator={<ChevronRightIcon boxSize="14px" />}
        mb="6px"
      >
        <BreadcrumbItem>
          <BreadcrumbLink fontSize="12px" color={mutedColor}>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink fontSize="12px" color={mutedColor}>
            Transformers
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink
            fontSize="12px"
            fontWeight="600"
            color={titleColor}
          >
            {selectedTransformerName}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* ================= TITLE ================= */}
      <HStack justify="space-between" mb="12px">
        <Text fontSize="12px" fontWeight="600" color={titleColor}>
          {selectedTransformerName}
        </Text>

        <Select
          value={selectedTransformer}
          onChange={(e) => setSelectedTransformer(e.target.value)}
          width="200px"
          size="sm"
          fontSize="12px"
        >
          {transformers.map((t) => (
            <option key={t.id} value={t.id.toString()}>
              {t.name}
            </option>
          ))}
        </Select>
      </HStack>

      {/* ================= MAIN GRID ================= */}
      <Grid templateColumns="320px 1fr" gap="12px">
        {/* LEFT */}
        <BayLocalRemote />

        {/* RIGHT */}
        <Box display="flex" flexDirection="column" gap="12px">
          {/* TOP ROW */}
          <Grid templateColumns="repeat(4, 1fr)" gap="12px">
            <CircuitBreaker />
            <Cubical />
            <TransformerSection />
            <Cooler />
          </Grid>

          {/* STATUS ROW */}
          <Grid templateColumns="repeat(4, 1fr)" gap="12px">
            <Metering />

            {/* 10px GAP TO THE RIGHT */}
            <Box>
              <SynchroCheck />
            </Box>

            {/* 87T SLIGHT LEFT SHIFT */}
            <Box ml="0px">
              <Led87T />
            </Box>

            <Led99 />
          </Grid>
        </Box>

        {/* ================= LAST ROW ================= */}
        <GridItem colSpan={2}>
          <Grid templateColumns="1fr 1fr" gap="12px" alignItems="start">
            <Box mt="-16px">
              <TemperatureTrendChart />
            </Box>

            <Box display="flex" flexDirection="column" gap="12px">
              <TripRelayReset />
              <SynchroCheckValues />
            </Box>
          </Grid>
        </GridItem>
      </Grid>
    </Box>
  );
}
