import React, { useEffect, useState } from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Progress,
  useColorModeValue,
  useBreakpointValue,
  Select,
} from "@chakra-ui/react";
import useBatteryBank from "../../../../hooks/PlantView/useBatteryBank";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE;

type Bank = {
  device_id: string;
  soc: number;
  active_device: number;
  non_active_device: number;
  amps : string;
  voltage : string;
  latest_temp : number;
  max_temp : number;
  dod?: number;
  soh?: number;
  pr?: number;
  cuf_ac?: number;
  cuf_dc?: number;
  power?: string;
  daily_energy?: string;
  total_energy?: string;
};



/** Tile with controllable value row box */
const Tile: React.FC<{
  title: string;
  value?: string | number;
  sub?: string;
  bg: string;
  flexGrow?: number;
  valueBox?: {
    width?: number;   
    height?: number;  
    gapPx?: number;   
    angleDeg?: number;
    opacity?: number; 
  };
}> = ({ title, value, sub, bg, flexGrow = 1, valueBox }) => {
  const titleFs = useBreakpointValue({ base: "10px", md: "11px" });
  const valFs = useBreakpointValue({ base: "13px", md: "14px" });
  const padX = useBreakpointValue({ base: "10px", md: "12px" });
  const padY = useBreakpointValue({ base: "6px", md: "8px" });
  const h = useBreakpointValue({ base: "50px", md: "54px" });

  const titleColor = useColorModeValue("blackAlpha.700", "whiteAlpha.800");
  const valueColor = useColorModeValue("blackAlpha.900", "white");
  const subColor = useColorModeValue("blackAlpha.700", "whiteAlpha.800");
  const ring = useColorModeValue(
    "inset 0 0 0 1px rgba(0,0,0,0.06)",
    "inset 0 0 0 1px rgba(255,255,255,0.06)"
  );

  // value row sizing
  const rowW = valueBox?.width !== undefined ? `${valueBox.width}px` : "100%";
  const rowH = valueBox?.height !== undefined ? `${valueBox.height}px` : undefined;
  const rowGap = valueBox?.gapPx !== undefined ? `${valueBox.gapPx}px` : "6px";
  const rowAngle = valueBox?.angleDeg !== undefined ? `rotate(${valueBox.angleDeg}deg)` : undefined;
  const rowOpacity = valueBox?.opacity ?? 1;
  const rowLineH = valueBox?.height !== undefined ? `${valueBox.height}px` : undefined;

  return (
    <VStack
      align="start"
      spacing="4px"
      bg={bg}
      px={padX}
      py={padY}
      rounded="lg"
      height={h}
      justify="center"
      boxShadow={ring}
      flex={`${flexGrow} 1 0`}
      minW={0}
    >
      <Text color={titleColor} fontSize={titleFs} lineHeight="14px" title={title} isTruncated>
        {title}
      </Text>

      <HStack
        spacing={rowGap}
        w={rowW}
        h={rowH}
        minW={0}
        align="center"
        transform={rowAngle}
        opacity={rowOpacity}
        overflow="hidden"
        whiteSpace="nowrap"
      >
        <Text
          color={valueColor}
          fontWeight="semibold"
          fontSize={valFs}
          title={String(value ?? "")}
          minW={0}
          textOverflow="ellipsis"
          noOfLines={1}
          lineHeight={rowLineH}
        >
          {value}
        </Text>

        {sub && (
          <>
            <Text color={subColor} fontSize={valFs} flexShrink={0} lineHeight={rowLineH}>
              |
            </Text>
            <Text
              color={subColor}
              fontSize={valFs}
              title={sub}
              minW={0}
              textOverflow="ellipsis"
              noOfLines={1}
              lineHeight={rowLineH}
            >
              {sub}
            </Text>
          </>
        )}
      </HStack>
    </VStack>
  );
};

