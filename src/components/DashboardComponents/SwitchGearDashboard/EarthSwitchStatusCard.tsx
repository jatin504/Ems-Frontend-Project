import {
  Box,
  Flex,
  Text,
  Badge,
  VStack,
  Divider,
  useColorModeValue,
  Button,
  HStack,
} from "@chakra-ui/react";

interface EarthSwitchData {
  id: string;
  name: string;
  earthSwitchStatus: "OPEN" | "CLOSED";
  earthSwitch: string;
  mechanicalLock: string;
  positionFeedback: string;
}

export default function EarthSwitchStatusCard({
  data,
}: {
  data: EarthSwitchData;
}) {
  const bg = useColorModeValue("#FFFFFF", "#2B2F36");
  const color = useColorModeValue("#1A202C", "white");
  const headerBg = useColorModeValue("#EDF2F7", "#1F2328");
  const labelColor = useColorModeValue("#4A5568", "#CBD5E0");
  const borderColor = useColorModeValue("#E2E8F0", "#1F2328");

  return (
    <Box
      width="300px"
      bg={bg}
      color={color}
      borderRadius="md"
      boxShadow="md"              
      border={`1px solid ${borderColor}`}
      overflow="hidden"
      fontFamily="Poppins"
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
          Earth Switch Status
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
          >
            OPEN
          </Button>
        </HStack>
      </Flex>

      <Divider borderColor={borderColor} />

      {/* CONTENT */}
      <Box p="8px">
        <VStack spacing="6px" align="stretch">
          {/* Earth Switch Status */}
          <Flex justify="space-between" align="center">
            <Text fontSize="12px" color={labelColor} fontWeight={500}>
              Earth Switch Status:
            </Text>
            <Badge
              bg={data.earthSwitchStatus === "OPEN" ? "#E53E3E" : "#38A169"}
              color="white"
              px="6px"
              py="1px"
              fontSize="11px"
              fontWeight={600}
            >
              {data.earthSwitchStatus} ✓
            </Badge>
          </Flex>

          {/* Earth Switch */}
          <Flex justify="space-between" align="center">
            <Text fontSize="12px" color={labelColor} fontWeight={500}>
              Earth Switch:
            </Text>
            <Text fontSize="12px" fontWeight={500}>
              {data.earthSwitch}
            </Text>
          </Flex>

          {/* Mechanical Lock */}
          <Flex justify="space-between" align="center">
            <Text fontSize="12px" color={labelColor} fontWeight={500}>
              Mechanical Lock:
            </Text>
            <Badge
              bg="#C53030"
              color="white"
              px="6px"
              py="1px"
              fontSize="11px"
              fontWeight={600}
            >
              {data.mechanicalLock}
            </Badge>
          </Flex>

          {/* Position Feedback */}
          <Flex justify="space-between" align="center">
            <Text fontSize="12px" color={labelColor} fontWeight={500}>
              Position Feedback:
            </Text>
            <Badge
              bg={useColorModeValue("#F7FAFC", "#1A202C")}
              border={useColorModeValue(
                "1px solid #E2E8F0",
                "1px solid #4A5568"
              )}
              color={color}
              px="6px"
              py="1px"
              fontSize="11px"
              fontWeight={600}
            >
              {data.positionFeedback}
            </Badge>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
}
