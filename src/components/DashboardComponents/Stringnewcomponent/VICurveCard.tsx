import React from "react";
import {
  Box,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const VICurveCard = () => {
  const bg = useColorModeValue("#ffffff", "#0F2235");
  const border = useColorModeValue("#E6EEF6", "#1F3B56");
  const text = useColorModeValue("gray.800", "white");
  const sub = useColorModeValue("#5A6B78", "#8FA8C0");

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="12px"
      p={4}
    >
      <Text color={text} fontWeight="700" fontSize="13px" mb={4}>
        VI CURVE (PLANT AVG.)
      </Text>

      <Box
        h="180px"
        borderRadius="10px"
        bg={useColorModeValue("#EDF2F7", "#13283C")}
      />

      <Flex justify="space-between" mt={4}>
        <Box>
          <Text color={sub} fontSize="11px">
            Vmpp
          </Text>

          <Text color={text}>781 V</Text>
        </Box>

        <Box>
          <Text color={sub} fontSize="11px">
            Impp
          </Text>

          <Text color={text}>10.2 A</Text>
        </Box>

        <Box>
          <Text color={sub} fontSize="11px">
            Pmpp
          </Text>

          <Text color={text}>7.95 kW</Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default VICurveCard;