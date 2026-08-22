import React from "react";
import {
  Box,
  Card,
  CardBody,
  Divider,
  Flex,
  HStack,
  Icon,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
import {
  MdBatteryChargingFull,
  MdElectricalServices,
  MdPower,
  MdSolarPower,
} from "react-icons/md";

type StepStatus = "completed" | "progress" | "pending";

interface StepItem {
  id: number;
  title: string;
  description: string;
  status: StepStatus;
  icon: React.ElementType;
}

const steps: StepItem[] = [
  {
    id: 1,
    title: "System Check",
    description: "Verify all prerequisites for black start",
    status: "completed",
    icon: MdBatteryChargingFull,
  },
  {
    id: 2,
    title: "Start Master PCS",
    description: "Start designated master PCS",
    status: "completed",
    icon: MdBatteryChargingFull,
  },
  {
    id: 3,
    title: "Energize Black Start Bus",
    description: "Energize 33 kV / 11 kV black start bus",
    status: "progress",
    icon: MdElectricalServices,
  },
  {
    id: 4,
    title: "Energize Aux Loads",
    description: "Power up auxiliary systems",
    status: "pending",
    icon: MdPower,
  },
  {
    id: 5,
    title: "Bring Online Additional PCS",
    description: "Synchronize and bring other PCS online",
    status: "pending",
    icon: MdBatteryChargingFull,
  },
  {
    id: 6,
    title: "Start Solar / Other Sources",
    description: "Start solar inverters or other generators",
    status: "pending",
    icon: MdSolarPower,
  },
];

const BlackStartSequence = () => {
  const cardBg = useColorModeValue("white", "#0F172A");
  const border = useColorModeValue("#E5E7EB", "#334155");
  const titleColor = useColorModeValue("#111827", "white");
  const subColor = useColorModeValue("#6B7280", "#94A3B8");

  const completedColor = "#16A34A";
  const progressColor = "#2563EB";
  const pendingColor = "#9CA3AF";

  const getCircleColor = (status: StepStatus) => {
    switch (status) {
      case "completed":
        return completedColor;
      case "progress":
        return progressColor;
      default:
        return "#FFFFFF";
    }
  };

  const getCircleBorder = (status: StepStatus) => {
    switch (status) {
      case "completed":
        return completedColor;
      case "progress":
        return progressColor;
      default:
        return "#D1D5DB";
    }
  };

  const getTextColor = (status: StepStatus) => {
    switch (status) {
      case "completed":
        return completedColor;
      case "progress":
        return progressColor;
      default:
        return pendingColor;
    }
  };

  const getStatusIcon = (status: StepStatus) => {
    switch (status) {
      case "completed":
        return CheckCircleIcon;
      case "progress":
        return WarningTwoIcon;
      default:
        return CheckCircleIcon;
    }
  };

  return (
    <Card
      bg={cardBg}
      border="1px solid"
      borderColor={border}
      borderRadius="12px"
      h="100%"
      boxShadow="sm"
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
          color={titleColor}
          mb={3}
        >
          Black Start Sequence (Manual)
        </Text>

        <VStack
          flex={1}
          align="stretch"
          spacing={2}
        >
          {steps.map((step) => {
            const StatusIcon = getStatusIcon(step.status);

            return (
              <Flex
                key={step.id}
                py={1}
                align="center"
                justify="space-between"
              >
                <HStack spacing={3} align="center">
                  <Flex
                    w="22px"
                    h="22px"
                    minW="22px"
                    borderRadius="full"
                    bg={getCircleColor(step.status)}
                    border="2px solid"
                    borderColor={getCircleBorder(step.status)}
                    color={
                      step.status === "pending"
                        ? "#6B7280"
                        : "white"
                    }
                    fontSize="11px"
                    fontWeight="700"
                    align="center"
                    justify="center"
                  >
                    {step.id}
                  </Flex>

                  <Flex
                    w="24px"
                    h="24px"
                    borderRadius="8px"
                    border="1px solid"
                    borderColor="#BBF7D0"
                    color="#22C55E"
                    align="center"
                    justify="center"
                  >
                    <Icon
                      as={step.icon}
                      boxSize={4}
                    />
                  </Flex>

                  <Box>
                    <Text
                      fontSize="12px"
                      fontWeight="700"
                      color={titleColor}
                      lineHeight="18px"
                    >
                      {step.title}
                    </Text>

                    <Text
                      mt="2px"
                      fontSize="9px"
                      color={subColor}
                      lineHeight="13px"
                    >
                      {step.description}
                    </Text>
                  </Box>
                </HStack>

                <HStack spacing={2}>
                  <Text
                    fontSize="10px"
                    fontWeight="700"
                    color={getTextColor(step.status)}
                    textTransform="uppercase"
                  >
                    {step.status === "completed"
                      ? "Completed"
                      : step.status === "progress"
                      ? "In Progress"
                      : "Pending"}
                  </Text>

                  <Icon
                    as={StatusIcon}
                    boxSize={3.5}
                    color={getTextColor(step.status)}
                  />
                </HStack>
              </Flex>
            );
          })}
        </VStack>

        <Divider my={3} />

        <Box
          border="1px solid"
          borderColor={border}
          borderRadius="10px"
          p={1.5}
          flexShrink={0}
          overflow="hidden"
        >
          <HStack
            spacing={0}
            align="stretch"
            divider={<Divider orientation="vertical" />}
          >
            <Box flex="1" p={1.5}>
              <Text
                fontSize="8px"
                color={subColor}
                mb={1}
              >
                Current Step
              </Text>

              <Text
                fontSize="15px"
                fontWeight="700"
                color={titleColor}
              >
                3 <Text as="span" fontSize="11px">of 6</Text>
              </Text>
            </Box>

            <Box flex="1" p={1.5}>
              <Text
                fontSize="8px"
                color={subColor}
                mb={1}
              >
                Elapsed Time
              </Text>

              <Text
                fontSize="15px"
                fontWeight="700"
                color={titleColor}
              >
                00:06:42
              </Text>
            </Box>

            <Box flex="1" p={1.5}>
              <Text
                fontSize="8px"
                color={subColor}
                mb={1}
              >
                Remaining Steps
              </Text>

              <Text
                fontSize="15px"
                fontWeight="700"
                color={titleColor}
              >
                3
              </Text>
            </Box>

            <Box flex="1" p={1.5}>
              <Text
                fontSize="8px"
                color={subColor}
                mb={1}
              >
                Estimated Time Remaining
              </Text>

              <Text
                fontSize="15px"
                fontWeight="700"
                color={titleColor}
              >
                00:08:15
              </Text>
            </Box>
          </HStack>
        </Box>
      </CardBody>
    </Card>
  );
};

export default BlackStartSequence;
       