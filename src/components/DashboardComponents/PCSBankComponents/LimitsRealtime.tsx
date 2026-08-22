import React from "react";
import {
  Box,
  Divider,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import WidgetTitle from "../../Common/WidgetTitle";

const LimitsRealtime: React.FC = () => {
  const bg = useColorModeValue("#FFFFFF", "#101820");
  const border = useColorModeValue("#E2E8F0", "#243244");
  const title = useColorModeValue("#1E293B", "#F8FAFC");
  const text = useColorModeValue("#64748B", "#CBD5E1");

  const data = [
    {
      label: "Max Charge Current",
      value: "200.00 A",
    },
    {
      label: "Max Discharge Current",
      value: "200.00 A",
    },
    {
      label: "Max Charge Power",
      value: "160.00 kW",
    },
    {
      label: "Max Discharge Power",
      value: "160.00 kW",
    },
    {
      label: "Current Limit Reason",
      value: "None",
    },
  ];

  return (
    <Box
      w="315px"
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
        px={4}
        align="center"
        justify="space-between"
        borderBottom="1px solid"
        borderColor={border}
      >
        <WidgetTitle color={title}>Limits (BMS Real-time)</WidgetTitle>

        <InfoOutlineIcon color={text} />
      </Flex>

      {/* Body */}
      <Flex
        direction="column"
        px={5}
        py={2}
        gap={3}
      >
        {data.map((item, index) => (
          <React.Fragment key={index}>
            <Flex
              justify="space-between"
              align="center"
            >
              <Text
                fontSize="13px"
                color={text}
              >
                {item.label}
              </Text>

              <Text
                fontSize="15px"
                fontWeight={700}
                color={title}
              >
                {item.value}
              </Text>
            </Flex>

            {index !== data.length - 1 && (
              <Divider borderColor={border} />
            )}
          </React.Fragment>
        ))}
      </Flex>
    </Box>
  );
};

export default LimitsRealtime;