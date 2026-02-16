import React from "react";
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";

interface ExactTempGaugeProps {
  title: string;
  value?: number;
}

const MAX_VALUE = 1000;

const ExactTempGauge: React.FC<ExactTempGaugeProps> = ({ title, value }) => {
  const titleColor = useColorModeValue("gray.800", "gray.100");
  const textColor = useColorModeValue("gray.700", "gray.200");

  const isValid = typeof value === "number" && !Number.isNaN(value);
  const safeValue = isValid ? value : 0;

  const percent = Math.max(
    0,
    Math.min(100, (safeValue / MAX_VALUE) * 100)
  );

  return (
    <Box textAlign="center">
      <Text fontSize="11px" fontWeight="600" color={titleColor}>
        {title}
      </Text>

      <Text fontSize="10px" mt={1} color={textColor}>
        {isValid ? safeValue.toFixed(1) : "--"}
      </Text>

      <Flex mt={2} justify="center" align="flex-end">
        <Box
          h="80px"
          mr={2}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          {["1000", "500", "0"].map((label) => (
            <Flex key={label} align="center">
              <Text fontSize="9px" mr={1}>
                {label}
              </Text>
              <Box w="8px" h="1px" bg="black" />
            </Flex>
          ))}
        </Box>

        <Flex align="center">
          <Box
            position="relative"
            w="34px"
            h="80px"
            border="1px solid"
            borderColor="black"
            bg="white"
            overflow="hidden"
          >
            <Box
              position="absolute"
              bottom={0}
              w="100%"
              h={`${percent}%`}
              bgGradient="linear(to-t, green.400, green.600)"
            />

            <Box
              position="absolute"
              top={0}
              w="100%"
              h={`${100 - percent}%`}
              bg="black"
            />
          </Box>

          <Text fontSize="10px" ml={2} color={textColor}>
            {isValid ? `${safeValue.toFixed(1)}` : "--"}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default ExactTempGauge;
