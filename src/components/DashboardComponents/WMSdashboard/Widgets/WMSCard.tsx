import {
  Text,
  Flex,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

import CommonCard from "./CommonCard";

const WeatherCard = ({
  title,
  value,
  unit,
  min,
  max,
  icon,
}: any) => {
  const titleColor = useColorModeValue(
    "#2d3748",
    "#dbe7ff"
  );

  const valueColor = useColorModeValue(
    "#1a202c",
    "#7ec8ff"
  );

  const subColor = useColorModeValue(
    "#4a5568",
    "#c2d2ea"
  );

  return (
    <CommonCard>
      <Flex justify="space-between">
        <VStack align="start" spacing="4px">
          <Text color={titleColor} fontSize="14px">
            {title}
          </Text>

          <Text
            color={valueColor}
            fontWeight="700"
            fontSize="36px"
          >
            {value}

            <Text
              as="span"
              fontSize="16px"
              ml="4px"
            >
              {unit}
            </Text>
          </Text>
        </VStack>

        {icon}
      </Flex>

      <Flex justify="space-between" mt="10px">
        <Text color={subColor} fontSize="12px">
          Min: {min}
        </Text>

        <Text color={subColor} fontSize="12px">
          Max: {max}
        </Text>
      </Flex>
    </CommonCard>
  );
};

export default WeatherCard;