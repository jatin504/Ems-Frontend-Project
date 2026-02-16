import React, { useEffect, useState, RefObject } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Grid,
  Box,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import useTimeseriesData from "../../../hooks/useTimeseriesData";

interface PCSModalProps {
  isOpen: boolean;
  onClose: () => void;
  pcs: {
    name: string;
    deviceId: string;
  } | null;
  timeWindow: any;
  containerRef: RefObject<HTMLElement>;
}

interface WidgetPoint {
  ts: number;
  value: number;
}

interface WidgetData {
  [deviceId: string]: {
    [alias: string]: WidgetPoint[];
  };
}

export default function PCSModal({
  isOpen,
  onClose,
  pcs,
  timeWindow,
  containerRef,
}: PCSModalProps) {
  const cardBg = useColorModeValue("#ffffff", "#161B1B");
  const cardBorder = useColorModeValue("#e5e7eb", "#1c2635");
  const labelColor = useColorModeValue("#475569", "#cbd5e1");
  const valueColor = useColorModeValue("#0f172a", "#ffffff");

  const { data, loading, error, fetchData } = useTimeseriesData();
  const [rackIds, setRackIds] = useState<string[]>([]);

  // 🔹 Fetch rack data
  useEffect(() => {
    if (!pcs) return;

    const rackPattern =
      pcs.deviceId.replace("_pcs_pcs_", "_pcs_") + "_bank_bank_";

    fetchData({
      devices: {
        patterns: [rackPattern],
        ids: [],
      },
      keys: [
        { key: "soc", alias: "SOC", keyType: "common" },
        { key: "voltage", alias: "Voltage", keyType: "common" },
        { key: "amps", alias: "Amps", keyType: "common" },
        {
          key: "reactive_power_kvar",
          alias: "Reactive Power",
          keyType: "common",
        },
        { key: "frequency_hz", alias: "Frequency", keyType: "common" },
        { key: "control_state", alias: "Control State", keyType: "common" },
      ],
      aggregation: timeWindow.aggregation,
      timeRange: timeWindow.timeRange,
      orderBy: timeWindow.orderBy,
    } as any);
  }, [pcs, timeWindow]);

  useEffect(() => {
    if (!data) {
      setRackIds([]);
      return;
    }
    setRackIds(Object.keys(data));
  }, [data]);

  const getLastValue = (
    rackId: string,
    alias: string,
    unit?: string
  ): string => {
    const widgetData = data as WidgetData | null;
    if (!widgetData) return "--";

    const arr = widgetData[rackId]?.[alias];
    if (!arr || arr.length === 0) return "--";

    const v = arr[arr.length - 1]?.value;
    if (typeof v !== "number") return "--";

    return unit ? `${v.toFixed(2)} ${unit}` : `${v.toFixed(2)}`;
  };

  if (!pcs) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      isCentered
      scrollBehavior="inside"
      blockScrollOnMount={false}
      portalProps={{ containerRef }}
    >
      <ModalOverlay bg="transparent" />

      <ModalContent
        bg={cardBg}
        border={`1px solid ${cardBorder}`}
        w="520px"
        h="520px"
        maxW="unset"
        maxH="unset"
        borderRadius="16px"
      >
        {/* <ModalHeader>{pcs.name} – Racks</ModalHeader> */}
        <ModalCloseButton />

        <ModalBody pb={4}>
          {loading && (
            <Text fontSize="12px" color={labelColor}>
              Loading rack data…
            </Text>
          )}

          {error && (
            <Text fontSize="12px" color="red.400">
              {error}
            </Text>
          )}

          <Grid templateColumns="repeat(3, 1fr)" gap="12px">
            {rackIds.map((rackId) => {
              const metrics = [
                ["SOC", getLastValue(rackId, "SOC", "%")],
                ["Voltage", getLastValue(rackId, "Voltage", "V")],
                ["Amps", getLastValue(rackId, "Amps", "A")],
                ["Power", getLastValue(rackId, "Reactive Power", "kVAR")],
                ["Frequency", getLastValue(rackId, "Frequency", "Hz")],
                ["Control State", getLastValue(rackId, "Control State")],
              ];

              return (
                <Box
                  key={rackId}
                  border={`1px solid ${cardBorder}`}
                  borderRadius="14px"
                  p="24px"
                  minH="180px"
                >
                  <Grid templateColumns="repeat(3, 1fr)" gap="16px">
                    {metrics.map(([label, value]) => (
                      <Box key={label}>
                        <Text
                          fontSize="13px"
                          color={labelColor}
                          lineHeight="1.3"
                          fontWeight="500"
                        >
                          {label}
                        </Text>
                        <Text
                          fontSize="15px"
                          color={valueColor}
                          lineHeight="1.3"
                          fontWeight="600"
                        >
                          {value}
                        </Text>
                      </Box>
                    ))}
                  </Grid>
                </Box>
              );
            })}

            {!loading && rackIds.length === 0 && (
              <Text fontSize="12px" color={labelColor}>
                No racks found
              </Text>
            )}
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
