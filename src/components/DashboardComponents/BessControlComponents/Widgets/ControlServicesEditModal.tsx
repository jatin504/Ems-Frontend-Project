import {
  Box,
  Button,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

// =========================================================
// TYPES
// =========================================================

export interface CurvePoint {
  tag: string;
  x: string;
  y: string;
}

export interface ControlCurvesValues {
  pf: CurvePoint[];
  quQ: CurvePoint[];
  quU: CurvePoint[];
  ramp: string;
  recover: string;
}

interface ControlServicesEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  values: ControlCurvesValues;
  onSave: (values: ControlCurvesValues) => void;
}

// =========================================================
// DEFAULT VALUES
// =========================================================

export const DEFAULT_VALUES: ControlCurvesValues = {
  pf: [
    { tag: "PF0", x: "", y: "" },
    { tag: "PF1", x: "", y: "" },
    { tag: "PF2", x: "", y: "" },
    { tag: "PF3", x: "", y: "" },
  ],

  quQ: [
    { tag: "QUQ0", x: "", y: "" },
    { tag: "QUQ1", x: "", y: "" },
    { tag: "QUQ2", x: "", y: "" },
    { tag: "QUQ3", x: "", y: "" },
    { tag: "QUQ4", x: "", y: "" },
    { tag: "QUQ5", x: "", y: "" },
  ],

  quU: [
    { tag: "QUU0", x: "", y: "" },
    { tag: "QUU1", x: "", y: "" },
    { tag: "QUU2", x: "", y: "" },
    { tag: "QUU3", x: "", y: "" },
    { tag: "QUU4", x: "", y: "" },
  ],
  ramp: "",
  recover: "",
};

// =========================================================
// CURVE SECTION
// =========================================================

