import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Spacer,
  Switch,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useDeviceLibrary } from "../../hooks/device_library/useDeviceLibrary";

// === TYPES ===
export type DeviceConfig = {
  server_ip: string;
  server_port: number | null;
  slave_id: number | null;
  plant: number | null;
  block: number | null;
  pcs: number | null;
  deviceType: string;
  device_id: string;
  make: string;
  model: string;
  function: number | null;
  index: number;
  dc_capacity: number | null;
};

// === BATTERY HIERARCHY ===
const BATTERY_HIERARCHY = ["pcs", "bank", "rack", "module"] as const;
type BatteryDeviceType = (typeof BATTERY_HIERARCHY)[number];

const isBatteryDevice = (type: string): type is BatteryDeviceType =>
  BATTERY_HIERARCHY.includes(type as BatteryDeviceType);

const getChildType = (type: string): BatteryDeviceType | null => {
  const idx = BATTERY_HIERARCHY.indexOf(type as BatteryDeviceType);
  return idx < BATTERY_HIERARCHY.length - 1 ? BATTERY_HIERARCHY[idx + 1] : null;
};

// === MAIN COMPONENT ===
export default function GeneralDeviceConfigPanel({
  isOpen,
  onClose,
  devices,
  onSubmit,
  mode = "inline",
}: {
  isOpen?: boolean;
  onClose?: () => void;
  devices: DeviceConfig[];
  onSubmit?: (devices: DeviceConfig[]) => Promise<void>;
  mode?: "inline" | "drawer";
}) {
  const { library, loading } = useDeviceLibrary();
  const toast = useToast();

  // === STATE ===
  const [device, setDevice] = useState<DeviceConfig>(() => ({
    server_ip: "",
    server_port: null,
    slave_id: null,
    plant: 1,
    block: null,
    pcs: null,
    deviceType: "",
    device_id: "",
    make: "",
    model: "",
    function: null,
    index: 1,
    dc_capacity: null,
  }));

  const [dcCapacity, setDcCapacity] = useState<number | null>(null);
  const [computeConfig, setComputeConfig] = useState(false);

  // Child configuration flow
  const [currentStep, setCurrentStep] = useState<BatteryDeviceType | "parent">("parent");
  const [parentDevice, setParentDevice] = useState<DeviceConfig | null>(null);
  const [parentCapacity, setParentCapacity] = useState<number | null>(null);

  // Config storage for child levels
  const [bankConfig, setBankConfig] = useState<
    Partial<Pick<DeviceConfig, "make" | "model" | "function" | "dc_capacity">>
  >({});
  const [rackConfig, setRackConfig] = useState<
    Partial<Pick<DeviceConfig, "make" | "model" | "function" | "dc_capacity">>
  >({});
  const [moduleConfig, setModuleConfig] = useState<
    Partial<Pick<DeviceConfig, "make" | "model" | "function" | "dc_capacity">>
  >({});

  // Initialize from props
  useEffect(() => {
    const firstDevice = devices[0] ?? device;
    setDevice(prev => ({
      ...prev,
      ...firstDevice,
      index: firstDevice.index ?? 1,
      device_id: generateDeviceId(firstDevice),
    }));
  }, [devices]);

  // Auto-generate device_id
  const generateDeviceId = useCallback((d: DeviceConfig): string => {
    const idx = d.index;
    if (d.deviceType === "pcs") {
      return [
        `plant_${d.plant ?? 1}`,
        "pcs",
        d.pcs ? `pcs_${d.pcs}` : null,
      ]
        .filter(Boolean)
        .join("_");
    }
    return [
      `plant_${d.plant ?? 1}`,
      d.block ? `block_${d.block}` : null,
      d.pcs ? `pcs_${d.pcs}` : null,
      d.deviceType,
      d.deviceType,
      idx,
    ]
      .filter(Boolean)
      .join("_");
  }, []);

  // Update field with auto ID and defaults
  const updateField = useCallback(
    (key: keyof DeviceConfig, value: any) => {
      setDevice(prev => {
        let next = { ...prev, [key]: value };

        // Auto make/model
        if (key === "deviceType" && library && library[value]) {
          const typeInfo = library[value];
          const firstMake = typeInfo.makes[0] ?? "";
          const firstModel = typeInfo.models?.[firstMake]?.[0] ?? "";
          next.make = firstMake;
          next.model = firstModel;
        }

        if (key === "make" && library && next.deviceType && library[next.deviceType]?.models?.[value]) {
          next.model = library[next.deviceType].models[value][0] ?? "";
        }

        // Toggle block/pcs
        if (key === "deviceType") {
          if (isBatteryDevice(value)) {
            if (next.block !== null) {
              next.pcs = next.block;
              next.block = null;
            }
          } else {
            if (next.pcs !== null) {
              next.block = next.pcs;
              next.pcs = null;
            }
          }
        }

        next.device_id = generateDeviceId(next);
        return next;
      });
    },
    [library, generateDeviceId]
  );

  // Local update for dc_capacity
  const updateLocal = useCallback((key: string, value: any) => {
    if (key === "dc_capacity") setDcCapacity(value);
    else updateField(key as keyof DeviceConfig, value);
  }, [updateField]);

  // Auto-show child config when Compute Config is ON
  useEffect(() => {
    if (computeConfig && dcCapacity && isBatteryDevice(device.deviceType)) {
      const childType = getChildType(device.deviceType);
      if (childType) {
        setParentDevice({
          ...device,
          dc_capacity: dcCapacity,
          device_id: generateDeviceId(device),
        });
        setParentCapacity(dcCapacity);
        setCurrentStep(childType);
      }
    } else {
      setCurrentStep("parent");
    }
  }, [computeConfig, dcCapacity, device, generateDeviceId]);

  // Handle final submit
  const handleSubmit = async () => {
    if (!onSubmit) return;

    const required = ["server_ip", "deviceType", "plant", "index"];
    const missing = required.filter(key => !device[key as keyof DeviceConfig]);
    if (missing.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill: ${missing.join(", ")}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const finalParent: DeviceConfig = {
      ...device,
      dc_capacity: dcCapacity,
      device_id: generateDeviceId(device),
    };

    const allDevices: DeviceConfig[] = [finalParent];

    // If computing config, generate full tree
    if (computeConfig && dcCapacity && isBatteryDevice(device.deviceType)) {
      const addChildDevices = (
        parent: DeviceConfig,
        parentCap: number,
        childType: BatteryDeviceType,
        config: { make: string; model: string; function?: number; dc_capacity: number }
      ): DeviceConfig[] => {
        const count = Math.ceil(parentCap / config.dc_capacity);
        return Array.from({ length: count }, (_, i) => ({
          ...parent,
          deviceType: childType,
          index: i + 1,
          dc_capacity: config.dc_capacity,
          make: config.make,
          model: config.model,
          function: config.function ?? null,
          device_id: generateDeviceId({
            ...parent,
            deviceType: childType,
            index: i + 1,
          }),
        }));
      };

      let currentCapacity = dcCapacity;

      if (device.deviceType === "pcs" && bankConfig.make && bankConfig.model && bankConfig.dc_capacity) {
        const banks = addChildDevices(finalParent, currentCapacity, "bank", bankConfig as any);
        allDevices.push(...banks);
        currentCapacity = bankConfig.dc_capacity;

        if (rackConfig.make && rackConfig.model && rackConfig.dc_capacity) {
          const racks = banks.flatMap(bank =>
            addChildDevices(bank, currentCapacity, "rack", rackConfig as any)
          );
          allDevices.push(...racks);
          currentCapacity = rackConfig.dc_capacity;

          if (moduleConfig.make && moduleConfig.model && moduleConfig.dc_capacity) {
            const modules = racks.flatMap(rack =>
              addChildDevices(rack, currentCapacity, "module", moduleConfig as any)
            );
            allDevices.push(...modules);
          }
        }
      } else if (device.deviceType === "bank" && rackConfig.make && rackConfig.model && rackConfig.dc_capacity) {
        const racks = addChildDevices(finalParent, currentCapacity, "rack", rackConfig as any);
        allDevices.push(...racks);
        currentCapacity = rackConfig.dc_capacity;

        if (moduleConfig.make && moduleConfig.model && moduleConfig.dc_capacity) {
          const modules = racks.flatMap(rack =>
            addChildDevices(rack, currentCapacity, "module", moduleConfig as any)
          );
          allDevices.push(...modules);
        }
      } else if (device.deviceType === "rack" && moduleConfig.make && moduleConfig.model && moduleConfig.dc_capacity) {
        const modules = addChildDevices(finalParent, currentCapacity, "module", moduleConfig as any);
        allDevices.push(...modules);
      }
    }

    const duplicate = allDevices.find(d => devices.some(existing => existing.device_id === d.device_id));
    if (duplicate) {
      const toastId = "duplicate-warning";
      if (!toast.isActive(toastId)) {
        toast({
          id: toastId,
          title: "Duplicate Device ID",
          description: `Device '${duplicate.device_id}' already exists. Update?`,
          status: "warning",
          duration: null,
          isClosable: true,
          render: () => (
            <Box color={useColorModeValue("secondaryText.light", "secondaryText.dark")} borderRadius="md" p={3} boxShadow="lg">
              <Text fontWeight="bold">Device ID Conflict</Text>
              <Text fontSize="sm" mb={2}>
                <strong>{duplicate.device_id}</strong> already exists. Update all?
              </Text>
              <HStack spacing={2} justify="center">
                <Button size="sm" colorScheme="green" onClick={async () => {
                  toast.close(toastId);
                  await onSubmit(allDevices);
                  toast({ title: "Updated", status: "success" });
                }}>
                  Update
                </Button>
                <Button size="sm" colorScheme="red" onClick={() => toast.close(toastId)}>
                  Discard
                </Button>
              </HStack>
            </Box>
          ),
        });
      }
      return;
    }

    // Submit all devices
    try {
      await onSubmit(allDevices);
      toast({
        title: "Configuration Saved",
        description: `Created ${allDevices.length} device(s).`,
        status: "success",
      });
    } catch (e: any) {
      toast({
        title: "Submit failed",
        description: e.message || "Unknown error",
        status: "error",
      });
    }
  };

  // Render child config form
  const renderChildConfig = (type: BatteryDeviceType) => {
    const parentType = BATTERY_HIERARCHY[BATTERY_HIERARCHY.indexOf(type) - 1];
    const config = type === "bank" ? bankConfig : type === "rack" ? rackConfig : moduleConfig;
    const setConfig = type === "bank"
      ? setBankConfig
      : type === "rack"
      ? setRackConfig
      : setModuleConfig;

    const handleChildSubmit = () => {
      if (!config.make || !config.model || !config.dc_capacity) {
        toast({ title: `Incomplete ${type} config`, status: "error" });
        return;
      }

      const nextType = getChildType(type);
      if (nextType) {
        setParentCapacity(config.dc_capacity);
        setCurrentStep(nextType);
      } else {
        setCurrentStep("parent");
        toast({ title: "All levels configured. Click Submit.", status: "info" });
      }
    };

    return (
      <Box mt={6} p={6} borderRadius="lg" border="1px" borderColor="gray.600">
        <Text fontSize="lg" fontWeight="bold" mb={4}>Configure {type.charAt(0).toUpperCase() + type.slice(1)}</Text>
        <Text mb={4}>
          Based on {parentType} capacity of <strong>{parentCapacity} kW</strong>. Enter per-{type} capacity.
        </Text>

        <HStack spacing={6} wrap="wrap" mb={4}>
          <FormControl flex="1" minW="150px">
            <FormLabel>DC Capacity per {type} (kW)</FormLabel>
            <NumberInput
              value={config.dc_capacity ?? ""}
              onChange={(_, num) => setConfig(prev => ({ ...prev, dc_capacity: num }))}
              min={0.1}
              step={0.1}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl flex="1" minW="150px">
            <FormLabel>Make</FormLabel>
            <Select
              value={config.make ?? ""}
              onChange={e => setConfig(prev => ({ ...prev, make: e.target.value }))}
            >
              <option value="" style={{ background: "#000", color: "#fff" }}>Select Make</option>
              {(library?.[type]?.makes ?? []).map((mk : any) => (
                <option key={mk} value={mk} style={{ background: "#000", color: "#fff" }}>{mk}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl flex="1" minW="150px">
            <FormLabel>Model</FormLabel>
            <Select
              value={config.model ?? ""}
              onChange={e => setConfig(prev => ({ ...prev, model: e.target.value }))}
              isDisabled={!config.make}
            >
              <option value="" style={{ background: "#000", color: "#fff" }}>Select Model</option>
              {(library?.[type]?.models?.[config.make as string] ?? []).map((mdl : any) => (
                <option key={mdl} value={mdl} style={{ background: "#000", color: "#fff" }}>{mdl}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl flex="1" minW="150px">
            <FormLabel>Function Code</FormLabel>
            <NumberInput
              value={config.function ?? ""}
              onChange={(_, num) => setConfig(prev => ({ ...prev, function: num }))}
              min={0}
            >
              <NumberInputField placeholder="3" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </HStack>

        <HStack mt={4} justify="flex-end">
          <Button size="md" colorScheme="gray" onClick={() => setCurrentStep("parent")}>
            Back
          </Button>
          <Button
            size="md"
            colorScheme="green"
            onClick={handleChildSubmit}
            isDisabled={!config.make || !config.model || !config.dc_capacity}
          >
            Continue
          </Button>
        </HStack>
      </Box>
    );
  };

  // === UI ===
  const Header = (
    <Box borderBottomWidth="1px" px={6} py={4}>
      <Flex align="center" gap={4} wrap="wrap">
        <Text fontSize="xl" fontWeight="bold">Device Configuration</Text>
        <Spacer />
      </Flex>
    </Box>
  );

  const showDcCapacity = isBatteryDevice(device.deviceType);
  const showComputeSwitch = isBatteryDevice(device.deviceType) && !!dcCapacity;

  const Body = (
    <Box>
      <Box px={6} py={6} display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={4}>
        {/* Server IP */}
        <FormControl gridColumn={{ base: "span 12", md: "span 2" }}>
          <FormLabel>Protocol Type</FormLabel>
          <Select>
            <option key={"88689"} value={"modbus"} defaultChecked style={{ background: "#000", color: "#fff" }}>{"Modbus TCP/IP"}</option>
            <option key={"88689"} value={"61850"} style={{ background: "#000", color: "#fff" }}>{"61850"}</option>
            <option key={"88689"} value={"OPC UA"} style={{ background: "#000", color: "#fff" }}>{"OPC UA"}</option>
            <option key={"88689"} value={"mqtt"} style={{ background: "#000", color: "#fff" }}>{"MQTT"}</option>
            <option key={"88689"} value={"ftp"} style={{ background: "#000", color: "#fff" }}>{"FTP"}</option>
          </Select>
        </FormControl>

        <FormControl gridColumn={{ base: "span 12", md: "span 4" }}>
          <FormLabel>Server IP</FormLabel>
          <Input value={device.server_ip} onChange={e => updateField("server_ip", e.target.value)} />
        </FormControl>

        <FormControl gridColumn={{ base: "span 12", md: "span 3" }}>
          <FormLabel>Server Port</FormLabel>
          <NumberInput value={device.server_port || undefined} onChange={(_, num) => updateField("server_port", num)} min={1}>
            <NumberInputField placeholder="502" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl gridColumn={{ base: "span 12", md: "span 3" }}>
          <FormLabel>Slave ID</FormLabel>
          <NumberInput value={device.slave_id || undefined} onChange={(_, num) => updateField("slave_id", num)} min={0}>
            <NumberInputField placeholder="1" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl gridColumn={{ base: "span 12", md: "span 3" }}>
          <FormLabel>Plant</FormLabel>
          <NumberInput value={device.plant || undefined} onChange={(_, num) => updateField("plant", num)} min={1}>
            <NumberInputField placeholder="1" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        {/* Block or PCS */}
        {isBatteryDevice(device.deviceType) ? (
          <FormControl gridColumn={{ base: "span 12", md: "span 3" }}>
            <FormLabel>PCS</FormLabel>
            <NumberInput value={device.pcs || undefined} onChange={(_, num) => updateField("pcs", num)} min={1}>
              <NumberInputField placeholder="1" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        ) : (
          <FormControl gridColumn={{ base: "span 12", md: "span 3" }}>
            <FormLabel>Block</FormLabel>
            <NumberInput value={device.block || undefined} onChange={(_, num) => updateField("block", num)} min={1}>
              <NumberInputField placeholder="1" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        )}

        <FormControl gridColumn={{ base: "span 12", md: "span 3" }}>
          <FormLabel>Device Type</FormLabel>
          <Select value={device.deviceType} onChange={e => updateField("deviceType", e.target.value)}>
            {library && Object.keys(library).map(t => (
              <option key={t} value={t} style={{ background: "#000", color: "#fff" }}>{t}</option>
            ))}
          </Select>
        </FormControl>

        <FormControl gridColumn={{ base: "span 12", md: "span 3" }}>
          <FormLabel>Index</FormLabel>
          <NumberInput value={device.index} onChange={(_, num) => updateField("index", num)} min={1}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl gridColumn={{ base: "span 12", md: "span 6" }}>
          <FormLabel>Device ID</FormLabel>
          <Input value={device.device_id} isReadOnly />
        </FormControl>

        <FormControl gridColumn={{ base: "span 12", md: "span 3" }}>
          <FormLabel>Make</FormLabel>
          <Select value={device.make} onChange={e => updateField("make", e.target.value)}>
            {(library?.[device.deviceType]?.makes ?? []).map(mk => (
              <option key={mk} value={mk} style={{ background: "#000", color: "#fff" }}>{mk}</option>
            ))}
          </Select>
        </FormControl>

        <FormControl gridColumn={{ base: "span 12", md: "span 3" }}>
          <FormLabel>Model</FormLabel>
          <Select value={device.model} onChange={e => updateField("model", e.target.value)}>
            {(library?.[device.deviceType]?.models?.[device.make] ?? []).map(mdl => (
              <option key={mdl} value={mdl} style={{ background: "#000", color: "#fff" }}>{mdl}</option>
            ))}
          </Select>
        </FormControl>

        <FormControl gridColumn={{ base: "span 12", md: "span 3" }}>
          <FormLabel>Function</FormLabel>
          <NumberInput value={device.function || undefined} onChange={(_, num) => updateField("function", num)} min={0}>
            <NumberInputField placeholder="3" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        {showDcCapacity && (
          <FormControl gridColumn={{ base: "span 12", md: "span 4" }}>
            <FormLabel>DC Capacity (kW)</FormLabel>
            <NumberInput
              value={dcCapacity ?? ""}
              onChange={(_, num) => setDcCapacity(num)}
              min={0.1}
              step={0.1}
            >
              <NumberInputField placeholder="e.g. 100" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        )}

        {/* {showComputeSwitch && (
          <FormControl gridColumn={{ base: "span 12", md: "span 8" }} display="flex" alignItems="center" mt={2}>
            <FormLabel htmlFor="compute-config" mb="0">Compute Configuration</FormLabel>
            <Switch
              id="compute-config"
              isChecked={computeConfig}
              onChange={e => setComputeConfig(e.target.checked)}
              ml={2}
              isDisabled={!dcCapacity}
            />
          </FormControl>
        )} */}
      </Box>

      {/* Child Config Flow */}
      {/* {currentStep !== "parent" && (
        <>
          {currentStep === "bank" && renderChildConfig("bank")}
          {currentStep === "rack" && renderChildConfig("rack")}
          {currentStep === "module" && renderChildConfig("module")}
        </>
      )} */}

      <Divider borderColor="gray.700" />

      <Box px={6} py={4}>
        <HStack><Spacer /><Button onClick={handleSubmit} colorScheme="green">Submit</Button></HStack>
      </Box>
    </Box>
  );

  const Content = (
    <>
      {Body}
    </>
  );

  if (mode === "inline") {
    return <Box color={useColorModeValue("secondaryText.light", "secondaryText.dark")} borderWidth="1px" rounded="xl">{Content}</Box>;
  }

  return (
    <>
        {Content}
    </>
  );
}