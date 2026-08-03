import React from "react";
import {
  Box,
  Divider,
  Flex,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { ShieldCheck } from "lucide-react";

const InsulationMonitoring: React.FC = () => {
  const bg = useColorModeValue("#FFFFFF", "#101820");
  const border = useColorModeValue("#E2E8F0", "#243244");
  const title = useColorModeValue("#1E293B", "#F8FAFC");
  const text = useColorModeValue("#64748B", "#CBD5E1");
  const green = "#66CC33";

  return (
    <Box
      w="100%"
      h="344px"
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="10px"
      overflow="hidden"
      display="flex"
      flexDirection="column"
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
        <Text
          fontSize="16px"
          fontWeight={700}
          color={title}
        >
          Insulation Monitoring
        </Text>

        <InfoOutlineIcon color={text} />
      </Flex>

      <Flex flex="1" direction="column">
        {/* Top */}
        <Flex flex="1">
          <Flex
            flex={1}
            align="center"
            justify="center"
            direction="column"
          >
            <Text fontSize="12px" color={text}>
              R+ to R-
            </Text>

            <Text
              mt={1}
              fontSize="24px"
              fontWeight={700}
              color={title}
            >
              &gt;1000 MΩ
            </Text>
          </Flex>

          <Divider orientation="vertical" borderColor={border} />

          <Flex
            flex={1}
            align="center"
            justify="center"
            direction="column"
          >
            <Text fontSize="12px" color={text}>
              R+ to PE
            </Text>

            <Text
              mt={1}
              fontSize="24px"
              fontWeight={700}
              color={title}
            >
              &gt;1000 MΩ
            </Text>
          </Flex>

          <Divider orientation="vertical" borderColor={border} />

          <Flex
            flex={1}
            align="center"
            justify="center"
            direction="column"
          >
            <Text fontSize="12px" color={text}>
              R- to PE
            </Text>

            <Text
              mt={1}
              fontSize="24px"
              fontWeight={700}
              color={title}
            >
              &gt;1000 MΩ
            </Text>
          </Flex>
        </Flex>

        <Divider borderColor={border} />

        {/* Leakage Current */}
        <Flex
          flex="1"
          direction="column"
          align="center"
          justify="center"
        >
          <Text
            fontSize="12px"
            color={text}
          >
            Leakage Current
          </Text>

          <Text
            mt={1}
            fontSize="26px"
            fontWeight={700}
            color={title}
          >
            0.28 mA
          </Text>
        </Flex>

        <Divider borderColor={border} />

        {/* Footer */}
        <Flex
          h="52px"
          align="center"
          justify="center"
          gap={3}
        >
          <Text
            fontSize="14px"
            color={text}
          >
            Insulation Health
          </Text>

          <HStack spacing={2}>
            <Flex
              w="30px"
              h="30px"
              borderRadius="full"
              bg="#6CCB2F"
              align="center"
              justify="center"
            >
              <ShieldCheck
                size={18}
                color="white"
              />
            </Flex>

            <Text
              fontSize="16px"
              fontWeight={700}
              color={green}
            >
              Good
            </Text>
          </HStack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default InsulationMonitoring;