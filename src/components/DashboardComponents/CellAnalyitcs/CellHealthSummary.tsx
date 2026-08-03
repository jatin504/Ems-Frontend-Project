import React from "react";
import {
  Box,
  Flex,
  Progress,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const healthData = [
  {
    label: "Voltage Health",
    value: 92,
  },
  {
    label: "Temperature Health",
    value: 93,
  },
  {
    label: "IR Health",
    value: 90,
  },
  {
    label: "Consistency Score",
    value: 88,
  },
];

const CellHealthSummary = () => {
  const bg = useColorModeValue("#FFFFFF", "#071A2B");
  const border = useColorModeValue("#E2E8F0", "#14324B");
  const title = useColorModeValue("#1E293B", "#FFFFFF");
  const text = useColorModeValue("#475569", "#C7D2FE");

  return (
    <Box
      h="100%"
      w="100%"
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="10px"
      px="14px"
      py="12px"
    >
      <Text
        fontSize="13px"
        fontWeight="700"
        color={title}
        mb="16px"
      >
        Cell Health Indicators
      </Text>

      {healthData.map((item) => (
        <Flex
          key={item.label}
          align="center"
          mb="13px"
        >
          <Text
            flex="1"
            fontSize="11px"
            color={text}
          >
            {item.label}
          </Text>

          <Progress
            value={item.value}
            w="68px"
            h="6px"
            borderRadius="999px"
            bg="#334155"
            colorScheme="green"
            mx="10px"
          />

          <Text
            w="30px"
            textAlign="right"
            fontSize="11px"
            fontWeight="600"
            color={title}
          >
            {item.value}%
          </Text>
        </Flex>
      ))}
    </Box>
  );
};

export default CellHealthSummary;