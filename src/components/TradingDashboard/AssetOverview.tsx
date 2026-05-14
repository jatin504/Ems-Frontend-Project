import {
  Box,
  Text,
  VStack,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";

const assets = [
  {
    name: "BESS 1 (50 MW / 100 MWh)",
    status: "Charging",
    color: "#22c55e",
  },
  {
    name: "BESS 2 (30 MW / 60 MWh)",
    status: "Discharging",
    color: "#facc15",
  },
  {
    name: "Solar Farm (35 MW)",
    status: "Active",
    color: "#22c55e",
  },
  {
    name: "Grid Connection",
    status: "RTM Enabled",
    color: "#16a34a",
    isGrid: true,
  },
];

const AssetOverview = () => {
  const cardBg = useColorModeValue("#ffffff", "#0f2235");
  const rowBg = useColorModeValue("#ffffff", "#132a44");
  const hoverBg = useColorModeValue("#edf2f7", "#163152");
  const borderColor = useColorModeValue("#e2e8f0", "#1f3b5b");
  const titleColor = useColorModeValue("gray.600", "gray.400");
  const textColor = useColorModeValue("gray.800", "gray.200");

  return (
    <Box
      bg={cardBg}
      p={3}
      borderRadius="lg"
      border={`1px solid ${borderColor}`}
      minH="550px"
      boxShadow="0 8px 20px rgba(0,0,0,0.25)" //  highlight
      transition="0.2s"
      _hover={{
        boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
        transform: "translateY(-2px)",
      }}
    >
      {/* Title */}
      <Text
        mb={3}
        fontSize="xs"
        fontWeight="600"
        letterSpacing="0.5px"
        color={titleColor}
      >
        Asset Overview
      </Text>

      <VStack spacing={2} align="stretch">
        {assets.map((item, index) => (
          <HStack
            key={index}
            justify="space-between"
            align="center"
            bg={rowBg}
            px={3}
            py={1.5}
            borderRadius="md"
            _hover={{ bg: hoverBg }}
          >
            {/* Left Section */}
            <HStack spacing={2} flex="1" minW={0}>
              <Box
                w="10px"
                h="10px"
                bg={item.isGrid ? "#3b82f6" : item.color}
                borderRadius="2px"
              />

              <Text
                fontSize="xs"
                fontWeight="500"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                color={textColor}
              >
                {item.name}
              </Text>
            </HStack>

            {/* Status */}
            <Text
              fontSize="xs"
              fontWeight="600"
              color={item.color}
              whiteSpace="nowrap"
            >
              {item.status}
            </Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default AssetOverview;