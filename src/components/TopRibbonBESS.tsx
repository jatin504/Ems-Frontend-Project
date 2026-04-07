import React, { useEffect, useState, type ReactNode, useRef } from "react";
import { getWMSStatus } from "../Services/dashboard";
import { useEmsStatus } from "../hooks/useEmsStatus";
import NotificationBell from "./NotificationBell";
import {
  Box, HStack, VStack, Text, Tooltip, Icon, Flex, IconButton, Avatar,
  Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, useDisclosure,
  Divider,
  Image, Grid, GridItem, Heading, Stack, useColorMode, useColorModeValue,
  Menu, MenuButton, MenuList, MenuItem, MenuGroup, Button, Portal
} from "@chakra-ui/react";
import {
  FiZap, FiBatteryCharging, FiTrendingUp, FiActivity, FiCpu, FiBell, FiInfo,
  FiSun, FiMoon
} from "react-icons/fi";
import imgPlant from "../assets/OIP.jpeg";

type PlantDetails = {
  name: string; location: string; date: string; energySystem: string;
  pvCapacity: string; bessCapacity?: string; dgCapacity?: string; imageUrl: string;
};

type Props = {
  livePowerKw: number; lifeChargeMWh: number; lifeDischargeMWh: number;
  dailyChargeMWh: number; dailyDischargeMWh: number; cufAcPct: number; cufDcPct: number;
  onlineInverters: number; totalInverters: number; updatedAt?: string; leftSlot?: ReactNode;
  eventCount?: number; plantInfo?: string; plantDetails?: PlantDetails;
  avatarUrl?: string; timeZone?: string;
  isLoggedIn?: boolean; displayName?: string; handleLogout?: () => void; navigate?: (path: string) => void;
};

/* ========= SIZES ========= */
const VAL_SIZE = "12px"; // number + unit
const LAB_SIZE = { base: "10px", md: "11px" };

