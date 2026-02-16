import React from "react";
import { Box, Flex, Text, Heading, useColorModeValue } from "@chakra-ui/react";

const Row: React.FC<{
  title: string;
  value: string;
  subLeft: string;
  subRight: string;
  color?: string; // value color
}> = ({ title, value, subLeft, subRight, color = "#ffffff" }) => {
  // light mode: soft gray chip with subtle border; dark mode: your original
  const rowBg = useColorModeValue("#f1f5f9", "#0e141d");
  const rowBorder = useColorModeValue("#e5e7eb", "#1c2635");
  const titleColor = useColorModeValue("#0f172a", "gray.300");
  const subColor = useColorModeValue("#94a3b8", "gray.500");

  return (
    <Box
      w="328px"
      h="66px"
      bg={rowBg}
      border={`1px solid ${rowBorder}`}
      borderRadius="8px"
      p="12px"
    >
      <Flex align="center" justify="space-between" w="100%">
        <Box w="152px" h="21px" overflow="hidden">
          <Text
            fontFamily="'Poppins', sans-serif"
            fontWeight={400}
            fontStyle="normal"
            fontSize="14px"
            lineHeight="100%"
            letterSpacing="0"
            color={titleColor}
            noOfLines={1}
          >
            {title}
          </Text>
        </Box>

        <Box w="136px" h="43px" display="flex" flexDir="column" gap="4px">
          <Text
            textAlign="right"
            fontFamily="'Poppins', sans-serif"
            fontWeight={600}
            fontSize="16px"
            lineHeight="100%"
            color={color}
          >
            {value}
          </Text>
          <Flex justify="space-between" align="center">
            <Text
              fontFamily="'Poppins', sans-serif"
              fontWeight={400}
              fontSize="12px"
              lineHeight="100%"
              color={subColor}
            >
              {subLeft}
            </Text>
            <Text
              fontFamily="'Poppins', sans-serif"
              fontWeight={400}
              fontSize="12px"
              lineHeight="100%"
              color={subColor}
            >
              {subRight}
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

const TemperatureCards: React.FC = () => {
  const cardBg = useColorModeValue("#ffffff", "#161B1B");
  const cardBorder = useColorModeValue("#e5e7eb", "#1c2635");
  const headingColor = useColorModeValue("#0f172a", "gray.300");

  return (
    <Box w="360px" h="302px" flex="0 0 auto">
      <Box
        bg={cardBg}
        borderRadius="lg"
        p={4}
        border={`1px solid ${cardBorder}`}
        h="100%"
        display="flex"
        flexDirection="column"
        gap="16px"
      >
        <Heading
          as="h3"
          size="sm"
          color={headingColor}
          mb={1}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <span>Temperatures</span>
        </Heading>
        <Row
          title="Max. Module temp"
          value="35.61 °C"
          subLeft="String ID 6"
          subRight="Module 5"
          color="#ff7a45"
        />
        <Row
          title="Min. Module temp"
          value="32.86 °C"
          subLeft="String ID 7"
          subRight="Module 2"
          color="#3b82f6"
        />
        <Row
          title="Average Module temp"
          value="34.20 °C"
          subLeft="String ID 7"
          subRight="Module 2"
          color="#a855f7"
        />
      </Box>
    </Box>
  );
};

export default TemperatureCards;
