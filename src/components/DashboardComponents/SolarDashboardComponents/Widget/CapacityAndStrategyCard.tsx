import React, { useState, useMemo } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Select,
  Button,
  Checkbox,
  useColorModeValue,
} from "@chakra-ui/react";
import ReactSelect, { components } from "react-select";
import { useDevices } from "../../../../hooks/useDevices";

/* ---------------- OPTIONS ---------------- */

const MODE_OPTIONS = [
  { label: "Reactive power setting disabled", value: "Reactive power setting disabled" },
  { label: "Reactive power value setting", value: "Reactive power value setting" },
  { label: "Power factor setting", value: "Power factor setting" },
  { label: "PQ mode", value: "PQ mode" },
  { label: "V/F off-grid mode", value: "V/F off-grid mode" },
  { label: "VSG mode", value: "VSG mode" },
  { label: "DC source mode", value: "DC source mode" },
  { label: "AC constant power mode", value: "AC constant power mode" },
  { label: "DC constant power mode", value: "DC constant power mode" },
  { label: "DC constant current mode", value: "DC constant current mode" },
];

/* ---------------- CHECKBOX OPTION ---------------- */

const CheckboxOption = (props: any) => {
  return (
    <components.Option {...props}>
      <Checkbox
        size="sm"
        isChecked={props.isSelected}
        pointerEvents="none"
      >
        {props.label}
      </Checkbox>
    </components.Option>
  );
};

/* ---------------- COMPONENT ---------------- */

export default function CapacityAndStrategyCard() {
  const cardBg = useColorModeValue("#ffffff", "#161B1B");
  const cardBorder = useColorModeValue("#e5e7eb", "#202525");
  const textPrimary = useColorModeValue("#0f172a", "#E8ECEC");
  const textMuted = useColorModeValue("gray.600", "#A6B0B0");
  const softBg = useColorModeValue("#f3f4f6", "#1C2121");

  const [selectedModes, setSelectedModes] = useState<any[]>([]);
  const [selectedPCS, setSelectedPCS] = useState<any[]>([]);
  const [localRemoteMode, setLocalRemoteMode] =
    useState<"Local" | "Remote">("Local");

  const { devices } = useDevices();

  const inverterOptions = useMemo(() => {
    if (!devices) return [];
    return devices
      .filter((d: any) => d.device_id?.toLowerCase().includes("_bank_bank_"))
      .map((d: any) => {
        const match = d.device_id.match(/_(\d+)$/);
        const suffix = match ? match[1] : "";
        return {
          value: d.device_id,
          label: suffix ? `INV-${suffix}` : d.device_id,
        };
      });
  }, [devices]);

  const handleApply = () => {
    console.log("Mode:", selectedModes.map((m) => m.value));
    console.log("INV:", selectedPCS.map((p) => p.value));
    console.log("Local/Remote:", localRemoteMode);
  };

  /* ---------------- LOCKED STYLES ---------------- */

  const selectStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: "32px",
      height: "32px",
      background: softBg,
      borderColor: cardBorder,
      boxShadow: "none",
    }),

    valueContainer: (base: any) => ({
      ...base,
      height: "32px",
      padding: "0 8px",
      overflow: "hidden",
      flexWrap: "nowrap",
    }),

    multiValue: (base: any) => ({
      ...base,
      maxWidth: "60px",
    }),

    multiValueLabel: (base: any) => ({
      ...base,
      fontSize: "11px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }),

    indicatorsContainer: (base: any) => ({
      ...base,
      height: "32px",
    }),

    menuPortal: (base: any) => ({
      ...base,
      zIndex: 9999,
    }),

    menu: (base: any) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius="12px"
      w="705px"
      h="214px"
      p="16px"
      overflow="hidden"
    >
      <VStack align="stretch" spacing={4}>
        <Text fontWeight="bold" fontSize="lg" color={textPrimary}>
          Widget
        </Text>

        <HStack spacing={4} align="flex-end">
          {/* Local / Remote */}
          <VStack align="start" spacing={2}>
            <Text fontSize="sm" color={textMuted}>
              Local/Remote
            </Text>
            <Select
              size="sm"
              value={localRemoteMode}
              onChange={(e) =>
                setLocalRemoteMode(e.target.value as "Local" | "Remote")
              }
              bg={softBg}
              borderColor={cardBorder}
              w="100px"
            >
              <option value="Local">Local</option>
              <option value="Remote">Remote</option>
            </Select>
          </VStack>

          {/* MODE */}
          <VStack align="start" spacing={2}>
            <Text fontSize="sm" color={textMuted}>
              Mode
            </Text>
            <Box w="320px">
              <ReactSelect
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                options={MODE_OPTIONS}
                value={selectedModes}
                onChange={(val) => setSelectedModes(val as any)}
                components={{ Option: CheckboxOption }}
                styles={selectStyles}
                placeholder="Select Mode"
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            </Box>
          </VStack>

          {/* INV */}
          <VStack align="start" spacing={2}>
            <Text fontSize="sm" color={textMuted}>
              INV
            </Text>
            <Box w="110px">
              <ReactSelect
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                options={inverterOptions}
                value={selectedPCS}
                onChange={(val) => setSelectedPCS(val as any)}
                components={{ Option: CheckboxOption }}
                styles={selectStyles}
                placeholder="Select"
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            </Box>
          </VStack>

          <Button size="sm" colorScheme="teal" onClick={handleApply}>
            Apply
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