/* ========= TYPO ========= */
const ValueText = (props: any) => (
  <Text
    as="span"
    fontSize={VAL_SIZE}
    fontWeight={600}
    lineHeight="1"
    color={useColorModeValue("#000", "whiteAlpha.900")}
    noOfLines={1}
    {...props}
  />
);
const BigNum = ({ v }: { v: number }) => (
  <ValueText>{v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</ValueText>
);
const BigNumInt = ({ v }: { v: number }) => <ValueText>{v.toLocaleString()}</ValueText>;
const Unit = ({ u }: { u: string }) => <ValueText flexShrink={0}>{" "}{u}</ValueText>;
const Sep = () => <ValueText>{`\u00A0/\u00A0`}</ValueText>; // non-breaking

// ensures the whole value stays on ONE line (no wrap, no overlap)
const ValueRow = ({ children }: { children: ReactNode }) => (
  <Box
    as="span"
    display="inline-flex"
    alignItems="baseline"
    columnGap="4px"
    whiteSpace="nowrap"
    minW={0}
    overflow="hidden"
    textOverflow="ellipsis"
  >
    {children}
  </Box>
);

/* ========= ICON (compact) ========= */
const SquareIcon = ({ as, bg }: { as: any; bg: string }) => (
  <Box w="20px" h="20px" bg={bg} borderRadius="4px" display="grid" placeItems="center" flexShrink={0}>
    <Icon as={as} boxSize="12px" color="gray.900" />
  </Box>
);

/* ========= DIVIDER ========= */
const MetricDivider = (props: any) => (
  <Box
    role="separator"
    aria-hidden="true"
    w="1px"
    h="22px"
    bg={useColorModeValue("#222", "white")}
    flexShrink={0}
    {...props}
  />
);

/* ========= PILL ========= */
const Pill = ({
  icon, colorBg = "teal.300", label, children, tooltip,
  minW = "120px", h = "42px", gap = "6px",
}: {
  icon: any; colorBg?: string; label: string; children: React.ReactNode; tooltip?: string;
  minW?: string | number; h?: string | number; gap?: string | number;
}) => (
  <Tooltip label={tooltip ?? label} hasArrow>
    <HStack spacing="8px" flex="0 0 auto" minW={minW} h={h} align="center">

      <SquareIcon as={icon} bg={colorBg} />
      <VStack align="start" spacing={gap} w="full" h="full" minW={0} justify="center">
        <Text fontSize={LAB_SIZE} color={useColorModeValue("#00000080", "gray.300")} lineHeight="1" noOfLines={1}>
          {label}
        </Text>
        <ValueRow>{children}</ValueRow>
      </VStack>
    </HStack>
  </Tooltip>
);

/* ========= LIVE POWER ========= */
const LivePowerItem = ({ kw, updatedAt }: { kw: number; updatedAt?: string }) => (
  <Tooltip label={`Real-time active power${updatedAt ? ` • Updated ${updatedAt}` : ""}`} hasArrow>
    <HStack minW="120px" h="42px" spacing="8px" align="center" flex="0 0 auto">

      <SquareIcon as={FiZap} bg="yellow.300" />
      <VStack align="start" spacing="6px" minW={0}>
        <Text fontSize={LAB_SIZE} color={useColorModeValue("#00000080", "gray.300")} lineHeight="1" noOfLines={1}>
          Live Power
        </Text>
        <ValueRow>
          <BigNum v={kw} />
          <Unit u="kW" />
        </ValueRow>
      </VStack>
    </HStack>
  </Tooltip>
);

/* ========= CONNECTIONS ========= */
const ConnectionECG = ({ healthy }: { healthy: boolean }) => (
  <Box w="60px" h="10px" color="currentColor" flexShrink={0}>
    {healthy ? (
      <svg viewBox="0 0 60 10" width="60px" height="10px" preserveAspectRatio="none">
        <polyline points="0,5 6,5 11,9 13,1 15,8 20,5 26,5 31,9 33,1 35,8 40,5 46,5 51,9 53,1 55,8 60,5" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    ) : (
      <svg viewBox="0 0 60 10" width="60px" height="10px" preserveAspectRatio="none">
        <line x1="0" y1="5" x2="60" y2="5" stroke="currentColor" strokeWidth="2" />
      </svg>
    )}
  </Box>
);

const ConnBubble = ({ healthy }: { healthy: boolean }) => (
  <Tooltip label={healthy ? "Protocol connection healthy" : "Protocol connection not healthy"} hasArrow>
    <Box w="10px" h="10px" borderRadius="full" bg={healthy ? "green.300" : "red.300"} border="1px solid" borderColor="blackAlpha.300" flexShrink={0} />
  </Tooltip>
);

const ConnectionsGroup = ({
  dbHealthy, commHealthy,
}: { dbHealthy: boolean; commHealthy: boolean }) => {
  const tooltip = dbHealthy ? "DB Connection healthy" : "DB Connection not healthy";
  return (
    <Tooltip label={tooltip} hasArrow>
      <HStack
        w={{ base: "clamp(140px, 38vw, 160px)", xl: "160px" }}
        h="56px"
        spacing="10px"
        align="center"
        flex="0 0 auto"
      >
        <HStack align="start" mt={10} spacing="15px" w="full" h="full">
          <Text fontSize="14px" fontWeight={600} mt={"2px"} color={useColorModeValue("#00000080", "gray.300")} lineHeight="1">
            Link
          </Text>
          <HStack w="full" spacing="20px" align="center">
            <ConnBubble healthy={commHealthy} />
            <Tooltip label={dbHealthy ? "DB connection healthy" : "DB connection not healthy"} hasArrow>
              <Box
                bg={useColorModeValue("green.100", "green.700")}
                py={1}
                color={useColorModeValue("gray.800", "gray.100")}
              >
                <ConnectionECG healthy={dbHealthy} />
              </Box>
            </Tooltip>
          </HStack>
        </HStack>
      </HStack>
    </Tooltip>
  );
};

/* ========= CLOCK ========= */
function useClock(tz?: string) {
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const timeZone = tz || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timeFmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone });
  const dayNum = parseInt(new Intl.DateTimeFormat("en-GB", { day: "numeric", timeZone }).format(now), 10);
  const suffix = dayNum % 10 === 1 && dayNum % 100 !== 11 ? "st" : dayNum % 10 === 2 && dayNum % 100 !== 12 ? "nd" : dayNum % 10 === 3 && dayNum % 100 !== 13 ? "rd" : "th";
  const month = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone }).format(now).replace(".", "");
  const year = new Intl.DateTimeFormat("en-GB", { year: "numeric", timeZone }).format(now);
  const prettyDate = `${dayNum}${suffix} ${month}, ${year}`;
  return { prettyDate, time: timeFmt.format(now), timeZone };
}

