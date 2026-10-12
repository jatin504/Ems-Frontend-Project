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
import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useBessControlModes } from "../../../../hooks/useBessControlModes";
import ConfirmPasswordModal from "../../../Common/ConfirmPasswordModal";
import ControlServicesEditModal, {
  DEFAULT_VALUES,
  type ControlCurvesValues,
} from "./ControlServicesEditModal";
import usePermissions from "../../../../hooks/usePermissions";
import { GetDataService } from "../../../SLDComponents/guvnl/DataExtractionService";

type Dot = "green" | "red";

const WRAP_W = 332;
const WRAP_H = 300;
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
export default function ControlServices({ ppc_data }: { ppc_data: any }) {
  const cardBg = useColorModeValue("white", "#161B1B");
  const cardBorder = useColorModeValue("gray.200", "#202525");
  const divider = cardBorder;

  const [pValue, setPValue] = useState(String(GetDataService("operator_setpoint_active_power_abs", ppc_data) || 0));
  const [qValue, setQValue] = useState(String(GetDataService("operator_setpoint_reactive_power", ppc_data) || 0));
  const [vValue, setVValue] = useState("");
  const [cosphiValue, setCosphiValue] = useState("");
  const [curveValues, setCurveValues] = useState<ControlCurvesValues>(() => ({
    ...DEFAULT_VALUES,
    pf: DEFAULT_VALUES.pf.map((point) => ({ ...point })),
    quQ: DEFAULT_VALUES.quQ.map((point) => ({ ...point })),
    quU: DEFAULT_VALUES.quU.map((point) => ({ ...point })),
  }));
  const [isEditOpen, setIsEditOpen] = useState(false);

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
  // Confirmation dialog state for Apply
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const cancelRef = React.useRef<any>(null);

  const {
    setBessControlSetpoints,
    getBessControlSetpoints,
    getBessControlModes,
  } = useBessControlModes();

  /* ===== GET SETPOINTS (same as before) ===== */
  useEffect(() => {
  getBessControlSetpoints().then((res) => {
    if (res?.data?.p) {
      setPValue(String(res.data.p.setpoint_value ? res.data.p.setpoint_value / 1000 :  ""));
    }

    if (res?.data?.q) {
      setQValue(String(res.data.q.setpoint_value ? res.data.q.setpoint_value / 1000 : ""));
    }

    if (res?.data?.v) {
      setVValue(String(res.data.v.setpoint_value ?? ""));
    }

    if (res?.data?.cosphi) {
      setCosphiValue(String(res.data.cosphi.setpoint_value ?? ""));
    }
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
  const handleApply = () => {
    if (!canControlService) {
      console.warn("User has no service control permission");
      return;
    }

    const payload = {
      p: {
        setpoint_value: Number(pValue) * 1000,
        setpoint_unit: "kW",
      },

      q: {
        setpoint_value: Number(qValue) * 1000,
        setpoint_unit: "kVAr",
      },

      v: {
        setpoint_value: Number(vValue),
        setpoint_unit: "V",
      },

      cosphi: {
        setpoint_value: Number(cosphiValue),
        setpoint_unit: "",
      },

      ramp: {
        setpoint_value: Number(curveValues.ramp),
        setpoint_unit: "%/min",
      },

      recover: {
        setpoint_value: Number(curveValues.recover),
        setpoint_unit: "s",
      },

      pfx0: {
        setpoint_value: Number(curveValues.pf[0]?.x || 0),
        setpoint_unit: "Hz",
      },
      pfx1: {
        setpoint_value: Number(curveValues.pf[1]?.x || 0),
        setpoint_unit: "Hz",
      },
      pfx2: {
        setpoint_value: Number(curveValues.pf[2]?.x || 0),
        setpoint_unit: "Hz",
      },
      pfx3: {
        setpoint_value: Number(curveValues.pf[3]?.x || 0),
        setpoint_unit: "Hz",
      },

      pfy0: {
        setpoint_value: Number(curveValues.pf[0]?.y || 0),
        setpoint_unit: "p.u.",
      },
      pfy1: {
        setpoint_value: Number(curveValues.pf[1]?.y || 0),
        setpoint_unit: "p.u.",
      },
      pfy2: {
        setpoint_value: Number(curveValues.pf[2]?.y || 0),
        setpoint_unit: "p.u.",
      },
      pfy3: {
        setpoint_value: Number(curveValues.pf[3]?.y || 0),
        setpoint_unit: "p.u.",
      },

      quqx0: {
        setpoint_value: Number(curveValues.quQ[0]?.x || 0),
        setpoint_unit: "p.u.",
      },
      quqx1: {
        setpoint_value: Number(curveValues.quQ[1]?.x || 0),
        setpoint_unit: "p.u.",
      },
      quqx2: {
        setpoint_value: Number(curveValues.quQ[2]?.x || 0),
        setpoint_unit: "p.u.",
      },
      quqx3: {
        setpoint_value: Number(curveValues.quQ[3]?.x || 0),
        setpoint_unit: "p.u.",
      },
      quqx4: {
        setpoint_value: Number(curveValues.quQ[4]?.x || 0),
        setpoint_unit: "p.u.",
      },
      quqx5: {
        setpoint_value: Number(curveValues.quQ[5]?.x || 0),
        setpoint_unit: "p.u.",
      },

      quqy0: {
        setpoint_value: Number(curveValues.quQ[0]?.y || 0),
        setpoint_unit: "p.u.",
      },
      quqy1: {
        setpoint_value: Number(curveValues.quQ[1]?.y || 0),
        setpoint_unit: "p.u.",
      },
      quqy2: {
        setpoint_value: Number(curveValues.quQ[2]?.y || 0),
        setpoint_unit: "p.u.",
      },
      quqy3: {
        setpoint_value: Number(curveValues.quQ[3]?.y || 0),
        setpoint_unit: "p.u.",
      },
      quqy4: {
        setpoint_value: Number(curveValues.quQ[4]?.y || 0),
        setpoint_unit: "p.u.",
      },
      quqy5: {
        setpoint_value: Number(curveValues.quQ[5]?.y || 0),
        setpoint_unit: "p.u.",
      },

      quux0: {
        setpoint_value: Number(curveValues.quU[0]?.x || 0),
        setpoint_unit: "p.u.",
      },
      quux1: {
        setpoint_value: Number(curveValues.quU[1]?.x || 0),
        setpoint_unit: "p.u.",
      },
      quux2: {
        setpoint_value: Number(curveValues.quU[2]?.x || 0),
        setpoint_unit: "p.u.",
      },
      quux3: {
        setpoint_value: Number(curveValues.quU[3]?.x || 0),
        setpoint_unit: "p.u.",
      },
      quux4: {
        setpoint_value: Number(curveValues.quU[4]?.x || 0),
        setpoint_unit: "p.u.",
      },

      quuy0: {
        setpoint_value: Number(curveValues.quU[0]?.y || 0),
        setpoint_unit: "p.u.",
      },
      quuy1: {
        setpoint_value: Number(curveValues.quU[1]?.y || 0),
        setpoint_unit: "p.u.",
      },
      quuy2: {
        setpoint_value: Number(curveValues.quU[2]?.y || 0),
        setpoint_unit: "p.u.",
      },
      quuy3: {
        setpoint_value: Number(curveValues.quU[3]?.y || 0),
        setpoint_unit: "p.u.",
      },
      quuy4: {
        setpoint_value: Number(curveValues.quU[4]?.y || 0),
        setpoint_unit: "p.u.",
      },
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
      overflow="auto"
      overflowX="hidden"
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
              onClick={() => setIsConfirmOpen(true)}
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
            subtext={Number(GetDataService("actual_active_power", ppc_data) || 0) / 1000 + " kW"}
            unit="kW"
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

          <Row h={46}>
            <HStack w="full" justify="space-between">
              <HStack spacing={3}>
                <Text fontSize="sm" fontWeight={700} color={useColorModeValue("gray.800", "#E8ECEC")}>
                  Droop Characteristics
                </Text>
                <StatusDot color="red" />
              </HStack>
              <Button
                size="xs"
                variant="outline"
                onClick={() => setIsEditOpen(true)}
                isDisabled={!canControlService}
              >
                Edit
              </Button>
            </HStack>
          </Row>

          <OneField
            label="Q"
            subtext={Number(GetDataService("actual_reactive_power", ppc_data) || 0) / 1000 + " kVAr"}
            unit="kVAr"
            dot={modes?.q?.active ? "green" : "red"}
            modeSymbol={modes?.q?.control_state === "local" ? "L" : "R"}
            value={qValue}
            onChange={setQValue}
          />

          <OneField
            label="cosphi"
            subtext={String(GetDataService("actual_cos_phi", ppc_data) || 0)}
            unit=""
            dot={modes?.cosphi?.active ? "green" : "red"}
            modeSymbol={
              modes?.cosphi?.control_state === "local" ? "L" : "R"
            }
            value={cosphiValue}
            onChange={setCosphiValue}
          />

          <OneField
            label="V"
            subtext={`${GetDataService("actual_voltage", ppc_data) || 0} V`}
            unit="V"
            dot={modes?.v?.active ? "green" : "red"}
            modeSymbol={
              modes?.v?.control_state === "local" ? "L" : "R"
            }
            value={vValue}
            onChange={setVValue}
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
        <ControlServicesEditModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          values={curveValues}
          onSave={(values) => {
            setCurveValues(values);
            setIsEditOpen(false);
          }}
        />
        {/* Confirmation dialog for Apply */}
        <AlertDialog
          isOpen={isConfirmOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => setIsConfirmOpen(false)}
          isCentered
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Confirm Apply
              </AlertDialogHeader>
              <AlertDialogBody>Are you sure you want to apply these setpoints?</AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={() => setIsConfirmOpen(false)} size="sm">
                  Cancel
                </Button>
                <Button
                  colorScheme="teal"
                  ml={3}
                  size="sm"
                  onClick={() => {
                    setIsConfirmOpen(false);
                    handleApply();
                  }}
                >
                  Yes, Apply
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </VStack>
    </Box>
  );
}
