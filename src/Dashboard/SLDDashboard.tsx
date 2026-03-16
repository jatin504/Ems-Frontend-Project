import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Stage, Layer, Group } from "react-konva";
import BatteryBusLayout1 from "../SLD/BatteryBusLayout1";
import BatteryBusLayout2 from "../SLD/BatteryBusLayout2";
import LoadsBranch from "../SLD/LoadsBranch";
import ACDCSymbol from "../components/SLDComponents/ACDCSymbol";
import ACDCSymbolWave from "../components/SLDComponents/ACDCSymbolWave";
import VerticalBreakerLine from "../components/SLDComponents/VerticalBreakerLine";
import { useSSE } from "../hooks/sse/useSSE";

import {
  Box,
  Button,
  Select,
  useColorModeValue,
  HStack,
  Text,
  Icon,
} from "@chakra-ui/react";
import { MdReplayCircleFilled } from "react-icons/md";

const getTimeOptions = () => {
  const options = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      options.push(`${hh}:${mm}`);
    }
  }
  return options;
};

const SLDDashboard = () => {
  const [stageWidth, setStageWidth] = useState(window.innerWidth);
  const [stageHeight, setStageHeight] = useState(window.innerHeight);
  const [day, setDay] = useState("today");
  const [time, setTime] = useState("00:00");
  const [isReplay, setIsReplay] = useState(false);

  const stageRef = useRef<any>(null);

  const API_BASE =
    (import.meta as any).env?.VITE_API_BASE?.toString()?.replace(/\/$/, "") || "";

  const optionColor = useColorModeValue("gray.800", "gray.100");
  const textColor = useColorModeValue("gray.900", "white");

  useEffect(() => {
    const handleResize = () => {
      setStageWidth(window.innerWidth);
      setStageHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Total diagram width and height you expect
  const diagramWidth = 1400;
  const diagramHeight = 800;

  // Calculate scale to fit in screen
  const scaleX = stageWidth / diagramWidth;
  const scaleY = (stageHeight - 80) / diagramHeight;
  const scale = Math.min(scaleX, scaleY);

  // Center diagram
  const offsetX = (stageWidth - diagramWidth * scale) / 2;
  const offsetY = (stageHeight - diagramHeight * scale) / 2 + 40;

  const [dataMap, setDataMap] = useState<Record<string, any>>({});

  // --- Replay glue state ---
  const [ssePaused, setSsePaused] = useState(false);     // SSE Will not disconnect it will pause
  const minutes = 15;                                    // fixed 15-min replay window
  const playbackDelayMs = 500;                           // 1 frame = 1 min bucket shown every 500ms
  const cancelReplayRef = useRef<() => void>(() => { });  // early stop support
  const mountedRef = useRef(true);

  const [currentFrameTs, setCurrentFrameTs] = useState("")

  useEffect(() => () => { mountedRef.current = false; }, []);

  const topics = useMemo(
    () => ["plant_1_pcs_2_bank_bank_1",
      "plant_1_pcs_2_bank_bank_2",
      "plant_1_pcs_2_bank_bank_6",
      "plant_1_pcs_2_bank_bank_7"],
    []
  );

  useSSE({
    url: `${API_BASE}/stream?topics=${topics.join(",")}`,
    paused: ssePaused,   // add this (update hook if needed)
    onMessage: ({ topic, message }) => {
      setDataMap((prev) => ({ ...prev, [topic]: message }));
    },
    onError: (err) => console.error("SSE error:", err),
  });

  const dataESS1 = dataMap["plant_1_pcs_2_bank_bank_1"];
  const dataESS2 = dataMap["plant_1_pcs_2_bank_bank_2"];
  const dataPCS = dataMap["plant_1_pcs_2_bank_bank_6"];
  const dataPOI = dataMap["plant_1_pcs_2_bank_bank_7"];

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    const scaleBy = 1.05;
    const oldScale = stage.scaleX();

    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    // Zoom in/out
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    stage.scale({ x: newScale, y: newScale });

    // Zoom position adjust so zoom centers on mouse pointer
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    stage.position(newPos);
    stage.batchDraw();
  };

  // Blink animation keyframes (for right indicator only)
  const blinkAnim = { animation: "blinker 1s linear infinite" };
  const styleTag = (
    <style>
      {`@keyframes blinker { 50% { opacity: 0; } }`}
    </style>
  );

  // --- Replay runner: fetch frames & play into dataMap, then auto-resume SSE ---
  const runReplay = useCallback(async () => {
    if (isReplay) return;

    setIsReplay(true);
    setSsePaused(true);
    // optional: clean start
    setDataMap({});

    let cancelled = false;
    cancelReplayRef.current = () => { cancelled = true; };

    try {
      const params = new URLSearchParams({
        topics: topics.join(","),
        day,              // "today" | "yesterday"
        time,             // "HH:MM"
        minutes: String(minutes),
        order: "asc",
      });

      const res = await fetch(`${baseURL}/tinydb/replay?${params.toString()}`);
      if (!res.ok) {
        console.error("Replay fetch failed:", await res.text());
        return;
      }
      const json = await res.json();
      const frames: Array<{ ts: string; byTopic: Record<string, any> }> = json?.frames ?? [];

      for (const frame of frames) {
        if (cancelled || !mountedRef.current) break;
        setCurrentFrameTs(frame.ts);
        setDataMap((prev) => {
          const next = { ...prev };
          for (const t of topics) {
            const payload = frame.byTopic?.[t];
            if (payload) next[t] = payload;
          }
          return next;
        });

        // 1 minute-bucket per delay
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, playbackDelayMs));
      }
    } catch (e) {
      console.error("Replay error:", e);
    } finally {
      if (mountedRef.current) {
        setIsReplay(false);
        setSsePaused(false); // auto-resume SSE
      }
    }
  }, [day, time, topics, minutes, playbackDelayMs, isReplay]);

  // Replay button handler (toggle). Running then stop; otherwise start.
  const onClickReplay = useCallback(() => {
    if (!isReplay) {
      runReplay();
    } else {
      cancelReplayRef.current?.();
      setIsReplay(false);
      setSsePaused(false);
    }
  }, [isReplay, runReplay]);

  return (
    <Box
      position="relative"
      w="100vw"
      h="100vh"
      bg={useColorModeValue("gray.50", "#111")}
      color={useColorModeValue("gray.900", "gray.100")}
      overflow="hidden"
    >
      {styleTag}

      {/* LEFT: controls */}
      <Box
        position="absolute"
        top={4}
        left={8}
        zIndex={10}
        display="flex"
        alignItems="center"
        gap={3}
      >
        <Box minW="80px">
          <Select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            size="sm"
            w="100%"
            bg={useColorModeValue("gray.200", "gray.700")}
            color={useColorModeValue("gray.800", "gray.100")}
            fontWeight="semibold"
            borderRadius="md"
            borderColor={useColorModeValue("gray.300", "gray.600")}
            _focus={{ borderColor: useColorModeValue("purple.400", "blue.400") }}
          >
            <option style={{ color: optionColor }} value="today">
              Today
            </option>
            <option style={{ color: optionColor }} value="yesterday">
              Yesterday
            </option>
          </Select>
        </Box>
        <Box minW="70px">
          <Select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            size="sm"
            w="100%"
            bg={useColorModeValue("gray.200", "gray.700")}
            color={useColorModeValue("gray.800", "gray.100")}
            fontWeight="semibold"
            borderRadius="md"
            borderColor={useColorModeValue("gray.300", "gray.600")}
            _focus={{ borderColor: useColorModeValue("purple.400", "blue.400") }}
          >
            {getTimeOptions().map((opt) => (
              <option style={{ color: optionColor }} key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Select>
        </Box>
        {isReplay && (
          <Box
            position="absolute"
            top={10}
            right="50%"
            transform="translateX(50%)"
            bg="blackAlpha.700"
            color="white"
            px={4}
            py={1}
            borderRadius="md"
            fontSize="sm"
          >
            {currentFrameTs || ""}
          </Box>
        )}

        <Button
          onClick={onClickReplay}   // use the callback instead
          size="sm"
          colorScheme={useColorModeValue("purple", "blue")}
          fontWeight="bold"
          borderRadius="md"
          px={4}
          minW="70px"
        >
          <span style={{ color: useColorModeValue("#222", "#fff"), fontWeight: 600 }}>
            {isReplay ? "Stop" : "Play"}
          </span>
        </Button>
      </Box>

      {/* RIGHT: replay indicator (blinks when isReplay = true) */}
      <Box position="absolute" top={4} right={8} zIndex={10}>
        <HStack spacing={2} align="center" style={isReplay ? blinkAnim : {}}>
          <Icon
            as={MdReplayCircleFilled}
            boxSize="20px"
            color={useColorModeValue("gray.800", "gray.100")}
          />
          <Text
            fontSize="sm"
            fontWeight="bold"
            color={useColorModeValue("gray.800", "gray.100")}
          >
            Replay
          </Text>
        </HStack>
      </Box>

      <Stage
        ref={stageRef}
        width={stageWidth}
        height={stageHeight}
        draggable
        onWheel={handleWheel}
      >
        <Layer>
          <Group x={offsetX} y={offsetY} scaleX={scale} scaleY={scale}>
            <BatteryBusLayout1 data={dataESS1} textColor={textColor} />
            <BatteryBusLayout2 id="battery-bus-2" data={dataESS2} textColor={textColor} />
            <LoadsBranch textColor={textColor} />
            {/*  x={600} y={0} */}
            <ACDCSymbol textColor={textColor} />
            {/*  x={200} y={150} */}
            <ACDCSymbolWave x={202} y={-56} isDraggable={false} />
            <VerticalBreakerLine topic="/plant_1_pcs_2_bank_bank_6,/plant_1_pcs_2_bank_bank_7" data={dataPCS} dataPOI={dataPOI} textColor={textColor} />
          </Group>
        </Layer>
      </Stage>
    </Box>
  );
};

export default SLDDashboard;
