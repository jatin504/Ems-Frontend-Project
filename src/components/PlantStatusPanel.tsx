// src/components/PlantStatusPanel.tsx
import React from "react";
import {
  Box,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Select,
  IconButton,
  SimpleGrid,
  Text,
  HStack,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { ViewIcon, WarningTwoIcon } from "@chakra-ui/icons";

/** TYPES  */
export type StatusData = {
  plantAvailability?: number;
  gridAvailability?: number;
  gridOutMinutes?: number;
  gridOccurrence?: number;
  plantDowntimeMinutes?: number;
  plantDowntimeOccurrence?: number;
  loadLossMinutes?: number;
};

export type GridData = {
  gridKw?: number;
  gridHz?: number;
  consumptionKwh?: number;
  feedKwh?: number;
  lineVoltageV?: number;
  lineCurrentA?: number;
};

export type SolarData = {
  pvPowerKw?: number;
  pvGenerationKwh?: number;
  cufPercent?: number;
  co2SavingKg?: number;
};

export type DgData = {
  dgPowerKw?: number;
  dgGenerationKwh?: number;
  dgLineVoltageV?: number;
  dgRuntimeMin?: number;
  savingsInr?: number;
};

export type BessData = {
  bessKw?: number;
  chargeKwh?: number;
  dischargeKwh?: number;
  socPercent?: number;
  bessHz?: number;
  lineVoltageV?: number;
  lineCurrentA?: number;
};

export interface PlantStatusPanelProps {
  status?: StatusData;
  grid?: GridData;
  solar?: SolarData;
  dg?: DgData;
  bess?: BessData;

  period?: "Daily" | "Weekly" | "Monthly";
  onPeriodChange?: (p: "Daily" | "Weekly" | "Monthly") => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

/** HELPERS */
const fmtPct0 = (v?: number) =>
  `${Math.max(0, Math.min(100, Math.round(v ?? 0)))}%`;

const fmtPct2 = (v?: number) => {
  const n = Number.isFinite(v as number) ? (v as number) : 0;
  return `${Math.max(0, Math.min(100, n)).toFixed(2)}%`;
};

const fmtHm = (mins?: number) => {
  const m = Math.max(0, Math.floor(mins ?? 0));
  const h = Math.floor(m / 60);
  const r = m % 60;
  return `${h}h ${r}m`;
};

const KPI: React.FC<{ label: string; value?: React.ReactNode }> = ({
  label,
  value,
}) => {
  const labelColor = useColorModeValue("gray.600", "gray.300");
  return (
    <Box>
      <Text fontSize="md" color={labelColor} mb={1}>
        {label}
      </Text>
      <Box fontSize="2xl" fontWeight="bold">{value}</Box>
    </Box>
  );
};

const NA = () => (
  <HStack spacing={2}>
    <Text as="span">NA</Text>
    <WarningTwoIcon color="yellow.400" />
  </HStack>
);

const V = (n: number | undefined, toText?: (v: number) => string) => {
  if (n === undefined || n === null || Number.isNaN(n)) return <NA />;
  return <>{toText ? toText(n) : String(n)}</>;
};

/** COMPONENT */
const PlantStatusPanel: React.FC<PlantStatusPanelProps> = ({
  status,
  grid,
  solar,
  dg,
  bess,
  period = "Daily",
  onPeriodChange,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const s = status ?? {};

  const panelMinH = { base: "unset", md: "260px" }; // chhota rakha

  return (
    <Box
      bg="gray.900"
      borderRadius="lg"
      border="1px solid"
      borderColor="gray.700"
      p={0}
      overflow="hidden"
    >
      {/* Header */}
      <Flex
        px={4}
        py={2}
        align="center"
        justify="space-between"
        borderBottom="1px solid"
        borderColor="gray.700"
      >
        <Tabs variant="unstyled" w="full">
          <Flex justify="space-between" w="full" align="center" gap={4}>
            <TabList gap={6}>
              {["Status", "Grid", "Solar", "DG", "BESS"].map((t) => (
                <Tab
                  key={t}
                  _selected={{
                    color: "green.300",
                    borderBottom: "2px solid",
                    borderColor: "green.300",
                  }}
                  color="gray.300"
                  pb={1}
                >
                  {t}
                </Tab>
              ))}
            </TabList>

            <Flex align="center" gap={3}>
              <Select
                value={period}
                onChange={(e) =>
                  onPeriodChange?.(
                    e.target.value as "Daily" | "Weekly" | "Monthly"
                  )
                }
                size="sm"
                w="110px"
                bg="gray.900"
                borderColor="gray.600"
                _hover={{ borderColor: "gray.500" }}
                _focusVisible={{ borderColor: "teal.400" }}
              >
                <option style={{ background: "#1A202C" }} value="Daily">
                  Daily
                </option>
                <option style={{ background: "#1A202C" }} value="Weekly">
                  Weekly
                </option>
                <option style={{ background: "#1A202C" }} value="Monthly">
                  Monthly
                </option>
              </Select>

              {/* <Tooltip label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                <IconButton
                  aria-label="Fullscreen"
                  icon={<ViewIcon />}
                  size="sm"
                  onClick={onToggleFullscreen}
                  bg="gray.900"
                  border="1px solid"
                  borderColor="gray.600"
                  _hover={{ bg: "gray.700" }}
                />
              </Tooltip> */}
            </Flex>
          </Flex>

          {/* TAB PANELS */}
          <TabPanels>
            {/* STATUS (7 KPIs, but fit in 2 rows) */}
            <TabPanel px={0}>
              <Box p={4} minH={panelMinH}>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacingY={8} spacingX={12}>
                  <KPI label="Plant Availability" value={fmtPct0(s.plantAvailability)} />
                  <KPI label="Grid Availability" value={fmtPct2(s.gridAvailability)} />
                  <KPI label="Grid Out" value={fmtHm(s.gridOutMinutes)} />
                  <KPI label="Grid Occurrence" value={V(s.gridOccurrence)} />
                  <KPI label="Plant Downtime" value={fmtHm(s.plantDowntimeMinutes)} />
                  <KPI label="Plant Downtime Occurrence" value={V(s.plantDowntimeOccurrence)} />
                </SimpleGrid>
              </Box>
            </TabPanel>

            {/* GRID */}
            <TabPanel px={0}>
              <Box p={4} minH={panelMinH}>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacingY={8} spacingX={12}>
                  <KPI label="Grid kW" value={V(grid?.gridKw)} />
                  <KPI label="Grid Hz" value={V(grid?.gridHz)} />
                  <KPI label="Consumption kWh" value={V(grid?.consumptionKwh)} />
                  <KPI label="Feed kWh" value={V(grid?.feedKwh)} />
                  <KPI label="Line Voltage V" value={V(grid?.lineVoltageV)} />
                  <KPI label="Line Current A" value={V(grid?.lineCurrentA)} />
                </SimpleGrid>
              </Box>
            </TabPanel>

            {/* SOLAR */}
            <TabPanel px={0}>
              <Box p={4} minH={panelMinH}>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacingY={8} spacingX={12}>
                  <KPI label="PV Power kW" value={V(solar?.pvPowerKw)} />
                  <KPI label="PV Generation kWh" value={V(solar?.pvGenerationKwh)} />
                  <KPI label="CUF %" value={V(solar?.cufPercent)} />
                  <KPI label="CO2 Saving kg" value={V(solar?.co2SavingKg)} />
                </SimpleGrid>
              </Box>
            </TabPanel>

            {/* DG */}
            <TabPanel px={0}>
              <Box p={4} minH={panelMinH}>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacingY={8} spacingX={12}>
                  <KPI label="DG Power kW" value={V(dg?.dgPowerKw)} />
                  <KPI label="DG Generation kWh" value={V(dg?.dgGenerationKwh)} />
                  <KPI label="DG Line Voltage V" value={V(dg?.dgLineVoltageV)} />
                  <KPI label="DG Runtime Min" value={V(dg?.dgRuntimeMin)} />
                  <KPI label="Savings INR" value={V(dg?.savingsInr)} />
                </SimpleGrid>
              </Box>
            </TabPanel>

            {/* BESS (7 KPIs → trim to 6, 2 rows) */}
            <TabPanel px={0}>
              <Box p={4} minH={panelMinH}>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacingY={8} spacingX={12}>
                  <KPI label="BESS kW" value={V(bess?.bessKw)} />
                  <KPI label="Charge kWh" value={V(bess?.chargeKwh)} />
                  <KPI label="Discharge kWh" value={V(bess?.dischargeKwh)} />
                  <KPI label="SoC%" value={V(bess?.socPercent)} />
                  <KPI label="BESS Hz" value={V(bess?.bessHz)} />
                  <KPI label="Line Voltage V" value={V(bess?.lineVoltageV)} />
                </SimpleGrid>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Box>
  );
};

export default PlantStatusPanel;
