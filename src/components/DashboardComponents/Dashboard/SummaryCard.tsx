import {
  Box,
  Flex,
  Text,
  Circle,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import type { IconType } from "react-icons";

interface Props {
  title: string;
  value: string;
  unit: string;
  subtitle?: string;
  icon: IconType;
  color: string;
}

const SummaryCard = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  color,
}: Props) => {
  const bg = useColorModeValue("#FFFFFF", "#071827");
  const titleColor = useColorModeValue("gray.600", "gray.400");
  const valueColor = useColorModeValue("gray.900", "white");
  const unitColor = useColorModeValue("gray.600", "gray.300");
  const subtitleColor = useColorModeValue("gray.500", "gray.500");
  const borderColor = useColorModeValue("rgba(0, 0, 0, 0.06)", "rgba(255,255,255,.06)");

  return (
    <Box
      bg={bg}
      borderRadius="12px"
      px={4}
      py={3}
      h="72px"
      border={`1px solid ${borderColor}`}
      _hover={{
        borderColor: color,
        transition: ".25s",
      }}
    >
      <Flex align="center" gap={3}>
        <Circle
          size="36px"
          bg={`${color}22`}
          color={color}
        >
          <Icon size={18} />
        </Circle>

        <VStack align="start" spacing={0}>
          <Text
            fontSize="10px"
            color={titleColor}
            fontWeight="500"
          >
            {title}
          </Text>

          <Flex align="end" gap={1}>
            <Text
              color={valueColor}
              fontWeight="700"
              fontSize="24px"
              lineHeight={1}
            >
              {value}
            </Text>

            <Text
              color={unitColor}
              fontSize="11px"
              mb="3px"
            >
              {unit}
            </Text>
          </Flex>

          {subtitle && (
            <Text
              fontSize="9px"
              color={subtitleColor}
            >
              {subtitle}
            </Text>
          )}
        </VStack>
      </Flex>
    </Box>
  );
};

export default SummaryCard;