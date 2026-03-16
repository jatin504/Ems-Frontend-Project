import { Routes, Route, useSearchParams, useLocation } from "react-router-dom";
import { Box, useColorModeValue } from "@chakra-ui/react";

import Dashboard from "./Dashboard/Index";
import BatteryBank1Dashboard from "./components/BatteryBank1Dashboard";
import BatteryBank2Dashboard from "./components/BatteryBank2Dashboard";
import StringDashboard from "./components/StringDashboard";
import BessControl from "./Dashboard/BessControl";
import ReportDashboard from "./Dashboard/ReportDashboard";
import ReportTemplateDashboard from "./Dashboard/ReportTemplateDashboard";
import SLDDashboard from "./Dashboard/SLDDashboard";
import Navbar from "./components/NavBar";
import AlarmLatest from "./Dashboard/Alarm_Latest";
import DashboardLog from "./User/DashboardLog";
import AlarmHistory from "./Dashboard/Alarm_History";
// import AlarmEvents from "./Dashboard/Alarm_Events";
import ConfigDashboard from "./Dashboard/ConfigDashboard";
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
import Inverter from "./Dashboard/Inverter";
import TransformerDashboard from "./Dashboard/TransformerDashboard";
import IndividualTransformerDashboard from "./Dashboard/IndividualTransformerDashboard";
import PCSdashboard from "./Dashboard/PCSdashboard";
import MeterDashboard from "./Dashboard/MeterDashboard";
import WMSDashboard from "./Dashboard/WMSDashboard";
import SwitchGearDashboard from "./Dashboard/SwitchGearDashboard";
import ProtectionRelayDashboard from "./Dashboard/ProtectionRelayDashboard";
import SolarDashboard from "./Dashboard/RevampDashboards/solardashboard";
import DCZoneDashboard from "./Dashboard/DCZoneTabs";

import MainLayout from "./layouts/MainLayout";
import CalendarDashboard from "./Dashboard/CalendarDashboard";
import RTMDashboard from "./Dashboard/RTMDashboard";
import CommercialModeDashboard from "./Dashboard/CommercialModeDashboard";
import RTMAdjustmentDashboard from "./Dashboard/RTMAdjustmentDashboard";
import PlantConfigDashboard from "./components/DeviceConfig/PlantConfig";
import MarqueeNewsHeadline from "./components/MarqueeNewsHeadline";
import NetworkDashboard from "./Dashboard/networkDashboard"; // Corrected import path
import SolarView from "./Dashboard/SolarView";

/* Report routes are mapped below directly to DashboardLayout */

/* ---------------- App ---------------- */
function App() {
  const location = useLocation();

  return (
    <MainLayout>
      <Box>
        <Navbar />

        {/*  Hide marquee on login page only */}
        {location.pathname !== "/login" && <MarqueeNewsHeadline />}

        <Box bg={useColorModeValue("#F4F6F6", "#0E1111")}>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route path="/batterybank" element={<BatteryBank1Dashboard />} />
            <Route path="/battery-bank-2" element={<BatteryBank2Dashboard />} />
            <Route path="/string" element={<StringDashboard />} />
            <Route path="/battery-bank-2/string/:id" element={<StringDashboard />} />
            <Route path="/bess-control" element={<BessControl />} />

            {/* Alarms */}
            <Route path="/alarms/latest" element={<AlarmLatest />} />
            <Route path="/alarms/history" element={<AlarmHistory />} />
            {/* <Route path="/alarms/events" element={<AlarmEvents />} /> */}

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
                    { label: "Home", href: "/plantview" },
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
                    { label: "Home", href: "/plantview" },
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
                    { label: "Home", href: "/plantview" },
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

            {/* Custom Dashboard */}
            <Route path="/custom/dashboard/:id" element={<CustomDashboardView />} />

            {/* Revamp Dashboards */}
            <Route
              path="/plantview"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/plantview" },
                    { label: "Plant View" },
                  ]}
                >
                  <PlantViewDashboard />
                </DashboardLayout>
              }
            />

            <Route
              path="/batterybankk"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/plantview" },
                    { label: "Plant View", href: "/plantview" },
                    { label: "Battery Bank" },
                  ]}
                >
                  <PCSBankDashboard />
                </DashboardLayout>
              }
            />

            <Route
              path="/batteryrackk"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/plantview" },
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
              path="/besscontroll"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/plantview" },
                    { label: "Control", href: "/besscontroll" },
                    { label: "BESS" },
                  ]}
                >
                  <BessControlDashboard />
                </DashboardLayout>
              }
            />

            <Route
              path="/dsm"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/plantview" },
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
                    { label: "Home", href: "/devices/transformer" },
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
                    { label: "Home", href: "/devices/transformer" },
                    { label: "Transformers", href: "/devices/transformer" },
                    { label: "Transformer Details" },
                  ]}
                >
                  <IndividualTransformerDashboard />
                </DashboardLayout>
              }
            />

            <Route
              path="/devices/inv"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/devices/inv" },
                    { label: "Inverter" },
                  ]}
                >
                  <Inverter />
                </DashboardLayout>
              }
            />
            <Route
              path="/devices/pcs"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/devices/pcs" },
                    { label: "PCS" },
                  ]}
                >
                  <PCSdashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/devices/meter"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/devices/meter" },
                    { label: "Meter" },
                  ]}
                >
                  <MeterDashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/devices/wms"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/devices/wms" },
                    { label: "WMS" },
                  ]}
                >
                  <WMSDashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/devices/switch-gear"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/devices/switch-gear" },
                    { label: "Switch Gear" },
                  ]}
                >
                  <SwitchGearDashboard />
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
            {/* Network Dashboard Route */}
            <Route path="/network-dashboard" element={<NetworkDashboard />} />
           
            <Route
              path="/solardashboard"
              element={
                <DashboardLayout
                  breadcrumbs={[
                    { label: "Home", href: "/plantview" },
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
