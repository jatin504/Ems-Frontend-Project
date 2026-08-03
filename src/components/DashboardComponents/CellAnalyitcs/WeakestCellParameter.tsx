import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Divider,
  HStack,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

const WeakestCellParameter = () => {
  const bg = useColorModeValue("#FFFFFF", "#071A2B");
  const border = useColorModeValue("#E2E8F0", "#14324B");
  const title = useColorModeValue("#1E293B", "#FFFFFF");
  const text = useColorModeValue("#64748B", "#94A3B8");

  const score = 91;

  return (
    <Box
      w="100%"
      h="100%"
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="10px"
      px="14px"
      py="12px"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      justifyContent="space-between"
    >
      <Text
        fontSize="15px"
        fontWeight="700"
        color="#000000"
        mb="10px"
      >
        Overall Health Score
      </Text>

      <VStack spacing={3} flex="1" minH="0" overflow="hidden">
        <CircularProgress
          value={score}
          size="84px"
          thickness="9px"
          color="#7AC943"
          trackColor="#334155"
        >
          <CircularProgressLabel>
            <Text
              fontSize="30px"
              fontWeight="700"
              color={title}
              lineHeight="26px"
            >
              {score}
            </Text>

            <Text
              fontSize="11px"
              color={text}
            >
              /100
            </Text>
          </CircularProgressLabel>
        </CircularProgress>

        <HStack spacing={1}>
          <CheckCircleIcon
            color="#7AC943"
            boxSize={4}
          />

          <Text
            color="#7AC943"
            fontSize="15px"
            fontWeight="600"
          >
            Good
          </Text>
        </HStack>
      </VStack>

      <Divider borderColor={border} mb="10px" />

      <Box mb="12px">
        <Text
          fontSize="11px"
          color={text}
          mb="2px"
        >
          Weakest Parameter:
        </Text>

        <Text
          fontSize="12px"
          fontWeight="700"
          color="#F59E0B"
        >
          Internal Resistance
        </Text>
      </Box>

      <Button
        size="sm"
        variant="outline"
        borderColor={border}
        color={text}
        _hover={{
          bg: useColorModeValue("#F8FAFC", "#0B2236"),
        }}
      >
        View Cell Report
      </Button>
    </Box>
  );
};

export default WeakestCellParameter;