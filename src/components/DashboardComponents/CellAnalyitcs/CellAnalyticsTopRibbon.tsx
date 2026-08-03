import React from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";

const data = [
  {
    title: "Total Cells",
    value: "280",
    color: "",
    sub: "",
  },
  {
    title: "Cells Online",
    value: "● 278",
    color: "#22C55E",
    sub: "(99.3%)",
  },
  {
    title: "Cells Balancing",
    value: "● 4",
    color: "#F59E0B",
    sub: "(1.4%)",
  },
  {
    title: "Cells Offline",
    value: "● 2",
    color: "#CBD5E1",
    sub: "(0.7%)",
  },
  {
    title: "Max Cell Voltage",
    value: "3.365 V",
    color: "#EF4444",
    sub: "Cell 023",
  },
  {
    title: "Min Cell Voltage",
    value: "3.347 V",
    color: "#38BDF8",
    sub: "Cell 198",
  },
  {
    title: "Voltage Delta",
    value: "18 mV",
    color: "#22C55E",
    sub: "Excellent",
  },
  {
    title: "Max Cell Temp.",
    value: "44.83 °C",
    color: "#EF4444",
    sub: "Cell 021",
  },
  {
    title: "Min Cell Temp.",
    value: "30.25 °C",
    color: "#38BDF8",
    sub: "Cell 167",
  },
  {
    title: "Temp. Delta",
    value: "14.58 °C",
    color: "#22C55E",
    sub: "Good",
  },
];

export default function CellAnalyticsTopRibbon() {
  const bg = useColorModeValue("#FFFFFF", "#071826");

  const border = useColorModeValue("#E2E8F0", "#15344D");

  const heading = useColorModeValue("#64748B", "#8FA8BF");

  const value = useColorModeValue("#0F172A", "#FFFFFF");

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="10px"
      overflow="hidden"
      w="100%"
    >
      <HStack spacing={0} align="stretch">
        {data.map((item, index) => (
          <React.Fragment key={item.title}>
            <VStack
              flex={1}
              align="center"
              spacing="2px"
              px="14px"
              py="8px"
              minH="64px"
              justify="center"
            >
              <Text
                fontSize="10px"
                color={heading}
                fontWeight="500"
                textAlign="center"
              >
                {item.title}
              </Text>

              <Text
                fontSize="18px"
                fontWeight="700"
                color={item.color || value}
                lineHeight="18px"
                textAlign="center"
              >
                {item.value}

                {item.sub &&
                  (item.sub.startsWith("(") ? (
                    <Text
                      as="span"
                      ml="4px"
                      fontSize="11px"
                      fontWeight="500"
                      color={heading}
                    >
                      {item.sub}
                    </Text>
                  ) : null)}
              </Text>

              {item.sub && !item.sub.startsWith("(") && (
                <Text
                  fontSize="10px"
                  fontWeight="600"
                  color={item.color}
                  textAlign="center"
                >
                  {item.sub}
                </Text>
              )}
            </VStack>

            {index !== data.length - 1 && (
              <Divider
                orientation="vertical"
                borderColor={border}
                h="64px"
              />
            )}
          </React.Fragment>
        ))}
      </HStack>
    </Box>
  );
}