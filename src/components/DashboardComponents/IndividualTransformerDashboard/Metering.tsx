import { Box, Text, useColorModeValue } from "@chakra-ui/react";

/* GREY VALUE CELL (SEPARATE BOX LOOK) */
const ValueBox = ({ value }: { value: string }) => {
  const valueBoxBg = useColorModeValue("#CFCFCF", "#4A4A4A");
  const valueBoxShadow = useColorModeValue("#B0B0B0", "#666666");

  return (
    <Box
      bg={valueBoxBg}
      w="72px"
      h="20px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontSize="11px"
      borderRadius="4px"                     
      boxShadow={`inset 0 0 0 1px ${valueBoxShadow}`}
    >
      {value}
    </Box>
  );
};

export default function Metering() {
  const primaryBg = useColorModeValue("primary.light", "primary.dark");
  const primaryColor = useColorModeValue(
    "primaryText.light",
    "primaryText.dark"
  );
  const secondaryColor = useColorModeValue(
    "secondaryText.light",
    "secondaryText.dark"
  );

  return (
    <Box
      bg={primaryBg}
      rounded="12px"          
      p="16px"                
      width="480px"
      height="180px"
    >
      {/* ===== TITLE ===== */}
      <Text fontSize="11px" fontWeight="bold" mb="6px" color={primaryColor}>
        METERING
      </Text>

      {/* ===== COLUMN HEADER ===== */}
      <Box
        display="grid"
        gridTemplateColumns="130px 72px 72px 72px"
        columnGap="14px"
        alignItems="center"
        mb="6px"
      >
        <Box />
        <Text fontSize="11px" textAlign="center">
          R-PHASE
        </Text>
        <Text fontSize="11px" textAlign="center">
          Y-PHASE
        </Text>
        <Text fontSize="11px" textAlign="center">
          B-PHASE
        </Text>
      </Box>

      {/* ===== V L-L ===== */}
      <Box
        display="grid"
        gridTemplateColumns="130px 72px 72px 72px"
        columnGap="14px"
        alignItems="center"
        mb="4px"
      >
        <Text fontSize="11px">V L-L (KV)</Text>
        <ValueBox value="300" />
        <ValueBox value="305" />
        <ValueBox value="310" />
      </Box>

      {/* ===== I L ===== */}
      <Box
        display="grid"
        gridTemplateColumns="130px 72px 72px 72px"
        columnGap="14px"
        alignItems="center"
        mb="8px"
      >
        <Text fontSize="11px">I L (A)</Text>
        <ValueBox value="280" />
        <ValueBox value="280" />
        <ValueBox value="280" />
      </Box>

      {/* ===== BOTTOM ROWS ===== */}
      <Box
        display="grid"
        gridTemplateColumns="130px 72px 72px 72px"
        columnGap="14px"
        rowGap="6px"
        alignItems="center"
      >
        <Text fontSize="11px">P (MW)</Text>
        <ValueBox value="600" />
        <Box />
        <ValueBox value="0.1" />

        <Text fontSize="11px">Q (MVAR)</Text>
        <ValueBox value="-300" />
        <Box />
        <ValueBox value="49.5" />
      </Box>
    </Box>
  );
}
