import React from "react";
import {
  Box,
  Divider,
  Flex,
  Grid,
  HStack,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import {
  RotateCcw,
  BatteryCharging,
  Activity,
  CalendarDays,
} from "lucide-react";

const LifetimeThroughput: React.FC = () => {
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
            Lifetime & Throughput
          </Text>

          <InfoOutlineIcon
            boxSize={3.5}
            color={subText}
          />
        </HStack>
      </Flex>

      {/* Grid */}
      <Grid
        templateColumns="1fr 1fr"
        templateRows="repeat(3, 1fr)"
        h="258px"
      >
                {/* Row 1 - Left */}
        <Flex
          px="14px"
          align="center"
          gap="12px"
          borderRight="1px solid"
          borderBottom="1px solid"
          borderColor={border}
        >
          <Flex
            w="34px"
            h="34px"
            borderRadius="full"
            bg="rgba(174,95,255,0.12)"
            align="center"
            justify="center"
          >
            <Icon
              as={RotateCcw}
              boxSize="18px"
              color="#C46CF8"
            />
          </Flex>

          <Box>
            <Text
              fontSize="11px"
              color={subText}
            >
              Equivalent Full Cycles
            </Text>

            <HStack spacing="4px" mt="2px">
              <Text
                fontSize="30px"
                fontWeight="700"
                lineHeight="28px"
                color={title}
              >
                862
              </Text>
            </HStack>
          </Box>
        </Flex>

        {/* Row 1 - Right */}
        <Flex
          px="14px"
          align="center"
          gap="12px"
          borderBottom="1px solid"
          borderColor={border}
        >
          <Flex
            w="34px"
            h="34px"
            borderRadius="full"
            bg="rgba(163,230,53,.12)"
            align="center"
            justify="center"
          >
            <Icon
              as={BatteryCharging}
              boxSize="18px"
              color="#A3E635"
            />
          </Flex>

          <Box>
            <Text
              fontSize="11px"
              color={subText}
            >
              Total Charge Energy
            </Text>

            <HStack spacing="4px" mt="2px">
              <Text
                fontSize="30px"
                fontWeight="700"
                lineHeight="28px"
                color={title}
              >
                1284.56
              </Text>

              <Text
                mt="8px"
                fontSize="14px"
                fontWeight="600"
                color={title}
              >
                MWh
              </Text>
            </HStack>
          </Box>
        </Flex>
                {/* Row 2 - Left */}
        <Flex
          px="14px"
          align="center"
          gap="12px"
          borderRight="1px solid"
          borderBottom="1px solid"
          borderColor={border}
        >
          <Flex
            w="34px"
            h="34px"
            borderRadius="full"
            bg="rgba(37,99,235,.12)"
            align="center"
            justify="center"
          >
            <Icon
              as={Activity}
              boxSize="18px"
              color="#3B82F6"
            />
          </Flex>

          <Box>
            <Text
              fontSize="11px"
              color={subText}
            >
              Total Discharge Energy
            </Text>

            <HStack spacing="4px" mt="2px">
              <Text
                fontSize="30px"
                fontWeight="700"
                lineHeight="28px"
                color={title}
              >
                1284.56
              </Text>

              <Text
                mt="8px"
                fontSize="14px"
                fontWeight="600"
                color={title}
              >
                MWh
              </Text>
            </HStack>
          </Box>
        </Flex>

        {/* Row 2 - Right */}
        <Flex
          px="14px"
          align="center"
          gap="12px"
          borderBottom="1px solid"
          borderColor={border}
        >
          <Flex
            w="34px"
            h="34px"
            borderRadius="full"
            bg="rgba(168,85,247,.12)"
            align="center"
            justify="center"
          >
            <Icon
              as={CalendarDays}
              boxSize="18px"
              color="#A855F7"
            />
          </Flex>

          <Box>
            <Text
              fontSize="11px"
              color={subText}
            >
              Calendar Age
            </Text>

            <HStack spacing="4px" mt="2px">
              <Text
                fontSize="30px"
                fontWeight="700"
                lineHeight="28px"
                color={title}
              >
                14.2
              </Text>

              <Text
                mt="8px"
                fontSize="14px"
                fontWeight="600"
                color={title}
              >
                Months
              </Text>
            </HStack>
          </Box>
        </Flex>
                {/* Row 3 - Left */}
        <Flex
          px="14px"
          align="center"
          gap="12px"
          borderRight="1px solid"
          borderColor={border}
        >
          <Flex
            w="34px"
            h="34px"
            borderRadius="full"
            bg="rgba(234,179,8,.12)"
            align="center"
            justify="center"
          >
            <Icon
              as={Activity}
              boxSize="18px"
              color="#EAB308"
            />
          </Flex>

          <Box>
            <Text
              fontSize="11px"
              color={subText}
            >
              Lifetime Throughput
            </Text>

            <HStack spacing="4px" mt="2px">
              <Text
                fontSize="30px"
                fontWeight="700"
                lineHeight="28px"
                color={title}
              >
                2569.12
              </Text>

              <Text
                mt="8px"
                fontSize="14px"
                fontWeight="600"
                color={title}
              >
                MWh
              </Text>
            </HStack>
          </Box>
        </Flex>

        {/* Row 3 - Right */}
        <Flex
          px="14px"
          align="center"
          gap="12px"
        >
          <Flex
            w="34px"
            h="34px"
            borderRadius="full"
            bg="rgba(56,189,248,.12)"
            align="center"
            justify="center"
          >
            <Icon
              as={CalendarDays}
              boxSize="18px"
              color="#38BDF8"
            />
          </Flex>

          <Box>
            <Text
              fontSize="11px"
              color={subText}
            >
              Cycle Age
            </Text>

            <HStack spacing="4px" mt="2px">
              <Text
                fontSize="30px"
                fontWeight="700"
                lineHeight="28px"
                color={title}
              >
                10.8
              </Text>

              <Text
                mt="8px"
                fontSize="14px"
                fontWeight="600"
                color={title}
              >
                Months
              </Text>
            </HStack>
          </Box>
        </Flex>
      </Grid>
    </Box>
  );
};

export default LifetimeThroughput;
      