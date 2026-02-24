import React, { useState } from "react";
import usePermissions from "../../../hooks/usePermissions";
import ConfirmPasswordModal from "../../Common/ConfirmPasswordModal";
import {
  Box,
  Flex,
  Text,
  Badge,
  VStack,
  Button,
  HStack,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";

interface VCBData {
  id: string;
  name: string;
  breakerStatus: string;
  springCharged: string;
  tripCoilHealthy: string;
  sf6Pressure: string;
  operationCount: string;
  lastOperation: string;
}

interface VCBStatusCardProps {
  data: VCBData;
}

/* ROW */
const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Flex justify="space-between" align="center">
    <Text
      fontSize="12px"
      color={useColorModeValue("#4A5568", "#CBD5E0")}
      fontWeight={500}
    >
      {label}
    </Text>
    {value}
  </Flex>
);

export default function VCBStatusCard({ data }: VCBStatusCardProps) {
  // Permission logic (must be inside component)
  const { permissions } = usePermissions();
  const role = (sessionStorage.getItem("role") || "").toLowerCase();
  const myPermission = (permissions || []).find((p) => (p.role_name || "").toLowerCase() === role);
  const canSwitchGear = myPermission?.can_control_switchgear === true;

  // Password modal state
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const bg = useColorModeValue("white", "#1A202C");
  const color = useColorModeValue("#1A202C", "white");
  const headerBg = useColorModeValue("#EDF2F7", "#2D3748");
  const borderColor = useColorModeValue("#E2E8F0", "#2D3748");

  const getStatusColor = (status: string) =>
    status.toLowerCase().includes("closed") ? "green" : "red";

  return (
    <Box
      width="300px"                 
      bg={bg}
      color={color}
      borderRadius="md"
      boxShadow="md"               
      border={`1px solid ${borderColor}`}
      overflow="hidden"
    >
      {/* HEADER */}
      <Flex
        bg={headerBg}
        px="8px"
        py="6px"
        justify="space-between"
        align="center"
      >
        <Text fontSize="12px" fontWeight={600}>
          VCB Status
        </Text>

        <HStack spacing="6px">
          <Button
            size="xs"
            bg="green.600"
            color="white"
            _hover={{ bg: "green.700" }}
            height="18px"
            px="8px"
            fontSize="10px"
            fontWeight={600}
          >
            CLOSE
          </Button>

          <Button
            size="xs"
            bg="red.600"
            color="white"
            _hover={{ bg: "red.700" }}
            height="18px"
            px="8px"
            fontSize="10px"
            fontWeight={600}
            isDisabled={!canSwitchGear}
            onClick={() => {
              if (!canSwitchGear) return;
              setIsPasswordOpen(true);
            }}
          >
            OPEN
          </Button>
        </HStack>
            {/* Password Modal for Switch Gear */}
            <ConfirmPasswordModal
              isOpen={isPasswordOpen}
              onClose={() => setIsPasswordOpen(false)}
              onConfirm={() => {
                setIsPasswordOpen(false);
                // TODO: Add actual open logic here after password confirmation
              }}
            />
      </Flex>

      <Divider borderColor={borderColor} />

      {/* CONTENT */}
      <Box p="8px">
        <VStack spacing="6px" align="stretch">
          <Row
            label="Breaker Status:"
            value={
              <Badge
                colorScheme={getStatusColor(data.breakerStatus)}
                px="6px"
                py="1px"
                fontSize="11px"
                fontWeight={600}
              >
                {data.breakerStatus}{" "}
                {data.breakerStatus.toLowerCase().includes("closed") ? "✔" : "✗"}
              </Badge>
            }
          />

          <Row label="Spring Charged:" value={<Text fontSize="12px">{data.springCharged}</Text>} />
          <Row label="Trip Coil Healthy:" value={<Text fontSize="12px">{data.tripCoilHealthy}</Text>} />
          <Row label="SF6 Pressure:" value={<Text fontSize="12px">{data.sf6Pressure}</Text>} />
          <Row label="Operation Count:" value={<Text fontSize="12px">{data.operationCount}</Text>} />
          <Row label="Last Operation:" value={<Text fontSize="12px">{data.lastOperation}</Text>} />
        </VStack>
      </Box>
    </Box>
  );
}
