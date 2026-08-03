import React from "react";
import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const ModelHealth = () => {
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
        mb={3}
      >
        Model Health
      </Text>

      <Flex
        direction="column"
        align="center"
        justify="center"
        h="calc(100% - 32px)"
      >
        <CircularProgress
          value={94}
          size="90px"
          thickness="8px"
          color="#22C55E"
          trackColor={useColorModeValue("#E5E7EB", "#2A2A2A")}
        >
          <CircularProgressLabel>
            <Text
              fontSize="22px"
              fontWeight="700"
              color={text}
              lineHeight="1"
            >
              94%
            </Text>
          </CircularProgressLabel>
        </CircularProgress>

        <Text
          mt={4}
          fontSize="11px"
          color={sub}
          textAlign="center"
        >
          Last Trained
        </Text>

        <Text
          mt={1}
          fontSize="12px"
          color={text}
          fontWeight="600"
          textAlign="center"
        >
          13 Jul 2026 07:15 AM
        </Text>

        <Link
          mt={3}
          fontSize="12px"
          color="#3B82F6"
          fontWeight="600"
        >
          View Details
        </Link>
      </Flex>
    </Box>
  );
};

export default ModelHealth;