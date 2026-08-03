import React from "react";
import {
  Box,
  Grid,
  GridItem,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

export default function CellTemperatureStatistics() {
  const bg = useColorModeValue("#FFFFFF", "#071826");
  const border = useColorModeValue("#D8E2EC", "#18344B");

  const title = useColorModeValue("#0F172A", "#F8FAFC");
  const label = useColorModeValue("#64748B", "#8EA6BC");
  const value = useColorModeValue("#0F172A", "#FFFFFF");

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
        <Text
          fontSize="13px"
          fontWeight="700"
          color={title}
        >
          Cell Temperature Statistics
        </Text>
      </Box>

      {/* Top */}
      <Grid
        templateColumns="repeat(3,1fr)"
        h="58px"
        borderBottom="1px solid"
        borderColor={border}
        flexShrink={0}
      >
        <GridItem>
          <VStack
            h="100%"
            justify="center"
            spacing="1px"
          >
            <Text fontSize="10px" color={label}>
              Average
            </Text>

            <Text
              fontSize="16px"
              fontWeight="700"
              color={value}
            >
              37.25
            </Text>

            <Text
              fontSize="11px"
              color={label}
            >
              °C
            </Text>
          </VStack>
        </GridItem>

        <GridItem
          borderLeft="1px solid"
          borderRight="1px solid"
          borderColor={border}
        >
          <VStack
            h="100%"
            justify="center"
            spacing="1px"
          >
            <Text fontSize="10px" color={label}>
              Median
            </Text>

            <Text
              fontSize="16px"
              fontWeight="700"
              color={value}
            >
              36.80
            </Text>

            <Text
              fontSize="11px"
              color={label}
            >
              °C
            </Text>
          </VStack>
        </GridItem>

        <GridItem>
          <VStack
            h="100%"
            justify="center"
            spacing="1px"
          >
            <Text fontSize="10px" color={label}>
              Std Dev
            </Text>

            <Text
              fontSize="16px"
              fontWeight="700"
              color={value}
            >
              2.85
            </Text>

            <Text
              fontSize="11px"
              color={label}
            >
              °C
            </Text>
          </VStack>
        </GridItem>
      </Grid>

      {/* Bottom */}
      <Grid
        templateColumns="repeat(3,1fr)"
        flex="1"
        minH={0}
      >
        <GridItem
          borderRight="1px solid"
          borderColor={border}
        >
          <VStack
            h="100%"
            justify="center"
            spacing="1px"
            px="4px"
          >
            <Text
              fontSize="10px"
              color={label}
            >
              &gt; 45.0 °C
            </Text>

            <Text
              fontSize="16px"
              fontWeight="700"
              color={value}
            >
              1
            </Text>

            <Text
              fontSize="11px"
              color={label}
            >
              (0.4%)
            </Text>
          </VStack>
        </GridItem>

        <GridItem
          borderRight="1px solid"
          borderColor={border}
        >
          <VStack
            h="100%"
            justify="center"
            spacing="1px"
            px="4px"
          >
            <Text
              fontSize="10px"
              color={label}
            >
              &lt; 30.0 °C
            </Text>

            <Text
              fontSize="16px"
              fontWeight="700"
              color={value}
            >
              0
            </Text>

            <Text
              fontSize="11px"
              color={label}
            >
              (0%)
            </Text>
          </VStack>
        </GridItem>

        <GridItem>
          <VStack
            h="100%"
            justify="center"
            spacing="1px"
            px="4px"
          >
            <Text
              fontSize="10px"
              color={label}
            >
              Delta (Max-Min)
            </Text>

            <Text
              fontSize="16px"
              fontWeight="700"
              color="#22C55E"
            >
              14.58 °C
            </Text>

            <Text
              fontSize="11px"
              fontWeight="700"
              color="#22C55E"
            >
              Good
            </Text>
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  );
}