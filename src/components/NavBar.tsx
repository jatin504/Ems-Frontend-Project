import ConfirmPasswordModal from "./Common/ConfirmPasswordModal";
import {
  Box, Flex, HStack, IconButton, Button, useDisclosure,
  Stack, Text, VStack, Image as ChakraImage,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  Input, ModalFooter, useColorModeValue, useColorMode, Portal, Divider,
  Menu, MenuButton, MenuList, MenuItem,
} from "@chakra-ui/react";

import {
  HamburgerIcon,
  CloseIcon,
  AddIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { AiFillHome } from "react-icons/ai";
import {
  FiCpu,
  FiSliders,
  FiBell,
  FiFileText,
  FiGitBranch,
  FiSun,
  FiActivity,
  FiGrid,
  FiSettings,
  FiChevronRight,
  FiDatabase,
  FiZap,
  FiBarChart2,
  FiLayers,
} from "react-icons/fi";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, useCallback, useMemo } from "react"; // ← useMemo added
import TopRibbonBESS from "./TopRibbonBESS";
// import cognetaLogoBlack from "../assets/cogneta_logo_black.png";
// import cognetaLogo from "../assets/Cogneta.png";
import { useDashboard } from "../hooks/dashboard/useDashboard";

/** NEW: White / near-white background ko transparent karta hai (PNG data URL se swap) */
function LightLogoProcessed({
  src,
  h = "64px",
  threshold = 244,
  tolerance = 40,
}: {
  src: string;
  h?: string | number;
  threshold?: number;
  tolerance?: number;
}) {
  const [out, setOut] = useState(src);
  const cacheKey = useMemo(
    () => `logoClean:${src}:t${threshold}:d${tolerance}`,
    [src, threshold, tolerance]
  );

  useEffect(() => {
    let cancelled = false;

    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setOut(cached);
      return;
    }

    // IMPORTANT: use the browser Image constructor, not Chakra's component
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      try {
        const w = img.naturalWidth || img.width;
        const hgt = img.naturalHeight || img.height;
        if (!w || !hgt) throw new Error("bad dims");

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = hgt;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no ctx");

        ctx.drawImage(img, 0, 0, w, hgt);
        const imgData = ctx.getImageData(0, 0, w, hgt);
        const d = imgData.data;

        // near-white ko transparent: r,g,b >= threshold & max-min <= tolerance
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i], g = d[i + 1], b = d[i + 2];
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          if (r >= threshold && g >= threshold && b >= threshold && max - min <= tolerance) {
            d[i + 3] = 0; // alpha 0 = transparent
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const url = canvas.toDataURL("image/png");
        if (!cancelled) {
          sessionStorage.setItem(cacheKey, url);
          setOut(url);
        }
      } catch {
        if (!cancelled) setOut(src);
      }
    };

    img.onerror = () => {
      if (!cancelled) setOut(src);
    };

    return () => { cancelled = true; };
  }, [cacheKey, src, threshold, tolerance]);

  return (
    <ChakraImage
      src={out}
      alt="logo"
      height={h}
      objectFit="contain"
      bg="transparent"
      draggable={false}
    />
  );
}

