import React from "react";
import {
  Box,
  Flex,
  Icon,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  FiCalendar,
  FiCheckCircle,
  FiLoader,
  FiClock,
} from "react-icons/fi";

const cards = [
  {
    label: "Scheduled",
    value: "08",
    icon: FiCalendar,
    color: "#2563EB",
  },
  {
    label: "Completed",
    value: "05",
    icon: FiCheckCircle,
    color: "#16A34A",
  },
  {
    label: "In Progress",
    value: "02",
    icon: FiLoader,
    color: "#0EA5E9",
  },
  {
    label: "Remaining",
    value: "01",
    icon: FiClock,
    color: "#F59E0B",
  },
];

const DSMSummaryToday = () => {
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
        DSM Summary (Today)
      </Text>

      <SimpleGrid columns={4} spacing={3}>
        {cards.map((item) => (
          <Flex
            key={item.label}
            direction="column"
            align="center"
            justify="center"
          >
            <Flex
              w="38px"
              h="38px"
              borderRadius="full"
              border="2px solid"
              borderColor={item.color}
              align="center"
              justify="center"
              mb={2}
            >
              <Icon
                as={item.icon}
                boxSize={4}
                color={item.color}
              />
            </Flex>

            <Text
              fontSize="22px"
              fontWeight="700"
              color={text}
              lineHeight={1}
            >
              {item.value}
            </Text>

            <Text
              mt={1}
              fontSize="11px"
              color={sub}
              textAlign="center"
              lineHeight="1.2"
            >
              {item.label}
            </Text>
          </Flex>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default DSMSummaryToday;