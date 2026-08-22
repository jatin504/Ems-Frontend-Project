import { Routes, Route, useLocation } from "react-router-dom";
import { Box, useColorModeValue } from "@chakra-ui/react";
import HomeDashboard from "./Dashboard/HomeDashboard";
import BatteryBank1Dashboard from "./components/BatteryBank1Dashboard";
import BatteryBank2Dashboard from "./components/BatteryBank2Dashboard";
import StringDashboard from "./components/StringDashboard";
import GensetDashboard from "./Dashboard/GensetDashboard";
import GridDashboard from "./Dashboard/GridControlDashboard";
import PPCDashboard from "./Dashboard/PPCDashboard";
import BessControl from "./Dashboard/BessControl";
import EventLatest from "./Dashboard/Event_Latest";
import EventHistory from "./Dashboard/Event_History";
import NewDashboard from "./Dashboard/NewDashboard";
import ReportDashboard from "./Dashboard/ReportDashboard";
import TradingDashboard from "./Dashboard/TradingDashboard";
import ReportTemplateDashboard from "./Dashboard/ReportTemplateDashboard";
import SLDDashboard from "./Dashboard/SLDDashboard";
import Navbar from "./components/NavBar";
import AlarmLatest from "./Dashboard/Alarm_Latest";
import DashboardLog from "./User/DashboardLog";
import StringNewDashboard from "./Dashboard/StringNewDashboard";
import WMSDashboard_1 from "./Dashboard/WMSDashboard_1";
import AlarmHistory from "./Dashboard/Alarm_History";
import NotificationToast from "./components/NotificationToast";
// import AlarmEvents from "./Dashboard/Alarm_Events";
import ConfigDashboard from "./Dashboard/ConfigDashboard";
import ManualBlackStartDashboard from "./Dashboard/ManualBlackStartDashboard";
import ConfigList from "./components/ConfigList";
import UsersPage from "./User/UsersPage";
import ProfilePage from "./User/ProfilePage";
import SettingsPage from "./User/SecuritySettings/SettingsPage";
import LoginPage from "./User/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import CustomDashboardView from "./Dashboard/CustomDashboardView";
import PlantViewDashboard from "./Dashboard/RevampDashboards/PlantViewDashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import PCSBankDashboard from "./Dashboard/RevampDashboards/PCSBankDashboard";
import RackDashboard from "./Dashboard/RevampDashboards/RackDashboard";
import BessControlDashboard from "./Dashboard/RevampDashboards/BessControlDashboard";
import UserLogDashboard from "./User/UserLogDashboard";
import DSMDashboard from "./Dashboard/RevampDashboards/DSMdashboard";
// import Inverter from "./Dashboard/Inverter";
import TransformerDashboard from "./Dashboard/TransformerDashboard";
import IndividualTransformerDashboard from "./Dashboard/IndividualTransformerDashboard";
import PCSdashboard from "./Dashboard/PCSdashboard";
import ControlNewDashboard from "./Dashboard/ControlNewDashboard";
// import MeterDashboard from "./Dashboard/MeterDashboard";
import MeterDashboard_1 from "./Dashboard/MeterDashboard_1";
import WMSDashboard from "./Dashboard/WMSDashboard";
import SwitchGearDashboard from "./Dashboard/SwitchGearDashboard";
import ProtectionRelayDashboard from "./Dashboard/ProtectionRelayDashboard";
import SolarDashboard from "./Dashboard/RevampDashboards/solardashboard";
import DCZoneDashboard from "./Dashboard/DCZoneTabs";
import InverterOverviewDashboard from "./Dashboard/InverterOverviewDashboard";
import InverterDetailDashboard from "./Dashboard/InverterDetailDashboard";
import MainLayout from "./layouts/MainLayout";
import CalendarDashboard from "./Dashboard/CalendarDashboard";
import RTMDashboard from "./Dashboard/RTMDashboard";
import CommercialModeDashboard from "./Dashboard/CommercialModeDashboard";
import RTMAdjustmentDashboard from "./Dashboard/RTMAdjustmentDashboard";
import PlantConfigDashboard from "./components/DeviceConfig/PlantConfig";
import MarqueeNewsHeadline from "./components/MarqueeNewsHeadline";
import NetworkDashboard from "./Dashboard/networkDashboard"; // Corrected import path
import SolarView from "./Dashboard/SolarView";
import BillingDashboard from "./Dashboard/BillingDashboard";
import PCSDetail from "./Dashboard/PCSDetail";
import BessDashboard from "./Dashboard/BessDashboard";
import BatteryIntelligenceDashboard from "./Dashboard/BatteryIntelligenceDashboard";
import ControlLoadForecastDashboard from "./Dashboard/ControlLoadForecastDashboard";
/* Report routes are mapped below directly to DashboardLayout */

