import React from "react";
import { Box, VStack, HStack, useColorModeValue } from "@chakra-ui/react";
import POIMeter from "../../components/DashboardComponents/BessControlComponents/Widgets/POIMeter";
import GlobalInfo from "../../components/DashboardComponents/BessControlComponents/Widgets/GlobalInfo";
import MeanAndPQ from "../../components/DashboardComponents/BessControlComponents/Widgets/MeanAndPQ";
import EMSSummaryFooter from "../../components/DashboardComponents/BessControlComponents/Widgets/EMSSummaryFooter";
import CapacityAndStrategyCard from "../../components/DashboardComponents/BessControlComponents/Widgets/CapacityAndStrategyCard";
import AnalyticsChart from "../../components/DashboardComponents/BessControlComponents/Widgets/AnalyticsChart";
// import NewAnalyticsChart from "../../components/DashboardComponents/BessControlComponents/Widgets/EnergyBlockChart";
import ControlServices from "../../components/DashboardComponents/BessControlComponents/Widgets/ControlServices";
import ScheduledCommands from "../../components/DashboardComponents/BessControlComponents/Widgets/ScheduledCommands";
import ChargeDischargeChart from "../../components/DashboardComponents/BessControlComponents/Widgets/ChargeDischargeChart";
import SystemOverview from "../../components/DashboardComponents/BessControlComponents/Widgets/SystemOverview";
import SoCWithChargeCard from "../../components/DashboardComponents/BessControlComponents/Widgets/SoCWithChargeCard";
import PPC_State from "../../components/DashboardComponents/BessControlComponents/Widgets/PPC_State";
import { useSSE } from "../../hooks/sse/useSSE";


/** Figma canvas */
// const FRAME_W = 1920;
// const FRAME_H = 939;
export default function BessControlDashboard() {

    const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString()?.replace(/\/$/, "") || "";

    const [dataMap, setDataMap] = React.useState<Record<string, any>>({});

    const topics = React.useMemo(
        () => [
          "plant_1_ppc_1",
        ],
        []
      );

    useSSE({
        url: `${API_BASE}/stream?topics=${topics.join(",")}`,
        // paused: ssePaused,   // add this (update hook if needed)
        onMessage: ({ topic, message }) => {
          setDataMap((prev) => ({ ...prev, [topic]: message }));
        },
        onError: (err) => console.error("SSE error:", err),
      });
  
    const ppc_data = dataMap["plant_1_ppc_1"] || {};

    // const [ssedata, setsseData] = React.useState<any>({});
    
    //   React.useEffect(() => {
    //   if (!ppc_data || Object.keys(ppc_data).length === 0) {
    //     return;
    //   }
    
    //   setsseData((prev: any) => ({
    //     ...prev,
    //     ...Object.fromEntries(
    //       Object.entries(ppc_data).filter(
    //         ([_, value]) =>
    //           value !== null &&
    //           value !== undefined &&
    //           value !== "" &&
    //           value !== 0
    //       )
    //     ),
    //   }));
    // }, [ppc_data]);

  return (
    <Box w="100%" minH="100%">
      <Box w="100%" minH="100%">
        <VStack align="stretch" spacing="10px" pb="0px" w="full" h="full">
          {/* ROW 1 — exact: 447 + 327 + 362 + 332 + 332 + (4×20 gap) = 1880 */}
          <HStack align="stretch" w="full" h="260px" spacing="10px">
            <Box flex="0 0 447px" minW="447px" h="260px"><SystemOverview /></Box>
            <Box flex="0 0 327px" minW="327px" h="260px"><SoCWithChargeCard /></Box>
            <Box flex="0 0 362px" minW="362px" h="260px"><POIMeter ppc_data={ppc_data} /></Box>
            <Box flex="0 0 332px" minW="332px" h="260px"><GlobalInfo /></Box>
            <Box flex="0 0 332px" minW="332px" h="260px"><MeanAndPQ ppc_data={ppc_data} /></Box>
          </HStack>

          {/* ROW 2 — 1176 (left) + 20 (gap) + 684 (right) = 1880 */}
          <HStack align="stretch" w="full" h="619px" spacing="10px">
            {/* LEFT column (locked 1176×619) */}
            <VStack w="1176px" h="619px" spacing="10px" align="stretch" flex="0 0 1176px">
              {/* 214px row */}
              <HStack spacing="10px" align="stretch" h="214px">
                <Box flex="0 0 578px" minW="578px" h="234px" ml="456px">
                  <CapacityAndStrategyCard />
                </Box>
              </HStack>
              {/* 385px row */}
              <HStack spacing="10px" align="stretch" h="385px">
                <Box flex="0 0 578px" minW="578px" h="385px" position="relative" top="-16px"><AnalyticsChart /></Box>
                <Box flex="0 0 578px" minW="578px" h="385px" position="relative" top="-16px"><ChargeDischargeChart /></Box>
              </HStack>
            </VStack>

            {/* RIGHT column (locked 684×619) */}
            <HStack w="684px" h="619px" spacing="10px" align="stretch" flex="0 0 684px">
              <VStack overflow="hidden" spacing="10px" zIndex={1}>
                <Box  minW="332px" h="190px"><PPC_State ppc_data={ppc_data} /></Box>
                <Box minW="332px" h="129px" position="relative" top="16px"><ControlServices ppc_data={ppc_data} /></Box>
              </VStack>
              <Box flex="0 0 332px" minW="332px" h="619px"><ScheduledCommands /></Box>
            </HStack>
          </HStack>

          {/* ROW 3 — EMS SUMMARY */}
          <Box
            w="full"
            h="86px"
            position="relative"
            top="-42px"
            zIndex={100}
          >
            <EMSSummaryFooter />
          </Box>
        </VStack>
      </Box>

    </Box>
  );
}
