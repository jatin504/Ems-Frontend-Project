import React from "react";
import {
  Box,
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";

export default function CellVoltageStatistics() {
  const bg = useColorModeValue("#FFFFFF", "#071826");
  const border = useColorModeValue("#D8E2EC", "#18344B");
  const title = useColorModeValue("#0F172A", "#F8FAFC");
  const label = useColorModeValue("#64748B", "#8EA6BC");
  const value = useColorModeValue("#0F172A", "#FFFFFF");
  const success = useColorModeValue("#16A34A", "#22C55E");
  const warning = useColorModeValue("#B45309", "#F59E0B");

  return (
    <Box
      w="100%"
      h="100%"
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="8px"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      {/* Header */}
      <Box
        h="34px"
        px="12px"
        display="flex"
        alignItems="center"
        borderBottom="1px solid"
        borderColor={border}
        flexShrink={0}
      >
        <Text fontSize="13px" fontWeight="700" color={title}>
          Cell Voltage Statistics
        </Text>
      </Box>

      {/* Top Statistics */}
      <Grid
        templateColumns="repeat(3,1fr)"
        flex="1"
        borderBottom="1px solid"
        borderColor={border}
      >
        <GridItem>
          <VStack h="100%" justify="center" spacing="1px">
            <Text fontSize="10px" color={label}>
              Average
            </Text>

            <HStack spacing="6px" align="baseline">
              <Text fontWeight="700" fontSize="16px" color={value}>
                3.355
              </Text>
              <Text fontSize="11px" color={label}>
                V
              </Text>
            </HStack>
          </VStack>
        </GridItem>

        <GridItem borderLeft="1px solid" borderRight="1px solid" borderColor={border}>
          <VStack h="100%" justify="center" spacing="1px">
            <Text fontSize="10px" color={label}>
              Median
            </Text>

            <HStack spacing="6px" align="baseline">
              <Text fontWeight="700" fontSize="16px" color={value}>
                3.355
              </Text>
              <Text fontSize="11px" color={label}>
                V
              </Text>
            </HStack>
          </VStack>
        </GridItem>

        <GridItem>
          <VStack h="100%" justify="center" spacing="1px">
            <Text fontSize="10px" color={label}>
              Std Dev
            </Text>

            <HStack spacing="6px" align="baseline">
              <Text fontWeight="700" fontSize="16px" color={value}>
                4.2
              </Text>
              <Text fontSize="11px" color={label}>
                mV
              </Text>
            </HStack>
          </VStack>
        </GridItem>
      </Grid>

      {/* Bottom Statistics */}
      <Grid templateColumns="repeat(3,1fr)" flex="1">
        <GridItem borderRight="1px solid" borderColor={border}>
          <VStack h="100%" justify="center" spacing="1px">
            <Text fontSize="10px" color={label}>
              &gt; 3.360 V
            </Text>

            <Text fontSize="16px" fontWeight="700" color={value}>
              6
            </Text>

            <Text fontSize="11px" color={label}>
              (2.1%)
            </Text>
          </VStack>
        </GridItem>

        <GridItem borderRight="1px solid" borderColor={border}>
          <VStack h="100%" justify="center" spacing="1px">
            <Text fontSize="10px" color={label}>
              &lt; 3.350 V
            </Text>

            <Text fontSize="16px" fontWeight="700" color={value}>
              5
            </Text>

            <Text fontSize="11px" color={label}>
              (1.8%)
            </Text>
          </VStack>
        </GridItem>

        <GridItem>
          <VStack h="100%" justify="center" spacing="1px">
            <Text fontSize="10px" color={label}>
              Delta (Max-Min)
            </Text>

            <Text fontSize="16px" fontWeight="700" color={success}>
              18 mV
            </Text>

            <Text fontSize="11px" fontWeight="700" color={success}>
              Excellent
            </Text>
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  );
}