import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  HStack,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";

type StatusType = "completed" | "progress" | "pending";

interface ControlItem {
  id: number;
  title: string;
  description: string;
  status: StatusType;
  button: string;
}

const controls: ControlItem[] = [
  {
    id: 1,
    title: "System Check",
    description: "Prerequisites verification",
    status: "completed",
    button: "View Details",
  },
  {
    id: 2,
    title: "Start Master PCS",
    description: "Start PCS-01 as Master",
    status: "completed",
    button: "Stop PCS",
  },
  {
    id: 3,
    title: "Energize Black Start Bus",
    description: "Close breaker and energize bus",
    status: "progress",
    button: "Energize Bus",
  },
  {
    id: 4,
    title: "Energize Aux Loads",
    description: "Supply auxiliary loads",
    status: "pending",
    button: "Energize",
  },
  {
    id: 5,
    title: "Bring Online Additional PCS",
    description: "Synchronize other PCS",
    status: "pending",
    button: "Bring Online",
  },
  {
    id: 6,
    title: "Start Solar / Other Sources",
    description: "Start solar inverters",
    status: "pending",
    button: "Start Source",
  },
];

const ManualControls = () => {
  const cardBg = useColorModeValue("white", "#0F172A");
  const border = useColorModeValue("#E5E7EB", "#334155");
  const titleColor = useColorModeValue("#111827", "white");
  const subColor = useColorModeValue("#6B7280", "#94A3B8");

  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case "completed":
        return "#16A34A";
      case "progress":
        return "#2563EB";
      default:
        return "#9CA3AF";
    }
  };

  const getStatusText = (status: StatusType) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "progress":
        return "In Progress";
      default:
        return "Pending";
    }
  };

  return (
    <Card
      bg={cardBg}
      border="1px solid"
      borderColor={border}
      borderRadius="12px"
      boxShadow="sm"
      h="100%"
    >
      <CardBody
        p={4}
        display="flex"
        flexDirection="column"
        h="100%"
      >
        <Text
          fontSize="16px"
          fontWeight="700"
          color={titleColor}
        >
          Manual Controls
        </Text>

        <Text
          mt={1}
          mb={3}
          fontSize="11px"
          color={subColor}
        >
          Execute steps manually using the buttons below.
        </Text>

        <VStack
          flex={1}
          spacing={2}
          align="stretch"
          justify="space-between"
        >
                      {controls.map((item) => (
            <HStack
              key={item.id}
              justify="space-between"
              align="center"
              h="46px"
            >
              {/* Left */}
              <HStack spacing={3} align="flex-start">
                <Flex
                  w="22px"
                  h="22px"
                  minW="22px"
                  borderRadius="full"
                  border="2px solid"
                  borderColor={getStatusColor(item.status)}
                  bg={
                    item.status === "completed"
                      ? "#22C55E"
                      : item.status === "progress"
                      ? "#2563EB"
                      : "white"
                  }
                  color={
                    item.status === "pending"
                      ? "#6B7280"
                      : "white"
                  }
                  justify="center"
                  align="center"
                  fontSize="10px"
                  fontWeight="700"
                >
                  {item.id}
                </Flex>

                <Box w="120px">
                  <Text
                    fontSize="12px"
                    fontWeight="700"
                    color={titleColor}
                    lineHeight="16px"
                  >
                    {item.title}
                  </Text>

                  <Text
                    fontSize="9px"
                    color={subColor}
                    mt="1px"
                    lineHeight="12px"
                  >
                    {item.description}
                  </Text>
                </Box>
              </HStack>

              {/* Status */}
              <HStack spacing={1} minW="70px">
                {item.status === "completed" ? (
                  <CheckCircleIcon
                    color="#22C55E"
                    boxSize={2.5}
                  />
                ) : item.status === "progress" ? (
                  <WarningTwoIcon
                    color="#2563EB"
                    boxSize={2.5}
                  />
                ) : (
                  <Box
                    w="6px"
                    h="6px"
                    borderRadius="full"
                    bg="#BDBDBD"
                  />
                )}

                <Text
                  fontSize="10px"
                  fontWeight="600"
                  color={getStatusColor(item.status)}
                >
                  {getStatusText(item.status)}
                </Text>
              </HStack>

              {/* Button */}
              <Button
                w="88px"
                h="28px"
                fontSize="10px"
                fontWeight="700"
                colorScheme={
                  item.status === "progress"
                    ? "blue"
                    : undefined
                }
                variant={
                  item.status === "progress"
                    ? "solid"
                    : "outline"
                }
              >
                {item.button}
              </Button>
            </HStack>
          ))}
                    <Button
            mt={1}
            w="100%"
            h="32px"
            variant="outline"
            borderColor="#EF4444"
            color="#EF4444"
            flexShrink={0}
            _hover={{
              bg: "#FEF2F2",
              borderColor: "#DC2626",
            }}
            leftIcon={
              <Box
                w="14px"
                h="14px"
                border="1.5px solid"
                borderColor="currentColor"
                borderRadius="3px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="9px"
                fontWeight="700"
              >
                ×
              </Box>
            }
            fontSize="11px"
            fontWeight="700"
          >
            Abort Black Start
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default ManualControls;
      