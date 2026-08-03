import React from "react";
import {
  Box,
  Divider,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const CostImpactToday = () => {
  const bg = useColorModeValue("white", "#151716");
  const border = useColorModeValue("#E5E7EB", "#2A2A2A");
  const text = useColorModeValue("#111827", "white");
  const sub = useColorModeValue("#64748B", "#A1A1AA");

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="12px"
      h="100%"
      p={3}
    >
      <Text
        fontSize="15px"
        fontWeight="700"
        color={text}
        mb={4}
      >
        Cost Impact (Today)
      </Text>

      <Flex justify="space-between" mb={3}>
        <Box>
          <Text fontSize="11px" color={sub}>
            Actual Cost
          </Text>

          <Text
            mt={1}
            fontSize="20px"
            fontWeight="700"
            color={text}
          >
            ₹1,24,570
          </Text>
        </Box>

        <Box textAlign="right">
          <Text fontSize="11px" color={sub}>
            Without DSM
          </Text>

          <Text
            mt={1}
            fontSize="20px"
            fontWeight="700"
            color={text}
          >
            ₹1,67,820
          </Text>
        </Box>
      </Flex>

      <Divider mb={3} />

      <Flex
        justify="space-between"
        align="baseline"
        gap={2}
      >
        <Text
          fontSize="12px"
          color={sub}
        >
          Savings
        </Text>

        <Flex align="baseline" gap={1}>
          <Text
            fontSize="24px"
            fontWeight="700"
            color="#16A34A"
          >
            ₹43,250
          </Text>

          <Text
            fontSize="12px"
            color="#16A34A"
            fontWeight="600"
          >
            (25.8%)
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default CostImpactToday;