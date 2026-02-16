import React from "react";
import { Box, VStack, HStack, Text, useColorModeValue } from "@chakra-ui/react";

const RowMean = ({ label, value }: { label: string; value: string }) => {
  const textMuted   = useColorModeValue("gray.600", "#A6B0B0");
  const textPrimary = useColorModeValue("gray.800", "#E8ECEC");
  return (
    <HStack justify="space-between" w="full">
      <Text fontSize="xs" color={textMuted}>{label}</Text>
      <Text fontSize="sm" color={textPrimary} fontWeight="semibold">{value}</Text>
    </HStack>
  );
};

const RowPQ = ({ label, p, q }: { label: string; p: string; q: string }) => {
  const textMuted   = useColorModeValue("gray.600", "#A6B0B0");
  const textPrimary = useColorModeValue("gray.800", "#E8ECEC");
  return (
    <HStack justify="space-between" w="full">
      <Text fontSize="xs" color={textMuted} w="40%">{label}</Text>
      <Text fontSize="sm" color={textPrimary} fontWeight="semibold" w="30%" textAlign="right">{p}</Text>
      <Text fontSize="sm" color={textPrimary} fontWeight="semibold" w="30%" textAlign="right">{q}</Text>
    </HStack>
  );
};

export default function MeanAndPQ() {
  const cardBg     = useColorModeValue("white", "#161B1B");
  const cardBorder = useColorModeValue("gray.200", "#202525");
  const textMuted  = useColorModeValue("gray.600", "#A6B0B0");
  const colHead    = useColorModeValue("gray.500", "#A6B0B0");
  const dividerCol = cardBorder;

  return (
    <VStack spacing="20px" align="stretch" w="332px" h="260px" opacity={1}>
      {/* Mean values (115px high) */}
      <Box bg={cardBg} border="1px solid" borderColor={cardBorder} borderRadius="12px" w="full" h="115px" p="16px">
        <VStack align="stretch" spacing="10px">
          <Text
            w="103px"
            h="24px"
            color={useColorModeValue("#000000", "#FFFFFF")}
            fontFamily="Poppins, sans-serif"
            fontWeight={700}
            fontStyle="normal"
            fontSize="16px"
            lineHeight="100%"
            letterSpacing="0"
            opacity={1}
          >
            Mean values
          </Text>
          <RowMean label="Mean Read Delay"  value="2.2 ms" />
          <RowMean label="Mean Write Delay" value="2.75 ms" />
        </VStack>
      </Box>

      {/* P & Q (125px high) */}
      <Box
        bg={cardBg}
        border="1px solid"
        borderColor={cardBorder}
        borderRadius="12px"
        w="full"
        h="125px"
        pt="10px"
        pr="16px"
        pb="10px"
        pl="16px"
      >
        <VStack align="stretch" spacing="6px">
          <Text
            w="43px"
            h="24px"
            color={useColorModeValue("#000000", "#FFFFFF")}
            fontFamily="Poppins, sans-serif"
            fontWeight={700}
            fontStyle="normal"
            fontSize="16px"
            lineHeight="100%"
            letterSpacing="0"
            opacity={1}
          >
           P&Q
          </Text>

          {/* Header row with two individual dividers under P and Q */}
          <HStack w="full" justify="space-between" align="end" mb="4px">
            <Box w="40%" /> {/* empty left col header */}
            <VStack w="30%" align="stretch" spacing="4px">
              <Text fontSize="xs" color={colHead} textAlign="right">P (MW)</Text>
              <Box h="1px" bg={dividerCol} /> {/* divider under P */}
            </VStack>
            <VStack w="30%" align="stretch" spacing="4px">
              <Text fontSize="xs" color={colHead} textAlign="right">Q (MVAr)</Text>
              <Box h="1px" bg={dividerCol} /> {/* divider under Q */}
            </VStack>
          </HStack>

          <RowPQ label="Available"  p="2.2" q="2.2" />
          <RowPQ label="Dispatched" p="2.2" q="2.2" />
        </VStack>
      </Box>
    </VStack>
  );
}
