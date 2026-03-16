import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Select,
  Button,
  RadioGroup,
  Radio,
  useColorModeValue,
  IconButton,
  Checkbox,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import ReactSelect, { components } from "react-select";
import usePermissions from "../../../../hooks/usePermissions";
import ConfirmPasswordModal from "../../../Common/ConfirmPasswordModal";

import { useCurrentStrategy } from "../../../../hooks/current_strategy/useCurrentStrategy";
import { useDevices } from "../../../../hooks/useDevices";
import { useBessControlModes } from "../../../../hooks/useBessControlModes";
import ControlStrategyModal from "../../BessControlComponents/Widgets/ControlStrategyModal";

/* ================= CONSTANTS ================= */

const SELECT_ALL_OPTION = { label: "Select All", value: "__ALL__" };

const MODE_OPTIONS = [
  SELECT_ALL_OPTION,
  "Reactive power setting disabled",
  "Reactive power setting",
  "Power factor setting",
  "PQ mode",
  "V/F off-grid mode",
  "VSG mode",
  "DC source mode",
  "AC constant power mode",
  "DC constant power mode",
  "DC constant current mode",
  "Ramp",
  "COSPHI",
  "V Droop",
  "FRT",
  "P",
  "Q",
].map((m) => (typeof m === "string" ? { label: m, value: m } : m));

const MODE_KEY_MAP: Record<string, string> = {
  "Reactive power setting disabled": "reactive_power_setting_disabled",
  "Reactive power setting": "reactive_power_setting",
  "Power factor setting": "power_factor_setting",
  "PQ mode": "pq",
  "V/F off-grid mode": "vf_mode",
  "VSG mode": "vsg_mode",
  "DC source mode": "dc_source_mode",
  "AC constant power mode": "ac_constant_power_mode",
  "DC constant power mode": "dc_constant_power_mode",
  "DC constant current mode": "dc_constant_current_mode",
  Ramp: "ramp",
  COSPHI: "cosphi",
  "V Droop": "v_droop",
  FRT: "frt",
  P: "p",
  Q: "q",
};

/* ================= MODE OPTION ================= */

const CheckboxOptionMode = (props: any) => {
  const isSelectAll = props.value === "__ALL__";

  return (
    <components.Option {...props}>
      <HStack justify="space-between" w="full">
        <Checkbox
          size="sm"
          pointerEvents="none"
          isChecked={
            isSelectAll
              ? props.selectProps.value?.length ===
                props.selectProps.options.length - 1
              : props.isSelected
          }
        >
          {props.label}
        </Checkbox>

        {!isSelectAll && (
          <IconButton
            aria-label="pcs"
            icon={<EditIcon />}
            size="xs"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              props.selectProps.onPencilClick(props.value);
            }}
          />
        )}
      </HStack>
    </components.Option>
  );
};

/* ================= PCS OPTION ================= */

const CheckboxOptionPCS = (props: any) => {
  const isSelectAll = props.value === "__ALL__";

  return (
    <components.Option {...props}>
      <Checkbox
        size="sm"
        pointerEvents="none"
        isChecked={
          isSelectAll
            ? props.selectProps.value?.length ===
              props.selectProps.options.length - 1
            : props.isSelected
        }
      >
        {props.label}
      </Checkbox>
    </components.Option>
  );
};

/* ================= MAIN ================= */

