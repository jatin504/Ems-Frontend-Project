import {
  Box,
  Flex,
  Text,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  Badge,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

// Remove hardcoded dummy data — accept `alarms` via props (defaults to empty array)

const getColor = (severity: string) => {
  if (severity === "High") return "red";
  if (severity === "Medium") return "orange";
  return "blue";
};

type AlarmItem = {
  time: string;
  meter: string;
  type: string;
  alarm: string;
  severity: string;
};

const RecentMeterAlarms = ({ alarms = [] }: { alarms?: AlarmItem[] }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const cardBg = useColorModeValue("linear-gradient(180deg,#ffffff,#f8fbff)", "primary.dark");

  const borderClr = useColorModeValue("#dbe7f3", "#16365f");

  const titleColor = useColorModeValue("#1A202C", "#d9e6ff");
  const thColor = useColorModeValue("#334155", "#8fb6e8");
  const tdColor = useColorModeValue("#1A202C", "white");
  const tdMuted = useColorModeValue("#475569", "#d6e4ff");

  return (
    <Box bg={cardBg} border={`1px solid ${borderClr}`} borderRadius="10px" p="12px">
      <Flex justify="space-between" mb="10px">
        <Text color={titleColor} fontWeight="700">Recent Alarms</Text>

        <Button size="xs" onClick={onOpen} bg={useColorModeValue("#eef5ff", "primary.dark")} color={useColorModeValue("#1A202C", "white")} _hover={{ bg: useColorModeValue("#e6f0ff", "primary.dark") }}>View All</Button>
      </Flex>

      <Table size="sm">
        <Thead>
          <Tr>
            <Th color={thColor}>Time</Th>
            <Th color={thColor}>Meter Name</Th>
            <Th color={thColor}>Meter Type</Th>
            <Th color={thColor}>Alarm</Th>
            <Th color={thColor}>Severity</Th>
            <Th color={thColor}>Status</Th>
          </Tr>
        </Thead>

        <Tbody>
          {alarms.map((item, index) => (
            <Tr key={index}>
              <Td color={tdColor}>{item.time}</Td>
              <Td color={tdColor}>{item.meter}</Td>
              <Td color={tdMuted}>{item.type}</Td>
              <Td color={tdMuted}>{item.alarm}</Td>

              <Td>
                <Badge colorScheme={getColor(item.severity)}>
                  {item.severity}
                </Badge>
              </Td>

              <Td>
                <Badge colorScheme="red">
                  Active
                </Badge>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent bg={cardBg}>
          <ModalHeader>RECENT METER ALARMS</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th color={thColor}>Time</Th>
                  <Th color={thColor}>Meter Name</Th>
                  <Th color={thColor}>Meter Type</Th>
                  <Th color={thColor}>Alarm</Th>
                  <Th color={thColor}>Severity</Th>
                  <Th color={thColor}>Status</Th>
                </Tr>
              </Thead>

              <Tbody>
                {alarms.map((item, index) => (
                  <Tr key={index}>
                    <Td color={tdColor}>{item.time}</Td>
                    <Td color={tdColor}>{item.meter}</Td>
                    <Td color={tdMuted}>{item.type}</Td>
                    <Td color={tdMuted}>{item.alarm}</Td>

                    <Td>
                      <Badge colorScheme={getColor(item.severity)}>
                        {item.severity}
                      </Badge>
                    </Td>

                    <Td>
                      <Badge colorScheme="red">Active</Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default RecentMeterAlarms;