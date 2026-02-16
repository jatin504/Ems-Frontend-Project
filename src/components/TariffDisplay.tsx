import { Box, Text, VStack, HStack, Badge } from "@chakra-ui/react";

interface TariffDisplayProps {
  state: string;                 // e.g. "West Bengal"
  tariff: number | string;       // e.g. 6.5
  tariffType: string;            // e.g. "Peak" | "Off-peak" | "Mid-peak" | "TOD-Slot A"
  startTime?: string;            // e.g. "18:00"
  endTime?: string;              // e.g. "22:00"
  lastUpdatedISO?: string;       // optional ISO string to show "Last updated"
}

export default function TariffDisplay({
  state,
  tariff,
  tariffType,
  startTime,
  endTime,
  lastUpdatedISO,
}: TariffDisplayProps) {
  // Simple color logic for the tariff type chip
  const getTypeColor = (t: string) => {
    const key = t.toLowerCase();
    if (key.includes("peak") && !key.includes("off")) return "red";
    if (key.includes("off")) return "green";
    if (key.includes("mid")) return "orange";
    return "teal";
  };

  const typeColor = getTypeColor(tariffType);

  // Format time window
  const timeWindow =
    startTime && endTime ? `${startTime} – ${endTime}` : "—";

  // Optional last updated text
  const lastUpdatedText = lastUpdatedISO
    ? new Date(lastUpdatedISO).toLocaleString()
    : undefined;

  return (
    <Box
      bgGradient="linear(to-br, gray.800, gray.700)"
      borderRadius="2xl"
      boxShadow="lg"
      p={5}
      textAlign="center"
      h="260px"
      ml="-15px"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      border="2px solid"
      borderColor="teal.400"
    >
      {/* Title */}
      <Text
        fontSize="lg"
        fontWeight="bold"
        color="teal.300"
        textTransform="uppercase"
        letterSpacing="wide"
      >
        Tariff  {state}
      </Text>

      {/* Tariff Type + Time Block */}
      <VStack spacing={3}>
        {/* Type chip */}
        <Badge
          variant="subtle"
          colorScheme={typeColor}
          fontSize="0.85rem"
          px={3}
          py={1}
          borderRadius="full"
          textTransform="none"
        >
          {tariffType} tariff
        </Badge>

        {/* Time window block */}
        <HStack
          spacing={3}
          bg="gray.900"
          borderRadius="xl"
          px={4}
          py={3}
          border="1px solid"
          borderColor="gray.600"
        >
          <Text fontSize="md" color="gray.300" as="span">
             Time
          </Text>
          <Text fontSize="md" color="white" fontWeight="semibold" as="span">
            {timeWindow}
          </Text>
        </HStack>
      </VStack>

      {/* Value block */}
      <VStack
        bg="gray.900"
        borderRadius="xl"
        p={5}
        spacing={0}
        border="1px solid"
        borderColor={`${typeColor}.500`}
        boxShadow="md"
      >
        <Text fontSize="5xl" fontWeight="extrabold" color="white" lineHeight="1">
          {tariff}
        </Text>
        <Text fontSize="md" color="gray.300">
          ₹/kWh
        </Text>
      </VStack>

      {/* Last updated (optional) */}
      {/* {lastUpdatedText && (
        <Text fontSize="xs" color="gray.400" mt={2}>
          Last updated: {lastUpdatedText}
        </Text>
      )} */}
    </Box>
  );
}