const CapacityAndStrategyCard: React.FC = () => {
  //Permission logic
  const { permissions } = usePermissions();
  const role = (sessionStorage.getItem("role") || "").toLowerCase();
  const myPermission = permissions.find(
    (p: any) => (p.role_name || "").toLowerCase() === role
  );
  const canControl =
    permissions?.length > 0
      ? myPermission?.can_control_bess === true
      : true;
  const cardBg = useColorModeValue("#ffffff", "#161B1B");
  const cardBorder = useColorModeValue("#e5e7eb", "#202525");
  const softBg = useColorModeValue("#f3f4f6", "#1C2121");

  const { strategy, loading, updateStrategy } = useCurrentStrategy();
  const { devices } = useDevices();
  const { setBessControlModes, getBessControlModes } = useBessControlModes();

  const [injectionMode, setInjectionMode] = useState<"single" | "multi" | "vvp">("multi");
  const [selectedModes, setSelectedModes] = useState<any[]>([]);
  const [pcsByMode, setPcsByMode] = useState<Record<string, any[]>>({});
  const [activePCSMode, setActivePCSMode] = useState<string | null>(null);
  const [localRemoteMode, setLocalRemoteMode] = useState<"Local" | "Remote">("Local");
  const [backendModes, setBackendModes] = useState<any>({}); 
  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // Password modal state for Apply
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  /* ========= PCS OPTIONS ========= */

  const pcsOptions = useMemo(() => {
    if (!devices) return [];

    const pcsList = devices
      .filter((d: any) =>
        d.device_id?.toLowerCase().includes("_bank_bank_")
      )
      .map((d: any, index: number) => ({
        label: `PCS-${index + 1}`,
        value: d.device_id,
      }));

    return [SELECT_ALL_OPTION, ...pcsList];
  }, [devices]);

  /* ================= GET MODE + PCS ================= */

  useEffect(() => {
    getBessControlModes().then((res) => {
      const data = res?.data || {};

      setBackendModes(data); 

      const preSelectedModes: any[] = [];
      const pcsMap: Record<string, any[]> = {};

      Object.entries(MODE_KEY_MAP).forEach(([label, key]) => {
        const modeData = data[key];
        if (!modeData) return;

        if (modeData.active) {
          preSelectedModes.push({ label, value: label });
        }

        if (Array.isArray(modeData.pcs_device_id)) {
          pcsMap[label] = pcsOptions.filter((p) =>
            modeData.pcs_device_id.includes(p.value)
          );
        }

        if (modeData.control_state) {
          setLocalRemoteMode(
            modeData.control_state === "remote" ? "Remote" : "Local"
          );
        }
      });

      setSelectedModes(preSelectedModes);
      setPcsByMode(pcsMap);
    });
  }, [pcsOptions]);

  /* ================= APPLY ================= */

  const handleApply = async () => {

    
    (window as any).__CONTROL_TYPE__ = "STRATEGY";
    (window as any).__CONTROL_MODULE__ = "PCS_MODE";

    setIsPasswordOpen(true);

  };

  // Actual apply logic after password confirmation
  const handlePasswordConfirm = async () => {
    setIsPasswordOpen(false);
    const selectedKeys = selectedModes.map(
      (m) => MODE_KEY_MAP[m.value]
    );

    const payload: any = {};

    Object.entries(MODE_KEY_MAP).forEach(([label, key]) => {
      payload[key] = {
        name: key,
        active: selectedKeys.includes(key),
        control_state: selectedKeys.includes(key)
          ? localRemoteMode.toLowerCase()
          : backendModes?.[key]?.control_state,
        pcs_device_id: (pcsByMode[label] || []).map((p) => p.value),
      };
    });

    await setBessControlModes(payload);
  };

  const selectStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: "32px",
      background: softBg,
      fontSize: "12px",
    }),
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
  };

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius="12px"
      w="705px"
      minH="210px"
      p="16px"
      position="relative"
      // FULL UI LOCK
      pointerEvents={!canControl ? "none" : "auto"}
      opacity={!canControl ? 0.6 : 1}
    >
      <VStack spacing="16px" align="stretch">
        <Text fontWeight={600} fontSize="16px">
          Widget
        </Text>

        <HStack spacing="12px" align="flex-end">
          <Select
            size="sm"
            value={localRemoteMode}
            onChange={(e) =>
              setLocalRemoteMode(e.target.value as any)
            }
            w="100px"
          >
            <option value="Local">Local</option>
            <option value="Remote">Remote</option>
          </Select>

          <Box w="480px">
            <ReactSelect
              isMulti
              options={MODE_OPTIONS}
              value={selectedModes}
              hideSelectedOptions={false}
              closeMenuOnSelect={false}
              menuIsOpen={isModeMenuOpen}
              onMenuOpen={() => setIsModeMenuOpen(true)}
              onMenuClose={() => setIsModeMenuOpen(false)}
              styles={selectStyles}
              menuPortalTarget={document.body}
              placeholder="Select Mode"
              components={{ Option: CheckboxOptionMode }}
              onChange={setSelectedModes}
              onPencilClick={(mode: string) => {
                setIsModeMenuOpen(false);
                setActivePCSMode(mode);
              }}
            />
          </Box>

          <Button colorScheme="teal" onClick={handleApply} isDisabled={!canControl}>
            Apply
          </Button>
          <ConfirmPasswordModal
            isOpen={isPasswordOpen}
            onClose={() => setIsPasswordOpen(false)}
            onConfirm={handlePasswordConfirm}
          />
        </HStack>

        {activePCSMode && (
          <Box
            position="absolute"
            top="110px"
            left="120px"
            w="500px"
            bg={softBg}
            border="1px solid"
            borderColor={cardBorder}
            borderRadius="8px"
            p="12px"
            zIndex={20}
          >
            <HStack justify="space-between" mb="8px">
              <Text fontWeight={600}>
                PCS for {activePCSMode}
              </Text>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => setActivePCSMode(null)}
              >
                Close
              </Button>
            </HStack>

            <ReactSelect
              isMulti
              options={pcsOptions}
              value={pcsByMode[activePCSMode] || []}
              hideSelectedOptions={false}
              closeMenuOnSelect={false}
              components={{ Option: CheckboxOptionPCS }}
              styles={selectStyles}
              onChange={(selected: any) =>
                setPcsByMode((prev) => ({
                  ...prev,
                  [activePCSMode]: selected,
                }))
              }
            />
          </Box>
        )}

        <HStack justify="space-between">
          <Text fontWeight={600}>Control Strategy</Text>
          <HStack>
            <Select
              size="sm"
              value={strategy ?? "0"}
              onChange={(e) => updateStrategy(e.target.value)}
            >
              <option value="0">Basic</option>
              <option value="3">Smart-ToU</option>
              <option value="4">Flat-ToU</option>
              <option value="5">Peak Shaving</option>
            </Select>

            <IconButton
              aria-label="edit"
              icon={<EditIcon />}
              size="sm"
              isDisabled={!canControl}
              opacity={!canControl ? 0.5 : 1}
              cursor={!canControl ? "not-allowed" : "pointer"}
              onClick={() => {
                if (!canControl) return;
                setIsOpen(true);
              }}
            />
          </HStack>
        </HStack>

        <RadioGroup
          value={injectionMode}
          onChange={(v) =>
            setInjectionMode(v as "single" | "multi" | "vvp")
          }
        >
          <HStack spacing="30px">
            <Radio value="single">Single meter injection</Radio>
            <Radio value="multi">Multi meter injection</Radio>
            <Radio value="vvp">VVP</Radio>
          </HStack>
        </RadioGroup>
      </VStack>

      <ControlStrategyModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        strategy={strategy}
        loading={loading}
        onStrategyChange={() => {}}
      />
    </Box>
  );
};

export default CapacityAndStrategyCard;
