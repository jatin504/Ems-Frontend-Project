import { Box, Text, SimpleGrid, useColorModeValue } from "@chakra-ui/react";

const GreyTag = ({ label }: { label: string }) => (
  <Box
    bg="gray.500"
    border="1px solid"
    borderColor="gray.500"
    borderRadius="3px"
    textAlign="center"
    fontSize="12px"
    py="4px"
    color="white"
  >
    {label}
  </Box>
);

export default function TripRelayReset() {
  const primaryBg = useColorModeValue("primary.light", "primary.dark");

  const primaryColor = useColorModeValue(
    "primaryText.light",
    "primaryText.dark"
  );

  return (
    <Box
      bg={primaryBg}
      rounded="12px"
      p="16px"
      width="260px"
      height="120px"
    >
      <Text
        fontSize="11px"
        fontWeight="bold"
        mb="6px"
        color={primaryColor}
      >
        TRIP RELAY RESET
      </Text>

      <SimpleGrid columns={2} spacing="10px">
        <GreyTag label="86A" />
        <GreyTag label="86B" />
        <GreyTag label="96" />
        <GreyTag label="86UF1" />
      </SimpleGrid>
    </Box>
  );
}