const BatteryRow: React.FC<{ bank: Bank }> = ({ bank }) => {
  const navigate = useNavigate();
  // light/dark
  const cardBg = useColorModeValue("white", "#0F1215");
  const nameColor = useColorModeValue("black", "white");
  const socTextColor = useColorModeValue("blackAlpha.700", "whiteAlpha.800");
  const cardShadow = useColorModeValue(
    "0 0 0 1px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.06)",
    "0 0 0 1px rgba(255,255,255,0.06), 0 6px 20px rgba(0,0,0,0.25)"
  );
  const barBg = useColorModeValue("blackAlpha.200", "whiteAlpha.200");
  const barFill = useColorModeValue("#14B8A6", "#22D3EE");

  const connectedBg = useColorModeValue("#C2FFE9", "#18463E");
  const powerBg  = useColorModeValue("#F2F2F5", "#3B3A3E");
  const dailyBg   = useColorModeValue("#EBEFFF", "#27315A");
  const totalBg     = useColorModeValue("#FFE6E6", "#5D3433");

  const nameFs = useBreakpointValue({ base: "14px", md: "15px" });
  const socBarW = useBreakpointValue({ base: "120px", md: "140px" });
  const gap = useBreakpointValue({ base: "10px", md: "12px" });
  // Placeholder values (replace with real data if available)
  const pr = bank.pr ?? 85; // fallback to 85 if not present
  const cuf_ac = bank.cuf_ac ?? 90; // fallback to 90 if not present
  const cuf_dc = bank.cuf_dc ?? 95; // fallback to 95 if not present

  const bankNum = parseInt(bank.device_id.match(/bank_(\d+)/)?.[1] || "0") || 1;
  return (
    <Box
      w="100%"
      bg={cardBg}
      rounded="12px"
      px={{ base: "12px", md: "14px", lg: "16px" }}
      py={{ base: "8px", md: "10px", lg: "12px" }}
      mb={"20px"}
    >
      <HStack spacing={gap} align="center" w="100%" wrap="nowrap" overflow="hidden">
        <VStack align="start" spacing="6px" flex="0 0 auto" minW="140px">
          <Text color={nameColor} fontWeight="semibold" cursor={"pointer"} textTransform={"capitalize"} fontSize={nameFs} noOfLines={1} title={bank.device_id}
            onClick={() => navigate('/batterybankk', {state : {currentBank : formatString(bank.device_id)}})}
          >
            {`Block ${bankNum}`}
          </Text>
          {/* PR, CUF AC, CUF DC Bars in a single row with left labels */}
          <VStack align="start" spacing={0} w="100%">
            <HStack spacing={1} align="center">
              <Text color={socTextColor} fontSize={{ base: "8px", md: "8px" }} minW="28px">PR</Text>
              <Progress
                value={pr}
                height="6px"
                rounded="full"
                w={socBarW}
                sx={{
                  "& > div": { bg: barFill },
                  bg: barBg,
                }}
              />
              <Text color={socTextColor} fontSize={{ base: "8px", md: "8px" }} minW="28px">{pr}%</Text>
            </HStack>
            <HStack spacing={1} align="center">
              <Text color={socTextColor} fontSize={{ base: "8px", md: "8px" }} minW="28px">CUF AC</Text>
              <Progress
                value={cuf_ac}
                height="6px"
                rounded="full"
                w={socBarW}
                sx={{
                  "& > div": { bg: "#F59E42" },
                  bg: barBg,
                }}
              />
              <Text color={socTextColor} fontSize={{ base: "8px", md: "8px" }} minW="28px">{cuf_ac}%</Text>
            </HStack>
            <HStack spacing={1} align="center">
              <Text color={socTextColor} fontSize={{ base: "8px", md: "8px" }} minW="28px">CUF DC</Text>
              <Progress
                value={cuf_dc}
                height="6px"
                rounded="full"
                w={socBarW}
                sx={{
                  "& > div": { bg: "#6DA2FF" },
                  bg: barBg,
                }}
              />
              <Text color={socTextColor} fontSize={{ base: "8px", md: "8px" }} minW="28px">{cuf_dc}%</Text>
            </HStack>
          </VStack>
        </VStack>

        {/* smaller */}
        <Box ml={"-10px"}>
          <Tile title="Connected" value={`${bankNum}/20`} bg={connectedBg} flexGrow={0.9} />
        </Box>
        <Tile title="Power" value={bank.power ?? "150 kW"} bg={powerBg} flexGrow={0.9} />

        {/* larger */}
        <Tile
          title="Daily Energy"
          value={bank.daily_energy ?? "250 kWh"}
          bg={dailyBg}
          flexGrow={1.6}
        />
        <Tile
          title="Total Energy"
          value={bank.total_energy ?? "5000 MWh"}
          bg={totalBg}
          flexGrow={1.6}
        />
      </HStack>
    </Box>
  );
};

