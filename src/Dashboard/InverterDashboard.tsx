import {
  Box,
  GridItem,
  SimpleGrid,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

import InverterMeter from "../components/DashboardComponents/InverterComponents/Widgets/InverterMeter";
import InverterPower from "../components/DashboardComponents/InverterComponents/Widgets/InverterPower";
import InverterStatus from "../components/DashboardComponents/InverterComponents/Widgets/InverterStatus";

import InverterPowerGraph from "../components/DashboardComponents/InverterComponents/Widgets/InverterPowerGraph";
import InverterTempVarGraph from "../components/DashboardComponents/InverterComponents/Widgets/InverterTempVarGraph";
import InverterACCurrentGraph from "../components/DashboardComponents/InverterComponents/Widgets/InverterACCurrentGraph";
import InverterAvailabilityGraph from "../components/DashboardComponents/InverterComponents/Widgets/InverterAvailablityGraph";
import InverterControlGraph from "../components/DashboardComponents/InverterComponents/Widgets/InverterControlGraph";
import InverterDailyEnergyGraph from "../components/DashboardComponents/InverterComponents/Widgets/InverterDailyEnergyGraph";
import InverterDCVoltGraph from "../components/DashboardComponents/InverterComponents/Widgets/InverterDCVoltGraph";
import InverterOperationPatternGraph from "../components/DashboardComponents/InverterComponents/Widgets/InverterOperationPatternGraph";
import InverterTable from "../components/DashboardComponents/InverterComponents/Widgets/InverterTable";

import React, { useEffect, useMemo, useState } from "react";
import { ImPencil } from "react-icons/im";
import "../App.css";
import GlobalLoader from "../components/GlobalLoader";
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
// } from "@hello-pangea/dnd";
// import type { DropResult } from "@hello-pangea/dnd";

import Highcharts from "highcharts";
import HCMore from "highcharts/highcharts-more";
import HC3D from "highcharts/highcharts-3d";
import HCExporting from "highcharts/modules/exporting";
import HCExportData from "highcharts/modules/export-data";
import HCGantt from "highcharts/modules/gantt";
try { (HCMore as any)(Highcharts); } catch { (HCMore as any).default?.(Highcharts); }
try { (HC3D as any)(Highcharts); } catch { (HC3D as any).default?.(Highcharts); }
try { (HCExporting as any)(Highcharts); } catch { (HCExporting as any).default?.(Highcharts); }
try { (HCExportData as any)(Highcharts); } catch { (HCExportData as any).default?.(Highcharts); }
try { (HCGantt as any)(Highcharts); } catch { (HCGantt as any).default?.(Highcharts); }

type Widget = {
  id: string;
  h: string;     // base height (px as string)
  col: 1 | 2;
  render: () => React.JSX.Element;
};

const STORAGE_KEY = "inverter_widgets_order_v1";

// ======= new: single knob to shrink every component =======
const COMPACT = 1.2; // 80% of original heights (tweak this)
const shrink = (h: string) => {
  const n = parseFloat(h);
  return Number.isFinite(n) ? `${Math.round(n * COMPACT)}px` : h;
};

const InverterDashboard = () => {
  const { colorMode } = useColorMode();

  // Loader
  const [showLoader, setShowLoader] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShowLoader(false), 1500);
    return () => clearTimeout(t);
  }, []);

  // Drag toggle
  const [isDrag, setIsDrag] = useState<boolean>(false);
  const handleDrag = () => setIsDrag((s) => !s);

  // Base widgets
  const baseWidgets: Widget[] = useMemo(
    () => [
      { id: "1", h: "344px", col: 1, render: () => <InverterPowerGraph /> },
      { id: "2", h: "344px", col: 1, render: () => <InverterDailyEnergyGraph /> },
      { id: "3", h: "344px", col: 1, render: () => <InverterDCVoltGraph /> },
      { id: "4", h: "344px", col: 1, render: () => <InverterAvailabilityGraph /> },
      { id: "5", h: "344px", col: 1, render: () => <InverterACCurrentGraph /> },
      { id: "6", h: "344px", col: 1, render: () => <InverterOperationPatternGraph /> },
      { id: "7", h: "460px", col: 2, render: () => <InverterTable /> },
      { id: "8", h: "344px", col: 1, render: () => <InverterControlGraph /> },
      { id: "9", h: "344px", col: 1, render: () => <InverterTempVarGraph /> },
    ],
    []
  );

  // Load order
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return baseWidgets;
      const order: string[] = JSON.parse(saved);
      const map = new Map(baseWidgets.map((w) => [w.id, w]));
      return order.map((id) => map.get(id)!).filter(Boolean);
    } catch {
      return baseWidgets;
    }
  });

  // Persist order
  useEffect(() => {
    const order = widgets.map((w) => w.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  }, [widgets]);

  // DnD handler
  // const onDragEnd = (result: DropResult) => {
  //   const { destination, source } = result;
  //   if (!destination) return;
  //   if (
  //     destination.droppableId === source.droppableId &&
  //     destination.index === source.index
  //   )
  //     return;

  //   setWidgets((prev) => {
  //     const next = Array.from(prev);
  //     const [removed] = next.splice(source.index, 1);
  //     next.splice(destination.index, 0, removed);
  //     return next;
  //   });
  // };

  // Highcharts theme
  useEffect(() => {
    const isLight = colorMode === "light";
    Highcharts.setOptions({
      chart: {
        backgroundColor: isLight ? "#ffffff" : "transparent",
        style: {
          fontFamily:
            "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        },
      },
      title: { style: { color: isLight ? "#062D59" : "#e6e6e6" } },
      subtitle: { style: { color: isLight ? "#4A5568" : "#b9c0c7" } },
      xAxis: {
        gridLineColor: isLight ? "#E2E8F0" : "rgba(255,255,255,0.08)",
        lineColor: isLight ? "#CBD5E0" : "rgba(255,255,255,0.25)",
        tickColor: isLight ? "#CBD5E0" : "rgba(255,255,255,0.25)",
        labels: { style: { color: isLight ? "#062D59" : "#cfd6dd" } },
      },
      yAxis: {
        gridLineColor: isLight ? "#E2E8F0" : "rgba(255,255,255,0.08)",
        lineColor: isLight ? "#CBD5E0" : "rgba(255,255,255,0.25)",
        tickColor: isLight ? "#CBD5E0" : "rgba(255,255,255,0.25)",
        labels: { style: { color: isLight ? "#062D59" : "#cfd6dd" } },
        title: { style: { color: isLight ? "#062D59" : "#e6e6e6" } },
      },
      legend: {
        itemStyle: { color: isLight ? "#1A202C" : "#d7dde3" },
        itemHoverStyle: { color: isLight ? "#2D3748" : "#ffffff" },
      },
      tooltip: {
        backgroundColor: isLight ? "#ffffff" : "rgba(20,26,34,0.95)",
        borderColor: isLight ? "#E2E8F0" : "rgba(255,255,255,0.08)",
        style: { color: isLight ? "#1A202C" : "#e6e6e6" },
      },
      credits: { style: { color: isLight ? "#718096" : "#9099a3" } },
    });
  }, [colorMode]);

  // common panel props (lower minH so small tiles get shorter too)
  const panelProps = useMemo(
    () => ({
      bg: useColorModeValue("#ffffff", "#141a22"),
      border: "1px solid",
      borderColor: useColorModeValue("#E2E8F0", "rgba(255,255,255,0.08)"),
      rounded: "16px",
      boxShadow: useColorModeValue(
        "0 2px 6px rgba(0,0,0,0.08)",
        "0 4px 18px rgba(0,0,0,0.35)"
      ),
      w: "100%",
      h: "auto",
      minH: `${Math.round(259 * COMPACT)}px`,
      overflow: "hidden",
    }),
    [colorMode]
  );

  // every card’s content should fill the given height
  const fillChild = { "& > *": { height: "100% !important" } };

  return (
    <>
      {/* {showLoader && <GlobalLoader />} */}

      <Box
        display={showLoader ? "none" : "block"}
        mt="12px"
        pt="0"
        w="100%"
        maxW="100%"
        mx="0"
        px={{ base: 3, md: 6, lg: 8 }}
        pb={10}
        bg="transparent"
        overflowX="hidden"
      >
        {/* floating edit button */}
        {/* <Box
          position="fixed"
          bottom={6}
          right={6}
          zIndex={1000}
          p={3}
          bg={useColorModeValue("rgba(255,255,255,0.9)", "rgba(0,0,0,0.6)")}
          backdropFilter="blur(4px)"
          opacity={isDrag ? 0.95 : 0.85}
          _hover={{ opacity: 1 }}
          cursor="pointer"
          borderRadius="10px"
          onClick={handleDrag}
          boxShadow={useColorModeValue(
            "0 4px 12px rgba(0,0,0,0.12)",
            "0 4px 18px rgba(0,0,0,0.35)"
          )}
          border="1px solid"
          borderColor={useColorModeValue("#E2E8F0", "rgba(255,255,255,0.08)")}
        >
          <ImPencil color={useColorModeValue("#1A202C", "#ffffff")} size={16} />
        </Box> */}

        {/* Top ribbon — shorter tiles */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} w="100%" mb={5}>
          <GridItem {...panelProps} h={shrink("230px")} sx={fillChild}>
            <InverterMeter />
          </GridItem>
          <GridItem {...panelProps} h={shrink("230px")} sx={fillChild}>
            <InverterPower />
          </GridItem>
          <GridItem {...panelProps} h={shrink("230px")} sx={fillChild}>
            <InverterStatus />
          </GridItem>
        </SimpleGrid>

        {/* Draggable grid — apply shrunken heights per widget */}
              <SimpleGrid
                columns={{ base: 1, md: 2, xl: 3 }}
                spacing={5}
                w="100%"
              >
                {widgets.map((w, index) => (
                      <GridItem
                        colSpan={w.col ?? 1}
                        transition="transform 0.2s ease-in-out"
                        _hover={isDrag ? { cursor: "grabbing" } : {}}
                        {...panelProps}
                        h={shrink(w.h)}     // <<<<<< shorter height here
                        sx={fillChild}
                      >
                        {w.render()}
                      </GridItem>
                ))}
              </SimpleGrid>
      </Box>
    </>
  );
};

export default InverterDashboard;