/* ========= RIGHT CONTROLS ========= */
const RightCornerControls = ({
  eventCount = 0, plantInfo = "Plant information not available",
  onOpenNotif, onOpenInfo, avatarUrl, timeZone,
  isLoggedIn, displayName, handleLogout, navigate,
}: {
  eventCount?: number; plantInfo?: string; onOpenNotif: () => void; onOpenInfo: () => void;
  avatarUrl?: string; timeZone?: string; isLoggedIn?: boolean; displayName?: string;
  handleLogout?: () => void; navigate?: (path: string) => void;
}) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const chipBg = useColorModeValue("#F1F5F9", "#232A2F");
  const activeBg = useColorModeValue("white", "gray.700");
  const iconClr = useColorModeValue("gray.700", "gray.100");
  const { prettyDate, time, timeZone: tz } = useClock(timeZone);
  const isLight = colorMode === "light";

  return (
    <Box w={{ base: "230px", md: "283px" }} h="58px" display="flex" flexDirection="column" alignItems="flex-end" justifyContent="flex-start" gap="6px" flex="0 0 auto">
      <HStack spacing="6px" align="center" justify="flex-end" w="100%">
        <HStack spacing="0" bg={chipBg} borderRadius="16px" p="2px" w="72px" h="28px" justify="space-between">
          <IconButton aria-label="Light mode" icon={<FiSun />} size="xs" onClick={() => (isLight ? null : toggleColorMode())} bg={isLight ? activeBg : "transparent"} color={iconClr} _hover={{ bg: isLight ? activeBg : "transparent" }} borderRadius="14px" />
          <IconButton aria-label="Dark mode" icon={<FiMoon />} size="xs" onClick={() => (isLight ? toggleColorMode() : null)} bg={!isLight ? activeBg : "transparent"} color={iconClr} _hover={{ bg: !isLight ? activeBg : "transparent" }} borderRadius="14px" />
        </HStack>
        <NotificationBell />
        <Tooltip label={plantInfo} hasArrow>
          <IconButton aria-label="Plant Info" icon={<FiInfo />} size="sm" variant="ghost" />
        </Tooltip>
        {isLoggedIn ? (
          <Menu placement="bottom-end" isLazy closeOnSelect={false}>
            <MenuButton as={Button} variant="ghost" p={0} minW={0} borderRadius="full">
              <Avatar size="sm" name={displayName || "User"} src={avatarUrl} />
            </MenuButton>
            <Portal>
              <MenuList zIndex={2000}>
                <MenuItem onClick={() => navigate && navigate("/users")}>Users</MenuItem>
                {/* <MenuItem onClick={() => navigate && navigate("/profile")}>Profile</MenuItem> */}
                <MenuItem onClick={() => navigate && navigate("/settings")}>Settings</MenuItem>
                <MenuItem onClick={() => navigate && navigate("/userlog")}>
                  Log
                </MenuItem>
                <MenuItem onClick={() => navigate && navigate("/config/device")}>Config</MenuItem>
                <MenuItem onClick={() => handleLogout && handleLogout()}>Logout</MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        ) : (
          <IconButton aria-label="Login" variant="ghost" p={0} minW={0} borderRadius="full" onClick={() => navigate && navigate("/login")} _hover={{ bg: "transparent" }} icon={<Avatar size="sm" />} />
        )}
      </HStack>
      <Text fontSize="12px" color={useColorModeValue("gray.700", "gray.300")} lineHeight="1" textAlign="right">
        {prettyDate} &nbsp; {time} &nbsp; ({tz})
      </Text>
    </Box>
  );
};

/* ========= SCALE-TO-FIT (adds no visual change except fitting) ========= */
function useScaleToFit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [naturalWidth, setNaturalWidth] = useState<number | null>(null);

  useEffect(() => {
    const ro = new ResizeObserver(() => {
      const cw = containerRef.current?.clientWidth ?? 0;
      const sw = contentRef.current?.scrollWidth ?? 0;
      if (sw > 0) {
        setNaturalWidth(sw);
        setScale(Math.min(1, cw / sw));
      }
    });
    if (containerRef.current) ro.observe(containerRef.current);
    if (contentRef.current) ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, []);

  return { containerRef, contentRef, scale, naturalWidth };
}

