import {
  Box,
  Card,
  CardBody,
  HStack,
  VStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import BlackStartSequence from "../components/DashboardComponents/ManualBlackStart/BlackStartSequence";
import LiveStatus from "../components/DashboardComponents/ManualBlackStart/LiveStatus";
import PlantElectricalSnapshot from "../components/DashboardComponents/ManualBlackStart/PlantElectricalSnapshot";
import ManualControls from "../components/DashboardComponents/ManualBlackStart/ManualControls";

import BlackStartEventLog from "../components/DashboardComponents/ManualBlackStart/BlackStartEventLog";
import RealTimeTrends from "../components/DashboardComponents/ManualBlackStart/RealTimeTrends";
import LoadStatus from "../components/DashboardComponents/ManualBlackStart/LoadStatus";

const ManualBlackStartDashboard = () => {
  const bg = useColorModeValue("#F7F9FC", "#05121F");
  const cardBg = useColorModeValue("white", "#0F172A");
  const border = useColorModeValue("gray.200", "gray.700");
  const muted = useColorModeValue("gray.600", "gray.400");

  return (
    <Box p={4} bg={bg} minH="100vh">
      <VStack spacing={4} align="stretch">

        {/* Header */}
        <Card
          bg={cardBg}
          borderWidth="1px"
          borderColor={border}
          borderRadius="12px"
        >
          <CardBody py={3}>
            <VStack align="start" spacing={2}>
              <HStack>
                <Text fontWeight="700" fontSize="md">
                  Manual Black Start Mode
                </Text>

                <Box
                  px={2}
                  py={0.5}
                  borderRadius="md"
                  bg="purple.100"
                  color="purple.700"
                  fontSize="10px"
                  fontWeight="700"
                >
                  MANUAL
                </Box>
              </HStack>

              <Text fontSize="sm" color={muted}>
                You are in manual mode. Execute each step using the controls on
                the right panel.
              </Text>
            </VStack>
          </CardBody>
        </Card>

        {/* Row 2 */}
        <HStack spacing={4} align="stretch">
          <Box w="480px" h="450px">
            <BlackStartSequence />
          </Box>

          <Box w="400px" h="450px">
            <LiveStatus />
          </Box>

          <Box w="480px" h="450px">
            <PlantElectricalSnapshot />
          </Box>

          <Box w="560px" h="450px">
            <ManualControls />
          </Box>
        </HStack>

        {/* Row 3 */}
        <HStack spacing={4} align="stretch">
          <Box w="700px" h="330px">
            <BlackStartEventLog />
          </Box>

          <Box w="560px" h="330px" mt={-4}>
            <RealTimeTrends />
          </Box>

          <Box w="560px" h="330px">
            <LoadStatus />
          </Box>
        </HStack>

      </VStack>
    </Box>
  );
};

export default ManualBlackStartDashboard;