import { Box, Text, Grid, useColorModeValue } from "@chakra-ui/react";

const Row = ({ label }: { label: string }) => {
  const rowBoxBg = useColorModeValue("#D3D3D3", "#4A4A4A");

  return (
    <>
      <Text fontSize="11px">{label}</Text>

      <Box
        bg={rowBoxBg}
        fontSize="11px"
        textAlign="right"
        px="6px"
        borderRadius="4px"
        minH="20px"
      />
    </>
  );
};

export default function SynchroCheckValues() {
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
      height="170px"
    >
      <Text
        fontSize="11px"
        fontWeight="bold"
        mb="6px"
        color={primaryColor}
      >
        SYNCHRO-CHECK
      </Text>

      <Grid templateColumns="1fr 60px" rowGap="4px">
        <Row label="INCOMING SUPPLY" />
        <Row label="SELECTED SUPPLY" />
        <Row label="VOLTAGE DIFF" />
        <Row label="FREQUENCY DIFF" />
      </Grid>
    </Box>
  );
}