/* ========= MAIN ========= */
export default function TopRibbonBESS({
  livePowerKw, lifeChargeMWh, lifeDischargeMWh, dailyChargeMWh, dailyDischargeMWh,
  cufAcPct, cufDcPct, updatedAt, leftSlot,
  eventCount = 3, plantInfo = "Plant information not available", plantDetails,
  avatarUrl, timeZone, isLoggedIn, displayName, handleLogout, navigate,
}: Props) {
  // Fetch real EMS health status from backend
  const { flags } = useEmsStatus(60000);
  const dbHealthy = flags ? (flags.is_db_healthy ?? 0) > 0 : false;
  const commHealthy = flags ? (flags.is_protocol_healthy ?? 0) > 0 : false;

  // Inverter online/total mapping (like WMSStatusCard)
  const [onlineInverters, setOnlineInverters] = useState(0);
  const [totalInverters, setTotalInverters] = useState(0);

  useEffect(() => {
    const fetchInverterStatus = async () => {
      try {
        const res = await getWMSStatus({
          pattern: "_bank_bank_", // inverter pattern, adjust as needed
          column: "active_power",
        });
        const data = res.data;
        setOnlineInverters(data.active); // active ---- Online
        setTotalInverters(data.online);  // online ---- Total
      } catch (err) {
        setOnlineInverters(0);
        setTotalInverters(0);
      }
    };
    fetchInverterStatus();
  }, []);

  const { containerRef, contentRef, scale, naturalWidth } = useScaleToFit();

  return (
    <Box bg={useColorModeValue("white", "#161B1B")} borderBottom="1px solid" borderColor="green.700" w="full" minH="96px" px={0} py={{ base: 2, md: 3, xl: 4 }} position="relative" zIndex={1200}>
      <Flex align="center" justify="space-between" direction="row" gap={{ base: 2, md: 4, xl: 8 }}>
        {/* LEFT */}
        <Flex align="center" gap={{ base: 2, md: 3 }} flex="1 1 auto" minW={0}>
          {leftSlot && <HStack flexShrink={0} pr={2}>{leftSlot}</HStack>}

          {/* Metrics rail: single row, auto-scales to fit; no scrollbar/overlap */}
          <Box
            ref={containerRef as any}
            flex="1 1 auto"
            minW={0}
            overflow="hidden"
          >
            <Box
              ref={contentRef as any}
              transform={`scale(${scale})`}
              transformOrigin="left center"
              w={naturalWidth ? `${naturalWidth}px` : "auto"}
              h="46px"
            >
              <Flex
                wrap="nowrap"
                justify="space-between"
                align="center"
                gap={{ base: 3, lg: 6 }}
                minW={0}
                w="max-content"   // intrinsic width so spacing stays Figma-like
              >
                <ConnectionsGroup dbHealthy={dbHealthy} commHealthy={commHealthy} />

                <MetricDivider display={{ base: "none", md: "block" }} />

                <LivePowerItem kw={livePowerKw} updatedAt={updatedAt} />

                <MetricDivider display={{ base: "none", md: "block" }} />

                <Pill icon={FiBatteryCharging} colorBg="cyan.300" label="Lifetime Charge / Discharge" tooltip="Cumulative energy since commissioning" minW="120px" h="42px">
                  <BigNum v={lifeChargeMWh} />
                  <Sep />
                  <BigNum v={lifeDischargeMWh} />
                  <Unit u="MWh" />
                </Pill>

                <MetricDivider display={{ base: "none", md: "block" }} />

                <Pill icon={FiTrendingUp} colorBg="purple.300" label="Daily Charge / Discharge" tooltip="Energy for today" minW="120px" h="42px">
                  <BigNum v={dailyChargeMWh} />
                  <Sep />
                  <BigNum v={dailyDischargeMWh} />
                  <Unit u="MWh" />
                </Pill>

                <MetricDivider display={{ base: "none", md: "block" }} />

                <Pill icon={FiActivity} colorBg="orange.300" label="CUF (AC / DC)" tooltip="Capacity Utilization Factor" minW="120px" h="42px">
                  <ValueText>{cufAcPct.toFixed(2)}%</ValueText>
                  <Sep />
                  <ValueText>{cufDcPct.toFixed(2)}%</ValueText>
                </Pill>

                <MetricDivider display={{ base: "none", md: "block" }} />

                <Pill icon={FiCpu} colorBg="green.300" label="Inverters Online" tooltip="Operational inverters / total installed" minW="120px" h="42px">
                  <BigNumInt v={onlineInverters} />
                  <Sep />
                  <BigNumInt v={totalInverters} />
                </Pill>
              </Flex>
            </Box>
          </Box>
        </Flex>

        {/* RIGHT */}
        <RightCornerControls eventCount={eventCount} plantInfo={plantInfo} onOpenNotif={() => {}} onOpenInfo={() => {}} avatarUrl={avatarUrl} timeZone={timeZone} isLoggedIn={isLoggedIn} displayName={displayName} handleLogout={handleLogout} navigate={navigate} />
      </Flex>
    </Box>
  );
}
