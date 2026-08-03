import React from "react";
import {
  Box,
  Grid,
  GridItem,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Select,
  HStack,
  Text,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

import StatusSummary from "../../components/DashboardComponents/PCSBankComponents/Widgets/StatusSummary";
import StringConnectedLayout from "../../components/DashboardComponents/PCSBankComponents/Widgets/StringConnectedLayout";
import TemperatureCards from "../../components/DashboardComponents/PCSBankComponents/Widgets/TemperatureCards";
import DeviceCard from "../../components/DashboardComponents/PCSBankComponents/Widgets/DeviceCard";
import AnalogsCard from "../../components/DashboardComponents/PCSBankComponents/Widgets/AnalogsCard";
import StringsTable from "../../components/DashboardComponents/PCSBankComponents/Widgets/StringsTable";
import RealtimeMonitoringChart from "../../components/DashboardComponents/PCSBankComponents/Widgets/RealtimeMonitoringChart";
import useBatteryBank from "../../hooks/PlantView/useBatteryBank";
import { useDevices } from "../../hooks/useDevices";
import useTimeseriesData from "../../hooks/useTimeseriesData";

const FRAME_W = 1920;
const FRAME_H = 939; // final dashboard height

const PCSBankDashboard: React.FC = () => {
  // tokens
  const screen = useColorModeValue("#f1f5f9", "#0b0f14");
  const crumbColor = useColorModeValue("#0f172a", "gray.300");
  const sepColor = useColorModeValue("#64748b", "gray.500"); // ">" color


  const location = useLocation();
  const { currentBank } = location.state || {};

  // Persist selectedBank in localStorage
  const STORAGE_KEY = "pcsbank_selectedBank";
  const [selectedBank, setSelectedBank] = React.useState<string>(() => {
    // Priority: location.state > localStorage > ""
    if (currentBank) return currentBank;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved || "";
  });

  const { fetchData, data: banks } = useBatteryBank();

  React.useEffect(() => {
    fetchData("plant_1");
  }, []);

  const { devices } = useDevices();

  const { data: bankData, fetchData: fetchBankData } =
    useTimeseriesData();

  const rackCount = React.useMemo(() => {
    if (!devices || !selectedBank) return 0;

    const match = selectedBank.match(/pcs_(\d+)_bank_(\d+)/);

    if (!match) return 0;

    const pcsNo = match[1];
    const bankNo = match[2];

    const actualBankId =
      `plant_1_pcs_${pcsNo}_bank_bank_${bankNo}`;

    return devices.filter(
      (device: any) =>
        device.device_id?.startsWith(
          actualBankId + "_rack_rack_"
        )
    ).length;
  }, [devices, selectedBank]);

  React.useEffect(() => {
    if (!selectedBank) return;

    const match =
      selectedBank.match(/pcs_(\d+)_bank_(\d+)/);

    if (!match) return;

    const pcsNo = match[1];
    const bankNo = match[2];

    fetchBankData({
      devices: {
        ids: [
          `plant_1_pcs_${pcsNo}_bank_bank_${bankNo}`,
        ],
        patterns: [],
      },

      keys: [
        {
          key: "number_of_cells_inside_bank",
          alias: "cell_count",
          keyType: "common",
        },
      ],

      aggregation: {
        func: "none",
        interval: 1,
        intervalType: "minute",
      },

      timeRange: {
        type: "last",
        interval: 1,
        intervalType: "minute",
      },

      orderBy: "ASC",
    } as any);
  }, [selectedBank]);

  const cellCount = React.useMemo(() => {
    if (!bankData) return 0;

    const deviceId =
      Object.keys(bankData || {})[0];

    if (!deviceId) return 0;

    const points =
      (bankData as any)?.[deviceId]
        ?.cell_count || [];

    const latest =
      points[points.length - 1];

    return Number(latest?.value || 0);
  }, [bankData]);


  // Save selectedBank to localStorage whenever it changes
  React.useEffect(() => {
    if (selectedBank) {
      localStorage.setItem(STORAGE_KEY, selectedBank);
    }
  }, [selectedBank]);

  // ---- scale to frame width (never upscale) ----
  const [scale, setScale] = React.useState(1);
  const viewportRef = React.useRef<HTMLDivElement>(null);

  // React.useLayoutEffect(() => {
  //   const update = () => {
  //     const cw =
  //       viewportRef.current?.clientWidth ?? document.documentElement.clientWidth;
  //     const s = Math.min(1, (cw - 2) / FRAME_W);
  //     setScale(s);
  //   };
  //   update();
  //   window.addEventListener("resize", update);
  //   return () => window.removeEventListener("resize", update);
  // }, []);

  return (
    <Box w={"100%"}>
      <Box
        w={`100%`}
        h={"100%"}
      >
        <HStack mb="12px" px="4px" spacing="12px">
          <Text fontWeight="600">Select Bank:</Text>
          <Select
            w="240px"
            size="sm"
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
          >
            {banks?.map((bank: any) => {
              const bankId = formatBankId(bank.device_id);
              const label = bankId.replace(/_/g, " ").replace("pcs", "PCS");

              return (
                <option key={bankId} value={bankId}>
                  {label}
                </option>
              );
            })}
          </Select>
        </HStack>

        {/* Breadcrumb top-left (EXACT: Home > Dashboard > PCS 2 Bank 1) */}
        {/* <Box px="20px" mb="12px" whiteSpace="nowrap">
          <Breadcrumb
            fontSize="14px"
            separator={<Box as="span" mx="8px" color={sepColor}>{">"}</Box>}
          >
            <BreadcrumbItem>
              <BreadcrumbLink
                href="#"
                color={crumbColor}
                fontWeight="600"
                _hover={{ textDecoration: "none" }}
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink
                href="#"
                color={crumbColor}
                fontWeight="600"
                _hover={{ textDecoration: "none" }}
              >
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink
                href="#"
                color={crumbColor}
                fontWeight="600"
                _hover={{ textDecoration: "none" }}
              >
                PCS 2 Bank 1
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box> */}

        {/* Row 1 */}
        <Grid
          templateColumns="330px 454px 360px 376px 280px"
          gap="20px"
          h="304px"
          alignItems="stretch"
        >
          <GridItem>
            <Box
              w="330px"
              h="304px"
              display="grid"
              gridTemplateRows="1fr 1fr"
              gap="10px"
            >
              <StatusSummary
                title="Strings connected"
                donutValue={rackCount}
                donutTotal={Math.max(rackCount, 1)}
                leftLabel="Connected"
                leftValue={rackCount}
                rightLabel="Disabled"
                rightValue={0}
              />
              <StatusSummary
                title="Cell Balancing"
                donutValue={cellCount}
                donutTotal={cellCount || 1}
                leftLabel="Balanced"
                leftValue={cellCount}
                rightLabel="Active"
                rightValue={0}
              />
            </Box>
          </GridItem>

          <GridItem>
            <Box w="454px" h="100%">
              <StringConnectedLayout bankId={selectedBank} />
            </Box>
          </GridItem>

          <GridItem>
            <Box w="360px" h="100%">
              <TemperatureCards bankId={selectedBank} />
            </Box>
          </GridItem>

          <GridItem>
            <Box w="376px" h="100%">
              <AnalogsCard bankId={selectedBank} />
            </Box>
          </GridItem>

          <GridItem>
            <Box w="280px" h="100%">
              <DeviceCard bankId={selectedBank} />
            </Box>
          </GridItem>
        </Grid>

        {/* Row 2 */}
        <Box mt="20px">
          <Grid
            templateColumns="930px 930px"
            gap="20px"
            h="534px"
            alignItems="stretch"
          >
            <GridItem>
              <Box w="930px" h="100%">
                <StringsTable bankId={selectedBank} />
              </Box>
            </GridItem>
            <GridItem>
              <Box w="930px" h="100%">
                <RealtimeMonitoringChart bankId={selectedBank} />
              </Box>
            </GridItem>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default PCSBankDashboard;

function formatBankId(input: string): string {
  const regex = /pcs_(\d+).*?bank_(\d+)/;
  const match = input.match(regex);

  if (match) {
    const [, pcsNum, bankNum] = match;
    return `pcs_${pcsNum}_bank_${bankNum}`;
  }

  return input;
}
