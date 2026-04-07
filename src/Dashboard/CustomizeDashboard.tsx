import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useDashboardData } from "../hooks/dashboard/useDashboardData";
import { energyDashboardConfig, getDefaultLayout } from "../Configs/Dashboards/Customize";
import GraphWidgetRenderer from "../components/Renderer/WidgetRenderer/GraphWidgetRenderer";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useDashboard } from "../hooks/dashboard/useDashboard";
import { useEffect } from "react";

// Wrap ResponsiveGridLayout with WidthProvider
const ResponsiveGridLayout = WidthProvider(Responsive);

const CustomizeDashboard = () => {
  
  const {loadSpecifiedDashboard, data: dashboardConfig} = useDashboard();
  useEffect(() => {
    loadSpecifiedDashboard('customize-dashboard');
  }, []);

  const { loadDashboardData, data, loading, error } = useDashboardData();

  useEffect(() => {
    if(!dashboardConfig) return;
    // console.log(Object.values(dashboardConfig.configuration.widgets));
    loadDashboardData(dashboardConfig);
  }, [dashboardConfig]);


  if (loading) return <Flex justify={"center"} alignItems={"center"} bg="gray.800" minH="100vh" minW={"100%"} color={"white"}><Spinner thickness='4px'
  speed='0.65s'
  emptyColor='gray.200'
  color='blue.500'
  size='xl' /></Flex>;
  if (error) return <Box color="red.500">Error: {error}</Box>;
  if (!dashboardConfig) return <Box>No dashboard configuration found.</Box>;

  // You can later load saved layout from API/localStorage
  const layout = dashboardConfig ? Object.values(dashboardConfig.configuration.widgets).map((widget : any) => widget.layout) : [];

  return (
    <Box bg="gray.800" color="white" p={4} minH="100vh" sx={{
    ".react-grid-layout": {
      height: "100%",
      minHeight: "300px",
    },
    ".react-grid-item": {
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
  }}>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={80}
        isDraggable={true}
        isResizable={true}
        isBounded={true}
        margin={[10, 10]}
        containerPadding={[0, 0]}
        onLayoutChange={(currentLayout, allLayouts) => {
          console.log("Layout changed:", allLayouts);
          //  Save layout to state, localStorage, or API
          // saveLayoutToBackend(allLayouts.lg);
        }}
        style={{ background: "transparent" }}
      >
        {dashboardConfig !== null ? Object.values(dashboardConfig.configuration.widgets).map((widget : any) => (
          <div key={widget.layout.i} data-grid={widget.layout}>
            {widget.type == "graph" ? (
              <GraphWidgetRenderer
                config={widget}
                data={data ? data[widget.dataSource.returnDataName] : {}}
              />
            ) : (<></>)}
          </div>
        )) : (<></>)}
      </ResponsiveGridLayout>
    </Box>
  );
};

export default CustomizeDashboard;