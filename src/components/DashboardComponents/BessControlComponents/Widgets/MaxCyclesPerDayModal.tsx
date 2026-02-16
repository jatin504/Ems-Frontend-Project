import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Text,
  Flex,
  SimpleGrid,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Switch,
  useColorModeValue,
  VStack,
  HStack,
  Progress,
  Select,
  Spinner,
} from "@chakra-ui/react";
import { useCycleConfig } from "../../../../hooks/useCycleConfig";

interface MaxCyclesPerDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onSave: (val: string) => void;
}

const MaxCyclesPerDayModal: React.FC<MaxCyclesPerDayModalProps> = ({
  isOpen,
  onClose,
  value,
  onSave,
}) => {
  const {
    maxCycles,
    setMaxCycles,
    cyclesUsedToday,
    isLoading,
    isSaving,
    saveConfig,
    lockoutBehaviour,
    setLockoutBehaviour,
    priceLogicOverrides,
    setPriceLogicOverrides,
    notifications,
    setNotifications,
    cycleCountingMethod,
    setCycleCountingMethod,
    // NEW: SOC safety management from hook
    socSafetyManagement,
    setSocSafetyManagement,
  } = useCycleConfig(isOpen, value);

  // COLORS
  const cardBg = useColorModeValue("white", "#020617");
  const cardBorder = useColorModeValue("gray.200", "#1f2937");
  const textMuted = useColorModeValue("gray.600", "#9ca3af");
  const pageBg = useColorModeValue("gray.50", "#020617");
  const pageText = useColorModeValue("gray.900", "#e5e7eb");

  const handleSave = async () => {
    const ok = await saveConfig();
    if (ok) {
      onSave(String(maxCycles));
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  const progressValue =
    maxCycles > 0 ? Math.min((cyclesUsedToday / maxCycles) * 100, 100) : 0;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="6xl" isCentered>
      <ModalOverlay />
      <ModalContent bg={pageBg} color={pageText}>
        {/* <ModalHeader fontSize="sm" py={2}>
          Cycle Budget Management
        </ModalHeader> */}
        <ModalCloseButton top="8px" />
        <ModalBody py={3} px={3}>
          <Box
            bg={pageBg}
            color={pageText}
            display="flex"
            flexDirection="column"
            gap={6}
          >
            {/* HEADER */}
            <Box display="flex" flexDirection="column" gap={1}>
              <Text fontSize="2xl" fontWeight="bold" lineHeight="short">
                Cycle Budget Management
              </Text>
              <Text fontSize="sm" color={textMuted}>
                Protect battery warranty and optimise daily cycle usage.
              </Text>
            </Box>

            {isLoading ? (
              <Flex justify="center" align="center" minH="160px">
                <Spinner size="sm" mr={2} />
                <Text fontSize="sm" color={textMuted}>
                  Loading cycle configuration...
                </Text>
              </Flex>
            ) : (
              <>
                {/* CYCLE BAR */}
                <Box
                  bg={cardBg}
                  borderRadius="2xl"
                  borderWidth="1px"
                  borderColor={cardBorder}
                  p={4}
                >
                  <VStack align="stretch" spacing={3}>
                    <Flex
                      justify="space-between"
                      align="center"
                      fontSize="sm"
                      color={textMuted}
                    >
                      <Text>Cycles Used Today</Text>
                      <Text>
                        {cyclesUsedToday} / {maxCycles}
                      </Text>
                    </Flex>
                    <Progress
                      value={progressValue}
                      height="12px"
                      borderRadius="full"
                    />
                  </VStack>
                </Box>

                {/* GRID LAYOUT */}
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {/* DAILY CYCLE LIMIT */}
                  <Box
                    bg={cardBg}
                    borderRadius="2xl"
                    borderWidth="1px"
                    borderColor={cardBorder}
                    p={4}
                  >
                    <VStack align="stretch" spacing={4}>
                      <Text fontSize="lg" fontWeight="semibold">
                        Daily Cycle Limit
                      </Text>

                      <Box>
                        <Text fontSize="sm" color={textMuted} mb={1}>
                          Max Cycles / Day
                        </Text>
                        <HStack spacing={3}>
                          <Box flex="1">
                            <Slider
                              min={0}
                              max={20}
                              step={1}
                              value={maxCycles}
                              onChange={(val) => setMaxCycles(val)}
                            >
                              <SliderTrack>
                                <SliderFilledTrack />
                              </SliderTrack>
                              <SliderThumb boxSize={3} />
                            </Slider>
                          </Box>
                          <Box w="40px" textAlign="right">
                            <Text fontSize="sm" fontWeight="medium">
                              {maxCycles}
                            </Text>
                          </Box>
                        </HStack>
                      </Box>

                      <Box>
                        <Text fontSize="sm" color={textMuted} mb={1}>
                          Cycle Counting Method
                        </Text>
                        {/* IMPORTANT: value is "0" | "1" | "2" --> backend keys */}
                        <Select
                          size="sm"
                          borderRadius="xl"
                          value={cycleCountingMethod}
                          onChange={(e) =>
                            setCycleCountingMethod(e.target.value)
                          }
                        >
                          <option value="0">Throughput</option>
                          <option value="1">Full Cycle</option>
                          <option value="2">DOD Weighted</option>
                        </Select>
                      </Box>
                    </VStack>
                  </Box>

                  {/* SOC SAFETY MANAGEMENT */}
                  <Box
                    bg={cardBg}
                    borderRadius="2xl"
                    borderWidth="1px"
                    borderColor={cardBorder}
                    p={4}
                  >
                    <VStack align="stretch" spacing={4}>
                      <Text fontSize="lg" fontWeight="semibold">
                        SOC Safety Management
                      </Text>

                      {/* Minimum Safe SOC */}
                      <Box>
                        <Text fontSize="sm" color={textMuted} mb={1}>
                          Minimum Safe SOC
                        </Text>
                        <HStack spacing={3}>
                          <Box flex="1">
                            <Slider
                              min={0}
                              max={50}
                              step={1}
                              value={socSafetyManagement.min_safe_soc}
                              onChange={(val) =>
                                setSocSafetyManagement((prev) => ({
                                  ...prev,
                                  min_safe_soc: val,
                                }))
                              }
                              isDisabled 
                            >
                              <SliderTrack>
                                <SliderFilledTrack />
                              </SliderTrack>
                              <SliderThumb boxSize={3} />
                            </Slider>
                          </Box>
                          <Box w="40px" textAlign="right">
                            <Text fontSize="sm" fontWeight="medium">
                              {socSafetyManagement.min_safe_soc}
                            </Text>
                          </Box>
                        </HStack>
                      </Box>

                      {/* Normal SOC After Safety Charge */}
                      {/* <Box>
                        <Text fontSize="sm" color={textMuted} mb={1}>
                          Normal SOC After Safety Charge
                        </Text>
                        <HStack spacing={3}>
                          <Box flex="1">
                            <Slider
                              min={0}
                              max={100}
                              step={1}
                              value={
                                socSafetyManagement.normal_soc_after_safety_charge
                              }
                              onChange={(val) =>
                                setSocSafetyManagement((prev) => ({
                                  ...prev,
                                  normal_soc_after_safety_charge: val,
                                }))
                              }
                            >
                              <SliderTrack>
                                <SliderFilledTrack />
                              </SliderTrack>
                              <SliderThumb boxSize={3} />
                            </Slider>
                          </Box>
                          <Box w="40px" textAlign="right">
                            <Text fontSize="sm" fontWeight="medium">
                              {
                                socSafetyManagement.normal_soc_after_safety_charge
                              }
                            </Text>
                          </Box>
                        </HStack>
                      </Box> */}

                      {/* Standby SOC Hold Band */}
                      <Box>
                        <Text fontSize="sm" color={textMuted} mb={1}>
                          Standby SOC Hold Band
                        </Text>
                        <HStack spacing={3}>
                          <Box flex="1">
                            <Slider
                              min={0}
                              max={100}
                              step={1}
                              value={socSafetyManagement.standby_soc_hold_band}
                              onChange={(val) =>
                                setSocSafetyManagement((prev) => ({
                                  ...prev,
                                  standby_soc_hold_band: val,
                                }))
                              }
                              isDisabled
                            >
                              <SliderTrack>
                                <SliderFilledTrack />
                              </SliderTrack>
                              <SliderThumb boxSize={3} />
                            </Slider>
                          </Box>
                          <Box w="40px" textAlign="right">
                            <Text fontSize="sm" fontWeight="medium">
                              {socSafetyManagement.standby_soc_hold_band}
                            </Text>
                          </Box>
                        </HStack>
                      </Box>
                    </VStack>
                  </Box>

                  {/* LOCKOUT BEHAVIOR */}
                  <Box
                    bg={cardBg}
                    borderRadius="2xl"
                    borderWidth="1px"
                    borderColor={cardBorder}
                    p={4}
                  >
                    <VStack align="stretch" spacing={4}>
                      <Text fontSize="lg" fontWeight="semibold">
                        Lockout Behavior
                      </Text>

                      <VStack align="stretch" spacing={3} fontSize="sm">
                        <HStack justify="space-between">
                          <Text>Allow Safety Charging</Text>
                          <Switch
                            size="sm"
                            isChecked={lockoutBehaviour.allow_safety_charging}
                            onChange={(e) =>
                              setLockoutBehaviour((prev) => ({
                                ...prev,
                                allow_safety_charging: e.target.checked,
                              }))
                            }
                          />
                        </HStack>
                        <HStack justify="space-between">
                          <Text>Allow Reserve Charging</Text>
                          <Switch
                            size="sm"
                            isChecked={lockoutBehaviour.allow_reserve_charging}
                            onChange={(e) =>
                              setLockoutBehaviour((prev) => ({
                                ...prev,
                                allow_reserve_charging: e.target.checked,
                              }))
                            }
                          />
                        </HStack>
                        <HStack justify="space-between">
                          <Text>Block Economic Charging</Text>
                          <Switch
                            size="sm"
                            isChecked={
                              lockoutBehaviour.block_economic_charging
                            }
                            onChange={(e) =>
                              setLockoutBehaviour((prev) => ({
                                ...prev,
                                block_economic_charging: e.target.checked,
                              }))
                            }
                          />
                        </HStack>
                        <HStack justify="space-between">
                          <Text>Block Discharging</Text>
                          <Switch
                            size="sm"
                            isChecked={lockoutBehaviour.block_discharging}
                            onChange={(e) =>
                              setLockoutBehaviour((prev) => ({
                                ...prev,
                                block_discharging: e.target.checked,
                              }))
                            }
                          />
                        </HStack>
                      </VStack>
                    </VStack>
                  </Box>

                  {/* PRICE LOGIC OVERRIDES */}
                  <Box
                    bg={cardBg}
                    borderRadius="2xl"
                    borderWidth="1px"
                    borderColor={cardBorder}
                    p={4}
                  >
                    <VStack align="stretch" spacing={4}>
                      <Text fontSize="lg" fontWeight="semibold">
                        Price Logic Overrides
                      </Text>

                      <VStack align="stretch" spacing={3} fontSize="sm">
                        <HStack justify="space-between">
                          <Text>Disable Aggressive Charging</Text>
                          <Switch
                            size="sm"
                            isChecked={
                              priceLogicOverrides.disable_aggrassive_charging
                            }
                            onChange={(e) =>
                              setPriceLogicOverrides((prev) => ({
                                ...prev,
                                disable_aggrassive_charging: e.target.checked,
                              }))
                            }
                          />
                        </HStack>
                        <HStack justify="space-between">
                          <Text>Disable Peak Shaving</Text>
                          <Switch
                            size="sm"
                            isChecked={
                              priceLogicOverrides.disable_peak_shaving
                            }
                            onChange={(e) =>
                              setPriceLogicOverrides((prev) => ({
                                ...prev,
                                disable_peak_shaving: e.target.checked,
                              }))
                            }
                          />
                        </HStack>
                        <HStack justify="space-between">
                          <Text>Disable Arbitrage</Text>
                          <Switch
                            size="sm"
                            isChecked={priceLogicOverrides.disable_arbitrage}
                            onChange={(e) =>
                              setPriceLogicOverrides((prev) => ({
                                ...prev,
                                disable_arbitrage: e.target.checked,
                              }))
                            }
                          />
                        </HStack>
                        <HStack justify="space-between">
                          <Text>Disable Low Price Charging</Text>
                          <Switch
                            size="sm"
                            isChecked={
                              priceLogicOverrides.disable_low_price_charging
                            }
                            onChange={(e) =>
                              setPriceLogicOverrides((prev) => ({
                                ...prev,
                                disable_low_price_charging: e.target.checked,
                              }))
                            }
                          />
                        </HStack>
                      </VStack>
                    </VStack>
                  </Box>

                  {/* NOTIFICATIONS */}
                  <Box
                    bg={cardBg}
                    borderRadius="2xl"
                    borderWidth="1px"
                    borderColor={cardBorder}
                    p={4}
                  >
                    <VStack align="stretch" spacing={4}>
                      <Text fontSize="lg" fontWeight="semibold">
                        Notifications
                      </Text>

                      <VStack align="stretch" spacing={3} fontSize="sm">
                        <HStack justify="space-between">
                          <Text>Notify at 80% Usage</Text>
                          <Switch
                            size="sm"
                            isChecked={
                              notifications.notify_at_80_percent_usage
                            }
                            onChange={(e) =>
                              setNotifications((prev) => ({
                                ...prev,
                                notify_at_80_percent_usage: e.target.checked,
                              }))
                            }
                          />
                        </HStack>
                        <HStack justify="space-between">
                          <Text>Notify Lockout Activated</Text>
                          <Switch
                            size="sm"
                            isChecked={
                              notifications.notify_lockout_activated
                            }
                            onChange={(e) =>
                              setNotifications((prev) => ({
                                ...prev,
                                notify_lockout_activated: e.target.checked,
                              }))
                            }
                          />
                        </HStack>
                        <HStack justify="space-between">
                          <Text>Mobile Push Notifications</Text>
                          <Switch
                            size="sm"
                            isChecked={
                              notifications.mobile_push_notification
                            }
                            onChange={(e) =>
                              setNotifications((prev) => ({
                                ...prev,
                                mobile_push_notification: e.target.checked,
                              }))
                            }
                          />
                        </HStack>
                      </VStack>
                    </VStack>
                  </Box>
                </SimpleGrid>
              </>
            )}
          </Box>
        </ModalBody>
        <ModalFooter py={2}>
          <Button
            size="xs"
            variant="outline"
            mr={2}
            onClick={handleClose}
            isDisabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            size="xs"
            colorScheme="purple"
            onClick={handleSave}
            isLoading={isSaving}
            loadingText="Saving"
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MaxCyclesPerDayModal;
