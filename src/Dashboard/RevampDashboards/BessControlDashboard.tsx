import React from "react";
import { Box, VStack, HStack, useColorModeValue } from "@chakra-ui/react";
import POIMeter from "../../components/DashboardComponents/BessControlComponents/Widgets/POIMeter";
import GlobalInfo from "../../components/DashboardComponents/BessControlComponents/Widgets/GlobalInfo";
import MeanAndPQ from "../../components/DashboardComponents/BessControlComponents/Widgets/MeanAndPQ";

import CapacityAndStrategyCard from "../../components/DashboardComponents/BessControlComponents/Widgets/CapacityAndStrategyCard";
import AnalyticsChart from "../../components/DashboardComponents/BessControlComponents/Widgets/AnalyticsChart";
// import NewAnalyticsChart from "../../components/DashboardComponents/BessControlComponents/Widgets/EnergyBlockChart";
import ControlServices from "../../components/DashboardComponents/BessControlComponents/Widgets/ControlServices";
import ScheduledCommands from "../../components/DashboardComponents/BessControlComponents/Widgets/ScheduledCommands";
import ChargeDischargeChart from "../../components/DashboardComponents/BessControlComponents/Widgets/ChargeDischargeChart";
import SystemOverview from "../../components/DashboardComponents/BessControlComponents/Widgets/SystemOverview";
import SoCWithChargeCard from "../../components/DashboardComponents/BessControlComponents/Widgets/SoCWithChargeCard";


/** Figma canvas */
// const FRAME_W = 1920;
// const FRAME_H = 939;
const GAP = 20; // outer padding/gutter

export default function BessControlDashboard() {
  const pageBg = useColorModeValue("gray.50", "#0B0F0F");
  const canvasBg = useColorModeValue("#FFFFFF", "#0F1414");

  // const [scale, setScale] = React.useState(1);
  // const viewportRef = React.useRef<HTMLDivElement>(null);

  // React.useLayoutEffect(() => {
  //   const update = () => {
  //     const cw = viewportRef.current?.clientWidth ?? document.documentElement.clientWidth;
  //     const s = Math.min(1, (cw - 2 - GAP * 2) / FRAME_W);
  //     // lock to 3 decimals to avoid sub-pixel jitter
  //     setScale(Math.max(0.001, Math.round(s * 1000) / 1000));
  //   };
  //   update();
  //   window.addEventListener("resize", update);
  //   return () => window.removeEventListener("resize", update);
  // }, []);

  return (
    <Box w="100%" minH="100%">
      <Box w="100%" minH="100%">
        <VStack align="stretch" spacing="20px" pb="20px" w="full" h="full">
          {/* ROW 1 — exact: 447 + 327 + 362 + 332 + 332 + (4×20 gap) = 1880 */}
          <HStack align="stretch" w="full" h="260px" spacing="20px">
            <Box flex="0 0 447px" minW="447px" h="260px"><SystemOverview /></Box>
                <Box flex="0 0 327px" minW="327px" h="260px"><SoCWithChargeCard /></Box>
            <Box flex="0 0 362px" minW="362px" h="260px"><POIMeter /></Box>
            <Box flex="0 0 332px" minW="332px" h="260px"><GlobalInfo /></Box>
            <Box flex="0 0 332px" minW="332px" h="260px"><MeanAndPQ /></Box>
          </HStack>

          {/* ROW 2 — 1176 (left) + 20 (gap) + 684 (right) = 1880 */}
          <HStack align="stretch" w="full" h="619px" spacing="20px">
            {/* LEFT column (locked 1176×619) */}
            <VStack w="1176px" h="619px" spacing="0px" align="stretch" flex="0 0 1176px">
              {/* 214px row */}
              <HStack spacing="20px" align="stretch" h="214px">
                <Box flex="0 0 578px" minW="578px" h="214px" ml="470px">
                  <CapacityAndStrategyCard />
                </Box>
              </HStack>
              {/* 385px row */}
              <HStack spacing="20px" align="stretch" h="385px">
                <Box flex="0 0 578px" minW="578px" h="385px"><AnalyticsChart /></Box>
                <Box flex="0 0 578px" minW="578px" h="385px"><ChargeDischargeChart /></Box>
              </HStack>
            </VStack>

            {/* RIGHT column (locked 684×619) */}
            <HStack w="684px" h="619px" spacing="20px" align="stretch" flex="0 0 684px">
              <Box flex="0 0 332px" minW="332px" h="619px"><ControlServices /></Box>
              <Box flex="0 0 332px" minW="332px" h="619px"><ScheduledCommands /></Box>
            </HStack>
          </HStack>

          {/* ROW 3 */}
          {/* <HStack align="stretch" w="full" h="385px" spacing="20px" mt="-60px">
            <Box flex="0 0 578px" minW="578px" h="385px"><NewAnalyticsChart /></Box>
          </HStack> */}
        </VStack>
      </Box>

    </Box>
  );
}