function BatteryBankRoute() {
  const location = useLocation();
  const source = (location.state as { breadcrumbSource?: string } | null)?.breadcrumbSource;

  const breadcrumbs =
    source === "bess"
      ? [
          { label: "Home", href: "/" },
          { label: "BESS", href: "/devices/bess" },
          { label: "Battery Bank" },
        ]
      : [
          { label: "Home", href: "/" },
          { label: "Plant View", href: "/plantview" },
          { label: "Battery Bank" },
        ];

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <PCSBankDashboard />
    </DashboardLayout>
  );
}

/* ---------------- App ---------------- */
function App() {
  const location = useLocation();

  return (
    <MainLayout>
      <Box>
        <Navbar />

        {/*  Hide marquee on login page only */}
        {location.pathname !== "/login" && <MarqueeNewsHeadline />}
        {location.pathname !== "/login" && <NotificationToast />}

        <Box bg={useColorModeValue("#F4F6F6", "#0E1111")}>

  <Routes>

    <Route
  path="/"
  element={
    <PrivateRoute>
      <DashboardLayout breadcrumbs={[]}>
        <HomeDashboard />
      </DashboardLayout>
    </PrivateRoute>
  }
/>

<Route
      path="/newdashboard"
      element={
        <PrivateRoute>
          <NewDashboard />
        </PrivateRoute>
      }
    />

    <Route path="/batterybank" element={<BatteryBank1Dashboard />} />
            <Route path="/battery-bank-2" element={<BatteryBank2Dashboard />} />
            <Route path="/string" element={<StringDashboard />} />
            <Route path="/battery-bank-2/string/:id" element={<StringDashboard />} />
            <Route path="/bess-control" element={<BessControl />} />
            <Route
              path="/Load-Forecast"
              element={
                <DashboardLayout
                  breadcrumbs={[{ label: "Home", href: "/" }, { label: "Control" }]}
                >
                  <ControlNewDashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/control-load-forecast"
              element={
                <DashboardLayout
                  breadcrumbs={[{ label: "Home", href: "/" }, { label: "Control" }, { label: "Load Forecast" }]}
                >
                  <ControlLoadForecastDashboard />
                </DashboardLayout>
              }
            />

            {/* Alarms */}
            <Route path="/alarms/latest" element={<AlarmLatest />} />
            <Route path="/alarms/history" element={<AlarmHistory />} />
            {/* <Route path="/alarms/events" element={<AlarmEvents />} /> */}
            <Route path="/events/latest" element={<EventLatest />} />
<Route path="/events/history" element={<EventHistory />} />
            {/* Reports */}
            <Route
              path="/report"
              element={
                <DashboardLayout
                  breadcrumbs={[{ label: "Home", href: "/" }, { label: "Report" }]}
                >
                  <ReportDashboard />
                </DashboardLayout>
              }
            />

            <Route
              path="/report/template"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Report", href: "/report" },
                    { label: "Template" },
                  ]}
                >
                  <ReportTemplateDashboard />
                </DashboardLayout>
              }
            />
            <Route
  path="/string-new-dashboard"
  element={
    <DashboardLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "String Dashboard" },
      ]}
    >
      <StringNewDashboard />
    </DashboardLayout>
  }