function SidebarSubItem({
  label,
  icon,
  active = false,
  onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  const textColor = useColorModeValue("#475569", "#CBD5E1");

  return (
    <HStack
      position="relative"
      ml="27px"
      mr="8px"
      px="10px"
      py="6px"
      minH="32px"
      borderRadius="9px"
      cursor="pointer"
      color={active ? "#FFFFFF" : textColor}
      bg={
        active
          ? "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)"
          : "transparent"
      }
      border={active ? "1px solid rgba(96,165,250,.45)" : "1px solid transparent"}
      boxShadow={
        active
          ? "0 5px 14px rgba(37,99,235,.35), inset 0 1px 0 rgba(255,255,255,.22)"
          : "none"
      }
      transition="all .2s ease"
      _hover={{
        bg: active
          ? "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)"
          : useColorModeValue("rgba(15,23,42,.05)", "rgba(255,255,255,.06)"),
        transform: "translateX(3px)",
      }}
      onClick={onClick}
    >
      <Box
        position="absolute"
        left="-17px"
        top="-18px"
        w="1px"
        h="42px"
        bg={useColorModeValue("#CBD5E1", "#334155")}
      />
      <Box
        position="absolute"
        left="-20px"
        w="7px"
        h="7px"
        borderRadius="full"
        bg={active ? "#60A5FA" : "#64748B"}
        boxShadow={active ? "0 0 8px #60A5FA" : "none"}
      />
      <Box
        w="22px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        fontSize="14px"
      >
        {icon}
      </Box>
      <Text
        fontSize="11px"
        fontWeight={active ? "600" : "500"}
        noOfLines={1}
      >
        {label}
      </Text>
    </HStack>
  );
}

function SidebarMainItem({
  label,
  icon,
  collapsed,
  active = false,
  hasChildren = false,
  isOpen = false,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  collapsed: boolean;
  active?: boolean;
  hasChildren?: boolean;
  isOpen?: boolean;
  onClick: () => void;
}) {
  const textColor = useColorModeValue("#334155", "#E2E8F0");

  return (
    <Box px="5px" mb="2px">
      <HStack
        position="relative"
        h="40px"
        px={collapsed ? 0 : "11px"}
        justify={collapsed ? "center" : "flex-start"}
        spacing={collapsed ? 0 : "10px"}
        borderRadius="10px"
        cursor="pointer"
        color={active ? "#FFFFFF" : textColor}
        bg={
          active
            ? "linear-gradient(135deg, #3978E8 0%, #285CC4 100%)"
            : "transparent"
        }
        border={
          active
            ? "1px solid rgba(96,165,250,.45)"
            : "1px solid transparent"
        }
        boxShadow={
          active
            ? "0 4px 10px rgba(37,99,235,.22), inset 0 1px 0 rgba(255,255,255,.16)"
            : "none"
        }
        transition="all .2s cubic-bezier(.4,0,.2,1)"
        _hover={{
          transform: "translateY(-1px)",
          bg: active
            ? "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)"
            : useColorModeValue(
                "linear-gradient(135deg,#F8FAFC,#E2E8F0)",
                "linear-gradient(135deg,#202938,#151C28)"
              ),
          boxShadow: active
            ? "0 7px 18px rgba(37,99,235,.35), inset 0 1px 0 rgba(255,255,255,.20)"
            : "0 5px 12px rgba(0,0,0,.12)",
        }}
        onClick={onClick}
        title={collapsed ? label : undefined}
      >
        {active && (
          <Box
            position="absolute"
            left="-2px"
            top="7px"
            bottom="7px"
            w="2px"
            borderRadius="full"
            bg="#60A5FA"
            boxShadow="0 0 6px #60A5FA"
          />
        )}
        <Box
          w="23px"
          h="23px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="7px"
          fontSize="14px"
          bg={
            active
              ? "rgba(255,255,255,.15)"
              : useColorModeValue("rgba(148,163,184,.12)", "rgba(148,163,184,.12)")
          }
          color={active ? "#FFFFFF" : textColor}
        >
          {icon}
        </Box>
        {!collapsed && (
          <Text
            flex="1"
            fontSize="12px"
            fontWeight={active ? "600" : "500"}
            letterSpacing="0.01em"
          >
            {label}
          </Text>
        )}
        {!collapsed && hasChildren && (
          <Box
            w="18px"
            h="18px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color={active ? "#FFFFFF" : useColorModeValue("#475569", "#CBD5E1")}
          >
            <FiChevronRight
              size={12}
              style={{
                transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform .2s ease",
              }}
            />
          </Box>
        )}
      </HStack>
    </Box>
  );
}

const Navbar = () => {
  // ROUTER
  const navigate = useNavigate();
  const location = useLocation();

  // DISCLOSURES
  const { isOpen, onOpen, onClose } = useDisclosure(); // mobile menu
  const {
    isOpen: isOpencreatingCustomDashboard,
    onOpen: openCreateCustomDashboard,
    onClose: closeCreateCustomDashboard
  } = useDisclosure();

  // STATE
  const [selectedMenu, setSelectedMenu] = useState("Fleet");
  const [displayName, setDisplayName] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [openSidebarMenu, setOpenSidebarMenu] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  // demo values (bind live later)
  const [livePowerKw] = useState(187.73);
  const [lifeChargeMWh] = useState(289.08);
  const [lifeDischargeMWh] = useState(289.08);
  const [dailyChargeMWh] = useState(1366.4);
  const [dailyDischargeMWh] = useState(1366.4);
  const [cufAcPct] = useState(16.1);
  const [cufDcPct] = useState(13.5);
  const [onlineInverters] = useState(17);
  const [totalInverters] = useState(17);
  const [updatedAt] = useState("just now");

  // AUTH EFFECT
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const name = sessionStorage.getItem("userName") || "";
    setIsLoggedIn(!!token);
    setDisplayName(name);

    const onStorage = () => {
      const t = sessionStorage.getItem("token");
      const n = sessionStorage.getItem("userName") || "";
      setIsLoggedIn(!!t);
      setDisplayName(n);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userName");
    setIsLoggedIn(false);
    setDisplayName("");
    navigate("/login");
  };

  // DASHBOARDS
  const [title, setTitle] = useState("");
  const [id, setId] = useState("");
  const { createDashboard, getDashboard, dashboards } = useDashboard();
  useEffect(() => { getDashboard(); }, []);



  const handleCreate = () => {
    if (!title.trim() || !id.trim()) return;
    createDashboard(id, title);
    setTitle("");
    setId("");
    closeCreateCustomDashboard();
    setTimeout(() => { getDashboard(); }, 500);
    setTimeout(() => { navigate(`/custom/dashboard/${id}`); }, 1000);
  };

  // LINKS
  const linksBeforeSLD = [
    { name: "Plant View", path: "/plantview" },
  ];
  const linksAfterSLD = [
    { name: "Solar View", path: "/solarview" },
  ];

  // COLORS & HELPERS
  const linkColor = useColorModeValue("gray.900", "white");
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const navBg = useColorModeValue("white", "#161B1B");
  const borderClr = useColorModeValue("gray.200", "gray.700");
  const mobileBtnColor = useColorModeValue("gray.800", "white");
  const navLinkUnderlineColor = useColorModeValue("black", "white");

  // Special-case BESS to open the PCS bank dashboard
  const goDevice = (slug: string) => {
    if (slug === "bess") {
      navigate("/batterybankk");
      return;
    }

    if (slug === "meter") {
      navigate("/devices/meter-1");
      return;
    }

    if (slug === "wms") {
      navigate("/devices/wms-1");
      return;
    }

    if (slug === "dc-zone") {
      navigate("/string-new-dashboard");
      return;
    }

    navigate(`/devices/${slug}`);
  };
  // ---------- Single moving underline ----------
  const navRowRef = useRef<HTMLDivElement>(null);
  const [underline, setUnderline] = useState<{ left: number; width: number; visible: boolean }>({
    left: 0, width: 0, visible: false,
  });

  const moveUnderline = useCallback((el?: HTMLElement | null) => {
    const row = navRowRef.current;
    if (!row || !el) return;
    const rowRect = row.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setUnderline({
      left: elRect.left - rowRect.left,
      width: elRect.width,
      visible: true,
    });
  }, []);

  const setFromEvent = (e: React.MouseEvent<HTMLElement>) => {
    moveUnderline(e.currentTarget as HTMLElement);
  };

  // route-change pe active element par underline set karo
  useEffect(() => {
    const row = navRowRef.current;
    if (!row) return;
    const active = row.querySelector('[data-active="true"]') as HTMLElement | null;
    if (active) {
      moveUnderline(active);
      setUnderline(u => ({ ...u, visible: true }));
    } else {
      // agar koi item active na mile, underline ko mat hatao (previous state rehne do)
      setUnderline(u => ({ ...u, visible: u.visible }));
    }
  }, [location.pathname, moveUnderline]);
  // ---------------------------------------------

  // SMART NavLink: child routes par bhi active
  const NavLink = ({ name, path }: { name: string; path: string }) => {
    // base = first segment, e.g. "/config" from "/config/device"
    const base = "/" + path.split("/").filter(Boolean)[0];
    const isActive =
      location.pathname === path ||
      location.pathname.startsWith(`${base}/`);

    return (
      <RouterLink to={path}>
        <HStack
          px={3}
          py={2}
          rounded="md"
          spacing={1}
          fontWeight="medium"
          color={linkColor}
          _hover={{ textDecoration: "none", bg: hoverBg, color: linkColor }}
          onClick={setFromEvent}
          data-active={isActive ? "true" : undefined}
        >
          {name === "Dashboard" && <AiFillHome />}
          <Text fontSize="sm">{name}</Text>
        </HStack>
      </RouterLink>
    );
  };

  // Active flags for dropdown parents
  const isDevicesActive = location.pathname.startsWith("/devices");
  const isSLDActive = location.pathname.startsWith("/sld");
  const isControlActive =
    location.pathname.startsWith("/besscontroll");
  location.pathname.startsWith("/control-new-dashboard");
  // location.pathname.startsWith("/ppc") ||
  // location.pathname.startsWith("/switch-gear");
  const isAlarmsActive = location.pathname.startsWith("/alarms");
  const isReportActive =
    location.pathname.startsWith("/report") ||
    location.pathname.startsWith("/template");
  const isCustomActive = location.pathname.startsWith("/custom/dashboard");
  const isDSMActive = location.pathname.startsWith("/dsm");

  const toggleSidebarMenu = (menu: string) => {
    if (sidebarCollapsed) {
      setSidebarCollapsed(false);
      setOpenSidebarMenu(menu);
      return;
    }
    setOpenSidebarMenu((prev) =>
      prev === menu ? null : menu
    );
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const sidebar = sidebarRef.current;
      if (!sidebar) return;
      const rect = sidebar.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (!inside && !sidebarCollapsed) {
        setSidebarCollapsed(true);
        setOpenSidebarMenu(null);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [sidebarCollapsed]);

  // hide nav on login
  const hideNav = location.pathname.toLowerCase().startsWith("/login");
  if (hideNav) return null;

  const { colorMode } = useColorMode();

  const sidebarBg = useColorModeValue("white", "#1a202c");
  const sidebarBorder = useColorModeValue("gray.200", "gray.700");

  return (
    <>
      {/* FIXED SIDEBAR */}
      <Box
        ref={sidebarRef}
        position="fixed"
        left="0"
        top="0"
        bottom="0"
        w={sidebarCollapsed ? "60px" : "230px"}
        bg={useColorModeValue(
          "linear-gradient(180deg,#F8FAFC 0%,#E8EEF5 100%)",
          "linear-gradient(180deg,#111B29 0%,#0B1420 100%)"
        )}
        borderRight="1px solid"
        borderColor={useColorModeValue(
          "rgba(148,163,184,.35)",
          "rgba(71,85,105,.45)"
        )}
        borderRadius="0"
        boxShadow={useColorModeValue(
          "8px 0 25px rgba(15,23,42,.10)",
          "8px 0 25px rgba(0,0,0,.35)"
        )}
        transition="width .25s ease"
        zIndex={1200}
        overflowY="auto"
        overflowX="hidden"
        pt="12px"
        pb="12px"
        css={{
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(100,116,139,.35)",
            borderRadius: "10px",
          },
        }}
      >
        {/* Collapse Toggle */}
        <Flex
          px={sidebarCollapsed ? 0 : "12px"}
          justifyContent={sidebarCollapsed ? "center" : "flex-end"}
          mb="16px"
        >
          <IconButton
            icon={
              sidebarCollapsed ? (
                <ChevronRightIcon />
              ) : (
                <ChevronRightIcon transform="rotate(180deg)" />
              )
            }
            aria-label="Toggle Sidebar"
            size="sm"
            borderRadius="10px"
            color={useColorModeValue("#334155", "#CBD5E1")}
            bg={useColorModeValue(
              "linear-gradient(145deg,#FFFFFF,#E2E8F0)",
              "linear-gradient(145deg,#263244,#17202D)"
            )}
            border="1px solid"
            borderColor={useColorModeValue("#CBD5E1", "#334155")}
            boxShadow={useColorModeValue(
              "3px 4px 8px rgba(15,23,42,.15), inset 1px 1px 2px white",
              "3px 4px 8px rgba(0,0,0,.35), inset 1px 1px 2px rgba(255,255,255,.08)"
            )}
            _hover={{
              transform: "translateY(-1px)",
            }}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </Flex>

        {/* Sidebar Menu Items */}
        <VStack spacing="4px" align="stretch">
          <SidebarMainItem
            label="Devices"
            icon={<FiCpu />}
            collapsed={sidebarCollapsed}
            active={isDevicesActive}
            hasChildren
            isOpen={openSidebarMenu === "Devices"}
            onClick={() => toggleSidebarMenu("Devices")}
          />
          {!sidebarCollapsed && openSidebarMenu === "Devices" && (
            <Box>
              <SidebarSubItem label="Inverter" icon={<FiZap />} active={location.pathname === "/devices/inv"} onClick={() => navigate("/devices/inv")} />
              <SidebarSubItem label="PCS" icon={<FiCpu />} active={location.pathname === "/devices/pcs"} onClick={() => navigate("/devices/pcs")} />
              <SidebarSubItem label="BESS" icon={<FiDatabase />} active={location.pathname === "/devices/bess"} onClick={() => navigate("/devices/bess")} />
              <SidebarSubItem label="Meter" icon={<FiActivity />} active={location.pathname === "/devices/meter-1"} onClick={() => navigate("/devices/meter-1")} />
              <SidebarSubItem label="Transformer" icon={<FiLayers />} active={location.pathname === "/devices/transformer"} onClick={() => navigate("/devices/transformer")} />
              <SidebarSubItem label="DC Zone" icon={<FiGrid />} active={location.pathname === "/string-new-dashboard"} onClick={() => navigate("/string-new-dashboard")} />
              <SidebarSubItem label="WMS" icon={<FiActivity />} active={location.pathname === "/devices/wms-1"} onClick={() => navigate("/devices/wms-1")} />
              <SidebarSubItem label="Switch Gear" icon={<FiSliders />} active={location.pathname === "/devices/switch-gear"} onClick={() => navigate("/devices/switch-gear")} />
              <SidebarSubItem label="Protection Relay" icon={<FiZap />} active={location.pathname === "/devices/protection-relay"} onClick={() => navigate("/devices/protection-relay")} />
            </Box>
          )}

          <SidebarMainItem
            label="Control"
            icon={<FiSliders />}
            collapsed={sidebarCollapsed}
            active={isControlActive}
            hasChildren
            isOpen={openSidebarMenu === "Control"}
            onClick={() => toggleSidebarMenu("Control")}
          />
          {!sidebarCollapsed && openSidebarMenu === "Control" && (
            <Box>
              <SidebarSubItem label="BESS" icon={<FiDatabase />} active={location.pathname === "/besscontroll"} onClick={() => navigate("/besscontroll")} />
              <SidebarSubItem label="Solar" icon={<FiSun />} active={location.pathname === "/solardashboard"} onClick={() => navigate("/solardashboard")} />
              <SidebarSubItem label="Trading" icon={<FiBarChart2 />} active={location.pathname === "/tradingdashboard"} onClick={() => navigate("/tradingdashboard")} />
              <SidebarSubItem label="Manual Black Start" icon={<FiGitBranch />} active={location.pathname === "/manual-black-start"} onClick={() => navigate("/manual-black-start")} />
              <SidebarSubItem label="Genset" icon={<FiGrid />} active={location.pathname === "/genset"} onClick={() => navigate("/genset")} />
              <SidebarSubItem label="Grid" icon={<FiGrid />} active={location.pathname === "/grid"} onClick={() => navigate("/grid")} />
              <SidebarSubItem label="Load Forecast" icon={<FiActivity />} active={location.pathname === "/Load-Forecast"} onClick={() => navigate("/Load-Forecast")} />
            </Box>
          )}

          <SidebarMainItem
            label="Alerts"
            icon={<FiBell />}
            collapsed={sidebarCollapsed}
            active={isAlarmsActive}
            hasChildren
            isOpen={openSidebarMenu === "Alerts"}
            onClick={() => toggleSidebarMenu("Alerts")}
          />
          {!sidebarCollapsed && openSidebarMenu === "Alerts" && (
            <Box>
              <SidebarSubItem label="Alarm" icon={<FiBell />} active={location.pathname === "/alarms/latest"} onClick={() => navigate("/alarms/latest")} />
              <SidebarSubItem label="Event" icon={<FiFileText />} active={location.pathname === "/events/latest"} onClick={() => navigate("/events/latest")} />
              <SidebarSubItem label="SOE" icon={<FiActivity />} active={location.pathname === "/alarms/soe"} onClick={() => navigate("/alarms/soe")} />
            </Box>
          )}

          <SidebarMainItem
            label="Report"
            icon={<FiFileText />}
            collapsed={sidebarCollapsed}
            active={isReportActive}
            hasChildren
            isOpen={openSidebarMenu === "Report"}
            onClick={() => toggleSidebarMenu("Report")}
          />
          {!sidebarCollapsed && openSidebarMenu === "Report" && (
            <Box>
              <SidebarSubItem label="Report Dashboard" icon={<FiBarChart2 />} active={location.pathname === "/report"} onClick={() => navigate("/report")} />
              <SidebarSubItem label="Report Templates" icon={<FiFileText />} active={location.pathname === "/template"} onClick={() => navigate("/template")} />
            </Box>
          )}

          <SidebarMainItem
            label="SLD"
            icon={<FiGitBranch />}
            collapsed={sidebarCollapsed}
            active={isSLDActive}
            hasChildren
            isOpen={openSidebarMenu === "SLD"}
            onClick={() => toggleSidebarMenu("SLD")}
          />
          {!sidebarCollapsed && openSidebarMenu === "SLD" && (
            <Box>
              <SidebarSubItem label="Electricals" icon={<FiGrid />} active={location.pathname === "/sld"} onClick={() => navigate("/sld")} />
              <SidebarSubItem label="Networks" icon={<FiGitBranch />} active={location.pathname === "/network-dashboard"} onClick={() => navigate("/network-dashboard")} />
            </Box>
          )}

          <SidebarMainItem
            label="Plant View"
            icon={<FiGrid />}
            collapsed={sidebarCollapsed}
            active={location.pathname === "/plantview"}
            onClick={() => navigate("/plantview")}
          />

          <SidebarMainItem
            label="Solar"
            icon={<FiSun />}
            collapsed={sidebarCollapsed}
            active={location.pathname === "/solarview"}
            onClick={() => navigate("/solarview")}
          />

          <SidebarMainItem
            label="Trends"
            icon={<FiBarChart2 />}
            collapsed={sidebarCollapsed}
            active={false}
            onClick={() => {
              const token = sessionStorage.getItem("token");
              const userName = sessionStorage.getItem("userName");
              window.open(
                `http://75.119.146.115:5500/Trend?token=${token}&userName=${userName}`,
                "_blank"
              );
            }}
          />

          <SidebarMainItem
            label="Custom"
            icon={<FiLayers />}
            collapsed={sidebarCollapsed}
            active={isCustomActive}
            hasChildren
            isOpen={openSidebarMenu === "Custom"}
            onClick={() => toggleSidebarMenu("Custom")}
          />
          {!sidebarCollapsed && openSidebarMenu === "Custom" && (
            <Box>
              {dashboards && dashboards.length > 0 ? (
                dashboards.map((d: { id: string; title: string }) => (
                  <SidebarSubItem
                    key={d.id}
                    label={d.title}
                    icon={<FiLayers />}
                    active={location.pathname === `/custom/dashboard/${d.id}`}
                    onClick={() => navigate(`/custom/dashboard/${d.id}`)}
                  />
                ))
              ) : (
                <SidebarSubItem label="No dashboards" icon={<FiLayers />} active={false} onClick={() => {}} />
              )}
            </Box>
          )}

          <SidebarMainItem
            label="PASS"
            icon={<FiDatabase />}
            collapsed={sidebarCollapsed}
            active={isDSMActive}
            hasChildren
            isOpen={openSidebarMenu === "PASS"}
            onClick={() => toggleSidebarMenu("PASS")}
          />
          {!sidebarCollapsed && openSidebarMenu === "PASS" && (
            <Box>
              <SidebarSubItem label="Dashboard" icon={<FiGrid />} active={location.pathname === "/newdashboard"} onClick={() => navigate("/newdashboard")} />
              <SidebarSubItem label="DSM" icon={<FiSliders />} active={location.pathname === "/dsm"} onClick={() => navigate("/dsm")} />
              <SidebarSubItem label="Energy Accounting" icon={<FiDatabase />} active={location.pathname === "/energy-accounting"} onClick={() => navigate("/energy-accounting")} />
              <SidebarSubItem label="Billing" icon={<FiFileText />} active={location.pathname === "/billing"} onClick={() => navigate("/billing")} />
              <SidebarSubItem label="Reports" icon={<FiBarChart2 />} active={location.pathname === "/reports"} onClick={() => navigate("/reports")} />
              <SidebarSubItem label="Setting" icon={<FiSettings />} active={location.pathname === "/settings"} onClick={() => navigate("/settings")} />
              <SidebarSubItem label="Load Forecast" icon={<FiActivity />} active={location.pathname === "/Load-Forecast"} onClick={() => navigate("/Load-Forecast")} />
            </Box>
          )}

          <SidebarMainItem
            label="Settings"
            icon={<FiSettings />}
            collapsed={sidebarCollapsed}
            active={location.pathname === "/settings"}
            onClick={() => navigate("/settings")}
          />
        </VStack>
        {!sidebarCollapsed && (
          <VStack
            position="absolute"
            bottom="8px"
            left="0"
            right="0"
            spacing="0"
            align="center"
            pointerEvents="none"
          >
            <Text fontSize="9px" color={useColorModeValue("#64748B", "#94A3B8")}>
              v3.1.0
            </Text>
            <Text fontSize="9px" color={useColorModeValue("#64748B", "#94A3B8")}>
              Designed by Cogneta Green Solution
            </Text>
          </VStack>
        )}
      </Box>

      {/* MAIN CONTENT AREA */}
      <Box
        ml={{ base: 0, md: sidebarCollapsed ? "60px" : "230px" }}
        width={{
          base: "100%",
          md: `calc(100vw - ${sidebarCollapsed ? "60px" : "230px"})`,
        }}
        maxW="none"
        minW={0}
        overflowX="auto"
        overflowY="hidden"
        transition="margin-left .25s ease, width .25s ease"
      >
        {/* TOP RIBBON */}
        <TopRibbonBESS
          livePowerKw={livePowerKw}
          lifeChargeMWh={lifeChargeMWh}
          lifeDischargeMWh={lifeDischargeMWh}
          dailyChargeMWh={dailyChargeMWh}
          dailyDischargeMWh={dailyDischargeMWh}
          cufAcPct={cufAcPct}
          cufDcPct={cufDcPct}
          onlineInverters={onlineInverters}
          totalInverters={totalInverters}
          updatedAt={updatedAt}
          leftSlot={
            <HStack spacing={2} ml={"18px"}>
              <LightLogoProcessed
                src="/NewEtaFluxLogo.svg"
                h="22px"
                threshold={244}
                tolerance={40}
              />
              <Text fontWeight="semibold" color={useColorModeValue("gray.900", "white")} />
            </HStack>
          }
          isLoggedIn={isLoggedIn}
          displayName={displayName}
          handleLogout={handleLogout}
          navigate={navigate}
        />

      </Box>

      {/* Create Dashboard Modal */}
      <Modal isOpen={isOpencreatingCustomDashboard} onClose={closeCreateCustomDashboard}>
        <ModalOverlay />
        <ModalContent bg={useColorModeValue("white", "gray.800")} color={linkColor}>
          <ModalHeader>Create New Dashboard</ModalHeader>
          <ModalBody>
            <Input placeholder="Dashboard Title" value={title} onChange={(e) => setTitle(e.target.value)} mb={3} />
            <Input placeholder="Dashboard ID (unique)" value={id} onChange={(e) => setId(e.target.value)} mb={3} />
          </ModalBody>
          <ModalFooter>
            <Button size="sm" mr={3} onClick={closeCreateCustomDashboard}>Cancel</Button>
            <Button size="sm" colorScheme="blue" onClick={handleCreate}>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Navbar;
