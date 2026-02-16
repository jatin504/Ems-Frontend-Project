// src/components/DashboardComponents/BessControl/Widgets/AnalyticsChart.tsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  Menu, MenuButton, MenuList, MenuItem, IconButton, HStack, Text, Box,
  SimpleGrid, useColorModeValue, Portal, Flex, CloseButton,
} from "@chakra-ui/react";
import { FaAngleDown } from "react-icons/fa";
import { Maximize2 } from "lucide-react";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import AreaspineGraph from "../../../Graphs/RevampCharts/AreasplineGraph";
import SplineGraph from "../../../Graphs/RevampCharts/SplineGraph";

type ChartKey =
  | "activeSetpoint" | "reactiveSetpoint" | "voltageSetpoint"
  | "pfSetpoint" | "fpCurve" | "qvCurve";

export default function AnalyticsChart() {
  /** ---- Color tokens (light/dark) ---- */
  const CARD_BG = useColorModeValue("#FFFFFF", "#161B1B");
  const BORDER = useColorModeValue("#E5E7EB", "#202525");
  const GRID = useColorModeValue("#E6ECEC", "#283131");
  const LABEL = useColorModeValue("#64748B", "#A6B0B0");
  const TITLE = useColorModeValue("#111827", "#E8ECEC");
  const MENU_HOVER = useColorModeValue("#F3F4F6", "#1C2121");
  const OVERLAY_BG = useColorModeValue("#FFFFFF", "#161B1B");

  const series = useMemo(() => {
    const base = new Date();
    base.setMinutes(0, 0, 0);
    base.setHours(12);
    const mk = (vals: number[]) =>
      vals.map((v, i) => [base.getTime() + i * 3600_000, v]) as [number, number][];

    return {
      active1: { name: "Active-1 kW", type: "areaspline", color: "#6DA2FF", data: mk([1200, 500, 300, 400, 800, 1000, 1800, 900, 1600, 1700, 1500, 400]) },
      active2: { name: "Active-2 kW", type: "areaspline", color: "#34D399", data: mk([800, 300, 400, 700, 1200, 1600, 1000, 1800, 1600, 600, 400, -50]) },
      reactive1: { name: "Reactive-1 kVAR", type: "areaspline", color: "#F59E0B", data: mk([600, 700, 900, 1400, 2000, 1800, 900, 800, 700, 600, 500, 1700]) },
      reactive2: { name: "Reactive-2 kVAR", type: "areaspline", color: "#8B5CF6", data: mk([300, 350, 600, 500, 400, 700, 1800, 1700, 1600, 1500, 400, 300]) },
      voltage: { name: "Voltage (kV)", type: "areaspline", color: "#F43F5E", data: mk([230, 231, 229, 228, 232, 233, 234, 230, 229, 228, 227, 226]) },
      pf: { name: "Power Factor", type: "areaspline", color: "#3B82F6", data: mk([0.98, 0.97, 0.96, 0.95, 0.94, 0.96, 0.97, 0.98, 0.99, 1, 0.98, 0.97]) },
    };
  }, []);

  const currentColor = useColorModeValue("#062D59", "#fff");
  const [overlay, setOverlay] = useState<ChartKey | null>(null);
  const [selectedKey, setSelectedKey] = useState<ChartKey | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOverlay(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const C = { blue: "#6DA2FF", green: "#34D399", amber: "#F59E0B", purple: "#8B5CF6", red: "#F43F5E", sky: "#3B82F6", setpoint: "#22C55E" };

  const mk2 = useMemo(() => {
    const base = new Date();
    base.setMinutes(0, 0, 0);
    base.setHours(6);
    return (vals: number[]) =>
      vals.map((v, i) => [base.getTime() + i * 2 * 3600_000, v]) as [number, number][];
  }, []);

  const gridCharts = useMemo(() => [
    {
      key: "activeSetpoint", title: "Active Power Vs Setpoint",
      series: [
        { name: "Active Power (kW)", type: "areaspline", color: C.blue, data: mk2([0, 20, 40, 80, 100, 90, 60, 20]) },
        { name: "Setpoint", type: "spline", color: C.setpoint, data: mk2([0, 0, 0, 90, 90, 90, 90, 90]) },
      ]
    },
    {
      key: "reactiveSetpoint", title: "Reactive Power Vs Setpoint",
      series: [
        { name: "Reactive Power (MVAr)", type: "areaspline", color: C.amber, data: mk2([0, 0, 0, 0, 0, 0, 2, 5]) },
        { name: "Setpoint", type: "spline", color: C.setpoint, data: mk2([0, 0, 0, 0, 0, 0, 0, 0]) },
      ]
    },
    {
      key: "voltageSetpoint", title: "Voltage Vs Setpoint",
      series: [
        { name: "Voltage (kV)", type: "areaspline", color: C.red, data: mk2([240, 238, 236, 235, 234, 236, 235, 234]) },
        { name: "Setpoint", type: "spline", color: C.setpoint, data: mk2([235, 235, 235, 235, 235, 235, 235, 235]) },
      ]
    },
    {
      key: "pfSetpoint", title: "Power Factor Vs Setpoint",
      series: [
        { name: "Power Factor", type: "areaspline", color: C.sky, data: mk2([0.95, 0.95, 0.95, 0.0, -0.5, -0.9, -0.95, -0.95]) },
        { name: "Setpoint", type: "spline", color: C.setpoint, data: mk2([0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95]) },
      ]
    },
    {
      key: "fpCurve", title: "F-P Curve Vs Operation point",
      series: [
        { name: "F-P Curve", type: "areaspline", color: C.purple, data: mk2([-1.2, -1.2, -1.2, -1.2, -0.8, -0.6, 0.2, 0.8]) },
        { name: "Operation point", type: "spline", color: C.setpoint, data: mk2([0, 0, 0, 0, 0, 0.2, 0.4, 0.6]) },
      ]
    },
    {
      key: "qvCurve", title: "Q-V Curve Vs Operation point",
      series: [
        { name: "Q-V Curve", type: "areaspline", color: C.green, data: mk2([-0.2, -0.2, -0.25, -0.3, -0.35, -0.4, -0.2, 0.1]) },
        { name: "Operation point", type: "spline", color: C.setpoint, data: mk2([0, 0, 0, 0, 0, 0.2, 0.3, 0.5]) },
      ]
    },
  ] as const, [mk2]);

  /** ---------- Highcharts common props ---------- */
  const commonChartProps = {
    chart: { backgroundColor: "transparent" },
    legend: {
      itemStyle: { color: LABEL },
      itemHoverStyle: { color: useColorModeValue("#111827", "#FFFFFF") },
    },
    tooltip: {
      backgroundColor: useColorModeValue("#F8FAFC", "#0F1414"),
      borderColor: BORDER,
      style: { color: useColorModeValue("#0F172A", "#EAF2F2") },
    },
    xAxis: {
      labels: { style: { color: LABEL, fontSize: "12px" } },
      gridLineColor: GRID,
      lineColor: GRID,
      tickColor: GRID,
    },
    yAxis: {
      labels: { style: { color: useColorModeValue("#000000", "#E8ECEC"), fontSize: "12px" } },
      gridLineColor: GRID,
      lineColor: GRID,
      tickColor: GRID,
    },
  };

  /** ---------- Grid widget content ---------- */
  const GridContent: React.FC<{ isFullscreen?: boolean; selectedSeries?: any[] }> = ({ isFullscreen, selectedSeries }) => {
    if (!isFullscreen) {
      return (
        <AreaspineGraph
          height={280}
          legendHeight={28}
          apiData={(selectedSeries ?? [series.active1, series.active2, series.reactive1, series.reactive2]) as any} // UPDATED
          bg="transparent"
          props={{
            ...commonChartProps,
            xAxis: { ...commonChartProps.xAxis, tickInterval: 3600_000 },
            yAxis: { ...commonChartProps.yAxis, min: -500, max: 2000, tickAmount: 6 },
          }}
        />
      );
    }

    const containerRef = useRef<HTMLDivElement>(null);
    const [containerW, setContainerW] = useState<number>(1200);
    const [cols, setCols] = useState<number>(3);
    const gapPx = 16;

    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const ro = new ResizeObserver((entries) => {
        const w = entries[0].contentRect.width;
        setContainerW(w);
        setCols(w >= 1600 ? 3 : w >= 1100 ? 2 : 1);
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    const cardW = (containerW - gapPx * (cols - 1)) / cols;
    const chartH = Math.max(180, Math.min(320, Math.round(cardW * 0.6)));
    const titleH = 30;
    const pad = 24;
    const cardH = chartH + titleH + pad;

    const Card = ({ title, series }: { title: string; series: any[] }) => (
      <Box border={`1px solid ${BORDER}`} borderRadius="12px" p="12px" bg={CARD_BG} w="100%" h={`${cardH}px`}>
        <Text fontSize="14px" fontWeight="600" mb="6px" color={TITLE}>
          {title}
        </Text>
        <AreaspineGraph
          height={chartH}
          legendHeight={28}
          apiData={series as any}
          bg="transparent"
          props={{
            ...commonChartProps,
            xAxis: { ...commonChartProps.xAxis, tickInterval: 2 * 3600_000 },
            yAxis: { ...commonChartProps.yAxis, tickAmount: 6 },
          }}
        />
      </Box>
    );

    return (
      <Box ref={containerRef} w="100%" h="calc(100vh - 90px)" overflow="auto" pr="4">
        <SimpleGrid columns={cols} spacing={4} pt="4px" pb="8px">
          {gridCharts.map((g) => (
            <Card key={g.key} title={g.title} series={g.series as any} />
          ))}
        </SimpleGrid>
      </Box>
    );
  };

  /** ---------- Fullscreen overlay chart ---------- */
  const OverlayChart: React.FC<{ series: any[] }> = ({ series }) => {
    const wrapRef = useRef<HTMLDivElement>(null);
    const [dims, setDims] = useState({ w: 0, h: 0 });

    useEffect(() => {
      const el = wrapRef.current;
      if (!el) return;
      const ro = new ResizeObserver((entries) => {
        const r = entries[0].contentRect;
        setDims({ w: Math.round(r.width), h: Math.max(240, Math.round(r.height)) });
      });
      ro.observe(el);
      const r = el.getBoundingClientRect();
      setDims({ w: Math.round(r.width), h: Math.max(240, Math.round(r.height)) });
      return () => ro.disconnect();
    }, []);

    return (
      <Box ref={wrapRef} flex="1 1 auto" minH={0} p={4} overflow="hidden">
        <SplineGraph
          key={`${dims.w}x${dims.h}`}
          height={dims.h}
          legendHeight={28}
          apiData={series as any}
          bg="transparent"
          props={{
            ...commonChartProps,
            chart: { backgroundColor: "transparent", height: dims.h },
            xAxis: { ...commonChartProps.xAxis, tickInterval: 2 * 3600_000 },
            yAxis: { ...commonChartProps.yAxis, tickAmount: 6 },
          }}
        />
      </Box>
    );
  };

  // Title preference: overlay > selectedKey > default
  const selectedTitle =
    (overlay && gridCharts.find((g) => g.key === overlay)?.title) ||
    (selectedKey && gridCharts.find((g) => g.key === selectedKey)?.title) ||
    "Analytics";

  return (
    <>
      <GraphLayout
        title={
          <HStack>
            <Text fontSize="18px" fontWeight={600} color={TITLE}>{selectedTitle}</Text>
            <Menu>
              <MenuButton as={IconButton} aria-label="Open chart" icon={<FaAngleDown />} size="xs" />
              <MenuList fontSize="12px" minW="220px" color={TITLE} bg={CARD_BG} borderColor={BORDER}>
                {/* NEW: Default option */}
                <MenuItem
                  key="default"
                  onClick={() => setSelectedKey(null)}   // reset to default Analytics
                  bg={CARD_BG}
                  _hover={{ bg: MENU_HOVER }}
                >
                  Default (Analytics)
                </MenuItem>

                {gridCharts.map((g) => (
                  <MenuItem
                    key={g.key}
                    onClick={() => setSelectedKey(g.key)} // fullscreen NAHI khulega
                    bg={CARD_BG}
                    _hover={{ bg: MENU_HOVER }}
                  >
                    {g.title}
                  </MenuItem>
                ))}
              </MenuList>

            </Menu>
          </HStack>
        }
        width={["578px"]}
        height="344px"
        border={`1px solid ${BORDER}`}
        bg={CARD_BG}
        px="16px"
        contentProps={{ mt: 0 }}
        downloadOption={true}
        fullScreen={true}
      >
        <GridContent
          selectedSeries={
            selectedKey ? (gridCharts.find((g) => g.key === selectedKey)?.series as any[]) : undefined
          }
        />
      </GraphLayout>

      {overlay && (
        <Portal>
          <Box position="fixed" inset={0} bg="rgba(0,0,0,0.6)" zIndex={3000} onClick={() => setOverlay(null)}>
            <Box
              position="absolute"
              inset={0}
              bg={OVERLAY_BG}
              onClick={(e) => e.stopPropagation()}
              display="flex"
              flexDirection="column"
            >
              <Flex
                align="center"
                justify="space-between"
                px={4}
                py={3}
                borderBottom="1px solid"
                borderColor={BORDER}
                color={TITLE}
                gap={3}
                flex="0 0 auto"
              >
                <HStack>
                  <Maximize2 size={16} />
                  <Text fontSize="md" fontWeight={600}>
                    {gridCharts.find((g) => g.key === overlay)?.title}
                  </Text>
                </HStack>
                <CloseButton onClick={() => setOverlay(null)} />
              </Flex>
              <OverlayChart series={(gridCharts.find((g) => g.key === overlay)?.series as any) || []} />
            </Box>
          </Box>
        </Portal>
      )}
    </>
  );
}
