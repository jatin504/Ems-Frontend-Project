import ConfirmPasswordModal from "./Common/ConfirmPasswordModal";
import {
  Box, Flex, HStack, IconButton, Button, useDisclosure,
  Stack, Text, VStack, Image as ChakraImage,   
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  Input, ModalFooter, useColorModeValue, useColorMode, Portal, Divider,
  Menu, MenuButton, MenuList, MenuItem,
} from "@chakra-ui/react";

import { HamburgerIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import { AiFillHome } from "react-icons/ai";
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
    const elRect  = el.getBoundingClientRect();
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
  const isSLDActive     = location.pathname.startsWith("/sld");
  const isControlActive =
    location.pathname.startsWith("/besscontroll");
    // location.pathname.startsWith("/ppc") ||
    // location.pathname.startsWith("/switch-gear");
  const isAlarmsActive  = location.pathname.startsWith("/alarms");
  const isReportActive  =
    location.pathname.startsWith("/report") ||
    location.pathname.startsWith("/template");
  const isCustomActive  = location.pathname.startsWith("/custom/dashboard");
  const isDSMActive     = location.pathname.startsWith("/dsm");

  // hide nav on login
  const hideNav = location.pathname.toLowerCase().startsWith("/login");
  if (hideNav) return null;

  const { colorMode } = useColorMode();

  return (
    <Box
      bg={navBg}
      px={4}
      boxShadow="md"
      zIndex={1100}
      position="relative"
      width="full"
      borderBottom="1px solid"
      borderColor={borderClr}
      overflowX="hidden"
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
          <HStack spacing={2}>
            {/* <ChakraImage
              src={colorMode === "light" ? cognetaLogoBlack : cognetaLogo}
              alt="Cogneta"
              height="64px"           
              objectFit="contain"
              bg="transparent"
            /> */}
            {/* NEW: Flux logo (transparent) — SECOND position */}
            <LightLogoProcessed
              src="/NewEtaFluxLogo.svg"   // ⬅️ replaced here
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

      {/* Main Navbar Row */}
      <Flex
        minH="40px"
        alignItems="center"
        justifyContent="space-between"
        width="full"
        py={1}
        gap={3}
        flexWrap="wrap"
      >
        {/* Mobile Menu Toggle */}
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ base: "inline-flex", md: "none" }}
          onClick={isOpen ? onClose : onOpen}
          color={mobileBtnColor}
          bg={useColorModeValue("gray.100", "gray.700")}
          _hover={{ bg: useColorModeValue("gray.200", "gray.600") }}
        />

        {/* Left side: Nav + Dropdowns (Desktop) */}
        <HStack spacing={4} alignItems="center" flex="1 1 auto" minW={0}>
          <Flex
            as="nav"
            gap={2}
            wrap="wrap"
            align="center"
            display={{ base: "none", md: "flex" }}
            w="full"
            position="relative"
            ref={navRowRef}
          >
            {/* Plant Menu */}
            <Menu placement="bottom-start" isLazy>
              <MenuButton
                as={Button}
                variant="ghost"
                size="sm"
                px={3}
                py={2}
                fontWeight="medium"
                onClick={setFromEvent}
                data-active={undefined} // plant picker isn't a route
              >
                {selectedMenu}
              </MenuButton>
              <Portal>
                <MenuList zIndex={2000} bg={navBg} color={linkColor} borderColor={borderClr}>
                  <MenuItem onClick={() => { setSelectedMenu("Fleet View"); window.location.href = `http://localhost:4444`; }}>
                    Fleet View
                  </MenuItem>
                  <MenuItem onClick={() => { setSelectedMenu("Fleet"); window.location.href = `http://localhost:4445${window.location.pathname}`; }}>
                    Fleet
                  </MenuItem>
                  <MenuItem onClick={() => { setSelectedMenu("Plant 2"); window.location.href = `http://localhost:4446${window.location.pathname}`; }}>
                    Plant 2
                  </MenuItem>
                  <MenuItem onClick={() => { setSelectedMenu("Plant 3"); window.location.href = `http://localhost:4447${window.location.pathname}`; }}>
                    Plant 3
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>

            {/* links BEFORE SLD */}
            {linksBeforeSLD.map((link) => (
              <NavLink key={link.name} {...link} />
            ))}

            {/* Devices */}
            <Menu placement="bottom-start" isLazy>
              <MenuButton
                as={Button}
                variant="ghost"
                size="sm"
                px={3}
                py={2}
                fontWeight="medium"
                onClick={setFromEvent}
                data-active={isDevicesActive ? "true" : undefined}
              >
                Devices
              </MenuButton>
              <Portal>
                <MenuList zIndex={2000} bg={navBg} color={linkColor} borderColor={borderClr} py={1} minW="180px">
                  <MenuItem onClick={() => goDevice("Inv")} py={1} fontSize="sm">Inverter</MenuItem>
                  <MenuItem onClick={() => goDevice("pcs")} py={1} fontSize="sm">PCS</MenuItem>
                  <MenuItem onClick={() => goDevice("wms")} py={1} fontSize="sm">WMS</MenuItem>
                  <MenuItem onClick={() => goDevice("meter")} py={1} fontSize="sm">METER</MenuItem>
                  <MenuItem onClick={() => goDevice("bess")} py={1} fontSize="sm">BESS</MenuItem>
                  <MenuItem onClick={() => goDevice("transformer")} py={1} fontSize="sm">Transformer</MenuItem>
                  <MenuItem onClick={() => goDevice("dc-zone")} py={1} fontSize="sm">DC Zone</MenuItem>
                  <MenuItem
                    py={1}
                    fontSize="sm"
                    onClick={() => navigate("/devices/switch-gear")}
                  >
                    Switch Gear
                  </MenuItem>
                  <MenuItem onClick={() => navigate("/devices/protection-relay")} py={1} fontSize="sm">Protection Relay</MenuItem>
                </MenuList>
              </Portal>
            </Menu>

            {/* SLD */}
            <Menu placement="bottom-start" isLazy>
              <MenuButton
                as={Button}
                variant="ghost"
                size="sm"
                px={3}
                py={2}
                fontWeight="medium"
                onClick={setFromEvent}
                data-active={isSLDActive ? "true" : undefined}
              >
                SLD
              </MenuButton>
              <Portal>
                <MenuList zIndex={2000} bg={navBg} color={linkColor} borderColor={borderClr}>
                  <MenuItem onClick={() => navigate("/sld")}>Electricals</MenuItem>
                  <MenuItem onClick={() => navigate("/network-dashboard")}>Networks</MenuItem>
                </MenuList>
              </Portal>
            </Menu>

            {/* links AFTER SLD */}
            {linksAfterSLD.map((link) => (
              <NavLink key={link.name} {...link} />
            ))}

            {/* Control */}
            <Menu placement="bottom-start" isLazy>
              <MenuButton
                as={Button}
                variant="ghost"
                size="sm"
                px={3}
                py={2}
                fontWeight="medium"
                onClick={setFromEvent}
                data-active={isControlActive ? "true" : undefined}
              >
                Control
              </MenuButton>
              <Portal>
                <MenuList zIndex={2000} bg={navBg} color={linkColor} borderColor={borderClr} minW="180px">
                  <MenuItem onClick={() => navigate("/besscontroll")}>BESS</MenuItem>
                  {/* <MenuItem onClick={() => navigate("/ppc")}>PPC</MenuItem>
                  <MenuItem onClick={() => navigate("/switch-gear")}>Switch Gear</MenuItem> */}
                  {/* --- Add this Solar option --- */}
                  <MenuItem onClick={() => navigate("/solardashboard")}>Solar</MenuItem>
                </MenuList>
              </Portal>
            </Menu>

            {/* Alarms */}
            <Menu placement="bottom-start" isLazy>
              <MenuButton
                as={Button}
                variant="ghost"
                size="sm"
                px={3}
                py={2}
                fontWeight="medium"
                onClick={setFromEvent}
                data-active={isAlarmsActive ? "true" : undefined}
              >
                Alarms
              </MenuButton>
              <Portal>
                <MenuList zIndex={2000} bg={navBg} color={linkColor} borderColor={borderClr} minW="220px" py={1}>
                  <MenuItem onClick={() => navigate("/alarms/latest")}>Alarm</MenuItem>
                  <MenuItem onClick={() => navigate("/alarms/events")}>Events</MenuItem>
                  <MenuItem onClick={() => navigate("/alarms/soe")}>SOE</MenuItem>
                </MenuList>
              </Portal>
            </Menu>

            {/* Report */}
            <Menu placement="bottom-start" isLazy>
              <MenuButton
                as={Button}
                variant="ghost"
                size="sm"
                px={3}
                py={2}
                fontWeight="medium"
                onClick={setFromEvent}
                data-active={isReportActive ? "true" : undefined}
              >
                Report
              </MenuButton>
              <Portal>
                <MenuList zIndex={2000} bg={navBg} color={linkColor} borderColor={borderClr}>
                  <MenuItem onClick={() => { navigate("/report"); }}>Report Dashboard</MenuItem>
                  <MenuItem onClick={() => { navigate("/template"); }}>Report Templates</MenuItem>
                </MenuList>
              </Portal>
            </Menu>

            {/* Custom */}
            <Menu placement="bottom-start" isLazy>
              <MenuButton
                as={Button}
                variant="ghost"
                size="sm"
                px={3}
                py={2}
                fontWeight="medium"
                onClick={setFromEvent}
                data-active={isCustomActive ? "true" : undefined}
              >
                Custom
              </MenuButton>
              <Portal>
                <MenuList zIndex={2000} bg={navBg} color={linkColor} borderColor={borderClr}>
                  {dashboards == null || dashboards?.length === 0 ? (
                    <MenuItem isDisabled>No custom dashboards</MenuItem>
                  ) : (
                    dashboards?.map((d: { id: string; title: string }) => (
                      <MenuItem key={d.id} onClick={() => navigate(`/custom/dashboard/${d.id}`)}>
                        {d.title}
                      </MenuItem>
                    ))
                  )}
                </MenuList>
              </Portal>
            </Menu>

            {/* PASS - Last Menu */}
            <Menu placement="bottom-start" isLazy>
              <MenuButton
                as={Button}
                variant="ghost"
                size="sm"
                px={3}
                py={2}
                fontWeight="medium"
                onClick={setFromEvent}
                data-active={isDSMActive ? "true" : undefined}
              >
                PASS
              </MenuButton>
              <Portal>
                <MenuList zIndex={2000} bg={navBg} color={linkColor} borderColor={borderClr}>
                  <MenuItem as={RouterLink} to="/newdashboard" fontSize="sm">Dashboard</MenuItem>
                  <MenuItem as={RouterLink} to="/dsm" fontSize="sm">DSM</MenuItem>
                  <MenuItem as={RouterLink} to="/energy-accounting" fontSize="sm">Energy Accounting</MenuItem>
                  <MenuItem as={RouterLink} to="/billing">Billing</MenuItem>
                  <MenuItem as={RouterLink} to="/reports">Reports</MenuItem>
                  <MenuItem as={RouterLink} to="/settings">Setting</MenuItem>
                </MenuList>
              </Portal>
            </Menu>

            {/* ---- GLOBAL UNDERLINE ---- */}
            <Box
              position="absolute"
              bottom="-1px"
              left={`${underline.left}px`}
              width={`${underline.width}px`}
              height="2px"
              bg={navLinkUnderlineColor}
              borderRadius="2px"
              transition="left .2s ease, width .2s ease, opacity .15s ease"
              opacity={underline.visible ? 1 : 0}
              pointerEvents="none"
            />
          </Flex>
        </HStack>

        {/* Right side: Create button */}
        <Flex alignItems="center" gap={3}>
          <IconButton
            icon={<AddIcon />}
            aria-label="Create Dashboard"
            size="sm"
            bg="#33D2D2"
            colorScheme="blue"
            onClick={openCreateCustomDashboard}
          />
        </Flex>
      </Flex>

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

      {/* Mobile View */}
      {isOpen && (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as="nav" spacing={2}>
            <Button w="100%" variant="ghost" color={mobileBtnColor} justifyContent="flex-start"
              onClick={() => { setSelectedMenu("Fleet View"); window.location.href = `http://localhost:4444`; }}>
              Fleet View
            </Button>
            <Button w="100%" variant="ghost" color={mobileBtnColor} justifyContent="flex-start"
              onClick={() => { setSelectedMenu("Fleet"); window.location.href = `http://localhost:4445${window.location.pathname}`; }}>
              Fleet
            </Button>
            <Button w="100%" variant="ghost" color={mobileBtnColor} justifyContent="flex-start"
              onClick={() => { setSelectedMenu("Plant 2"); window.location.href = `http://localhost:4446${window.location.pathname}`; }}>
              Plant 2
            </Button>
            <Button w="100%" variant="ghost" color={mobileBtnColor} justifyContent="flex-start"
              onClick={() => { setSelectedMenu("Plant 3"); window.location.href = `http://localhost:4447${window.location.pathname}`; }}>
              Plant 3
            </Button>

            {/* Devices list (flat) */}
            <Text fontSize="sm" mt={2} px={2} opacity={0.8}>Devices</Text>
            {[
              ["INV", "inv"], ["PCS", "pcs"], ["WMS", "wms"], ["METER", "meter"], ["BESS", "bess"],
              ["Transformer", "transformer"], ["DC Zone", "dc-zone"], ["Switch Gear", "switch-gear"],
            ].map(([label, slug]) => (
              <Button key={slug} w="100%" variant="ghost" color={mobileBtnColor} justifyContent="flex-start" onClick={() => goDevice(slug as string)}>
                {label}
              </Button>
            ))}
            <Button w="100%" variant="ghost" color={mobileBtnColor} justifyContent="flex-start" onClick={() => navigate("/devices/protection-relay")}>
              Protection Relay
            </Button>

            {/* SLD (mobile) */}
            <Text fontSize="sm" mt={2} px={2} opacity={0.8}>SLD</Text>
            <Button w="100%" variant="ghost" color={mobileBtnColor} justifyContent="flex-start" onClick={() => navigate("/sld")}>
              Electricals
            </Button>
            <Button w="100%" variant="ghost" color={mobileBtnColor} justifyContent="flex-start" onClick={() => navigate("/sld/networks")}>
              Networks
            </Button>

            {/* Alarms (mobile) */}
            <Text fontSize="sm" mt={2} px={2} opacity={0.8}>Alarms</Text>
            <HStack px={2}>
              <Button size="xs" variant="solid" onClick={() => navigate("/alarms/latest")}>Latest</Button>
              <Button size="xs" variant="outline" onClick={() => navigate("/alarms/history")}>History</Button>
            </HStack>
            <Button w="100%" variant="ghost" color={mobileBtnColor} justifyContent="flex-start" onClick={() => navigate("/alarms/events")}>
              Events
            </Button>
            <Button w="100%" variant="ghost" color={mobileBtnColor} justifyContent="flex-start" onClick={() => navigate("/alarms/soe")}>
              SOE
            </Button>

            {[...linksAfterSLD].map((link) => (
              <NavLink key={link.name} {...link} />
            ))}
          </Stack>
        </Box>
      )}

    </Box>
  );
};

export default Navbar;