function CurveSection({
  title,
  points,
  onChange,
}: {
  title: string;
  points: CurvePoint[];
  onChange: (index: number, field: "x" | "y", value: string) => void;
}) {
  return (
    <Box>
      {/* Section Header */}
      <Box
        bg="#E8EEF7"
        borderRadius="3px"
        px="10px"
        py="5px"
        mb="6px"
      >
        <Text
          fontSize="11px"
          fontWeight={700}
          color="#26364A"
        >
          {title}
        </Text>
      </Box>

      {/* Curve Rows */}
      <VStack spacing="4px" align="stretch">
        {points.map((point, index) => (
          <HStack key={index} spacing="8px">
            {/* Label */}
            <Text
              w="38px"
              fontSize="11px"
              fontWeight={500}
              color="#26364A"
            >
              {point.tag}
            </Text>

            {/* X Label */}
            <Text
              w="12px"
              fontSize="11px"
              color="#26364A"
            >
              X
            </Text>

            {/* X Input */}
            <Input
              h="22px"
              flex="0 0 82px"
              w="82px"
              minW={0}
              fontSize="11px"
              px="7px"
              borderColor="#D5DCE5"
              borderRadius="3px"
              bg="white"
              value={point.x}
              onChange={(e) =>
                onChange(index, "x", e.target.value)
              }
            />

            {/* Y Label */}
            <Text
              w="12px"
              fontSize="11px"
              color="#26364A"
            >
              Y
            </Text>

            {/* Y Input */}
            <Input
              h="22px"
              flex="0 0 82px"
              w="82px"
              minW={0}
              fontSize="11px"
              px="7px"
              borderColor="#D5DCE5"
              borderRadius="3px"
              bg="white"
              value={point.y}
              onChange={(e) =>
                onChange(index, "y", e.target.value)
              }
            />
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}

// =========================================================
// MAIN MODAL
// =========================================================

export default function ControlServicesEditModal({
  isOpen,
  onClose,
  values,
  onSave,
}: ControlServicesEditModalProps) {
  const [draftValues, setDraftValues] =
    useState<ControlCurvesValues>(DEFAULT_VALUES);

  useEffect(() => {
    if (isOpen) {
      setDraftValues({
        ...DEFAULT_VALUES,
        ...values,
        pf: values?.pf || DEFAULT_VALUES.pf,
        quQ: values?.quQ || DEFAULT_VALUES.quQ,
        quU: values?.quU || DEFAULT_VALUES.quU,
      });
    }
  }, [isOpen, values]);

  // =========================================================
  // UPDATE CURVE POINT
  // =========================================================

  const updateCurve = (
    curve: "pf" | "quQ" | "quU",
    index: number,
    field: "x" | "y",
    value: string
  ) => {
    setDraftValues((current) => ({
      ...current,
      [curve]: current[curve].map((point, i) =>
        i === index
          ? { ...point, [field]: value }
          : point
      ),
    }));
  };

  // =========================================================
  // SAVE
  // =========================================================

  const handleSave = () => {
    onSave(draftValues);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="sm"
    >
      <ModalOverlay bg="blackAlpha.300" />

      <ModalContent
        maxW="600px"
        w="calc(100% - 24px)"
        borderRadius="4px"
        overflow="hidden"
        bg="white"
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <ModalHeader
          fontSize="15px"
          fontWeight={700}
          color="#26364A"
          px="12px"
          py="8px"
          borderBottom="1px solid"
          borderColor="#D5DCE5"
        >
          Control Server — Curves (Read / Write)
        </ModalHeader>

        <ModalCloseButton
          size="sm"
          top="5px"
          right="5px"
          color="#26364A"
        />

        {/* =================================================
            BODY
        ================================================= */}

        <ModalBody
          px="10px"
          py="8px"
          bg="white"
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="10px" alignItems="start">

            {/* ================= P(f) CURVE ================= */}
            <CurveSection
              title="P(f) Curve (Hz → dp fraction)"
              points={draftValues.pf}
              onChange={(index, field, value) =>
                updateCurve("pf", index, field, value)
              }
            />

            {/* ================= RAMP / RECOVER ================= */}
            <HStack spacing="10px" align="start">
              <VStack flex="1" spacing="4px" align="stretch">
                <Text fontSize="11px" fontWeight={500} color="#26364A">
                  Ramp %/min
                </Text>
                <Input
                  h="22px"
                  w="82px"
                  fontSize="11px"
                  px="7px"
                  borderColor="#D5DCE5"
                  borderRadius="3px"
                  value={draftValues.ramp}
                  onChange={(e) =>
                    setDraftValues((current) => ({ ...current, ramp: e.target.value }))
                  }
                />
              </VStack>
              <VStack flex="1" spacing="4px" align="stretch">
                <Text fontSize="11px" fontWeight={500} color="#26364A">
                  Recover s
                </Text>
                <Input
                  h="22px"
                  w="82px"
                  fontSize="11px"
                  px="7px"
                  borderColor="#D5DCE5"
                  borderRadius="3px"
                  value={draftValues.recover}
                  onChange={(e) =>
                    setDraftValues((current) => ({ ...current, recover: e.target.value }))
                  }
                />
              </VStack>
            </HStack>

            {/* ================= Q(U) Q-SHIFT ================= */}
            <CurveSection
              title="Q(U) Q-shift (P.u. → Q fraction)"
              points={draftValues.quQ}
              onChange={(index, field, value) =>
                updateCurve("quQ", index, field, value)
              }
            />

            {/* ================= Q(V) V-SHIFT ================= */}
            <CurveSection
              title="Q(V) V-shift (P.u. → Q fraction)"
              points={draftValues.quU}
              onChange={(index, field, value) =>
                updateCurve("quU", index, field, value)
              }
            />

          </SimpleGrid>
        </ModalBody>

        {/* =================================================
            FOOTER
        ================================================= */}

        <ModalFooter
          px="10px"
          py="8px"
          gap="8px"
          borderTop="1px solid"
          borderColor="#D5DCE5"
          justifyContent="flex-end"
        >
          <Button
            h="28px"
            px="16px"
            fontSize="11px"
            fontWeight={500}
            variant="outline"
            borderColor="#D5DCE5"
            borderRadius="4px"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            h="28px"
            px="16px"
            fontSize="11px"
            fontWeight={600}
            bg="#2563EB"
            color="white"
            borderRadius="4px"
            _hover={{ bg: "#1D4ED8" }}
            onClick={handleSave}
          >
            Write Curves
          </Button>
        </ModalFooter>

      </ModalContent>
    </Modal>
  );
}