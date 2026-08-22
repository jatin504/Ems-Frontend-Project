import {
  Box,
  Card,
  CardBody,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import BatterySVG from "../../../assets/BatterySVG";
import BlackStartBusSVG from "../../../assets/blackstartbusSVG";
import AuxLoadSVG from "../../../assets/auxloadsvg";
import SolarPanelSVG from "../../../assets/solarpanelsvg";

import { HiArrowLongRight } from "react-icons/hi2";

const metrics = [
  {
    title: "Frequency",
    value: "50.02 Hz",
  },
  {
    title: "Voltage (Avg)",
    value: "1.001 pu",
  },
  {
    title: "Active Power",
    value: "67.52 kW",
  },
  {
    title: "Reactive Power",
    value: "12.45 MVAr",
  },
  {
    title: "Voltage (L-L)",
    value: "33.01 kV",
  },
  {
    title: "Current",
    value: "1.24 A",
  },
];

const powerFlow = [
  {
    title: "Battery (PCS)",
    value: "67.52 kW",
    icon: <BatterySVG width={42} height={42} />,
  },
  {
    title: "Black Start Bus",
    value: "33.01 kV",
    icon: <BlackStartBusSVG width={42} height={42} />,
  },
  {
    title: "Aux Loads",
    value: "42.10 kW",
    icon: <AuxLoadSVG width={42} height={42} />,
  },
  {
    title: "Other Sources",
    value: "25.42 kW",
    icon: <SolarPanelSVG width={34} height={34} />,
  },
];

const PlantElectricalSnapshot = () => {
  const cardBg = useColorModeValue("white", "#0F172A");
  const border = useColorModeValue("#E5E7EB", "#334155");
  const title = useColorModeValue("#111827", "white");
  const muted = useColorModeValue("#6B7280", "#94A3B8");
  const tileBg = useColorModeValue("#F8FAFC", "#111827");

  return (
    <Card
      bg={cardBg}
      border="1px solid"
      borderColor={border}
      borderRadius="12px"
      boxShadow="sm"
      h="100%"
    >
      <CardBody
        p={4}
        display="flex"
        flexDirection="column"
        h="100%"
      >
        <Text
          fontSize="16px"
          fontWeight="700"
          mb={4}
        >
          Plant Electrical Snapshot (Live)
        </Text>

        <SimpleGrid
          columns={3}
          spacing={2.5}
          mb={3}
        >
          {metrics.map((item) => (
            <Box
              key={item.title}
              bg={tileBg}
              border="1px solid"
              borderColor={border}
              borderRadius="8px"
              p={2.5}
              h="78px"
            >
              <Text
                fontSize="10px"
                fontWeight="600"
                color={muted}
                mb={1}
              >
                {item.title}
              </Text>

              <Text
                fontSize="16px"
                fontWeight="700"
                lineHeight="20px"
                color={title}
              >
                {item.value}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        <Box
          flex="1"
          border="1px solid"
          borderColor={border}
          borderRadius="10px"
          p={4}
          minH="170px"
        >
          <Text
            fontSize="13px"
            fontWeight="700"
            mb={3}
          >
            Power Flow
          </Text>

          <HStack
            justify="space-between"
            align="center"
            w="100%"
            spacing={0}
          >
            {powerFlow.map((item, index) => (
              <HStack
                key={item.title}
                flex="1"
                justify="space-between"
                align="center"
              >
                <VStack
                  spacing={2}
                  w="60px"
                >
                  <Text
                    fontSize="9px"
                    fontWeight="600"
                    color={muted}
                    textAlign="center"
                    lineHeight="13px"
                  >
                    {item.title}
                  </Text>

                  <Box
                    h="46px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {item.icon}
                  </Box>

                  <Text
                    fontSize="12px"
                    fontWeight="700"
                    color={title}
                  >
                    {item.value}
                  </Text>
                </VStack>

                {index !== powerFlow.length - 1 && (
                  <Icon
                    as={HiArrowLongRight}
                    boxSize={4}
                    color={muted}
                  />
                )}
              </HStack>
            ))}
          </HStack>
        </Box>
      </CardBody>
    </Card>
  );
};

export default PlantElectricalSnapshot;
        