const BatteryBanks: React.FC = () => {
  const headerColor = useColorModeValue("black", "white");
  const [selectedResolution, setSelectedResolution] = useState("Today");
  const [banks, setBanks] = useState<Bank[]>([]);
//   const banks: Bank[] = [
//   { name: "PCS 2 Bank 1", soc: 80, connected: 10, disabled: 0, strings: { voltage: "623.60 V", current: "33.50 A" }, temps: { t1: "27.54 ℃", t2: "31.75 ℃" } },
//   { name: "PCS 2 Bank 1", soc: 80, connected: 10, disabled: 0, strings: { voltage: "623.60 V", current: "33.50 A" }, temps: { t1: "27.54 ℃", t2: "31.75 ℃" } },
//   { name: "PCS 2 Bank 1", soc: 80, connected: 10, disabled: 0, strings: { voltage: "623.60 V", current: "33.50 A" }, temps: { t1: "27.54 ℃", t2: "31.75 ℃" } },
//   { name: "PCS 2 Bank 1", soc: 80, connected: 10, disabled: 0, strings: { voltage: "623.60 V", current: "33.50 A" }, temps: { t1: "27.54 ℃", t2: "31.75 ℃" } },
//   { name: "PCS 2 Bank 1", soc: 80, connected: 10, disabled: 0, strings: { voltage: "623.60 V", current: "33.50 A" }, temps: { t1: "27.54 ℃", t2: "31.75 ℃" } },
//   { name: "PCS 2 Bank 1", soc: 80, connected: 10, disabled: 0, strings: { voltage: "623.60 V", current: "33.50 A" }, temps: { t1: "27.54 ℃", t2: "31.75 ℃" } },
//   { name: "PCS 2 Bank 1", soc: 80, connected: 10, disabled: 0, strings: { voltage: "623.60 V", current: "33.50 A" }, temps: { t1: "27.54 ℃", t2: "31.75 ℃" } },
//   { name: "PCS 2 Bank 1", soc: 80, connected: 10, disabled: 0, strings: { voltage: "623.60 V", current: "33.50 A" }, temps: { t1: "27.54 ℃", t2: "31.75 ℃" } },
//   { name: "PCS 2 Bank 1", soc: 80, connected: 10, disabled: 0, strings: { voltage: "623.60 V", current: "33.50 A" }, temps: { t1: "27.54 ℃", t2: "31.75 ℃" } },
//   { name: "PCS 2 Bank 1", soc: 80, connected: 10, disabled: 0, strings: { voltage: "623.60 V", current: "33.50 A" }, temps: { t1: "27.54 ℃", t2: "31.75 ℃" } },
// ];

  const {fetchData} = useBatteryBank();

  useEffect(() => {

    if (selectedResolution === "Today") return;

    fetch(`${BASE_URL}/api/timeseries-resolution-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        resolutions: [selectedResolution],
        devices: {
          patterns: ["_bank_bank_"]
        },
        keys: [
          "active_power",
          "battery_cabin_temperature_1",
          "BCU_2_Chargeable_power"
        ]
      })
    })
      .then((res) => res.json())
      .then((j) => {

        if (!j.success) return;

        const resolutionData = j.data?.[selectedResolution] || {};

        const processedBanks: Bank[] = Object.entries(resolutionData).map(
          ([deviceId, row]: any) => ({

            device_id: deviceId,

            soc: 80,
            active_device: 1,
            non_active_device: 0,

            amps: "10 A",
            voltage: "400 V",

            latest_temp: 25,
            max_temp: 30,

            pr: 85,
            cuf_ac: 90,
            cuf_dc: 95,

            power: row.active_power
              ? `${row.active_power} kW`
              : "150 kW",

            daily_energy: row.battery_cabin_temperature_1
              ? `${row.battery_cabin_temperature_1} kWh`
              : "250 kWh",

            total_energy: row.BCU_2_Chargeable_power
              ? `${row.BCU_2_Chargeable_power} MWh`
              : "5000 MWh"

          })
        );

        processedBanks.sort((a, b) => {
          const aNum = parseInt(a.device_id.match(/bank_(\d+)/)?.[1] || "0");
          const bNum = parseInt(b.device_id.match(/bank_(\d+)/)?.[1] || "0");
          return aNum - bNum;
        });

        setBanks(processedBanks);

      })
      .catch(console.error);

  }, [selectedResolution]);

  useEffect(() => {
    if (selectedResolution === "Today") {
      fetch(
        `${BASE_URL}/api/lastest-direct-data/multiple-latest-devices`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            device_id_patterns: ["_bank_bank_"],
          }),
        }
      )
        .then((r) => r.json())
        .then((j) => {
          if (j.success) {
            const processedBanks: Bank[] = Object.entries(j.data).map(
              ([deviceId, row]: any) => ({
                device_id: deviceId,
                soc: 80,
                active_device: 1,
                non_active_device: 0,
                amps: "10 A",
                voltage: "400 V",
                latest_temp: 25,
                max_temp: 30,
                pr: 85,
                cuf_ac: 90,
                cuf_dc: 95,
                power: row.Active_power?.value
                  ? `${row.Active_power.value} kW`
                  : "150 kW",
                daily_energy: row.BCU_1_Energy_charged_today?.value
                  ? `${row.BCU_1_Energy_charged_today.value} kWh`
                  : "250 kWh",
                total_energy: row.BCU_2_Chargeable_power?.value
                  ? `${row.BCU_2_Chargeable_power.value} MWh`
                  : "5000 MWh",
              })
            );

            // FIX: sort by bank number
            processedBanks.sort((a, b) => {
  const aNum = parseInt(a.device_id.match(/bank_(\d+)/)?.[1] || "0");
  const bNum = parseInt(b.device_id.match(/bank_(\d+)/)?.[1] || "0");
  return aNum - bNum;
});

            setBanks(processedBanks);
          }
        })
        .catch(console.error);
    }
  }, [selectedResolution]);

  // console.log("DATA: ", banks)
  
  return (
    <VStack align="stretch" gap={"20px"} w="100%" h={"100%"}>
      <HStack justify="space-between" align="center">
        <Text color={headerColor} fontWeight="semibold" fontSize={{ base: "16px", md: "18px" }}>
          Inverter Block
        </Text>
        <Select
          value={selectedResolution}
          onChange={(e) => setSelectedResolution(e.target.value)}
          size="sm"
          w="120px"
          bg={useColorModeValue("white", "gray.700")}
          color={headerColor}
        >
          <option value="Today">Today</option>
          <option value="Yesterday">Yesterday</option>
          <option value="Week">Week</option>
          <option value="Month">Month</option>
          <option value="Year">Year</option>
          <option value="Total">Total</option>
        </Select>
      </HStack>
    <Box
      height={"100%"}
      width={"100%"}
      overflowY={"auto"}
    >
      {banks.map((b : Bank, i : number) => (
        <BatteryRow key={i} bank={b} />
      ))}
    </Box>
    </VStack>
  );
};

export default BatteryBanks;


function formatString(input: string): string {
  // Regex to capture pcs number and bank number
  const regex = /pcs_(\d+).*?bank_(\d+)/;
  const match = input.match(regex);

  if (match) {
    const [, pcsNum, bankNum] = match;
    return `pcs_${pcsNum}_bank_${bankNum}`;
  }

  return input; 
}