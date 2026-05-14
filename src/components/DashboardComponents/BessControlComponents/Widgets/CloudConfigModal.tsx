import { DeleteIcon, InfoIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  Grid,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Tooltip,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import CloudDetectionGraph from "./CloudDetectionGraph";
import { useCloudConfig } from "../../../../hooks/useCloudConfig";

interface CloudConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  cloudModule: unknown;
  onSave: (module: unknown) => void;
}

const CloudConfigModal: React.FC<CloudConfigModalProps> = ({
  isOpen,
  onClose,
  cloudModule,
  onSave,
}) => {
  const {
    config,
    setConfig,
    windows,
    setWindows,
    confidence,
    setConfidence,
    stageInfo,
    setStageInfo,
    isLoading,
    error,
    fetchData,
    saveData,
  } = useCloudConfig();

  const bg = useColorModeValue("white", "#161B1B");
  const cardBg = useColorModeValue("gray.50", "#111c2b");

  const updateConfig = (key: string, value: number) => {
    setConfig({ ...config, [key]: value });
  };

  const updateWindow = (
    index: number,
    key: "morning" | "midday" | "evening",
    value: string | number
  ) => {
    const updated = [...windows];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (updated[index] as any)[key] = value;
    setWindows(updated);
  };

  const removeWindow = (index: number) => {
    setWindows(windows.filter((_, i) => i !== index));
  };

  const updateConfidence = (key: string, value: number) => {
    setConfidence({ ...confidence, [key]: value });
  };

  const addWindow = () => {
    // Always add a new entry to allow users to add windows repeatedly.
    setWindows([
      ...windows,
      {
        name: "East",
        morning: 0,
        midday: 0,
        evening: 0,
      },
    ]);
  };

  React.useEffect(() => {
  if (!isOpen) return;

  let intervalId: any;

  const load = async () => {
    await fetchData();
  };

  // first call
  load();

  // every 10 sec
  intervalId = setInterval(load, 10000);

  return () => {
    clearInterval(intervalId);
  };
}, [isOpen]); // ❗ fetchData dependency hata diya

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent bg={bg} h="80vh" maxH="800px">
        <ModalHeader fontSize="sm">
          ASRS Configuration
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody overflowY="auto">
          <VStack align="stretch" spacing={4}>

            {/*  TOP CONFIG GRID */}
            <Grid templateColumns="repeat(2, 1fr)" gap={3}>
              <Box>
                <Tooltip label="A negative value that adjusts the cloud detection sensitivity to avoid false positives.">
                  <HStack spacing={1}>
                    <Text fontSize="2xs">Safety Factor</Text>
                    <InfoIcon boxSize={3} color="blue.500" />
                  </HStack>
                </Tooltip>
                <Input
                  size="xs"
                  type="number"
                  value={config.safety_factor}
                  onChange={(e) => updateConfig("safety_factor", parseFloat(e.target.value) || 0)}
                />
              </Box>

              <Box>
                <Tooltip label="Minimum number of consecutive intervals required to confirm cloud detection.">
                  <HStack spacing={1}>
                    <Text fontSize="2xs">Min Interval Number</Text>
                    <InfoIcon boxSize={3} color="blue.500" />
                  </HStack>
                </Tooltip>
                <Input
                  size="xs"
                  value={config.sustain_interval_min_number}
                  isReadOnly
                />
              </Box>

              <Box>
                <Tooltip label="Number of intervals used in the detection algorithm.">
                  <HStack spacing={1}>
                    <Text fontSize="2xs">Interval Number</Text>
                    <InfoIcon boxSize={3} color="blue.500" />
                  </HStack>
                </Tooltip>
                <Input
                  size="xs"
                  value={config.sustain_interval_number}
                  isReadOnly
                />
              </Box>

              <Box>
                <Tooltip label="Duration in minutes for each detection interval.">
                  <HStack spacing={1}>
                    <Text fontSize="2xs">Interval Minute</Text>
                    <InfoIcon boxSize={3} color="blue.500" />
                  </HStack>
                </Tooltip>
                <Input
                  size="xs"
                  value={config.sustain_interval_minute}
                  isReadOnly
                />
              </Box>
            </Grid>

            <Accordion allowToggle defaultIndex={[]}>
              <AccordionItem border="1px solid" borderColor="blue.300" borderRadius="md">
                <AccordionButton px={3} py={2}>
                  <Box flex="1" textAlign="left" fontSize="xs" fontWeight={600}>
                    Window Thresholds
                  </Box>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={3} maxH="260px" overflowY="auto">
                  <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                    {windows.map((w, i) => (
                      <Box
                    key={i}
                    p={2}
                    borderRadius="md"
                    bg={cardBg}
                    border="1px solid"
                    borderColor="gray.200"
                  >
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="xs" fontWeight={600}>
                        {w.name}
                      </Text>
                      <Button
                        size="xs"
                        leftIcon={<DeleteIcon />}
                        variant="ghost"
                        isDisabled
                      >
                        Remove
                      </Button>
                    </HStack>

                    <VStack spacing={2}>
                      <HStack w="100%">
                        <Text fontSize="2xs" w="80px">
                          Morning
                        </Text>
                        <Input
                          size="xs"
                          value={w.morning}
                          isReadOnly
                        />
                      </HStack>

                      <HStack w="100%">
                        <Text fontSize="2xs" w="80px">
                          Midday
                        </Text>
                        <Input
                          size="xs"
                          value={w.midday}
                          isReadOnly
                        />
                      </HStack>

                      <HStack w="100%">
                        <Text fontSize="2xs" w="80px">
                          Evening
                        </Text>
                        <Input
                          size="xs"
                          type="number"
                          value={w.evening}
                          isReadOnly
                        />
                      </HStack>
                    </VStack>
                  </Box>
                ))}
              </Grid>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Accordion allowToggle defaultIndex={[]}> 
          <AccordionItem border="1px solid" borderColor="blue.300" borderRadius="md">
            <AccordionButton px={3} py={2}>
              <Box flex="1" textAlign="left" fontSize="xs" fontWeight={600}>
                Confidence Dispatch Stages
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={3}>
              <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                <Box>
                  <Text fontSize="2xs">Early Warning</Text>
                  <HStack>
                    <Input
                      size="xs"
                      type="number"
                      step="1"
                      value={confidence.early_warning * 100}
                      onChange={(e) =>
                        updateConfidence(
                          "early_warning",
                          (parseFloat(e.target.value) || 0) / 100
                        )
                      }
                    />
                    <Text fontSize="xs">%</Text>
                  </HStack>
                </Box>

                <Box>
                  <Text fontSize="2xs">Stronger Signal</Text>
                  <HStack>
                    <Input
                      size="xs"
                      type="number"
                      step="1"
                      value={confidence.stronger_signal * 100}
                      onChange={(e) =>
                        updateConfidence(
                          "stronger_signal",
                          (parseFloat(e.target.value) || 0) / 100
                        )
                      }
                    />
                    <Text fontSize="xs">%</Text>
                  </HStack>
                </Box>

                <Box>
                  <Text fontSize="2xs">Confirmation Building</Text>
                  <HStack>
                    <Input
                      size="xs"
                      type="number"
                      step="1"
                      value={confidence.confirmation_building * 100}
                      onChange={(e) =>
                        updateConfidence(
                          "confirmation_building",
                          (parseFloat(e.target.value) || 0) / 100
                        )
                      }
                    />
                    <Text fontSize="xs">%</Text>
                  </HStack>
                </Box>

                <Box>
                  <Text fontSize="2xs">Confirmed Cloud</Text>
                  <HStack>
                    <Input
                      size="xs"
                      type="number"
                      step="1"
                      value={confidence.confirmed_cloud * 100}
                      onChange={(e) =>
                        updateConfidence(
                          "confirmed_cloud",
                          (parseFloat(e.target.value) || 0) / 100
                        )
                      }
                    />
                    <Text fontSize="xs">%</Text>
                  </HStack>
                </Box>
              </Grid>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        {/*  DISPATCH STATUS */}
        <Box
          mt={2}
          p={3}
          borderRadius="xl"
          bg={useColorModeValue("white", "rgba(255,255,255,0.05)")}
          border="1px solid"
          borderColor={useColorModeValue("gray.200", "whiteAlpha.200")}
          boxShadow="sm"
        >
          <HStack justify="space-between" mb={2}>
            <Text fontSize="xs" fontWeight={700}>
              ⚡ Dispatch Status
            </Text>

            <Box
              px={3}
              py={1}
              borderRadius="full"
              fontSize="2xs"
              fontWeight={700}
              bg={
                stageInfo.current_stage === "confirmed_cloud"
                  ? "red.500"
                  : stageInfo.current_stage === "stronger_signal"
                  ? "orange.400"
                  : stageInfo.current_stage === "early_warning"
                  ? "yellow.400"
                  : "green.400"
              }
              color="white"
            >
              {stageInfo.current_stage || "N/A"}
            </Box>
          </HStack>

          <Grid templateColumns="repeat(5, 1fr)" gap={3}>

            <Box>
              <Text fontSize="2xs" opacity={0.6}>Previous Stage</Text>
              <Text fontSize="xs" fontWeight={600}>
                {stageInfo.previous_stage || "-"}
              </Text>
            </Box>

            <Box>
              <Text fontSize="2xs" opacity={0.6}>Start Stage time</Text>
              <Text fontSize="xs">
                {stageInfo.stage_start_time
                  ? new Date(stageInfo.stage_start_time).toLocaleTimeString()
                  : "-"}
              </Text>
            </Box>

            <Box>
              <Text fontSize="2xs" opacity={0.6}>Setpoint</Text>
              <Text fontSize="xs" fontWeight={700} color="blue.400">
                {stageInfo.setpoint_kw} kW
              </Text>
            </Box>

            <Box>
              <Text fontSize="2xs" opacity={0.6}>Override</Text>
              <Input
                size="xs"
                type="number"
                value={stageInfo.setpoint_kw}
                onChange={(e) =>
                  setStageInfo({
                    ...stageInfo,
                    setpoint_kw: Number(e.target.value),
                  })
                }
              />
            </Box>

            <Box>
              <Text fontSize="2xs" opacity={0.6}>
                Approx.Irradiance Drop
              </Text>

              <Text
                fontSize="xs"
                fontWeight={700}
                color={
                  stageInfo.delta_irradiance_percent > 0.5
                    ? "red.400"
                    : stageInfo.delta_irradiance_percent > 0.2
                    ? "yellow.400"
                    : "green.400"
                }
              >
                {(stageInfo.delta_irradiance_percent * 100).toFixed(0)} %
              </Text>
            </Box>

          </Grid>
        </Box>

        <Divider mt={4} mb={4} />

        <Box mt={4}>
          <CloudDetectionGraph />
        </Box>

          </VStack>
        </ModalBody>

        
        <ModalFooter>
  <Button size="sm" variant="ghost" mr={2} onClick={onClose}>
    Cancel
  </Button>

  {/*  NEW TEST BUTTON */}
  <Button
    size="sm"
    colorScheme="orange"
    mr={2}
    onClick={async () => {
      try {
        await fetch("http://75.119.146.115:5179/api/cloud/select", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "RESET",   // 👈 backend wala action
          }),
        });

        console.log("RESET SUCCESS");
      } catch (err) {
        console.error("RESET ERROR:", err);
      }
    }}
  >
    Test
  </Button>

  <Button
    size="sm"
    colorScheme="blue"
    onClick={async () => {
      try {
        const payload = {
          safety_factor: config.safety_factor,
          sustain_interval_min_number: config.sustain_interval_min_number,
          sustain_interval_number: config.sustain_interval_number,
          sustain_interval_minute: config.sustain_interval_minute,

          confidance_dispatch_stages: confidence,

          windows_avg_rate_per_minute: windows.reduce((acc: any, w) => {
            acc[w.name.toLowerCase()] = {
              morning: Number(w.morning),
              midday: Number(w.midday),
              evening: Number(w.evening),
            };
            return acc;
          }, {}),

          current_stage: stageInfo.current_stage,
          previous_stage: stageInfo.previous_stage,
          stage_start_time: stageInfo.stage_start_time,
          setpoint_kw: stageInfo.setpoint_kw,
        };

        console.log("FINAL PAYLOAD:", payload);

        const data = await saveData(payload);
        console.log("SAVE RESPONSE:", data);

      } catch (err) {
        console.error("SAVE ERROR:", err);
      }
    }}
  >
    Save
  </Button>
</ModalFooter>
      </ModalContent>
      
    </Modal>
  );
};

export default CloudConfigModal;
