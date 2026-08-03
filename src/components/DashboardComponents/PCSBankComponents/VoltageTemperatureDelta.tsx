import React from "react";
import {
  Box,
  Divider,
  Flex,
  HStack,
  Icon,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { Thermometer, Gauge, CheckCircle2 } from "lucide-react";

const VoltageTemperatureDelta: React.FC = () => {
  const bg = useColorModeValue("#FFFFFF", "#101820");
  const border = useColorModeValue("#E2E8F0", "#243244");
  const title = useColorModeValue("#0F172A", "#F8FAFC");
  const subText = useColorModeValue("#64748B", "#94A3B8");

  const green = "#74D63E";
  const blue = "#21A8FF";
  const cyan = "#33D6FF";
  const purple = "#C46CF8";

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
        h="40px"
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
            Voltage & Temperature Delta
          </Text>

          <InfoOutlineIcon
            boxSize={3.5}
            color={subText}
          />
        </HStack>
      </Flex>

      {/* Top Summary */}
      <Flex
        h="78px"
        px="14px"
        justify="space-between"
        align="center"
      >
        {/* Voltage Delta */}
        <VStack
          spacing="2px"
          align="start"
          w="48%"
        >
          <Text
            fontSize="11px"
            color={subText}
          >
            Cell Voltage Delta (Max - Min)
          </Text>

          <HStack spacing="6px" align="end">
            <Text
              fontSize="28px"
              fontWeight="700"
              color={title}
              lineHeight="28px"
            >
              18
            </Text>

            <Text
              mb="3px"
              fontSize="14px"
              fontWeight="600"
              color={title}
            >
              mV
            </Text>

            <Text
              mb="3px"
              fontSize="13px"
              fontWeight="700"
              color={green}
            >
              Excellent
            </Text>
          </HStack>
        </VStack>

        {/* Temperature Delta */}
        <VStack
          spacing="2px"
          align="start"
          w="48%"
        >
          <Text
            fontSize="11px"
            color={subText}
          >
            Temperature Delta (Max - Min)
          </Text>

          <HStack spacing="6px" align="end">
            <Text
              fontSize="28px"
              fontWeight="700"
              color={title}
              lineHeight="28px"
            >
              2.4
            </Text>

            <Text
              mb="3px"
              fontSize="14px"
              fontWeight="600"
              color={title}
            >
              °C
            </Text>

            <Text
              mb="3px"
              fontSize="13px"
              fontWeight="700"
              color={green}
            >
              Excellent
            </Text>
          </HStack>
        </VStack>
      </Flex>

      <Divider borderColor={border} />

      {/* Middle Rows */}
      <Flex flex="1" direction="column">
            {/* Voltage Row */}
      <Flex flex="1">
        {/* Max Voltage */}
        <Flex
          flex={1}
          px="18px"
          align="center"
          gap="10px"
        >
          <Icon
            as={Gauge}
            boxSize="18px"
            color={blue}
            strokeWidth={2}
          />

          <VStack
            spacing="0"
            align="start"
          >
            <Text
              fontSize="11px"
              color={subText}
              lineHeight="14px"
            >
              Max Cell Voltage
            </Text>

            <HStack spacing="4px">
              <Text
                fontSize="24px"
                fontWeight="700"
                color={title}
                lineHeight="24px"
              >
                3.365
              </Text>

              <Text
                mt="6px"
                fontSize="13px"
                fontWeight="600"
                color={title}
              >
                V
              </Text>
            </HStack>
          </VStack>
        </Flex>

        <Divider
          orientation="vertical"
          borderColor={border}
        />

        {/* Min Voltage */}
        <Flex
          flex={1}
          px="18px"
          align="center"
          gap="10px"
        >
          <Icon
            as={Thermometer}
            boxSize="18px"
            color={cyan}
            strokeWidth={2}
          />

          <VStack
            spacing="0"
            align="start"
          >
            <Text
              fontSize="11px"
              color={subText}
              lineHeight="14px"
            >
              Min Cell Voltage
            </Text>

            <HStack spacing="4px">
              <Text
                fontSize="24px"
                fontWeight="700"
                color={title}
                lineHeight="24px"
              >
                3.347
              </Text>

              <Text
                mt="6px"
                fontSize="13px"
                fontWeight="600"
                color={title}
              >
                V
              </Text>
            </HStack>
          </VStack>
        </Flex>
      </Flex>

      <Divider borderColor={border} />

      {/* Temperature Row */}
      <Flex flex="1">
        {/* Max Temp */}
        <Flex
          flex={1}
          px="18px"
          align="center"
          gap="10px"
        >
          <Icon
            as={Thermometer}
            boxSize="18px"
            color={purple}
            strokeWidth={2}
          />

          <VStack
            spacing="0"
            align="start"
          >
            <Text
              fontSize="11px"
              color={subText}
            >
              Max Cell Temp.
            </Text>

            <HStack spacing="4px">
              <Text
                fontSize="24px"
                fontWeight={700}
                color={title}
                lineHeight="24px"
              >
                44.02
              </Text>

              <Text
                mt="6px"
                fontSize="13px"
                fontWeight="600"
                color={title}
              >
                °C
              </Text>
            </HStack>
          </VStack>
        </Flex>

        <Divider
          orientation="vertical"
          borderColor={border}
        />

        {/* Min Temp */}
        <Flex
          flex={1}
          px="18px"
          align="center"
          gap="10px"
        >
          <Icon
            as={Thermometer}
            boxSize="18px"
            color="#00CFFF"
            strokeWidth={2}
          />

          <VStack
            spacing="0"
            align="start"
          >
            <Text
              fontSize="11px"
              color={subText}
            >
              Min Cell Temp.
            </Text>

            <HStack spacing="4px">
              <Text
                fontSize="24px"
                fontWeight={700}
                color={title}
                lineHeight="24px"
              >
                30.25
              </Text>

              <Text
                mt="6px"
                fontSize="13px"
                fontWeight={600}
                color={title}
              >
                °C
              </Text>
            </HStack>
          </VStack>
        </Flex>
      </Flex>
      </Flex>

      <Divider borderColor={border} />
            {/* Footer */}
      <Flex
        h="48px"
        align="center"
        justify="center"
        gap="10px"
      >
        <Text
          fontSize="13px"
          fontWeight="500"
          color={subText}
        >
          Imbalance Status
        </Text>

        <HStack spacing="6px">
          <Flex
            w="22px"
            h="22px"
            borderRadius="full"
            bg="#66CC33"
            align="center"
            justify="center"
            boxShadow="0 0 6px rgba(102,204,51,.35)"
          >
            <Icon
              as={CheckCircle2}
              boxSize="13px"
              color="white"
            />
          </Flex>

          <Text
            fontSize="14px"
            fontWeight="700"
            color={green}
          >
            Excellent
          </Text>
        </HStack>
      </Flex>
    </Box>
  );
};

export default VoltageTemperatureDelta;