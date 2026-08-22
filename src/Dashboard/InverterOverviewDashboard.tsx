import React from "react";
import { useColorModeValue } from "@chakra-ui/react";

import PowerTrendChart from "../components/DashboardComponents/Inverter/inverteroverviewcomponent/PowerTrendChart.tsx";
import YieldChart from "../components/DashboardComponents/Inverter/inverteroverviewcomponent/YieldChart.tsx";
import InverterTable from "../components/DashboardComponents/Inverter/inverteroverviewcomponent/InverterTable.tsx";
import InverterHeatmap from "../components/DashboardComponents/Inverter/inverteroverviewcomponent/InverterHeatmap.tsx";
import PerformanceSummary from "../components/DashboardComponents/Inverter/inverteroverviewcomponent/PerformanceSummary.tsx";
import TopInverters from "../components/DashboardComponents/Inverter/inverteroverviewcomponent/TopInverters.tsx";
import Availiblitychart from "../components/DashboardComponents/Inverter/inverteroverviewcomponent/AvailabilityChart.tsx";
import DCVoltageChart from "../components/DashboardComponents/Inverter/inverteroverviewcomponent/DCVoltageChart.tsx";

const inverterCss = `
.card{
  background:var(--card-bg);
  border-radius:8px;
  padding:12px;
  box-shadow:0 1px 3px rgba(0,0,0,0.08);
  border:1px solid var(--card-border);
  color:var(--text-color)
}

.status-card .circle{
  background:transparent
}

.title-row{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:8px;
  color:var(--text-color)
}

.alarm-table{
  width:100%;
  border-collapse:collapse;
  color:var(--text-color)
}

.alarm-table th,
.alarm-table td{
  padding:8px;
  border-bottom:1px solid var(--card-border);
  text-align:left
}

.alarm-table th{
  opacity:0.9
}

.severity.high{
  color:var(--accent-red)
}

.severity.medium{
  color:var(--accent-yellow)
}

.active-status{
  color:var(--accent-green)
}

.view-btn{
  background:var(--view-btn-bg);
  color:var(--view-btn-text);
  border:none;
  padding:6px 10px;
  border-radius:4px
}

.heatmap-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(100px,1fr));
  gap:8px
}

.heatmap-box{
  padding:8px;
  border-radius:6px;
  color:var(--text-color);
  display:flex;
  flex-direction:column;
  align-items:flex-start
}

.responsive-grid{
  width:100%;
  box-sizing:border-box;
}

@media (max-width:1200px){
  .responsive-grid{
    grid-template-columns:1fr !important;
  }
}
`;

const InverterDashboard = () => {
  const pageBg = useColorModeValue("#f7fafc", "#06172d");
  const cardBg = useColorModeValue("#FFFFFF", "#1f2937");
  const cardBorder = useColorModeValue(
    "#e6e9ee",
    "rgba(255,255,255,0.06)"
  );
  const textColor = useColorModeValue("#111827", "#E6EEF6");
  const viewBtnBg = useColorModeValue("#007bff", "#0aa3ff");

  return (
    <div
      style={{
        background: pageBg,
        width: "100%",
        minWidth: 0,
        padding: "12px",
        boxSizing: "border-box",
        overflow: "visible",

        ...({
          ["--card-bg" as any]: cardBg,
          ["--card-border" as any]: cardBorder,
          ["--text-color" as any]: textColor,
          ["--view-btn-bg" as any]: viewBtnBg,
          ["--view-btn-text" as any]: "#ffffff",
          ["--accent-green" as any]: "#74c043",
          ["--accent-yellow" as any]: "#b8a52d",
          ["--accent-orange" as any]: "#d98b1f",
          ["--accent-red" as any]: "#d64545",
        } as React.CSSProperties)}
      }
    >
      <style>{inverterCss}</style>

      {/* ROW 1 + ROW 2 */}
      <div
        className="responsive-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1.4fr",
          gridTemplateRows: "380px 380px",
          gap: "12px",
          marginBottom: "12px",
          alignItems: "start",
        }}
      >
        <PerformanceSummary />

        <TopInverters />

        <div
          style={{
            gridColumn: 3,
            gridRow: "1 / span 2",
          }}
        >
          <InverterTable />
        </div>

        <div
          style={{
            alignSelf: "start",
            marginTop: "-120px",
          }}
        >
          <PowerTrendChart />
        </div>

        <div
          style={{
            alignSelf: "start",
            marginTop: "-120px",
          }}
        >
          <YieldChart />
        </div>
      </div>

      {/* ROW 3 */}
      <div
        className="responsive-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "12px",
          alignItems: "start",
          marginTop: "-170px",
        }}
      >
        <div style={{ marginTop: "-12px" }}>
          <Availiblitychart />
        </div>

        <div style={{ marginTop: "-12px" }}>
          <DCVoltageChart />
        </div>

        <div style={{ marginTop: "-12px" }}>
          <InverterHeatmap />
        </div>
      </div>
    </div>
  );
};

export default InverterDashboard;