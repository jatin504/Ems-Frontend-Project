import { Box, Text, useColorModeValue } from "@chakra-ui/react";

const GreyBox = () => {
  const greyBoxBg = useColorModeValue("#D3D3D3", "#4A4A4A");
  return (
    <Box
      bg={greyBoxBg}
      w="70px"
      h="16px"
    />
  );
};

export default function SynchroCheck() {
  const primaryBg = useColorModeValue("primary.light", "primary.dark");
  const primaryColor = useColorModeValue("primaryText.light", "primaryText.dark");
  return (
    <Box
      bg={primaryBg}
      px="6px"
      py="4px"
      width="230px"
      height="180px"
    >
      <Text
        fontSize="11px"
        fontWeight="bold"
        mb="6px"
        color={primaryColor}
      >
        SYNCHRO-CHECK
      </Text>

      <Box
        display="grid"
        gridTemplateColumns="1fr auto"
        rowGap="6px"
        fontSize="11px"
        alignItems="center"
      >
        <Text>TAP POS</Text>
        <GreyBox />

        <Text>WTI HV</Text>
        <GreyBox />

        <Text>WTI LV</Text>
        <GreyBox />

        <Text>OTI (TRFR)</Text>
        <GreyBox />

        <Text>OTI OLTC</Text>
        <GreyBox />
      </Box>
    </Box>
  );
}