/>
            <Route
              path="/template"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Report Template" },
                  ]}
                >
                  <ReportTemplateDashboard />
                </DashboardLayout>
              }
            />

            {/* Other */}
            <Route path="/sld" element={<SLDDashboard />} />
            <Route path="/calendar" element={<CalendarDashboard />} />
            <Route
              path="/config/device"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Config" },
                  ]}
                >
                  <ConfigDashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/config/list"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Config List" },
                  ]}
                >
                  <ConfigList />
                </DashboardLayout>
              }
            />
            <Route
              path="/solarview"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Solar View" },
                  ]}
                >
                  <SolarView />
                </DashboardLayout>
              }
            />
            <Route
              path="/config/plant"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Plant Config" },
                  ]}
                >
                  <PlantConfigDashboard />
                </DashboardLayout>
              }
            />

            {/* Login */}
            <Route path="/login" element={<LoginPage />} />

            {/* Users */}
            <Route
              path="/users"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Users" },
                  ]}
                >
                  <UsersPage />
                </DashboardLayout>
              }
            />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="/userlog"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "User Logs" },
                  ]}
                >
                  <UserLogDashboard />
                </DashboardLayout>
              }
            /> <Route path="/dashboardlog" element={<DashboardLog />} />
            <Route
              path="/settings"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Settings" },
                  ]}
                >
                  <SettingsPage />
                </DashboardLayout>
              }
            />
            {/* Billing */}
            <Route
              path="/billing"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Billing" },
                  ]}
                >
                  <BillingDashboard />
                </DashboardLayout>
              }
            />

            {/* Custom Dashboard */}
            <Route path="/custom/dashboard/:id" element={<CustomDashboardView />} />

            {/* Revamp Dashboards */}
            <Route
              path="/plantview"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Plant View" },
                  ]}
                >
                  <PlantViewDashboard />
                </DashboardLayout>
              }
            />

            <Route path="/batterybankk" element={<BatteryBankRoute />} />

            <Route
              path="/batteryrackk"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Plant View", href: "/plantview" },
                    { label: "Battery Bank", href: "/batterybankk" },
                    { label: "Rack" },
                  ]}
                >
                  <RackDashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/ppc"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "PPC" },
                  ]}
                >
                  <PPCDashboard />
                </DashboardLayout>
              }
            />

            <Route
              path="/besscontroll"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Control", href: "/besscontroll" },
                    { label: "BESS" },
                  ]}
                >
                  <BessControlDashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/devices/bess"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Devices", href: "/devices/bess" },
                    { label: "BESS" },
                  ]}
                >
                  <BessDashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/devices/bess/battery-intelligence"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Devices", href: "/devices/bess" },
                    { label: "Battery Intelligence" },
                  ]}
                >
                  <BatteryIntelligenceDashboard />
                </DashboardLayout>
              }
            />

            <Route
              path="/dsm"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "DSM" },
                  ]}
                >
                  <DSMDashboard />
                </DashboardLayout>
              }
            />

            <Route path="/rtm" element={<RTMDashboard />} />
            <Route path="/rtm-adjustment" element={<RTMAdjustmentDashboard />} />
            <Route path="/commercial-mode" element={<CommercialModeDashboard />} />

            {/* Devices */}
            <Route
              path="/devices/transformer"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Transformers" },
                  ]}
                >
                  <TransformerDashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/devices/transformer/:id"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Transformers", href: "/devices/transformer" },
                    { label: "Transformer Details" },
                  ]}
                >
                  <IndividualTransformerDashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/tradingdashboard"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Control", href: "/tradingdashboard" },
                    { label: "Trading" },
                  ]}
                >
                  <TradingDashboard />
                </DashboardLayout>
              }
            />
            {/* <Route
              path="/devices/inv"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Inverter" },
                  ]}
                >
                  <Inverter />
                </DashboardLayout>
              }
            /> */}
            <Route
              path="/devices/inv"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Inverter" },
                  ]}
                >
                  <InverterOverviewDashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/inverter-overview"
              element={
                <DashboardLayout
                  breadcrumbs={[{ label: "Home", href: "/" }, { label: "Inverter Overview" }]}
                >
                  <InverterOverviewDashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/devices/inv/details"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Inverter", href: "/devices/inv" },
                    { label: "Inverter Details" },
                  ]}
                >
                  <InverterDetailDashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/devices/pcs"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "PCS" },
                  ]}
                >
                  <PCSdashboard />
                </DashboardLayout>
              }
            />
            {/* <Route
              path="/devices/meter"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Meter" },
                  ]}
                >
                  <MeterDashboard />
                </DashboardLayout>
              }
            /> */}
            <Route
              path="/manual-black-start"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Control", href: "/besscontroll" },
                    { label: "Manual Black Start" },
                  ]}
                >
                  <ManualBlackStartDashboard />
                </DashboardLayout>
              }
            /> 
            <Route
              path="/devices/meter-1"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/devices/meter-1" },
                    { label: "Meter" },
                  ]}
                >
                  <MeterDashboard_1 />
                </DashboardLayout>
              }
            />
            <Route
              path="/devices/wms"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "WMS" },
                  ]}
                >
                  <WMSDashboard />
                </DashboardLayout>
              }
            />
            <Route
  path="/devices/wms-1"
  element={
    <DashboardLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "WMS" },
      ]}
    >
      <WMSDashboard_1 />
    </DashboardLayout>
  }
/>
            <Route
              path="/devices/switch-gear"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Switch Gear" },
                  ]}
                >
                  <SwitchGearDashboard />
                </DashboardLayout>
              }
            />
            <Route
  path="/devices/pcs/details"
  element={
    <DashboardLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "PCS", href: "/devices/pcs" },
        { label: "PCS Details" },
      ]}
    >
      <PCSDetail />
    </DashboardLayout>
  }
/>
            <Route
              path="/devices/protection-relay"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Dashboards", href: "/dashboards" },
                    { label: "Protection Relay" },
                  ]}
                >
                  <ProtectionRelayDashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/genset"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Genset Control" },
                  ]}
                >
                  <GensetDashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/grid"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Grid Control" },
                  ]}
                >
                  <GridDashboard />
                </DashboardLayout>
              }
            />


            {/* Network Dashboard Route */}
            <Route path="/network-dashboard" element={<NetworkDashboard />} />
           
            <Route
              path="/solardashboard"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Control", href: "/solardashboard" },
                    { label: "Solar" },
                  ]}
                >
                  <SolarDashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/devices/dc-zone"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "DC Zone" },
                  ]}
                >
                  <DCZoneDashboard />
                </DashboardLayout>
              }
            />
          </Routes>
        </Box>
      </Box>
    </MainLayout>
  );
}

export default App;
