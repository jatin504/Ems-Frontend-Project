import {
  Box,
  Button,
  Flex,
  Grid,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  CheckCircleIcon,
  WarningTwoIcon,
  WarningIcon,
} from "@chakra-ui/icons";

import CommonCard from "./CommonCard";

const items = [
  {
    title: "Status",
    value: "Online",
    color: "#6bd425",
    icon: CheckCircleIcon,
  },
  {
    title: "Active Alarms",
    value: "0",
    color: "#ef4444",
    icon: WarningIcon,
  },
  {
    title: "Events (Today)",
    value: "0",
    color: "#f59e0b",
    icon: WarningTwoIcon,
  },
];

const StatusAlarms = () => {

  const textColor = useColorModeValue(
    "#0f172a",
    "#e8f0ff"
  );

  const subText = useColorModeValue(
    "#64748b",
    "#8ea6c9"
  );

  const borderColor = useColorModeValue(
    "#dbe4f0",
    "#14345d"
  );

  const cardBg = useColorModeValue(
    "#ffffff",
    "primary.dark"
  );

  const buttonBg = useColorModeValue(
    "#e2e8f0",
    "#16365f"
  );

  return (
    <CommonCard
      bg={cardBg}
      p="16px"
      borderRadius="12px"
      fontFamily="Poppins"
    >
      <Text
        fontSize="13px"
        fontWeight="700"
        color={textColor}
        mb="14px"
        fontFamily="Poppins"
      >
        Status & Alarms
      </Text>

      <Flex
        borderTop={`1px solid ${borderColor}`}
      >
        <Grid
          templateColumns="repeat(3,1fr)"
          flex="1"
        >
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <VStack
                key={index}
                spacing="7px"
                py="18px"
                borderRight={`1px solid ${borderColor}`}
              >
                <Icon
                  boxSize={8}
                  color={item.color}
                />

                <Text
                  fontSize="11px"
                  color={subText}
                  fontWeight="500"
                  fontFamily="Poppins"
                >
                  {item.title}
                </Text>

                <Text
                  fontSize="24px"
                  lineHeight="24px"
                  fontWeight="700"
                  color={item.color}
                  fontFamily="Poppins"
                >
                  {item.value}
                </Text>
              </VStack>
            );
          })}
        </Grid>

        {/* RIGHT BUTTON */}
        <Flex
          align="center"
          justify="center"
          px="14px"
        >
          <Button
            bg={buttonBg}
            color={textColor}
            size="sm"
            h="58px"
            w="88px"
            borderRadius="8px"
            fontSize="11px"
            fontWeight="600"
            whiteSpace="normal"
            lineHeight="15px"
            fontFamily="Poppins"
            _hover={{
              bg: buttonBg,
            }}
          >
            View All
            <br />
            Alarms &
            <br />
            Events
          </Button>
        </Flex>
      </Flex>
    </CommonCard>
  );
};

export default StatusAlarms;