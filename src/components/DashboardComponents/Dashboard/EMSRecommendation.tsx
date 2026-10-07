import React from "react";
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Button,
  Circle,
  Divider,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  FiClock,
  FiChevronRight,
  FiBarChart2,
  FiBatteryCharging,
  FiDownload,
  FiSun,
} from "react-icons/fi";

import { BsLightbulbFill } from "react-icons/bs";

type Status =
  | "Active"
  | "Pending"
  | "Scheduled"
  | "No Change";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  status: Status;
  metricTitle: string;
  metricValue: React.ReactNode;
  color: string;
  bg: string;
  icon: React.ElementType;
  direction: "up" | "down" | "none";
}

const recommendations: Recommendation[] = [
  {
    id: "01",
    title: "Reactive Support (PPC)",
    description: "PPC increasing capacitive Q",
    status: "Active",
    metricTitle: "Reactive Power",
    metricValue: "+0.5 MVAr",
    color: "#18BE76",
    bg: "#EAFBF3",
    icon: FiBarChart2,
    direction: "up",
  },
  {
    id: "02",
    title: "BESS Dispatch (EMS)",
    description: "Increase BESS discharge",
    status: "Pending",
    metricTitle: "Active Power",
    metricValue: (
      <>
        from -0.5 MW
        <br />
        to +0.5 MW
      </>
    ),
    color: "#1976ED",
    bg: "#EAF3FF",
    icon: FiBatteryCharging,
    direction: "up",
  },
  {
    id: "03",
    title: "Flexible Load Management",
    description: "Shift non-critical load on Feeder 3",
    status: "Scheduled",
    metricTitle: "Load Reduction",
    metricValue: (
      <>
        Reduce by 0.3 MW
        <Text
          as="span"
          display="block"
          fontSize="9px"
          fontWeight="500"
        >
          (if required)
        </Text>
      </>
    ),
    color: "#F28A00",
    bg: "#FFF4E7",
    icon: FiDownload,
    direction: "down",
  },
  {
    id: "04",
    title: "Re-evaluate PV Schedule",
    description: "No change (PV low at this time)",
    status: "No Change",
    metricTitle: "PV Generation",
    metricValue: "No Change",
    color: "#7650E8",
    bg: "#F1ECFF",
    icon: FiSun,
    direction: "none",
  },
];

const statusStyles: Record<
  Status,
  { color: string; bg: string }
> = {
  Active: {
    color: "#16B86F",
    bg: "#DDF8EA",
  },
  Pending: {
    color: "#1976ED",
    bg: "#E7F1FF",
  },
  Scheduled: {
    color: "#E87900",
    bg: "#FFF0D9",
  },
  "No Change": {
    color: "#687991",
    bg: "#EDF1F5",
  },
};

const StatusBadge = ({
  status,
}: {
  status: Status;
}) => {
  const style = statusStyles[status];

  return (
    <HStack
      spacing="5px"
      h="20px"
      px="8px"
      borderRadius="20px"
      bg={style.bg}
      w="fit-content"
    >
      {status === "Active" && (
        <Circle
          size="8px"
          bg="#16B86F"
        />
      )}

      {status === "Pending" && (
        <Circle
          size="10px"
          border="2px solid"
          borderColor="#1976ED"
          bg="transparent"
        />
      )}

      {status === "Scheduled" && (
        <FiClock
          size={11}
          color="#E87900"
        />
      )}

      {status === "No Change" && (
        <Flex
          w="10px"
          h="10px"
          borderRadius="50%"
          bg="#718096"
          align="center"
          justify="center"
        >
          <Box
            w="5px"
            h="1.5px"
            bg="white"
          />
        </Flex>
      )}

      <Text
        fontSize="9px"
        fontWeight="700"
        color={style.color}
        lineHeight="1"
      >
        {status}
      </Text>
    </HStack>
  );
};

