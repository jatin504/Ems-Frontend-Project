import {
  Box,
  Flex,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import WidgetTitle from "../../../Common/WidgetTitle";

const Row = ({ label, value }: any) => (
  <Flex justify="space-between" fontSize="11px" lineHeight="1.2">
    <Text color="gray.500" noOfLines={1}>{label}</Text>
    <Text fontWeight="600" noOfLines={1}>{value}</Text>
  </Flex>
);

const PCSStatusCard = () => {
  const bg = useColorModeValue("white", "#1A202C");
  const border = useColorModeValue("#E5E7EB", "#2D3748");

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="12px"
      p={2}
      h="180px"
    >
      <Flex justify="space-between" mb={2} align="center">
        <WidgetTitle fontSize="13px">PCS Status</WidgetTitle>

        <Text color="#22C55E" fontWeight="700" fontSize="11px">
          ● ONLINE
        </Text>
      </Flex>

      <VStack spacing={1.5} align="stretch">
        <Row label="Run Status" value="Running" />
        <Row label="Health" value="Healthy" />
        <Row label="Availability" value="99.52 %" />
        <Row label="Alarms" value="0" />
        <Row label="Warnings" value="1" />
        <Row label="Last Fault" value="-" />
        <Row label="Last Restart" value="28 Jun, 2026 11:23" />
      </VStack>
    </Box>
  );
};

export default PCSStatusCard;