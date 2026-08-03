import {
  Box,
  Flex,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  WarningTwoIcon,
  InfoOutlineIcon,
} from "@chakra-ui/icons";

import CommonCard from "./CommonCard";

// Alerts will be fetched from backend/event service; placeholder empty list
const alerts: any[] = [];

const AlertsEvents = () => {
  const bg = useColorModeValue(
    "#ffffff",
    "linear-gradient(180deg,#07182d 0%, #0a2140 100%)"
  );

  const border = useColorModeValue(
    "#d9e2ef",
    "#16365f"
  );

  const title = useColorModeValue(
    "#1a202c",
    "#dce8ff"
  );

  const divider = useColorModeValue(
    "#d9e2ef",
    "#1f436a"
  );

  const timeColor = useColorModeValue(
    "#718096",
    "#9fb4d1"
  );

  const valueColor = useColorModeValue(
    "#1a202c",
    "#ffffff"
  );

  return (
    <CommonCard
      bg={bg}
      border={`1px solid ${border}`}
      borderRadius="10px"
      p="12px"
      h="410px"
      overflowY="auto"
    >
      {/* HEADER */}
      <Flex
        justify="space-between"
        align="center"
        mb="8px"
      >
        <Text
          color={title}
          fontWeight="700"
          fontSize="14px"
          letterSpacing="0.3px"
        >
          Alerts & Events
        </Text>

        <Flex
          align="center"
          gap="4px"
          cursor="pointer"
        >
          <Text
            color={title}
            fontSize="12px"
          >
            View All
          </Text>

          <Text
            color={title}
            fontSize="14px"
          >
            ›
          </Text>
        </Flex>
      </Flex>

      {/* ALERT LIST */}
      <VStack spacing="0" align="stretch">
        {alerts.length === 0 ? (
          <Box py="24px" textAlign="center">
            <Text color={timeColor} fontSize="13px">
              No alerts
            </Text>
          </Box>
        ) : (
          alerts.map((item, index) => (
            <Box key={index}>
              <Flex
                align="flex-start"
                justify="space-between"
                py="8px"
                gap="10px"
              >
                {/* LEFT */}
                <Flex align="flex-start" gap="10px" flex="1" minW="0">
                  {/* ICON */}
                  <Box pt="1px">
                    {item.type === "warning" ? (
                      <WarningTwoIcon color={item.color} boxSize="18px" />
                    ) : (
                      <InfoOutlineIcon color={item.color} boxSize="18px" />
                    )}
                  </Box>

                  {/* TEXT */}
                  <Box flex="1" minW="0">
                    <Text
                      color={item.color}
                      fontSize="14px"
                      fontWeight="500"
                      lineHeight="1.2"
                    >
                      {item.title}
                    </Text>

                    {item.subtitle && (
                      <Text color="#7ec8ff" fontSize="12px" mt="2px">
                        {item.subtitle}
                      </Text>
                    )}

                    <Text color={timeColor} fontSize="11px" mt="4px">
                      {item.time}
                    </Text>
                  </Box>
                </Flex>

                {/* VALUE */}
                {item.value && (
                  <Text
                    color={valueColor}
                    fontSize="14px"
                    fontWeight="500"
                    whiteSpace="nowrap"
                    flexShrink={0}
                  >
                    {item.value}
                  </Text>
                )}
              </Flex>

              {/* DIVIDER */}
              {index !== alerts.length - 1 && (
                <Box borderBottom={`1px solid ${divider}`} opacity="0.18" />
              )}
            </Box>
          ))
        )}
      </VStack>
    </CommonCard>
  );
};

export default AlertsEvents;