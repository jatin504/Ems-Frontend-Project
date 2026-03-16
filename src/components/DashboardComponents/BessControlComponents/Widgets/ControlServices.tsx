import {
  Box,
  VStack,
  HStack,
  Stack,
  Text,
  Button,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useBessControlModes } from "../../../../hooks/useBessControlModes";
import ConfirmPasswordModal from "../../../Common/ConfirmPasswordModal";
import usePermissions from "../../../../hooks/usePermissions";

type Dot = "green" | "red";

const WRAP_W = 332;
const WRAP_H = 578;
const FIELD_W = 160;
const FIELD_H = 34;
const FIELD_RADIUS = 8;
const FIELD_PADX = 10;
const FIELD_PADY = 8;
const FIELD_GAP = 10;

/* ================= STATUS DOT ================= */
function StatusDot({ color }: { color: Dot }) {
  const map: Record<Dot, string> = {
    green: "#22c55e",
    red: "#ef4444",
  };
  return <Box w="8px" h="8px" borderRadius="full" bg={map[color]} />;
}

/* ================= VALUE + UNIT ================= */
function ValueUnitField({
  unit,
  placeholder = "Enter value",
  value,
  onChange,
}: {
  unit?: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
}) {
  const softBg = useColorModeValue("gray.100", "#1C2121");
  const cardBorder = useColorModeValue("gray.200", "#202525");
  const textMuted = useColorModeValue("gray.600", "#A6B0B0");

  return (
    <HStack
      w={`${FIELD_W}px`}
      h={`${FIELD_H}px`}
      px={`${FIELD_PADX}px`}
      py={`${FIELD_PADY}px`}
      spacing={`${FIELD_GAP}px`}
      bg={softBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius={`${FIELD_RADIUS}px`}
    >
      <Input
        variant="unstyled"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        fontSize="sm"
        _placeholder={{ color: textMuted }}
      />
      {unit && (
        <>
          <Box h="100%" borderLeft="1px solid" borderColor={cardBorder} />
          <Text fontSize="xs" color={textMuted}>
            {unit}
          </Text>
        </>
      )}
    </HStack>
  );
}

/* ================= ROW ================= */
function Row({ h, children }: { h: number; children: React.ReactNode }) {
  return (
    <HStack w={`${WRAP_W}px`} h={`${h}px`} px="16px">
      {children}
    </HStack>
  );
}

/* ================= ONE FIELD ================= */
function OneField({
  label,
  subtext,
  unit,
  dot,
  value,
  onChange,
  modeSymbol,
  h = 46,
}: {
  label: string;
  subtext: string;
  unit?: string;
  dot: Dot;
  value?: string;
  onChange?: (v: string) => void;
  modeSymbol?: "L" | "R";
  h?: number;
}) {
  const textPrimary = useColorModeValue("gray.800", "#E8ECEC");
  const textMuted = useColorModeValue("#000000", "#FFFFFF");

  return (
    <Row h={h}>
      <Stack direction="row" align="center" spacing={3} w="full">
        <VStack align="start" spacing={1} flex="1">
          <HStack spacing={2}>
            <Text fontSize="sm" fontWeight={700} color={textPrimary}>
              {label}
            </Text>
            <StatusDot color={dot} />
            {modeSymbol && (
              <Box
                fontSize="10px"
                fontWeight={700}
                border="1px solid"
                borderRadius="3px"
                px="4px"
                color={modeSymbol === "L" ? "#22c55e" : "#2563eb"}
                borderColor={modeSymbol === "L" ? "#22c55e" : "#2563eb"}
              >
                {modeSymbol}
              </Box>
            )}
          </HStack>
          <Text fontSize="xs" color={textMuted}>
            {subtext}
          </Text>
        </VStack>

        <ValueUnitField unit={unit} value={value} onChange={onChange} />
      </Stack>
    </Row>
  );
}

/* ================= RAMP FIELD ================= */
function RampField({ modeSymbol }: { modeSymbol?: "L" | "R" }) {
  const textPrimary = useColorModeValue("gray.800", "#E8ECEC");
  const textMuted = useColorModeValue("gray.600", "#A6B0B0");

  return (
    <Row h={78}>
      <Stack direction="row" align="flex-start" spacing={3} w="full">
        <VStack align="start" spacing={1} flex="1">
          <HStack spacing={2}>
            <Text fontSize="sm" fontWeight={700} color={textPrimary}>
              Ramp
            </Text>
            <Text fontSize="xs" color={textMuted}>
              rate/min
            </Text>
            <StatusDot color="red" />
            {modeSymbol && (
              <Box
                fontSize="10px"
                fontWeight={700}
                border="1px solid"
                borderRadius="3px"
                px="4px"
                color={modeSymbol === "L" ? "#22c55e" : "#2563eb"}
                borderColor={modeSymbol === "L" ? "#22c55e" : "#2563eb"}
              >
                {modeSymbol}
              </Box>
            )}
          </HStack>
          <Text fontSize="xs">827.27</Text>
        </VStack>

        <VStack spacing={2}>
          <ValueUnitField unit="kW/min" placeholder="Up value" />
          <ValueUnitField unit="kW/min" placeholder="Down value" />
        </VStack>
      </Stack>
    </Row>
  );
}

/* ================= MAIN ================= */
export default function ControlServices() {
  const cardBg = useColorModeValue("white", "#161B1B");
  const cardBorder = useColorModeValue("gray.200", "#202525");
  const divider = cardBorder;

  const [pValue, setPValue] = useState("");
  const [qValue, setQValue] = useState("");
  const [modes, setModes] = useState<any>({});

  // PERMISSION CHECK
  const { permissions } = usePermissions();

  const role = (sessionStorage.getItem("role") || "").toLowerCase();

  const isPermissionLoaded = permissions && permissions.length > 0;

  const myPermission = permissions.find(
    (p: any) => (p.role_name || "").toLowerCase() === role
  );

  const canControlService = isPermissionLoaded
    ? myPermission?.can_control_service === true
    : true;

  // PASSWORD FLOW STATE
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<any>(null);

  const {
    setBessControlSetpoints,
    getBessControlSetpoints,
    getBessControlModes,
  } = useBessControlModes();

  /* ===== GET SETPOINTS (same as before) ===== */
  useEffect(() => {
    getBessControlSetpoints().then((res) => {
      if (res?.data?.p) setPValue(String(res.data.p.setpoint_value ?? ""));
      if (res?.data?.q) setQValue(String(res.data.q.setpoint_value ?? ""));
    });
  }, []);

  /* ===== GET MODES (AUTO REFRESH ADDED) ===== */
  useEffect(() => {
    const fetchModes = async () => {
      const res = await getBessControlModes();
      setModes(res?.data || {});
    };

    fetchModes(); // first load

    const interval = setInterval(fetchModes, 10000); 

    return () => clearInterval(interval);
  }, []);

  /* ===== APPLY ===== */
  const handleApply = async () => {
    if (!canControlService) {
      console.warn("User has no service control permission");
      return;
    }

    const payload = {
      p: { setpoint_value: Number(pValue), setpoint_unit: "kW" },
      q: { setpoint_value: Number(qValue), setpoint_unit: "kVAr" },
    };

    setPendingPayload(payload);
    setIsPasswordOpen(true);
  };

  // PASSWORD CONFIRM HANDLER
  const handlePasswordConfirm = async () => {
    if (!pendingPayload) return;

    await setBessControlSetpoints(pendingPayload);

    setPendingPayload(null);
    setIsPasswordOpen(false);
  };

  return (
    <Box
  bg={cardBg}
  border="1px solid"
  borderColor={cardBorder}
  borderRadius="12px"
  w={`${WRAP_W}px`}
  h={`${WRAP_H}px`}
  overflow="hidden"
  pointerEvents={!canControlService ? "none" : "auto"}
  opacity={!canControlService ? 0.6 : 1}
>
      <VStack align="stretch" spacing={0}>
        <HStack justify="space-between" px="16px" py="12px">
          <Text fontWeight={700}>Control Services</Text>
          <HStack>
            <Button size="xs" variant="outline">
              Clear
            </Button>
            <Button
              size="xs"
              bg="#33D2D2"
              color="white"
              onClick={handleApply}
              isDisabled={!canControlService}
            >
              Apply
            </Button>
          </HStack>
        </HStack>

        <Box h="12px" />
        <Box h="1px" bg={divider} />
        <Box h="12px" />

        <VStack
          spacing={0}
          divider={
            <>
              <Box h="12px" />
              <Box h="1px" bg={divider} />
              <Box h="12px" />
            </>
          }
        >
          <OneField
            label="P"
            subtext="827267"
            unit="kWh"
            dot={modes?.p?.active ? "green" : "red"}
            modeSymbol={modes?.p?.control_state === "local" ? "L" : "R"}
            value={pValue}
            onChange={setPValue}
          />

          <RampField
            modeSymbol={modes?.ramp?.control_state === "local" ? "L" : "R"}
          />

          <OneField
            label="P(f)"
            subtext="49.97 Hz"
            unit="kWh"
            dot="red"
            modeSymbol={modes?.pf?.control_state === "local" ? "L" : "R"}
          />

          <OneField
            label="Q"
            subtext="0 kVAr"
            unit="kVAr"
            dot={modes?.q?.active ? "green" : "red"}
            modeSymbol={modes?.q?.control_state === "local" ? "L" : "R"}
            value={qValue}
            onChange={setQValue}
          />

          <OneField
            label="cosphi"
            subtext="1"
            dot="red"
            modeSymbol={modes?.cosphi?.control_state === "local" ? "L" : "R"}
          />

          <OneField
            label="V Droop"
            subtext="4"
            dot="red"
            modeSymbol={modes?.v_droop?.control_state === "local" ? "L" : "R"}
          />

          <OneField
            label="FRT"
            subtext="4"
            dot="red"
            modeSymbol={modes?.frt?.control_state === "local" ? "L" : "R"}
          />
        </VStack>

        {/* Password Confirmation Modal */}
        <ConfirmPasswordModal
          isOpen={isPasswordOpen}
          onClose={() => setIsPasswordOpen(false)}
          onConfirm={handlePasswordConfirm}
        />
      </VStack>
    </Box>
  );
}
