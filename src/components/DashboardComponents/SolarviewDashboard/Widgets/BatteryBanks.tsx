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
// Removed useBatteryBank hook and remote API usage per request
import { useNavigate } from "react-router-dom";

// No remote API calls; using local placeholder data
import UseInverterBlock from "../../../../hooks/UseInverterBlock";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";

type Bank = {
  device_id: string;
  soc: number;
  active_device: number;
  non_active_device: number;
  amps: string;
  voltage: string;
  latest_temp: number;
  max_temp: number;
  dod?: number;
  soh?: number;
  pr?: number;
  cuf_ac?: number;
  cuf_dc?: number;
  power?: string;
  daily_energy?: string;
  total_energy?: string;
};


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
  const valFs = useBreakpointValue({ base: "12px", md: "13px" });
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
  const powerBg = useColorModeValue("#F2F2F5", "#3B3A3E");
  const dailyBg = useColorModeValue("#EBEFFF", "#27315A");
  const totalBg = useColorModeValue("#FFE6E6", "#5D3433");

  const nameFs = useBreakpointValue({ base: "14px", md: "15px" });
  const socBarW = useBreakpointValue({ base: "120px", md: "140px" });
  const gap = useBreakpointValue({ base: "10px", md: "12px" });
  const pr = bank.pr ?? 85;
  const cuf_ac = bank.cuf_ac ?? 90;
  const cuf_dc = bank.cuf_dc ?? 95;

  const fixedValueBox = { width: 133, height: 21, gapPx: 10, angleDeg: 0, opacity: 1 };
  const navigate = useNavigate();
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
          <Text color={nameColor} fontWeight="semibold" cursor={"pointer"} textTransform={"capitalize"} fontSize={nameFs} noOfLines={1} title={bank.device_id}>
            {formatString(bank.device_id).replace(/_/g, " ").replace("pcs", "PCS")}
          </Text>
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

        <Box ml={"-10px"}>
          <Tile
            title="Connected"
            value={`${bank.active_device}/${bank.active_device + bank.non_active_device}`}
            bg={connectedBg}
            flexGrow={0.9}
          />
        </Box>
        <Tile title="Power" value={bank.power ?? "150 kW"} bg={powerBg} flexGrow={0.9} />

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
  const { data: blockData = [] } = UseInverterBlock();
  const [banks, setBanks] = useState<Bank[]>([]);

  const { data: tsData, fetchData: fetchTsData } = useTimeseriesData();

  // Build simple banks array from blockData (no timeseries)
  useEffect(() => {
    if (!blockData || !blockData.length) return;

    const formatted: Bank[] = blockData.map((b: any, idx: number) => ({
      device_id: b.block_name || `block_${idx + 1}`,
      soc: 80,
      active_device: b.connected || 0,
      non_active_device: (b.total_device || 0) - (b.connected || 0),
      amps: "30 A",
      voltage: "400 V",
      latest_temp: 25,
      max_temp: 30,
      pr: 0,
      cuf_ac: 0,
      cuf_dc: 0,
      power: b.active_power ? `${b.active_power} kW` : "0 kW",
      daily_energy: b.daily_energy ? `${(Number(b.daily_energy) / 1000).toFixed(3)} MWh` : "0.000 MWh",
      total_energy: b.total_energy ? `${(Number(b.total_energy) / 1000).toFixed(3)} MWh` : "0.000 MWh",
    }));

    setBanks(formatted);
  }, [blockData]);

  // fetch timeseries for inverters associated with blocks (initial + periodic)
  useEffect(() => {
    if (!blockData || !blockData.length) return;

    const fetchFn = () => {
      fetchTsData({
        devices: {
          patterns: ["_inverter_inverter_"],
          ids: [],
        },
        keys: [
          { key: "active_power", alias: "Active_Power", keyType: "timeseries" },
          { key: "daily_energy", alias: "Daily_Energy", keyType: "timeseries" },
          { key: "total_energy", alias: "Total_Energy", keyType: "timeseries" },
          { key: "inv_pr", alias: "INV_PR", keyType: "timeseries" },
          { key: "cuf_ac", alias: "CUF_AC", keyType: "timeseries" },
          { key: "cuf_dc", alias: "CUF_DC", keyType: "timeseries" },
        ],
        aggregation: { func: "LAST", interval: 1, intervalType: "minutes" },
        timeRange: { type: "last", interval: 1, intervalType: "minutes" },
        orderBy: "DESC",
      });
    };

    // initial API hit
    fetchFn();

    // every 1 minute refresh
    const interval = setInterval(() => {
      fetchFn();
    }, 60000);

    return () => clearInterval(interval);
  }, [blockData]);

  // merge timeseries values into banks when available
  useEffect(() => {
    if (!tsData || !blockData || !blockData.length) return;

    const blockMap: any = {};

    Object.entries(tsData).forEach(([deviceId, row]: any) => {
      const blockMatch = deviceId.match(/block_(\d+)/i);
      if (!blockMatch) return;
      const blockNumber = blockMatch[1];
      const blockKey = `block_${blockNumber}`;

      if (!blockMap[blockKey]) {
        const blockInfo: any = blockData.find((b: any) => b.block_name?.match(/\d+/)?.[0] === blockNumber) || {};
        blockMap[blockKey] = {
          device_id: blockKey,
          pr: 0,
          cuf_ac: 0,
          cuf_dc: 0,
          powerValue: 0,
          dailyEnergyValue: 0,
          totalEnergyValue: 0,
          percentCount: 0,
          active_device: blockInfo.connected || 0,
          non_active_device: (blockInfo.total_device || 0) - (blockInfo.connected || 0),
        };
      }

      const lastVal = (arr: any) => (Array.isArray(arr) && arr.length ? Number(arr[arr.length - 1].value) : 0);

      blockMap[blockKey].powerValue += lastVal(row.Active_Power);
      blockMap[blockKey].dailyEnergyValue += lastVal(row.Daily_Energy);
      blockMap[blockKey].totalEnergyValue += lastVal(row.Total_Energy);
      blockMap[blockKey].pr += lastVal(row.INV_PR);
      blockMap[blockKey].cuf_ac += lastVal(row.CUF_AC);
      blockMap[blockKey].cuf_dc += lastVal(row.CUF_DC);
      blockMap[blockKey].percentCount += 1;
    });

    const merged: Bank[] = Object.values(blockMap).map((item: any) => ({
      device_id: item.device_id,
      soc: 80,
      active_device: item.active_device,
      non_active_device: item.non_active_device,
      amps: "30 A",
      voltage: "400 V",
      latest_temp: 25,
      max_temp: 30,
      pr: item.percentCount > 0 ? Number((item.pr / item.percentCount).toFixed(2)) : 0,
      cuf_ac: item.percentCount > 0 ? Number((item.cuf_ac / item.percentCount).toFixed(2)) : 0,
      cuf_dc: item.percentCount > 0 ? Number((item.cuf_dc / item.percentCount).toFixed(2)) : 0,
      power: `${item.powerValue.toFixed(2)} kW`,
      daily_energy: `${(item.dailyEnergyValue / 1000).toFixed(2)} MWh`,
      total_energy: `${(item.totalEnergyValue / 1000).toFixed(2)} MWh`,
    }));

    // sort and set
    merged.sort((a: any, b: any) => {
      const aNum = parseInt(a.device_id.match(/block_(\d+)/)?.[1] || "0");
      const bNum = parseInt(b.device_id.match(/block_(\d+)/)?.[1] || "0");
      return aNum - bNum;
    });

    setBanks(merged);
  }, [tsData, blockData]);
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

  // No remote effects; banks are static placeholders.

  // console.log("DATA: ", banks)
  
  return (
    <VStack align="stretch" gap={"20px"} w="100%" h={"100%"}>
      <HStack justify="space-between" align="center">
        <Text color={headerColor} fontWeight="semibold" fontSize={{ base: "16px", md: "18px" }}>
          Inverter Block
        </Text>
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