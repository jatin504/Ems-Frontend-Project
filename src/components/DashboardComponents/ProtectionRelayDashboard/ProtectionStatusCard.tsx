import {
  Box,
  Flex,
  Text,
  Badge,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

const StatusRow = ({
  label,
  status,
}: {
  label: string;
  status: "READY" | "TRIPPED";
}) => {
  const isTripped = status === "TRIPPED";

  return (
    <Flex justify="space-between" align="center">
      <Text
        fontSize="11px"
        color={useColorModeValue("#4A5568", "#CBD5E0")}
      >
        {label}
      </Text>
      <Badge
        fontSize="9px"
        colorScheme={isTripped ? "red" : "green"}
        px={2}
        py={0.5}
        borderRadius="full"
      >
        {status}
      </Badge>
    </Flex>
  );
};

export default function ProtectionStatusCard() {
  const bg = useColorModeValue("#FFFFFF", "#161B1B");
  const border = useColorModeValue("gray.200", "#202525");
  const titleColor = useColorModeValue("#1F2937", "#E8ECEC");

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="12px"        
      boxShadow="sm"             
      p="12px"
      w="100%"
      h="100%"
      transition="all 0.15s ease"
      _hover={{
        boxShadow: "md",
      }}
    >
      <Text
        fontSize="13px"
        fontWeight="600"
        mb="8px"
        color={titleColor}
      >
        Protection Status
      </Text>

      <VStack spacing={1.5} align="stretch">
        <StatusRow label="Overcurrent Trip" status="TRIPPED" />
        <StatusRow label="Earth Fault Trip" status="READY" />
        <StatusRow label="Under/Over Voltage" status="READY" />
        <StatusRow label="Over Frequency" status="READY" />
        <StatusRow label="Breaker Failure FO" status="READY" />
      </VStack>
    </Box>
  );
}
