import React from "react";
import { Box, Flex, Text, Heading, useColorModeValue } from "@chakra-ui/react";

const Row: React.FC<{
  title: string;
  value: string;
  subLeft: string;
  subRight: string;
  color?: string; 
}> = ({ title, value, subLeft, subRight, color = "#ffffff" }) => {
  const rowBg = useColorModeValue("#F5F7F8", "#242929");
  const rowBorder = useColorModeValue("#e5e7eb", "#1c2635");
  const titleColor = useColorModeValue("#0f172a", "gray.300");
  const subColor = useColorModeValue("#94a3b8", "gray.500");

  return (
    <Box
      w="100%"
      h="66px"
      bg={rowBg}
      border={`1px solid ${rowBorder}`}
      borderRadius="8px"
      p="12px"
    >
      <Flex align="center" justify="space-between" w="100%" gap="12px">
        {/* Title */}
        <Box flex="1" minW={0}>
          <Text
            fontFamily="'Poppins', sans-serif"
            fontWeight={400}
            fontSize="14px"
            lineHeight="100%"
            color={titleColor}
            noOfLines={1}
          >
            {title}
          </Text>
        </Box>

        {/* Value + subs (right) */}
        <Box
          flex="0 0 auto"
          display="flex"
          flexDir="column"
          alignItems="flex-end"
          gap="4px"
          minW={0}
        >
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

          {/* ---- ONE ROW LAYOUT (exact spec) ----
               width: 136px; height: 18px; gap: 20px; right-aligned */}
          <Flex
            w="136px"
            h="18px"
            align="center"
            justify="flex-end"
            gap="20px"
            ml="auto"
          >
            <Text
              fontFamily="'Poppins', sans-serif"
              fontWeight={400}
              fontSize="12px"
              lineHeight="18px"
              color={subColor}
              whiteSpace="nowrap"
              noOfLines={1}
              minW={0}
            >
              {subLeft}
            </Text>
            <Text
              fontFamily="'Poppins', sans-serif"
              fontWeight={400}
              fontSize="12px"
              lineHeight="18px"
              color={subColor}
              whiteSpace="nowrap"
              noOfLines={1}
              minW={0}
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
    <Box w="496.666656px" h="302px" flex="0 0 auto">
      <Box
        bg={cardBg}
        borderRadius="12px"
        p="16px"
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
          color="#F17A4B"
        />
        <Row
          title="Min. Module temp"
          value="32.86 °C"
          subLeft="String ID 7"
          subRight="Module 2"
          color="#599EF5"
        />
        <Row
          title="Average Module temp"
          value="34.20 °C"
          subLeft="String ID 7"
          subRight="Module 2"
          color="#D19CFF"
        />
      </Box>
    </Box>
  );
};

export default TemperatureCards;
