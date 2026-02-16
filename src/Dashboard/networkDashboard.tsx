import { Box, useColorModeValue } from "@chakra-ui/react";
import { Stage, Layer, Rect } from "react-konva";
import { useEffect, useState, useRef } from "react";

import PLC from "../components/DashboardComponents/Network/PLC";
import Server from "../components/DashboardComponents/Network/Server";
import Workstation from "../components/DashboardComponents/Network/Workstation";
import Printer from "../components/DashboardComponents/Network/Printer";
import Modem from "../components/DashboardComponents/Network/modem";
import InternetCloud from "../components/DashboardComponents/Network/InternetCloud";
import Display from "../components/DashboardComponents/Network/Display";
import NetworkLinks from "../components/DashboardComponents/Network/NetworkLinks";
import VerticalConnectors from "../components/DashboardComponents/Network/VerticalConnectors";
import HorizontalDashedLines from "../components/DashboardComponents/Network/HorizontalDashedline";
import Switch from "../components/DashboardComponents/Network/Switch-a";
import HTStatusCluster from "../components/DashboardComponents/Network/HTStatusCluster";

import SPDTriplet, {
  SPDSixExact,
} from "../components/DashboardComponents/Network/SPDTriplet";

import RedAlertBox, {
  GreenAlertBox,
} from "../components/DashboardComponents/Network/RedAlertBox";

import StatusIndicatorStack, {
  StatusIndicatorStack_RED2,
  StatusIndicatorStack_GREEN3,
  StatusIndicatorSMBGrid, 
} from "../components/DashboardComponents/Network/StatusIndicatorStack";

import GreenInfoQuad from "../components/DashboardComponents/Network/GreenInfoQuad";

const NetworkDashboard = () => {
  const bg = useColorModeValue("#e6e6e6", "#222831");

  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: 1000,
  });

  useEffect(() => {
    const handleResize = () => {
      setStageSize({
        width: window.innerWidth,
        height: 1000,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Konva stage ref + wheel zoom handler (same behaviour as SLD)
  const stageRef = useRef<any>(null);

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const scaleBy = 1.05;
    const oldScale = stage.scaleX() || 1;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    stage.position(newPos);
    stage.batchDraw();
  };

  return (
    <Box w="100%" minH={`${stageSize.height}px`} bg={bg}>
      <Stage ref={stageRef} width={stageSize.width} height={stageSize.height} draggable onWheel={handleWheel}>
        <Layer>
          {/* BACKGROUND */}
          <Rect
            x={0}
            y={0}
            width={stageSize.width}
            height={stageSize.height}
            fill={bg}
          />

          {/* TOP DISPLAY */}
          <Display x={40} y={60} />

          {/* PLCs */}
          <PLC x={28} y={222} label="Primary PLC" />
          <PLC x={149} y={224} label="Secondary PLC" />

          {/* DEVICES */}
          <Workstation x={416} y={95} />
          <Printer x={651} y={103} />
          <Server x={870} y={97} />
          <InternetCloud x={1171} y={108} />
          <Modem x={1331} y={107} />

          {/* SWITCHES */}
          <Switch x={84} y={437} name="Switch-1" />
          <Switch x={300} y={437} name="Switch-2" />
          <Switch x={516} y={437} name="Switch-3" />
          <Switch x={732} y={437} name="Switch-4" />

          {/* SPD */}
          <SPDTriplet x={263} y={498} />
          <SPDSixExact x={100} y={650} />

          {/* ALERT BOXES */}
          <RedAlertBox x={202} y={498} />
          <GreenAlertBox x={270} y={500} />

          {/* LINKS & CONNECTORS */}
          <VerticalConnectors x={1477} y={71} />
          <HorizontalDashedLines x={860} y={270} />
          <NetworkLinks />

          {/* STATUS STACKS */}
          <StatusIndicatorStack />
          <StatusIndicatorStack_RED2 />
          <StatusIndicatorStack_GREEN3 />

          <HTStatusCluster x={650} y={420} />


          {/* */}
          <StatusIndicatorSMBGrid x={520} y={560} />

          {/* GREEN INFO */}
          <GreenInfoQuad />
        </Layer>
      </Stage>
    </Box>
  );
};

export default NetworkDashboard;
