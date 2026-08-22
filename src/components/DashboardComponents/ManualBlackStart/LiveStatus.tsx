import {
  Box,
  Card,
  CardBody,
  HStack,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

const cards = [
  {
    title: "Black Start Bus",
    value: "33 kV",
    sub: "Energized",
    color: "#22C55E",
  },
  {
    title: "Master PCS",
    value: "PCS-01",
    sub: "Running (GFM)",
    color: "#22C55E",
  },
  {
    title: "Bus Frequency",
    value: "50.02 Hz",
  },
  {
    title: "Bus Voltage (L-L)",
    value: "33.01 kV",
  },
  {
    title: "System Mode",
    value: "GRID FORMING (GFM)",
    sub: "Manual Black Start",
  },
  {
    title: "Islanding Status",
    value: "ISLANDED",
    color: "#F97316",
  },
];

const LiveStatus = () => {
  const cardBg = useColorModeValue("white", "#0F172A");
  const border = useColorModeValue("#E5E7EB", "#334155");
  const title = useColorModeValue("#111827", "white");
  const muted = useColorModeValue("#6B7280", "#94A3B8");

  return (
    <Card
      bg={cardBg}
      border="1px solid"
      borderColor={border}
      borderRadius="12px"
      h="100%"
      boxShadow="sm"
    >
      <CardBody p={4}>
        <HStack justify="space-between" mb={4}>
          <Text fontWeight="700" fontSize="16px">
            Live Status
          </Text>

          <HStack spacing={2}>
            <Box
              w="7px"
              h="7px"
              borderRadius="full"
              bg="#22C55E"
            />
            <Text
              fontSize="11px"
              fontWeight="600"
              color={muted}
            >
              Black Start Active
            </Text>
          </HStack>
        </HStack>

        <SimpleGrid columns={2} spacing={3}>
          {cards.map((item) => (
            <Box
              key={item.title}
              p={3}
              minH="108px"
              border="1px solid"
              borderColor={border}
              borderRadius="10px"
              bg={useColorModeValue("#F8FAFC", "#111827")}
            >
              <VStack
                align="flex-start"
                justify="center"
                spacing={1}
                h="100%"
              >
                <Text
                  fontSize="10px"
                  fontWeight="600"
                  color={muted}
                >
                  {item.title}
                </Text>

                <Text
                  fontWeight="700"
                  lineHeight="1.1"
                  color={item.color ?? title}
                  fontSize={
                    item.value === "GRID FORMING (GFM)"
                      ? "16px"
                      : item.value === "ISLANDED"
                      ? "17px"
                      : "18px"
                  }
                >
                  {item.value}
                </Text>

                {item.sub && (
                  <Text
                    fontSize="10px"
                    fontWeight="500"
                    color={
                      item.color === "#22C55E"
                        ? "#22C55E"
                        : muted
                    }
                  >
                    {item.sub}
                  </Text>
                )}
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

export default LiveStatus;
        