const Direction = ({
  type,
  color,
}: {
  type: "up" | "down" | "none";
  color: string;
}) => {
  if (type === "none") {
    return (
      <Box
        w="17px"
        h="2px"
        borderRadius="4px"
        bg="#718096"
      />
    );
  }

  return (
    <Text
      fontSize="14px"
      fontWeight="900"
      color={color}
      lineHeight="1"
    >
      {type === "up" ? "▲" : "▼"}
    </Text>
  );
};

const RecommendationRow = ({
  item,
}: {
  item: Recommendation;
}) => {
  const Icon = item.icon;

  return (
    <Flex
      h="51px"
      minH="51px"
      w="100%"
      minW={0}
      borderRadius="11px"
      overflow="hidden"
      bg="white"
      border="1px solid #E6EDF5"
      boxShadow="0 1px 4px rgba(30,60,90,0.04)"
    >
      {/* Color strip */}
      <Box
        w="4px"
        minW="4px"
        bg={item.color}
      />

      {/* Number */}
      <Flex
        w="42px"
        minW="42px"
        bg={item.bg}
        align="center"
        justify="center"
      >
        <Text
          fontSize="17px"
          fontWeight="800"
          color={item.color}
        >
          {item.id}
        </Text>
      </Flex>

      {/* Icon */}
      <Flex
        w="44px"
        minW="44px"
        align="center"
        justify="center"
      >
        <Flex
          w="34px"
          h="34px"
          borderRadius="50%"
          bg={item.bg}
          align="center"
          justify="center"
        >
          <Icon
            size={19}
            color={item.color}
            strokeWidth={1.8}
          />
        </Flex>
      </Flex>

      {/* Content */}
      <Flex
        flex="1"
        minW={0}
        align="center"
        px="6px"
      >
        <Box
          minW={0}
          flex="1"
        >
          <Text
            fontSize="11px"
            fontWeight="800"
            color="#14284B"
            lineHeight="1.1"
            noOfLines={1}
          >
            {item.title}
          </Text>

          <Text
            fontSize="8px"
            color="#687A97"
            lineHeight="1.1"
            mt="2px"
            noOfLines={1}
          >
            {item.description}
          </Text>

          <Box mt="3px">
            <StatusBadge status={item.status} />
          </Box>
        </Box>

        {/* Metric */}
        <Flex
          w="105px"
          minW="105px"
          h="39px"
          borderRadius="8px"
          bg={item.bg}
          align="center"
          justify="space-between"
          px="8px"
          ml="5px"
        >
          <Box minW={0}>
            <Text
              fontSize="7px"
              color="#647897"
              lineHeight="1"
              mb="3px"
            >
              {item.metricTitle}
            </Text>

            <Text
              fontSize="10px"
              fontWeight="800"
              color={
                item.id === "04"
                  ? "#344762"
                  : item.color
              }
              lineHeight="1.05"
              noOfLines={2}
            >
              {item.metricValue}
            </Text>
          </Box>

          <Direction
            type={item.direction}
            color={item.color}
          />
        </Flex>

        {/* Arrow */}
        <Flex
          w="25px"
          minW="25px"
          h="25px"
          ml="6px"
          borderRadius="50%"
          bg="#EFF3F8"
          align="center"
          justify="center"
        >
          <FiChevronRight
            size={15}
            color="#5B6F8C"
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

const SummaryPanel = () => {
  return (
    <Box
      w="105px"
      minW="105px"
      h="100%"
      borderRadius="12px"
      bg="linear-gradient(145deg,#FFF9F4,#FFFDFC)"
      border="1px solid #F1E8DF"
      px="9px"
      py="10px"
    >
      {/* Compact donut */}
      <Flex
        justify="center"
        mb="7px"
      >
        <Box
          w="63px"
          h="63px"
          borderRadius="50%"
          bg="conic-gradient(#20C77D 0deg 90deg,#7350E8 90deg 180deg,#1976ED 180deg 270deg,#F59A14 270deg 360deg)"
          p="6px"
        >
          <Flex
            w="100%"
            h="100%"
            borderRadius="50%"
            bg="#FFFDFC"
            align="center"
            justify="center"
            direction="column"
          >
            <Text
              fontSize="18px"
              fontWeight="800"
              color="#10254A"
              lineHeight="1"
            >
              4
            </Text>

            <Text
              fontSize="5px"
              color="#334D72"
              mt="2px"
            >
              Recommendations
            </Text>
          </Flex>
        </Box>
      </Flex>

      {/* Legend */}
      <VStack
        spacing="5px"
        align="stretch"
      >
        {[
          ["#19C37D", "Active"],
          ["#1976ED", "Pending"],
          ["#F59A14", "Scheduled"],
          ["#7550E9", "No Change"],
        ].map(([color, label]) => (
          <HStack
            key={label}
            justify="space-between"
          >
            <HStack spacing="4px">
              <Circle
                size="7px"
                bg={color}
              />

              <Text
                fontSize="7px"
                color="#64748B"
              >
                {label}
              </Text>
            </HStack>

            <Text
              fontSize="7px"
              fontWeight="700"
              color="#172A4D"
            >
              1
            </Text>
          </HStack>
        ))}
      </VStack>

      <Divider
        my="7px"
        borderColor="#EDE3D9"
      />

      {/* Action */}
      <HStack
        spacing="5px"
        align="center"
      >
        <Flex
          w="20px"
          h="20px"
          minW="20px"
          borderRadius="50%"
          bg="#FF5A0A"
          align="center"
          justify="center"
        >
          <Text
            color="white"
            fontSize="14px"
            fontWeight="900"
          >
            !
          </Text>
        </Flex>

        <Box>
          <Text
            fontSize="9px"
            fontWeight="800"
            color="#B9470B"
            lineHeight="1.1"
          >
            1 Action Suggested
          </Text>

          <Text
            fontSize="9px"
            color="#707070"
            mt="2px"
          >
            Review and take action
          </Text>
        </Box>
      </HStack>
    </Box>
  );
};

const EMSRecommendation = () => {
  const [isValuesOpen, setIsValuesOpen] = React.useState(false);
  const [values, setValues] = React.useState({
    soc: "",
    power: "",
    load: "",
  });
  const [submittedValues, setSubmittedValues] = React.useState<{
    soc: string;
    power: string;
    load: string;
  } | null>(null);

  const cardBg = useColorModeValue(
    "#FFFFFF",
    "#0B1B2B"
  );

  const borderColor = useColorModeValue(
    "#E4EBF3",
    "#23384D"
  );

  const handleValuesSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedValues(values);
    setIsValuesOpen(false);
  };

  const displayRecommendations = recommendations.map((item) => {
    if (!submittedValues) return item;

    if (item.id === "02") {
      return {
        ...item,
        metricTitle: "BESS Power / SOC",
        metricValue: (
          <>
            {submittedValues.power} kW
            <br />
            SOC {submittedValues.soc}%
          </>
        ),
      };
    }

    if (item.id === "03") {
      return {
        ...item,
        metricTitle: "Load",
        metricValue: `${submittedValues.load} MW`,
      };
    }

    return item;
  });

  return (
    <>
    <Box
      w="700px"
      h="320px"
      minW={0}
      maxW="100%"
      overflow="hidden"
      position="relative"
      borderRadius="13px"
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      boxShadow="0 2px 8px rgba(40,75,120,0.06)"
      fontFamily="'Poppins', sans-serif"
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <Flex
        h="48px"
        minH="48px"
        px="11px"
        align="center"
        justify="space-between"
        borderBottom="1px solid"
        borderColor={borderColor}
      >
        {/* Left title */}
        <HStack
          spacing="8px"
          minW={0}
        >
          

          <Box minW={0}>
            <Text
              fontSize="14px"
              fontWeight="800"
              color="#10254A"
              lineHeight="1"
              noOfLines={1}
            >
              EMS Recommendation
            </Text>

            <Text
              fontSize="7px"
              color="#607594"
              mt="3px"
              noOfLines={1}
            >
              Real-time system actions and suggestions
            </Text>
          </Box>
        </HStack>

        {/* Action */}
        <Flex
          h="29px"
          px="10px"
          borderRadius="8px"
          bg="#FFF0E7"
          align="center"
          gap="5px"
          flexShrink={0}
        >
          <Flex
            w="17px"
            h="17px"
            borderRadius="50%"
            bg="#FF5A0A"
            align="center"
            justify="center"
          >
            <Text
              color="white"
              fontSize="12px"
              fontWeight="900"
              lineHeight="1"
            >
              !
            </Text>
          </Flex>

          <Text
            fontSize="8px"
            fontWeight="800"
            color="#BE4D12"
          >
            Action Suggested
          </Text>
        </Flex>

        <Button
          h="29px"
          px="10px"
          bg="#1467E8"
          color="white"
          fontSize="8px"
          _hover={{ bg: "#125BCB" }}
          onClick={() => setIsValuesOpen(true)}
        >
          Enter Values
        </Button>

        {/* Time */}
        <HStack
          spacing="5px"
          flexShrink={0}
        >
          <FiClock
            size={17}
            color="#647997"
          />

          <Box>
            <Text
              fontSize="10px"
              fontWeight="700"
              color="#526A8B"
              lineHeight="1"
            >
              14:31:20
            </Text>

            <Text
              fontSize="6px"
              color="#526A8B"
              mt="3px"
              textAlign="right"
            >
              29 Sep 2025
            </Text>
          </Box>
        </HStack>
      </Flex>

      {/* =====================================================
          BODY
      ====================================================== */}
      <Flex
        h="272px"
        p="8px"
        gap="8px"
        minW={0}
      >
        {/* LEFT SUMMARY */}
        <SummaryPanel />

        {/* RIGHT LIST */}
        <VStack
          flex="1"
          minW={0}
          spacing="5px"
          align="stretch"
          overflow="hidden"
        >
          {displayRecommendations.map((item) => (
            <RecommendationRow
              key={item.id}
              item={item}
            />
          ))}
        </VStack>
      </Flex>
    </Box>

    {isValuesOpen && (
      <Flex
        position="absolute"
        inset={0}
        zIndex={2}
        align="center"
        justify="center"
        bg="rgba(5, 18, 31, 0.58)"
        p={3}
      >
        <Box
          w="100%"
          maxW="320px"
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="12px"
          boxShadow="0 8px 28px rgba(0,0,0,0.25)"
          p={3}
        >
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontSize="sm" fontWeight="700" color="#10254A">
              Enter BESS and Load Values
            </Text>
            <Button
              size="xs"
              variant="ghost"
              aria-label="Close values form"
              onClick={() => setIsValuesOpen(false)}
            >
              ×
            </Button>
          </Flex>
          <form id="ems-values-form" onSubmit={handleValuesSubmit}>
            <VStack spacing={2} align="stretch">
              <FormControl isRequired>
                <FormLabel fontSize="xs" mb={1}>BESS SOC (%)</FormLabel>
                <Input
                  type="number"
                  size="sm"
                  h="32px"
                  min={0}
                  max={100}
                  step="any"
                  value={values.soc}
                  onChange={(event) =>
                    setValues({ ...values, soc: event.target.value })
                  }
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="xs" mb={1}>BESS Power (kW)</FormLabel>
                <Input
                  type="number"
                  size="sm"
                  h="32px"
                  step="any"
                  value={values.power}
                  onChange={(event) =>
                    setValues({ ...values, power: event.target.value })
                  }
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="xs" mb={1}>Load (MW)</FormLabel>
                <Input
                  type="number"
                  size="sm"
                  h="32px"
                  min={0}
                  step="any"
                  value={values.load}
                  onChange={(event) =>
                    setValues({ ...values, load: event.target.value })
                  }
                />
              </FormControl>
              <Text fontSize="10px" lineHeight="1.2" color="gray.500">
                Values update this card only; backend submission is not connected yet.
              </Text>
              <Flex justify="flex-end" gap={2}>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => setIsValuesOpen(false)}
                >
                  Cancel
                </Button>
                <Button size="xs" colorScheme="blue" type="submit">
                  Add Values
                </Button>
              </Flex>
            </VStack>
          </form>
        </Box>
      </Flex>
    )}
    </>
  );
};

export default EMSRecommendation;