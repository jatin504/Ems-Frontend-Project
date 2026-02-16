import {
  Box,
  Flex,
  Text,
  VStack,
  useColorModeValue,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { FiMoreVertical } from "react-icons/fi";

import AnalogTrendPanel from "./AnalogTrendPanel";

const CurrentRow = ({ label, value }: { label: string; value: number }) => {
  const trackBg = useColorModeValue("#E2E8F0", "#1A202C");
  const barBg = "#5FA84F";
  const labelColor = useColorModeValue("#4A5568", "#CBD5E0");
  const valueColor = useColorModeValue("#1A202C", "#E2E8F0");

  return (
    <Flex align="center" width="100%">
      <Text width="36px" fontSize="11px" color={labelColor}>
        {label}:
      </Text>

      <Box flex="1" height="8px" bg={trackBg} borderRadius="2px" mx={2}>
        <Box
          height="100%"
          width={`${Math.min((value / 500) * 100, 100)}%`}
          bg={barBg}
          borderRadius="2px"
        />
      </Box>

      <Text
        width="56px"
        textAlign="right"
        fontSize="11px"
        color={valueColor}
        fontWeight="500"
      >
        {value} A
      </Text>
    </Flex>
  );
};

export default function PhaseCurrentsCard() {
  const bg = useColorModeValue("#FFFFFF", "#1A202C");
  const borderColor = useColorModeValue("#E2E8F0", "#4A5568");
  const titleColor = useColorModeValue("#2D3748", "#E2E8F0");

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {/* ================= CARD ================= */}
      <Box
        bg={bg}
        border={`1px solid ${borderColor}`}
        borderRadius="md"
        p={3}
        width="100%"
      >
        {/* ===== HEADER ===== */}
        <Flex justify="space-between" align="center">
          <Text fontSize="12px" fontWeight="bold" color={titleColor}>
            Phase Currents
          </Text>

          {/* 3 DOT MENU */}
          <IconButton
            aria-label="More"
            icon={<FiMoreVertical />}
            size="xs"
            variant="ghost"
            onClick={onOpen}
          />
        </Flex>

        {/* DIVIDER */}
        <Box height="1px" bg={borderColor} my={2} />

        {/* ROWS */}
        <VStack spacing={2} align="stretch">
          <CurrentRow label="IA" value={416} />
          <CurrentRow label="IB" value={410} />
          <CurrentRow label="IC" value={408} />
        </VStack>
      </Box>

      {/* ================= MODAL ================= */}
<Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
  <ModalOverlay />
  <ModalContent>
    {/* <ModalHeader fontSize="13px" py="10px">
      Analog Trend
    </ModalHeader> */}
    <ModalCloseButton />

    <ModalBody p={3} height="300px">
      <AnalogTrendPanel />
    </ModalBody>
  </ModalContent>
</Modal>

    </>
  );
}
