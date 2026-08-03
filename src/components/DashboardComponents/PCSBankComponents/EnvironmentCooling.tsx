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
import WidgetTitle from "../../Common/WidgetTitle";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Thermometer,
  Droplets,
  Refrigerator,
  Wind,
} from "lucide-react";

const deviceData = [
  {
    device: "AC-01",
    status: "Running",
    speed: "Level 2",
    power: "1.25",
    runtime: "1523.4",
  },
  {
    device: "AC-02",
    status: "Running",
    speed: "Level 2",
    power: "1.28",
    runtime: "1518.2",
  },
  {
    device: "Fan Tray-01",
    status: "Running",
    speed: "62 %",
    power: "0.18",
    runtime: "6234.5",
  },
  {
    device: "Fan Tray-02",
    status: "Running",
    speed: "58 %",
    power: "0.17",
    runtime: "6210.3",
  },
];

const EnvironmentCooling: React.FC = () => {
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
          <WidgetTitle color={title}>Environment & Cooling</WidgetTitle>

          <InfoOutlineIcon
            boxSize={3.5}
            color={subText}
          />
        </HStack>
      </Flex>

      {/* Top Cards */}
      <Grid
        templateColumns="repeat(4,1fr)"
        gap="8px"
        px="8px"
        py="8px"
      >
                {/* Ambient Temperature */}
        <Flex
          h="48px"
          px="10px"
          border="1px solid"
          borderColor={border}
          borderRadius="6px"
          align="center"
          justify="center"
          gap="8px"
        >
          <Icon
            as={Thermometer}
            boxSize="18px"
            color="#52D273"
          />

          <Box textAlign="center">
            <Text
              fontSize="11px"
              color={subText}
            >
              Ambient Temp.
            </Text>

            <Text
              fontSize="18px"
              fontWeight="700"
              color={title}
            >
              32.5 °C
            </Text>
          </Box>
        </Flex>

        {/* Humidity */}
        <Flex
          h="48px"
          px="10px"
          border="1px solid"
          borderColor={border}
          borderRadius="6px"
          align="center"
          justify="center"
          gap="8px"
        >
          <Icon
            as={Droplets}
            boxSize="18px"
            color="#29B6F6"
          />

          <Box textAlign="center">
            <Text
              fontSize="11px"
              color={subText}
            >
              Humidity
            </Text>

            <Text
              fontSize="18px"
              fontWeight="700"
              color={title}
            >
              48.6 %
            </Text>
          </Box>
        </Flex>

        {/* Rack Temperature */}
        <Flex
          h="48px"
          px="10px"
          border="1px solid"
          borderColor={border}
          borderRadius="6px"
          align="center"
          justify="center"
          gap="8px"
        >
          <Icon
            as={Refrigerator}
            boxSize="18px"
            color="#7ED957"
          />

          <Box textAlign="center">
            <Text
              fontSize="11px"
              color={subText}
            >
              Rack Temp. Avg.
            </Text>

            <Text
              fontSize="18px"
              fontWeight="700"
              color={title}
            >
              29.8 °C
            </Text>
          </Box>
        </Flex>

        {/* Cooling Mode */}
        <Flex
          h="48px"
          px="10px"
          border="1px solid"
          borderColor={border}
          borderRadius="6px"
          justify="center"
          align="center"
          direction="column"
        >
          <Text
            fontSize="11px"
            color={subText}
          >
            Cooling Mode
          </Text>

          <Text
            fontSize="18px"
            fontWeight="700"
            color={title}
          >
            Auto
          </Text>
        </Flex>
      </Grid>
            {/* Device Table */}
      <Box px="8px">
        <Box
          border="1px solid"
          borderColor={border}
          borderRadius="6px"
          overflow="hidden"
        >
          {/* Table Header */}
          <Grid
            templateColumns="1.3fr 1fr 1.2fr 1fr 1.2fr"
            bg={useColorModeValue("#F8FAFC", "#162433")}
            h="32px"
            alignItems="center"
            px="10px"
            borderBottom="1px solid"
            borderColor={border}
          >
            <Text fontSize="11px" fontWeight="600">
              Device
            </Text>

            <Text
              fontSize="11px"
              fontWeight="600"
              textAlign="center"
            >
              Status
            </Text>

            <Text
              fontSize="11px"
              fontWeight="600"
              textAlign="center"
            >
              Speed / Level
            </Text>

            <Text
              fontSize="11px"
              fontWeight="600"
              textAlign="center"
            >
              Power (kW)
            </Text>

            <Text
              fontSize="11px"
              fontWeight="600"
              textAlign="center"
            >
              Runtime (h)
            </Text>
          </Grid>

          {/* Rows */}
          {deviceData.map((item, index) => (
            <React.Fragment key={item.device}>
              <Grid
                templateColumns="1.3fr 1fr 1.2fr 1fr 1.2fr"
                h="30px"
                alignItems="center"
                px="10px"
              >
                <Text fontSize="12px" color={title}>
                  {item.device}
                </Text>

                <Text
                  fontSize="12px"
                  color="#66CC33"
                  fontWeight="700"
                  textAlign="center"
                >
                  {item.status}
                </Text>

                <Text
                  fontSize="12px"
                  textAlign="center"
                  color={title}
                >
                  {item.speed}
                </Text>

                <Text
                  fontSize="12px"
                  textAlign="center"
                  color={title}
                >
                  {item.power}
                </Text>

                <Text
                  fontSize="12px"
                  textAlign="center"
                  color={title}
                >
                  {item.runtime}
                </Text>
              </Grid>

              {index !== deviceData.length - 1 && (
                <Divider borderColor={border} />
              )}
            </React.Fragment>
          ))}
        </Box>
      </Box>
            {/* Bottom Summary */}
      <Divider
        mt="8px"
        borderColor={border}
      />

      <Flex
        h="38px"
        px="14px"
        align="center"
        justify="space-between"
      >
        <HStack spacing={2}>
          <Text
            fontSize="12px"
            color={subText}
          >
            Cooling Efficiency
          </Text>

          <Box
            px="8px"
            py="1px"
            borderRadius="4px"
            bg="#66CC3320"
          >
            <Text
              fontSize="13px"
              fontWeight="700"
              color="#66CC33"
            >
              3.42
            </Text>
          </Box>

          <Text
            fontSize="12px"
            color={title}
          >
            kW / °C
          </Text>
        </HStack>

        <HStack spacing={2}>
          <Text
            fontSize="12px"
            color={subText}
          >
            Heat Load
          </Text>

          <Text
            fontSize="16px"
            fontWeight="700"
            color={title}
          >
            42.3
          </Text>

          <Text
            fontSize="12px"
            color={title}
          >
            kW
          </Text>
        </HStack>
      </Flex>
    </Box>
  );
};

export default EnvironmentCooling;
    