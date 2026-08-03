import React from "react";
import { Box, HStack, Text, useColorModeValue } from "@chakra-ui/react";

interface Props {
  title: string;
  value: string;
  unit?: string;
  color?: string;
}

const StatCard: React.FC<Props> = ({
  title,
  value,
  unit,
  color,
}) => {
  const bg = useColorModeValue("white", "#0B2340");
  const border = `1px solid ${useColorModeValue("#E6EEF2", "#1C3557")}`;
  const titleColor = useColorModeValue("gray.700", "gray.400");
  const unitColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box bg={bg} border={border} borderRadius="10px" p={3} minW="120px">
      <Text fontSize="11px" color={titleColor}>
        {title}
      </Text>

      <HStack spacing={1} mt={1}>
        <Text fontSize="24px" fontWeight="700" color={color || useColorModeValue("gray.900", "white")}>
          {value}
        </Text>

        {unit && (
          <Text fontSize="12px" color={unitColor}>
            {unit}
          </Text>
        )}
      </HStack>
    </Box>
  );
};

export default StatCard;