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

const PCSModeControlCard = () => {
  const bg = useColorModeValue("white", "#1A202C");
  const border = useColorModeValue("#E5E7EB", "#2D3748");

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="12px"
      p={2}
      h="200px"
    >
      <WidgetTitle mb={2} fontSize="13px">
        PCS Mode & Control
      </WidgetTitle>

      <VStack spacing={1.5} align="stretch">
        <Row label="Operating Mode" value="Grid Forming (GFM)" />
        <Row label="Control Source" value="EMS" />
        <Row label="P Setpoint" value="12.50 MW" />
        <Row label="Q Setpoint" value="2.10 MVAr" />
        <Row label="V Setpoint" value="1.000 pu" />
        <Row label="F Droop" value="4.0 %" />
        <Row label="V Droop" value="3.0 %" />
      </VStack>

    </Box>
  );
};

export default PCSModeControlCard;