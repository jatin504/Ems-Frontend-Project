import React from "react";
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";

const InfoRow: React.FC<{ left: string; right: string }> = ({ left, right }) => {
  const rowText = useColorModeValue("gray.800", "gray.100");

  return (
    <Flex justify="space-between" fontSize="13px" color={rowText} fontFamily="Poppins">
      <Text fontWeight="700">{left}</Text>
      <Text>{right}</Text>
    </Flex>
  );
};

export default InfoRow;