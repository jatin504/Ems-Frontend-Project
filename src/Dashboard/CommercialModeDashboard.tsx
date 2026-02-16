import { useState } from "react";
import {
  Box,
  Card,
  CardBody,
  Button,
  Switch,
  Badge,
  Divider,
  VStack,
  HStack,
  Text,
  Grid,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { ChevronRightIcon, EditIcon } from "@chakra-ui/icons";
import { useMarketConfig } from "../hooks/useMarketConfig";

export default function CommercialModeConfig() {
  const [marketEnabled, setMarketEnabled] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<string>("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.900", "white");

  const { getDAMConfig, saveDAMConfig, getRTMConfig, saveRTMConfig } = useMarketConfig();

  /*STATES */
  const [rtmConfig, setRtmConfig] = useState({
    block_minutes: 0,
    plan_start_minutes: 0,
    plan_end_minutes: 0,
    freeze_at_minutes: 0,
    submit_at_minutes: 0,
  });

  const [damConfig, setDamConfig] = useState({
    gate_closure_offset_hours: 0,
    planning_start_offset_hours: 0,
    planning_end_offset_hours: 0,
    finalize_start_offset_hours: 0,
    finalize_end_offset_hours: 0,
    clearing_offset_hours: 0,
  });

  /* API HELPERS */

  const openRTMModal = async () => {
    setSelectedMarket("Real Time Market (RTM)");

    const config = await getRTMConfig();
    if (config) {
      setRtmConfig(config);
    }

    onOpen();
  };

  const openDAMModal = async () => {
    setSelectedMarket("Day Ahead Market (DAM)");

    const config = await getDAMConfig();
    if (config) {
      setDamConfig(config);
    }

    onOpen();
  };

  const handleSaveMarketConfig = async () => {
    try {
      if (selectedMarket === "Real Time Market (RTM)") {
        await saveRTMConfig(rtmConfig);
      }

      if (selectedMarket === "Day Ahead Market (DAM)") {
        await saveDAMConfig(damConfig);
      }

      onClose();
    } catch (e) {
      console.error("Failed to save market config", e);
    }
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Commercial Mode Configuration" },
  ];

  return (
    <Box p={4} bg={bgColor} color={textColor} w="full">
      {/*  Header*/}
      <VStack align="start" spacing={2} mb={4}>
        <Breadcrumb
          spacing="5px"
          fontSize="12px"
          separator={
            <ChevronRightIcon
              boxSize="6"
              color={useColorModeValue(
                "rgba(0,0,0,0.4)",
                "rgba(255,255,255,0.5)"
              )}
            />
          }
        >
          {breadcrumbs.map((bc, idx) => (
            <BreadcrumbItem key={idx} isCurrentPage={!bc.href}>
              {bc.href ? (
                <BreadcrumbLink href={bc.href}>{bc.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbLink fontWeight="600">
                  {bc.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          ))}
        </Breadcrumb>

        <HStack justify="space-between" w="full">
          <VStack align="start">
            <Text fontSize="xl" fontWeight="semibold">
              Commercial Mode Configuration
            </Text>
            <Text fontSize="xs" color="gray.500">
              Project: PH-CLARK-SOLAR-BESS-20MW
            </Text>
          </VStack>
          <Badge colorScheme={marketEnabled ? "red" : "gray"}>
            {marketEnabled ? "Market Mode Active" : "BTM Mode"}
          </Badge>
        </HStack>
      </VStack>

      {/*Commercial Participation  */}
      <Card mb={4}>
        <CardBody p={3}>
          <HStack justify="space-between">
            <VStack align="start">
              <Text fontSize="sm" fontWeight="medium">
                Enable Market Participation
              </Text>
              <Text fontSize="xs" color="gray.500">
                Enforces sell-before-dispatch logic
              </Text>
            </VStack>
            <Switch
              isChecked={marketEnabled}
              onChange={(e) => setMarketEnabled(e.target.checked)}
            />
          </HStack>
        </CardBody>
      </Card>

      {/* Market Permissions*/}
      {marketEnabled && (
        <Card mb={4}>
          <CardBody p={3}>
            <VStack align="start" spacing={3}>
              <Text fontSize="sm" fontWeight="medium">
                Market Permissions
              </Text>
              <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                <MarketRow
                  label="Day Ahead Market (DAM)"
                  onEdit={openDAMModal}
                />
                <MarketRow
                  label="Real Time Market (RTM)"
                  onEdit={openRTMModal}
                />
                <MarketRow
                  label="Intraday Market"
                  onEdit={() => {
                    setSelectedMarket("Intraday Market");
                    onOpen();
                  }}
                />
                <MarketRow
                  label="Ancillary Services"
                  onEdit={() => {
                    setSelectedMarket("Ancillary Services");
                    onOpen();
                  }}
                />
              </Grid>
            </VStack>
          </CardBody>
        </Card>
      )}

      <Divider />

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedMarket}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* ---- RTM FORM ---- */}
            {selectedMarket === "Real Time Market (RTM)" && (
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                {Object.entries(rtmConfig).map(([key, value]) => (
                  <FormControl key={key}>
                    <FormLabel fontSize="sm">{key}</FormLabel>
                    <NumberInput
                      size="sm"
                      value={value}
                      onChange={(_, v) =>
                        setRtmConfig({
                          ...rtmConfig,
                          [key]: isNaN(v) ? 0 : v,
                        })
                      }
                    >
                      <NumberInputField fontSize="sm" />
                    </NumberInput>
                  </FormControl>
                ))}
              </Grid>
            )}

            {/* ---- DAM FORM ---- */}
            {selectedMarket === "Day Ahead Market (DAM)" && (
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                {Object.entries(damConfig).map(([key, value]) => (
                  <FormControl key={key}>
                    <FormLabel fontSize="sm">{key}</FormLabel>
                    <NumberInput
                      size="sm"
                      value={value}
                      onChange={(_, v) =>
                        setDamConfig({
                          ...damConfig,
                          [key]: isNaN(v) ? 0 : v,
                        })
                      }
                    >
                      <NumberInputField fontSize="sm" />
                    </NumberInput>
                  </FormControl>
                ))}
              </Grid>
            )}

            {!["Real Time Market (RTM)", "Day Ahead Market (DAM)"].includes(
              selectedMarket
            ) && <Text>Configuration for {selectedMarket}</Text>}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveMarketConfig}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

function MarketRow({ label, onEdit }: { label: string; onEdit: () => void }) {
  return (
    <HStack justify="space-between">
      <Text fontSize="sm">{label}</Text>
      <EditIcon cursor="pointer" onClick={onEdit} />
    </HStack>
  );
}
