// CustomDashboardView.tsx
import {
  Box,
  Flex,
  Spinner,
  IconButton,
  HStack,
  Box as ChakraBox,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";

import GraphWidgetRenderer from "../components/Renderer/WidgetRenderer/GraphWidgetRenderer";
// import LatestCardWidgetRenderer from "../components/Renderer/WidgetRenderer/LatestCardWidgetRenderer";
import StandardWidgetRenderer from "../components/Renderer/WidgetRenderer/StandardWidgetRenderer";
import TableWidgetRenderer from "../components/Renderer/WidgetRenderer/TableWidgetRenderer";
import AdvanceTableWidgetRenderer from "../components/Renderer/WidgetRenderer/AdvanceTableWidgetRenderer";
import { useDashboardData } from "../hooks/dashboard/useDashboardData";
import { useDashboard } from "../hooks/dashboard/useDashboard";
import type { WidgetTemplate } from "../types/widget/widgetTemplates";
import WidgetTemplatePanel from "../components/WidgetTemplates/WidgetTemplatePanel";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import EditWidgetModal from "../components/CustomComponent/EditWidgetModal";
import DeleteWidgetAlert from "../components/CustomComponent/DeleteWidgetAlert";
import { i } from "framer-motion/m";

const ResponsiveGridLayout = WidthProvider(Responsive);

const DEFAULT_WIDGET_WIDTH = 4;
const DEFAULT_WIDGET_HEIGHT = 4;

const CustomDashboardView = () => {
  const { id } = useParams<{ id: string }>();
  const { loadSpecifiedDashboard, saveDashboard, getDashboard } = useDashboard();
  const { loadDashboardData, fetchForWidget, data, loading, error } = useDashboardData();

  const [dashboardConfig, setDashboardConfig] = useState<any>(null);

  const [editingWidget, setEditingWidget] = useState<any>(null);
  const [deletingWidgetId, setDeletingWidgetId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [controlsVisible, setControlsVisible] = useState<boolean>(false);
  const [isAddingWidget, setIsAddingWidget] = useState<boolean>(false);

  const bg = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const cardBg = useColorModeValue("white", "gray.900");
  const overlayBg = useColorModeValue("whiteAlpha.900", "blackAlpha.600");
  const spinnerColor = useColorModeValue("blue.500", "blue.300");
  const placeholderColor = useColorModeValue("gray.600", "gray.400");

  const normalizeWidget = (rawWidget: any, fallbackId?: string) => {
    const w = JSON.parse(JSON.stringify(rawWidget || {}));
    w.id =
      w.id ||
      fallbackId ||
      (typeof w.layout === "object" && w.layout.i) ||
      `widget_${Date.now()}`;
    w.layout = w.layout || {};
    w.layout.i = w.layout.i || w.id;
    w.layout.x = typeof w.layout.x === "number" ? w.layout.x : 0;
    w.layout.y = typeof w.layout.y === "number" ? w.layout.y : Infinity;
    w.layout.w =
      typeof w.layout.w === "number" ? w.layout.w : DEFAULT_WIDGET_WIDTH;
    w.layout.h =
      typeof w.layout.h === "number" ? w.layout.h : DEFAULT_WIDGET_HEIGHT;

    w.dataSource = w.dataSource || {};
    w.dataSource.returnDataName =
      w.dataSource.returnDataName || `ds_${w.id}`;
    w.dataSource.keys = Array.isArray(w.dataSource.keys)
      ? w.dataSource.keys
      : w.dataSource.keys
      ? [w.dataSource.keys]
      : [];

    // graph config sirf graph-type widgets
    if (w.type === "graph" || !w.type) {
      w.graph = w.graph || {
        type: w.type === "latest_card" ? "card" : "combination",
      };
    }

    w.props = w.props || {};
    w.props.height = w.props.height || "250px";
    w.props.chartProps = w.props.chartProps || {};

    w.title = w.title || "Untitled";
    w.type = w.type || "graph";

    return w;
  };

  const normalizeDashboardConfig = (raw: any) => {
    if (!raw) return raw;
    const copy = JSON.parse(JSON.stringify(raw));
    copy.config = copy.config || {};
    copy.config.widgets = copy.config.widgets || {};
    const normalizedWidgets: Record<string, any> = {};
    Object.entries(copy.config.widgets).forEach(([k, v]: any) => {
      const norm = normalizeWidget(v as any, k);
      normalizedWidgets[norm.id] = norm;
    });
    copy.config.widgets = normalizedWidgets;
    return copy;
  };

  useEffect(() => {
    if (!id) return;
    const rawDashboard = loadSpecifiedDashboard(id);
    
    if (!rawDashboard) return;
    const parsedConfig =
      typeof rawDashboard.config === "string"
        ? JSON.parse(rawDashboard.config)
        : rawDashboard.config;
    const fullDashboard = { ...rawDashboard, config: parsedConfig };
    console.log("[DASHBOARD_LOAD] loaded dashboard:", fullDashboard);
    const normalized = normalizeDashboardConfig(fullDashboard);
    console.log("[DASHBOARD_LOAD] normalized dashboard:", normalized);
    setDashboardConfig(normalized);

    void loadDashboardData({...normalized});
  }, [id, loadDashboardData]);

  const addWidgetFromTemplate = async (template: WidgetTemplate) => {
    setIsAddingWidget(true);
    try {
      if (!dashboardConfig) {
        console.warn("Dashboard config not loaded yet - cannot add widget");
        return;
      }

      const newId = `${id}_widget_${(template.name || template.title || "widget")
        .toString()
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}_${Date.now()}`;

      const widgetConfig =
        typeof template.config === "string"
          ? JSON.parse(template.config)
          : template.config;
      const cloned = JSON.parse(JSON.stringify(widgetConfig || {}));

      const widget = normalizeWidget(
        {
          ...cloned,
          id: newId,
          title: template.title || cloned.title || "Untitled",
          type: template.type || cloned.type || "graph",
          layout: {
            i: newId,
            x:
              (Object.keys(dashboardConfig?.config?.widgets || {}).length *
                2) %
              12,
            y:
              Math.floor(
                Object.keys(dashboardConfig?.config?.widgets || {})
                  .length / 6
              ) * DEFAULT_WIDGET_HEIGHT,
            w: cloned.layout?.w || DEFAULT_WIDGET_WIDTH,
            h: cloned.layout?.h || DEFAULT_WIDGET_HEIGHT,
          },
        },
        newId
      );

      console.log(
        "[ADD_WIDGET] fetching data for new widget before mounting:",
        widget.id
      );

      const fetchResult = await fetchForWidget(widget);

      console.log("[ADD_WIDGET] fetchForWidget result:", fetchResult);

      const updatedWidgets = {
        ...dashboardConfig.config.widgets,
        [widget.id]: widget,
      };

      const updatedDashboard = {
        ...dashboardConfig,
        config: {
          ...dashboardConfig.config,
          widgets: updatedWidgets,
        },
      };

      setDashboardConfig(updatedDashboard);

      setEditMode(true);
      setControlsVisible(true);

      try {
        const stored = localStorage.getItem("dashboards");
        const parsed = stored ? JSON.parse(stored) : [];
        let updatedList: any[] = [];
        if (Array.isArray(parsed) && parsed.length > 0) {
          let replaced = false;
          updatedList = parsed.map((d: any) => {
            if (d.id === updatedDashboard.id) {
              replaced = true;
              return updatedDashboard;
            }
            return d;
          });
          if (!replaced) updatedList.push(updatedDashboard);
        } else {
          updatedList = [updatedDashboard];
        }
        localStorage.setItem("dashboards", JSON.stringify(updatedList));
      } catch (err) {
        console.warn("Failed to persist dashboard to localStorage:", err);
      }

      try {
        await saveDashboard(updatedDashboard as any);
        await getDashboard();
        if (!id) return;
        const rawDashboard = loadSpecifiedDashboard(id);
    
        if (!rawDashboard) return;
        const parsedConfig =
          typeof rawDashboard.config === "string"
            ? JSON.parse(rawDashboard.config)
            : rawDashboard.config;
        const fullDashboard = { ...rawDashboard, config: parsedConfig };
        console.log("[DASHBOARD_LOAD] loaded dashboard:", fullDashboard);
        const normalized = normalizeDashboardConfig(fullDashboard);
        console.log("[DASHBOARD_LOAD] normalized dashboard:", normalized);
        setDashboardConfig(normalized);

        void loadDashboardData({...normalized});

      } catch (err) {
        // ignore
      }

      console.log(
        "[ADD_WIDGET] widget added and dashboardConfig updated:",
        widget.id
      );
    } catch (err) {
      console.error("Error in addWidgetFromTemplate:", err);
    }
    setIsAddingWidget(false);
  };

  const updateWidget = async (updatedWidget: any) => {
    if (!dashboardConfig) return;
    const currentWidget = dashboardConfig.config.widgets[updatedWidget.id];
    if (!currentWidget) return;

    const merged = {
      ...currentWidget,
      ...updatedWidget,
      dataSource: {
        ...currentWidget.dataSource,
        ...(updatedWidget.dataSource || {}),
      },
      graph: {
        ...currentWidget.graph,
        ...(updatedWidget.graph || {}),
      },
      props: {
        ...currentWidget.props,
        ...(updatedWidget.props || {}),
      },
      layout:
        currentWidget.layout ||
        updatedWidget.layout || { ...currentWidget.layout },
    };

    const newWidgets = {
      ...dashboardConfig.config.widgets,
      [merged.id]: normalizeWidget(merged, merged.id),
    };

    const updatedDashboard = {
      ...dashboardConfig,
      config: {
        ...dashboardConfig.config,
        widgets: newWidgets,
      },
    };

    // Update local state immediately
    setDashboardConfig(updatedDashboard);
    void loadDashboardData(updatedDashboard);

    // Save to localStorage immediately
    try {
      const stored = localStorage.getItem("dashboards");
      const parsed = stored ? JSON.parse(stored) : [];
      let updatedList: any[] = [];
      if (Array.isArray(parsed) && parsed.length > 0) {
        let replaced = false;
        updatedList = parsed.map((d: any) => {
          if (d.id === updatedDashboard.id) {
            replaced = true;
            return updatedDashboard;
          }
          return d;
        });
        if (!replaced) updatedList.push(updatedDashboard);
      } else {
        updatedList = [updatedDashboard];
      }
      localStorage.setItem("dashboards", JSON.stringify(updatedList));
      console.log("[UPDATE_WIDGET] Widget changes saved to localStorage immediately");
    } catch (err) {
      console.warn("Failed to persist widget changes to localStorage:", err);
    }

    // Save to database asynchronously
    try {
      await saveDashboard(updatedDashboard);
      console.log("[UPDATE_WIDGET] Widget changes saved to database successfully");
    } catch (err) {
      console.warn("Failed to save widget changes to database:", err);
      // Even if database save fails, localStorage is already updated
      // so changes will persist on refresh
    }

    setEditingWidget(null);
  };

  const deleteWidget = async () => {
    if (!deletingWidgetId || !dashboardConfig) return;

    const { [deletingWidgetId]: _, ...updatedWidgets } =
      dashboardConfig.config.widgets;

    const updatedDashboard = {
      ...dashboardConfig,
      config: {
        ...dashboardConfig.config,
        widgets: updatedWidgets,
      },
    };

    // Update local state immediately
    setDashboardConfig(updatedDashboard);
    void loadDashboardData(updatedDashboard);

    // Save to localStorage immediately
    try {
      const stored = localStorage.getItem("dashboards");
      const parsed = stored ? JSON.parse(stored) : [];
      let updatedList: any[] = [];
      if (Array.isArray(parsed) && parsed.length > 0) {
        let replaced = false;
        updatedList = parsed.map((d: any) => {
          if (d.id === updatedDashboard.id) {
            replaced = true;
            return updatedDashboard;
          }
          return d;
        });
        if (!replaced) updatedList.push(updatedDashboard);
      } else {
        updatedList = [updatedDashboard];
      }
      localStorage.setItem("dashboards", JSON.stringify(updatedList));
      console.log("[DELETE_WIDGET] Widget deletion saved to localStorage immediately");
    } catch (err) {
      console.warn("Failed to persist widget deletion to localStorage:", err);
    }

    // Save to database asynchronously
    try {
      await saveDashboard(updatedDashboard);
      console.log("[DELETE_WIDGET] Widget deletion saved to database successfully");
    } catch (err) {
      console.warn("Failed to save widget deletion to database:", err);
      // Even if database save fails, localStorage is already updated
    }

    setDeletingWidgetId(null);
  };

  const handleLayoutChange = (currentLayout: any, _allLayouts: any) => {
    if (!dashboardConfig) return;

    const updatedWidgets = { ...dashboardConfig.config.widgets };

    currentLayout.forEach((item: any) => {
      if (updatedWidgets[item.i]) {
        updatedWidgets[item.i] = {
          ...updatedWidgets[item.i],
          layout: {
            i: item.i,
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h,
          },
        };
      }
    });

    const updatedDashboard = {
      ...dashboardConfig,
      config: {
        ...dashboardConfig.config,
        widgets: updatedWidgets,
      },
    };

    setDashboardConfig(updatedDashboard);

    // Save layout changes to localStorage immediately
    try {
      const stored = localStorage.getItem("dashboards");
      const parsed = stored ? JSON.parse(stored) : [];
      let updatedList: any[] = [];
      if (Array.isArray(parsed) && parsed.length > 0) {
        let replaced = false;
        updatedList = parsed.map((d: any) => {
          if (d.id === updatedDashboard.id) {
            replaced = true;
            return updatedDashboard;
          }
          return d;
        });
        if (!replaced) updatedList.push(updatedDashboard);
      } else {
        updatedList = [updatedDashboard];
      }
      localStorage.setItem("dashboards", JSON.stringify(updatedList));
      console.log("[LAYOUT_CHANGE] Layout changes saved to localStorage");
    } catch (err) {
      console.warn("Failed to persist layout changes to localStorage:", err);
    }

    // Also save to database (but with a small delay to avoid too many saves)
    setTimeout(async () => {
      try {
        await saveDashboard(updatedDashboard);
        console.log("[LAYOUT_CHANGE] Layout changes saved to database");
      } catch (err) {
        console.warn("Failed to save layout changes to database:", err);
      }
    }, 1000); // 1 second delay to batch layout changes
  };

  const layout = useMemo(() => {
    if (!dashboardConfig?.config?.widgets) return [];

    return (Object.values(dashboardConfig.config.widgets) as any[])
      .filter((widget: any) => widget?.layout?.i)
      .map((widget: any) => ({
        i: widget.layout.i,
        x: typeof widget.layout.x === "number" ? widget.layout.x : 0,
        y: typeof widget.layout.y === "number" ? widget.layout.y : 0,
        w:
          typeof widget.layout.w === "number"
            ? widget.layout.w
            : DEFAULT_WIDGET_WIDTH,
        h:
          typeof widget.layout.h === "number"
            ? widget.layout.h
            : DEFAULT_WIDGET_HEIGHT,
      }));
  }, [dashboardConfig]);

  const handleEdit = (widget: any) => {
    const { layout: _, ...configWithoutLayout } = widget;
    setEditingWidget(configWithoutLayout);
  };

  const handleSaveEdit = async (widget: any) => {
    await updateWidget(widget);
  };

  const handleCancelEdit = () => {
    setEditingWidget(null);
  };

  const handleSaveDashboardToDB = () => {
    if (!dashboardConfig) return;
    setControlsVisible(false);
    setEditMode(false);
    const toSave = JSON.parse(JSON.stringify(dashboardConfig));
    void saveDashboard(toSave);
  };

  if (loading && !isAddingWidget)
    return (
      <Flex justify="center" align="center" bg={bg} minH="100vh">
        <Spinner size="xl" color={spinnerColor} />
      </Flex>
    );

  if (error)
    return (
      <Box color="red.500" p={4}>
        Error: {error}
      </Box>
    );

  if (!dashboardConfig)
    return (
      <Box bg={bg} color={textColor} p={4}>
        Dashboard not found.
      </Box>
    );

  const widgets = Object.values(dashboardConfig?.config?.widgets || {});

  return (
    <Box
      bg={bg}
      color={textColor}
      p={4}
      minH="100vh"
      sx={{
        ".react-grid-layout": { minHeight: "300px" },
        ".react-grid-item": {
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      <HStack spacing={4}>
        <Button
          colorScheme={editMode ? "red" : "blue"}
          onClick={() => {
            const next = !editMode;
            setEditMode(next);
            setControlsVisible(next);
          }}
        >
          {editMode ? "Exit Edit" : "Edit Dashboard"}
        </Button>

        {editMode && <WidgetTemplatePanel onAddWidget={addWidgetFromTemplate} />}

        {editMode && (
          <Button colorScheme="green" onClick={handleSaveDashboardToDB}>
            Save Dashboard
          </Button>
        )}
      </HStack>

      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={10}
        isDraggable={editMode}
        isResizable={editMode}
        draggableCancel={
          ".no-drag, button, input, textarea, select, .non-draggable"
        }
        margin={[10, 10]}
        containerPadding={[0, 0]}
        onLayoutChange={handleLayoutChange}
        style={{ background: "transparent" }}
      >
        {widgets.length > 0 ? (
          (widgets as any[]).map((widget: any) => (
            <div
              key={widget.id || widget.layout?.i}
              data-grid={
                widget.layout || {
                  i: widget.id,
                  x: 0,
                  y: 0,
                  w: DEFAULT_WIDGET_WIDTH,
                  h: DEFAULT_WIDGET_HEIGHT,
                }
              }
            >
              <ChakraBox
                h="100%"
                display="flex"
                flexDirection="column"
                bg={cardBg}
                color={textColor}
                borderRadius="md"
                boxShadow="sm"
                position="relative"
              >
                {editMode && controlsVisible && (
                  <HStack
                    spacing={1}
                    position="absolute"
                    top={1}
                    right={1}
                    zIndex={10}
                    bg={overlayBg}
                    pointerEvents="auto"
                    borderRadius="md"
                    px={1}
                  >
                    <IconButton
                      className="no-drag"
                      aria-label="Edit widget"
                      icon={<EditIcon />}
                      size="xs"
                      colorScheme="yellow"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(widget);
                      }}
                    />
                    <IconButton
                      className="no-drag"
                      aria-label="Delete widget"
                      icon={<DeleteIcon />}
                      size="xs"
                      colorScheme="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingWidgetId(widget.id);
                      }}
                    />
                  </HStack>
                )}

                <ChakraBox flex="1" overflow="hidden" p={2}>
                  {widget.type === "graph" ? (
                    <GraphWidgetRenderer
                      config={widget}
                      data={
                        data?.[widget.dataSource?.returnDataName] || {}
                      }
                    />
                  // ) : widget.type === "latest_card" ? (
                  //   <LatestCardWidgetRenderer
                  //     config={widget}
                  //     data={
                  //       data?.[widget.dataSource?.returnDataName] || {}
                  //     }
                  //   />
                  ) : widget.type === "standard" ? (
                    <StandardWidgetRenderer
                      config={widget}
                      data={
                        data?.[widget.dataSource?.returnDataName] || {}
                      }
                    />
                  ) : widget.type === "table" ? (
                    <TableWidgetRenderer
                      config={widget}
                      data={
                        data?.[widget.dataSource?.returnDataName] || []
                      }
                    />
                  ) : widget.type === "advance_table" ? (
                    <AdvanceTableWidgetRenderer
                      config={widget}
                      data={
                        data?.[widget.dataSource?.returnDataName] || []
                      }
                    />
                  ) : null}
                </ChakraBox>
              </ChakraBox>
            </div>
          ))
        ) : (
          <div
            key="no-widgets-placeholder"
            data-grid={{ i: "empty", x: 0, y: 0, w: 12, h: 2 }}
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              color={placeholderColor}
              fontSize="lg"
              height="100%"
              textAlign="center"
            >
              No widgets added yet.
            </Box>
          </div>
        )}
      </ResponsiveGridLayout>

      <EditWidgetModal
        isOpen={!!editingWidget}
        onClose={handleCancelEdit}
        widget={editingWidget}
        onSave={handleSaveEdit}
      />

      <DeleteWidgetAlert
        isOpen={!!deletingWidgetId}
        onClose={() => setDeletingWidgetId(null)}
        onConfirm={deleteWidget}
        widgetTitle={
          dashboardConfig?.config?.widgets?.[deletingWidgetId!]?.title ||
          "this widget"
        }
      />
    </Box>
  );
};

export default CustomDashboardView;
