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

interface WindowItem {
  name: string;
  morning: string;
  midday: string;
  evening: number;
}

interface CloudConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  cloudModule: unknown;
  onSave: (module: unknown) => void;
}

type ConfigState = {
  safety_factor: number;
  sustain_interval_min_number: number;
  sustain_interval_number: number;
  sustain_interval_minute: number;
};

type ConfidenceState = {
  early_warning: number;
  stronger_signal: number;
  confirmation_building: number;
  confirmed_cloud: number;
};

const CloudConfigModal: React.FC<CloudConfigModalProps> = ({
  isOpen,
  onClose,
  cloudModule,
  onSave,
}) => {
  const [config, setConfig] = React.useState({
    safety_factor: -3,
    sustain_interval_min_number: 2,
    sustain_interval_number: 2,
    sustain_interval_minute: 5,
  });

  const [windows, setWindows] = React.useState<WindowItem[]>([]);

  const [newType, setNewType] = React.useState("East");

  const [confidence, setConfidence] = React.useState<ConfidenceState>({
    early_warning: 0.3,
    stronger_signal: 0.5,
    confirmation_building: 0.8,
    confirmed_cloud: 1.0,
  });

  const bg = useColorModeValue("white", "#161B1B");
  const cardBg = useColorModeValue("gray.50", "#111c2b");

  const updateConfig = (key: keyof ConfigState, value: number) => {
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

  const updateConfidence = (key: keyof ConfidenceState, value: number) => {
    setConfidence({ ...confidence, [key]: value });
  };

  const addWindow = () => {
    // Always add a new entry to allow users to add windows repeatedly.
    setWindows([
      ...windows,
      {
        name: newType,
        morning: "",
        midday: "",
        evening: 0,
      },
    ]);
  };

  React.useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const res = await fetch("http://75.119.146.115:5179/api/v1/getCloudDetails");
        const json = await res.json();

        if (!json.success || !json.data) return;

        const data = json.data;

        setConfig({
          safety_factor: data.safety_factor ?? -3,
          sustain_interval_min_number: data.sustain_interval_min_number ?? 2,
          sustain_interval_number: data.sustain_interval_number ?? 2,
          sustain_interval_minute: data.sustain_interval_minute ?? 5,
        });

        setConfidence(data.confidance_dispatch_stages ?? {
          early_warning: 0.3,
          stronger_signal: 0.5,
          confirmation_building: 0.8,
          confirmed_cloud: 1.0,
        });

        const windowsData = data.windows_avg_rate_per_minute;
        if (windowsData && typeof windowsData === 'object') {
          const mappedWindows = Object.entries(windowsData).map(([key, val]: any) => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            morning: val.morning,
            midday: val.midday,
            evening: val.evening,
          }));
          setWindows(mappedWindows);
        } else {
          setWindows([]);
        }
      } catch (err) {
        console.error("FETCH ERROR:", err);
      }
    };

    fetchData();
  }, [isOpen]);

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
                <Tooltip label="A negative/positive value that adjusts the cloud detection sensitivity to avoid false positives.">
                  <HStack spacing={1}>
                    <Text fontSize="2xs">Safety Factor</Text>
                    <InfoIcon boxSize={3} color="blue.500" />
                  </HStack>
                </Tooltip>
                <Input
                  size="xs"
                  type="number"
                  value={config.safety_factor}
                  onChange={(e) => updateConfig("safety_factor", Number(e.target.value))}
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
                  type="number"
                  value={config.sustain_interval_number}
                  onChange={(e) =>
                    updateConfig("sustain_interval_number", Number(e.target.value))
                  }
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
                  type="number"
                  value={config.sustain_interval_minute}
                  onChange={(e) =>
                    updateConfig("sustain_interval_minute", Number(e.target.value))
                  }
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
                          {/* <Button
                            size="xs"
                            leftIcon={<DeleteIcon />}
                            variant="ghost"
                            isDisabled
                          >
                            Remove
                          </Button> */}
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
                };

                console.log("FINAL PAYLOAD:", payload);

                const res = await fetch("http://75.119.146.115:5179/api/v1/saveCloudDetails", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(payload),
                });

                const data = await res.json();
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
