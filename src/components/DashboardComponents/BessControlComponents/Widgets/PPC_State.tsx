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
import usePermissions from "../../../../hooks/usePermissions";
import { useSSE } from "../../../../hooks/sse/useSSE";
import { GetDataService } from "../../../SLDComponents/guvnl/DataExtractionService";

type Dot = "green" | "red";

const WRAP_W = 332;
const WRAP_H = 208;
const FIELD_W = 160;
const FIELD_H = 34;
const FIELD_RADIUS = 8;
const FIELD_PADX = 10;
const FIELD_PADY = 8;
const FIELD_GAP = 10;

/* ================= MAIN ================= */
export default function PPC_State({ppc_data}: {ppc_data: any}) {
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
  // Confirmation dialog state for Apply
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);

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
  overflow="auto"
  pointerEvents={!canControlService ? "none" : "auto"}
  opacity={!canControlService ? 0.6 : 1}
>
      <VStack align="stretch" spacing={0}>
        <HStack justify="space-between" px="16px" pt="12px" pb={"2px"}>
          <Text fontWeight={700} fontSize={"14px"}>PPC State</Text>
          
        </HStack>

        {/* <Box h="12px" /> */}
        <Box h="1px" bg={divider} />
        <Box h="12px" />

        <VStack
          spacing={2}
          overflowY="auto"
          // divider={
          //   <>
          //     <Box h="12px" />
          //     <Box h="1px" bg={divider} />
          //     <Box h="12px" />
          //   </>
          // }
        >
          <HStack justify="space-between" px="20px" width={"100%"} fontSize={"12px"}>
            <Text fontWeight={700}>Nominal Power: </Text>
            <Text>{Number(GetDataService("nominal_active_power_production", ppc_data) || 0 ) / 1000 + " kW"} </Text>
          </HStack>
          <HStack justify="space-between" px="20px" width={"100%"} fontSize={"12px"}>
            <Text fontWeight={700}>Nominal Apparent Power: </Text>
            <Text>{Number(GetDataService("nominal_apparent_power", ppc_data) || 0 ) / 1000 + " kVA"} </Text>
          </HStack>
          <HStack justify="space-between" px="20px" width={"100%"} fontSize={"12px"}>
            <Text fontWeight={700}>Actual Power: </Text>
            <Text>{Number(GetDataService("actual_active_power", ppc_data) || 0 ) / 1000 + " kW"} </Text>
          </HStack>
          <HStack justify="space-between" px="20px" width={"100%"} fontSize={"12px"}>
            <Text fontWeight={700}>Actual Apparent Power: </Text>
            <Text>{Number(GetDataService("actual_apparent_power", ppc_data) || 0 ) / 1000 + " kVA"} </Text>
          </HStack>
          <HStack justify="space-between" px="20px" width={"100%"} fontSize={"12px"}>
            <Text fontWeight={700}>Actual Reactive Power: </Text>
            <Text>{Number(GetDataService("actual_reactive_power", ppc_data) || 0 ) / 1000 + " kVar"} </Text>
          </HStack>
          <HStack justify="space-between" px="20px" width={"100%"} fontSize={"12px"}>
            <Text fontWeight={700}>Nominal Voltage: </Text>
            <Text>{((Number(GetDataService("actual_voltage_l1l2", ppc_data) || 0 ) + Number(GetDataService("actual_voltage_l2l3", ppc_data) || 0 ) + Number(GetDataService("actual_voltage_l3l1", ppc_data) || 0 )) / 3).toFixed(2) + " V"} </Text>
          </HStack>
          <HStack justify="space-between" px="20px" width={"100%"} fontSize={"12px"}>
            <Text fontWeight={700}>Frequency: </Text>
            <Text>{Number(GetDataService("actual_frequency", ppc_data) || 0 ) / 1000 + " Hz"} </Text>
          </HStack>
          <HStack justify="space-between" px="20px" width={"100%"} fontSize={"12px"}>
            <Text fontWeight={700}>Grid Control: </Text>
            <Box h={"12px"} w={"12px"} borderRadius="50%" bg="green"></Box>
          </HStack>
          <HStack justify="space-between" px="20px" width={"100%"} fontSize={"12px"}>
            <Text fontWeight={700}>Active Processor: </Text>
            <Text>{(GetDataService("plc_id", ppc_data) || 0 ) == 2 ? "Processor-2" : "Processor-1" } </Text>
          </HStack>
          <HStack justify="space-between" px="20px" width={"100%"} fontSize={"12px"}>
          <Text fontWeight={700}>PPC Online: </Text>
          <Box
            h={"12px"}
            w={"12px"}
            borderRadius="50%"
            bg={
              (GetDataService("plc_id", ppc_data))
                ? "green"
                : "red"
            }
          />
        </HStack>
        </VStack>
          
      </VStack>
    </Box>
  );
}
