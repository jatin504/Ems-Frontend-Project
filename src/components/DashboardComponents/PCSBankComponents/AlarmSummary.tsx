import React from "react";
import {
  Box,
  Divider,
  Flex,
  HStack,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { InfoOutlineIcon, WarningIcon } from "@chakra-ui/icons";
import { BellRing } from "lucide-react";

const alarms = [
  {
    time: "11:25:12",
    severity: "Major",
    color: "#D4A017",
    text: "Rack-03 Cell Over Temperature",
  },
  {
    time: "11:20:05",
    severity: "Minor",
    color: "#C9B000",
    text: "Rack-02 High Temp Warning",
  },
  {
    time: "11:15:42",
    severity: "Minor",
    color: "#C9B000",
    text: "Cell Voltage Imbalance High",
  },
  {
    time: "11:10:11",
    severity: "Info",
    color: "#1E88E5",
    text: "Fan-02 Running",
  },
];

const AlarmSummary: React.FC = () => {
  const bg = useColorModeValue("#FFFFFF", "#101820");
  const border = useColorModeValue("#E2E8F0", "#243244");
  const title = useColorModeValue("#0F172A", "#F8FAFC");
  const subText = useColorModeValue("#64748B", "#94A3B8");

  return (
    <Box
      w="100%"
      h="300px"
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="10px"
      overflow="hidden"
    >
      {/* Header */}
      <Flex
        h="42px"
        px="14px"
        align="center"
        justify="space-between"
        borderBottom="1px solid"
        borderColor={border}
      >
        <HStack spacing={2}>
          <Text
            fontSize="16px"
            fontWeight="700"
            color={title}
          >
            Alarm Summary
          </Text>

          <InfoOutlineIcon
            boxSize={3.5}
            color={subText}
          />
        </HStack>
      </Flex>

      {/* Alarm Counters */}
      <Flex
        h="62px"
        px="16px"
        align="center"
        justify="space-between"
      >
        {/* Critical */}
        <VStack spacing={0} w="25%">
          <HStack spacing="5px">
            <BellRing size={18} color="#F44336" />
            <Text
              fontSize="30px"
              fontWeight="700"
              color={title}
              lineHeight="28px"
            >
              0
            </Text>
          </HStack>

          <Text
            mt="-2px"
            fontSize="11px"
            color={subText}
          >
            Critical
          </Text>
        </VStack>

        {/* Major */}
        <VStack spacing={0} w="25%">
          <HStack spacing="5px">
            <WarningIcon boxSize={5} color="#F4B400" />
            <Text
              fontSize="30px"
              fontWeight="700"
              color={title}
              lineHeight="28px"
            >
              1
            </Text>
          </HStack>

          <Text
            mt="-2px"
            fontSize="11px"
            color={subText}
          >
            Major
          </Text>
        </VStack>

        {/* Minor */}
        <VStack spacing={0} w="25%">
          <HStack spacing="5px">
            <WarningIcon boxSize={5} color="#FFD54F" />
            <Text
              fontSize="30px"
              fontWeight="700"
              color={title}
              lineHeight="28px"
            >
              2
            </Text>
          </HStack>

          <Text
            mt="-2px"
            fontSize="11px"
            color={subText}
          >
            Minor
          </Text>
        </VStack>

        {/* Info */}
        <VStack spacing={0} w="25%">
          <HStack spacing="5px">
            <InfoOutlineIcon boxSize={5} color="#1E88E5" />
            <Text
              fontSize="30px"
              fontWeight="700"
              color={title}
              lineHeight="28px"
            >
              3
            </Text>
          </HStack>

          <Text
            mt="-2px"
            fontSize="11px"
            color={subText}
          >
            Info
          </Text>
        </VStack>
      </Flex>

      <Divider borderColor={border} />

      {/* Active Alarm Header */}
      <Flex
        px="14px"
        h="36px"
        align="center"
        justify="space-between"
      >
        <Text
          fontSize="14px"
          fontWeight="700"
          color="#F44336"
        >
          Active Alarms (4)
        </Text>

        <HStack spacing={1}>
          <Text
            fontSize="13px"
            color={subText}
          >
            View All
          </Text>

          <InfoOutlineIcon
            boxSize={3}
            color="#4DA3FF"
          />
        </HStack>
      </Flex>

      <Divider borderColor={border} />

      <VStack
        spacing={0}
        align="stretch"
      >
                {alarms.map((alarm, index) => (
          <React.Fragment key={`${alarm.time}-${index}`}>
            <Flex
              h="34px"
              px="12px"
              align="center"
              justify="space-between"
            >
              <Text
                w="58px"
                fontSize="12px"
                color={title}
              >
                {alarm.time}
              </Text>

              <Box
                minW="44px"
                textAlign="center"
                px="6px"
                py="2px"
                borderRadius="4px"
                border="1px solid"
                borderColor={alarm.color}
                bg={`${alarm.color}20`}
              >
                <Text
                  fontSize="10px"
                  fontWeight="700"
                  color={alarm.color}
                >
                  {alarm.severity}
                </Text>
              </Box>

              <Text
                flex={1}
                ml="10px"
                fontSize="12px"
                color={title}
                noOfLines={1}
              >
                {alarm.text}
              </Text>
            </Flex>

            {index !== alarms.length - 1 && (
              <Divider borderColor={border} />
            )}
          </React.Fragment>
        ))}
      </VStack>
    </Box>
  );
};

export default AlarmSummary;
      