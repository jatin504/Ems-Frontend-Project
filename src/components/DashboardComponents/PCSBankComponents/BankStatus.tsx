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
import { InfoOutlineIcon } from "@chakra-ui/icons";

const statusData = [
  { label: "Contactor Status", value: "Closed", color: "#66CC33" },
  { label: "Precharge Status", value: "Completed", color: "#66CC33" },
  {
    label: "Charge / Discharge Status",
    value: "Discharging",
    color: "#4DA3FF",
  },
  { label: "BMS Status", value: "Normal", color: "#66CC33" },
  { label: "Communication", value: "Online", color: "#66CC33" },
  { label: "HVIL", value: "OK", color: "#66CC33" },
  { label: "BMS Heartbeat", value: "OK", color: "#66CC33" },
];

const BankStatus: React.FC = () => {
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
            Bank Status
          </Text>

          <InfoOutlineIcon
            boxSize={3.5}
            color={subText}
          />
        </HStack>
      </Flex>

      {/* Status List */}
      <VStack
        spacing={0}
        align="stretch"
      >
        {statusData.slice(0, 4).map((item, index) => (
          <React.Fragment key={item.label}>
            <Flex
              h="36px"
              px="14px"
              align="center"
              justify="space-between"
            >
              <Text
                fontSize="13px"
                color={title}
              >
                {item.label}
              </Text>

              <Text
                fontSize="13px"
                fontWeight="700"
                color={item.color}
              >
                {item.value}
              </Text>
            </Flex>

            <Divider borderColor={border} />
          </React.Fragment>
        ))}
                {statusData.slice(4).map((item, index) => (
          <React.Fragment key={item.label}>
            <Flex
              h="36px"
              px="14px"
              align="center"
              justify="space-between"
            >
              <Text
                fontSize="13px"
                color={title}
              >
                {item.label}
              </Text>

              <Text
                fontSize="13px"
                fontWeight="700"
                color={item.color}
              >
                {item.value}
              </Text>
            </Flex>

            {index !== statusData.slice(4).length - 1 && (
              <Divider borderColor={border} />
            )}
          </React.Fragment>
        ))}
      </VStack>
    </Box>
  );
};

export default BankStatus;