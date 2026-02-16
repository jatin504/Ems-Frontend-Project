import React from "react";
import { Box, Text, Grid, Flex, useColorModeValue } from "@chakra-ui/react";

const StatusSection: React.FC = () => {
  const cardBg = useColorModeValue("white", "#161B1B");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const sectionTitle = useColorModeValue("gray.800", "gray.100");
  const labelMuted = useColorModeValue("gray.600", "gray.300");

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius="8px"
      p={3}
      gridColumn={{ base: "1 / -1", md: "1 / 3" }}
      alignSelf="flex-start"
      minH="72px"
    >
      <Text
        fontSize="14px"
        fontWeight="700"
        mb={1.5}
        color={sectionTitle}
        fontFamily="Poppins"
        bg={useColorModeValue(undefined, "#161B1B")}
        px={2}
        py={1}
        borderRadius="6px"
      >
        Status
      </Text>

      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
        gap={2}                    
      >
        {[
          "AC Breaker",
          "GFDI Relay",
          "DC Breaker 1",
          "DC Breaker 2",
          "DC Breaker 3",
        ].map((label) => (
          <Flex key={label} align="center">
            <Box
              w="20px"
              h="8px"
              bg="green.500"
              borderRadius="2px"
              mr={2}
            />
            <Text
              fontSize="13px"
              color={sectionTitle}
              fontFamily="Poppins"
              noOfLines={1}
            >
              {label}
            </Text>
          </Flex>
        ))}
      </Grid>
    </Box>
  );
};

export default StatusSection;
