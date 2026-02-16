import React from "react";
import { Box, Grid, Text, Flex, useColorModeValue } from "@chakra-ui/react";

export default function StringGrid() {
  // Each tile now shows Amps, Voltage, Current
  const TILE_LABELS = [
    { label: "S02.M01", amps: 12.3, voltage: 685, current: 9.6 },
    { label: "S02.M02", amps: 11.8, voltage: 682, current: 9.2 },
    { label: "S02.M03", amps: 13.1, voltage: 688, current: 10.1 },
    { label: "S02.M04", amps: 12.7, voltage: 684, current: 9.8 },
  ];

  const cardBg = useColorModeValue("#ffffff", "#161B1B");
  const cardBorder = useColorModeValue("#e5e7eb", "#1c2635");
  const headingColor = useColorModeValue("#0f172a", "#ffffff");

  const tileBg = useColorModeValue("#ffffff", "#242929");
  const tileBorder = useColorModeValue("#e5e7eb", "#1c2635");
  const tileLabel = useColorModeValue("#0f172a", "#ffffff");

  const innerBg = useColorModeValue("#f1f5f9", "#3B4044");
  const innerBorder = useColorModeValue("#e5e7eb", "#30363b");

  return (
    <Box
      w="496.6667px"
      h="302.4175px"
      bg={cardBg}
      border={`1px solid ${cardBorder}`}
      borderRadius="12px"
      p="16px"
      display="flex"
      flexDirection="column"
      gap="16px"
    >
      {/* Header */}
      <Flex justify="space-between" align="center" width="100%">
        <Text fontSize="14px" fontWeight="600" color={headingColor}>
          String
        </Text>
        <Text fontSize="14px" fontWeight="600" color={headingColor}>
          BK1.S02
        </Text>
      </Flex>

      {/* 2 × 2 tiles */}
      <Grid
        templateColumns="repeat(2, 1fr)"
        autoRows="1fr"
        gap="16px"
        flex="1"
        width="100%"
      >
        {TILE_LABELS.map((t) => (
          <Box
            key={t.label}
            bg={tileBg}
            border={`1px solid ${tileBorder}`}
            borderRadius="8px"
            p="12px"
            display="flex"
            flexDirection="column"
            gap="8px"
          >
            <Text color={tileLabel} fontSize="14px" fontWeight="500">
              {t.label}
            </Text>

            {/* Show three tags: Amps, Voltage, Current */}
            <Box
              flex="1"
              borderRadius="8px"
              bg={innerBg}
              border={`1px solid ${innerBorder}`}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="row"
              gap="10px"
            >
              <Box textAlign="center">
                <Text fontSize="12px" color="gray.500">Amps</Text>
                <Flex align="baseline" gap="2px" justify="center">
                  <Text fontSize="16px" fontWeight="600">{t.amps}</Text>
                  <Text fontSize="10px" color="gray.600">A</Text>
                </Flex>
              </Box>
              <Box textAlign="center">
                <Text fontSize="12px" color="gray.500">Voltage</Text>
                <Flex align="baseline" gap="2px" justify="center">
                  <Text fontSize="16px" fontWeight="600">{t.voltage}</Text>
                  <Text fontSize="10px" color="gray.600">V</Text>
                </Flex>
              </Box>
              <Box textAlign="center">
                <Text fontSize="12px" color="gray.500">Current</Text>
                <Flex align="baseline" gap="2px" justify="center">
                  <Text fontSize="16px" fontWeight="600">{t.current}</Text>
                  <Text fontSize="10px" color="gray.600">A</Text>
                </Flex>
              </Box>
            </Box>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
