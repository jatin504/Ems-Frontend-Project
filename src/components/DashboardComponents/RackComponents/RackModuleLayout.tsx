import React from "react";
import {
  Box,
  Flex,
  Grid,
  HStack,
  VStack,
  Text,
  Circle,
  Icon,
  keyframes,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  CheckCircleIcon,
  WarningIcon,
} from "@chakra-ui/icons";

import { FaRegCircle } from "react-icons/fa";

const modulesPerRack = Number(import.meta.env.VITE_MODULES_PER_RACK) || 4;
const modules = Array.from({ length: modulesPerRack }, (_, index) => ({
  id: String(index + 1).padStart(2, "0"),
  alarm: false,
}));

const floatAnim = keyframes`
  0%, 100% {
    transform: perspective(700px) rotateX(0deg) translateY(0px);
  }
  50% {
    transform: perspective(700px) rotateX(4deg) translateY(-6px);
  }
`;

const ledGlow = keyframes`
  0%{
    box-shadow:0 0 4px rgba(34,197,94,.4);
  }
  50%{
    box-shadow:
      0 0 8px rgba(34,197,94,.9),
      0 0 18px rgba(34,197,94,.7),
      0 0 28px rgba(34,197,94,.5);
  }
  100%{
    box-shadow:0 0 4px rgba(34,197,94,.4);
  }
`;

const getLineColor = (status: "normal" | "warning" | "alarm" | "offline") =>
  status === "normal"
    ? "#22C55E"
    : status === "warning"
    ? "#F59E0B"
    : status === "alarm"
    ? "#EF4444"
    : "#94A3B8";

const ModuleCard = ({
  id,
  alarm,
  selected,
  onClick,
}: {
  id: string;
  alarm: boolean;
  selected: boolean;
  onClick: () => void;
}) => {
  const bg = useColorModeValue("#FFFFFF", "#16232F");
  const border = useColorModeValue("#D8E2EE", "#2C4356");
  const title = useColorModeValue("#0F172A", "#FFFFFF");
  const label = useColorModeValue("#64748B", "#94A3B8");

  const moduleNo = Number(id);
  const voltage = (76.5 + moduleNo * 0.12).toFixed(2);
  const capacity = (148.5 + moduleNo * 0.35).toFixed(2);
  const temperature = (35.5 + moduleNo * 0.4).toFixed(1);

  return (
    <Box
      h="92px"
      bg={bg}
      borderWidth={selected ? "2px" : "1px"}
      borderStyle="solid"
      borderColor={selected ? "#2563EB" : border}
      borderRadius="8px"
      px="8px"
      py="6px"
      position="relative"
      textAlign="center"
      transformStyle="preserve-3d"
      animation={`${floatAnim} 8s ease-in-out infinite`}
      boxShadow={useColorModeValue("0 20px 35px rgba(15,23,42,0.08)", "0 20px 35px rgba(0,0,0,0.35)")}
      _hover={{ transform: "perspective(700px) rotateX(5deg) translateY(-4px)", boxShadow: "0 24px 45px rgba(59,130,246,0.18)" }}
      cursor="pointer"
      onClick={onClick}
    >
      <Flex justify="space-between" align="center" w="100%">

        <Circle
          size="14px"
          bg="#22C55E"
          boxShadow={
            alarm
              ? "0 0 8px rgba(34,197,94,.9), 0 0 16px rgba(34,197,94,.5)"
              : "none"
          }
          transition="all .3s ease"
          animation={alarm ? `${ledGlow} 1s infinite` : undefined}
        >
          <CheckCircleIcon
            color="white"
            boxSize={2.5}
          />
        </Circle>

        <Text
          fontSize="12px"
          fontWeight="700"
          color={title}
        >
          {id}
        </Text>

        {alarm ? (
          <WarningIcon
            color="#EF4444"
            boxSize={3}
          />
        ) : (
          <Circle
            size="12px"
            bg="#22C55E"
          >
            <CheckCircleIcon
              color="white"
              boxSize={2}
            />
          </Circle>
        )}

      </Flex>

      <Box mt="6px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" h="calc(100% - 24px)">
        <Text
          fontSize="9px"
          color={label}
          mb="2px"
        >
          Module-{id}
        </Text>

        <Text
          fontSize="11px"
          color={title}
          mb="1px"
          fontWeight="600"
        >
          {voltage} V
        </Text>

        <Text
          fontSize="11px"
          color={title}
          mb="1px"
          fontWeight="600"
        >
          {capacity} Ah
        </Text>

        <Text
          fontSize="11px"
          color={label}
        >
          {temperature} °C
        </Text>
      </Box>

    </Box>
  );
};

interface Props {
  rackId: string;
  selectedModule: string | null;
  onModuleSelect: (id: string) => void;
  onOpenDetails: () => void;
}

export default function RackModuleLayout({
  rackId,
  selectedModule,
  onModuleSelect,
  onOpenDetails,
}: Props) {

  void rackId;

  const bg = useColorModeValue("#FFFFFF", "#0D1720");
  const border = useColorModeValue("#E2E8F0", "#203344");
  const title = useColorModeValue("#1E293B", "#F8FAFC");
  const label = useColorModeValue("#64748B", "#94A3B8");

  return (

    <Box
      w="100%"
      h="100%"
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="10px"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >

      {/* HEADER */}

      <Flex
        h="46px"
        px="16px"
        justify="space-between"
        align="center"
        borderBottom="1px solid"
        borderColor={border}
      >

        <Text
          fontSize="15px"
          fontWeight="700"
          color={title}
        >
          Rack & Module Layout
        </Text>

        <HStack spacing="18px">

          <HStack spacing="5px">
            <Circle size="8px" bg="#22C55E" />
            <Text fontSize="11px" color={label}>Normal</Text>
          </HStack>

          <HStack spacing="5px">
            <Circle size="8px" bg="#F59E0B" />
            <Text fontSize="11px" color={label}>Warning</Text>
          </HStack>

          <HStack spacing="5px">
            <Circle size="8px" bg="#EF4444" />
            <Text fontSize="11px" color={label}>Alarm</Text>
          </HStack>

          <HStack spacing="5px">
            <Circle size="8px" bg="#CBD5E1" />
            <Text fontSize="11px" color={label}>Offline</Text>
          </HStack>

          <HStack spacing="5px">
            <Icon
              as={FaRegCircle}
              color="#3B82F6"
              boxSize={3}
            />

            <Text
              cursor={selectedModule ? "pointer" : "not-allowed"}
              color={selectedModule ? "#2563EB" : "#94A3B8"}
              fontWeight="600"
              fontSize="11px"
              onClick={onOpenDetails}
            >
              Click for Details
            </Text>
          </HStack>

        </HStack>

      </Flex>
            {/* ================= BODY ================= */}

      <Flex
        flex="1"
        minH="0"
        position="relative"
        px="16px"
        py="14px"
      >

        {/* ================= LEFT BLOCK ================= */}

        <VStack
          w="60px"
          spacing="18px"
          align="center"
          mt="14px"
          position="relative"
          zIndex={2}
        >
          <Box
            w="46px"
            h="28px"
            bg="#2563EB"
            color="white"
            borderRadius="4px"
            fontSize="10px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            BMU
          </Box>

          <Box
            w="46px"
            h="28px"
            bg="#16A34A"
            color="white"
            borderRadius="4px"
            fontSize="10px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mt="18px"
          >
            BCU
          </Box>

          <Box
            w="46px"
            h="42px"
            bg="#D97706"
            color="white"
            borderRadius="4px"
            fontSize="10px"
            textAlign="center"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mt="8px"
          >
            HV
            <br />
            BOX
          </Box>
        </VStack>

        {/* ================= SVG CONNECTION ================= */}

        <Box
          position="absolute"
          left="60px"
          top="28px"
          zIndex={0}
          pointerEvents="none"
        >
          <svg width="210" height="250">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" />
              </filter>

              <circle id="energyDot" r="3" fill="#22C55E">
                <animate
                  attributeName="opacity"
                  values="0.2;1;0.2"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
              </circle>
            </defs>

            {/* Backbone */}
            <path
              d="M40 18 V195"
              stroke="#64748B"
              strokeWidth="2"
              strokeDasharray="5 4"
              fill="none"
            />

            {/* BMU */}
            <path
              d="M0 18 H40"
              stroke="#2563EB"
              strokeWidth="2"
              strokeDasharray="5 4"
              fill="none"
            />

            {/* BCU */}
            <path
              d="M0 79 H40"
              stroke="#16A34A"
              strokeWidth="2"
              strokeDasharray="5 4"
              fill="none"
            />

            {/* HV */}
            <path
              d="M0 141 H40"
              stroke="#D97706"
              strokeWidth="2"
              strokeDasharray="5 4"
              fill="none"
            />

            {/* Top Bus */}
            <path
              d="M40 18 H195"
              stroke="#2563EB"
              strokeWidth="2"
              strokeDasharray="6 6"
              fill="none"
            />
            <use href="#energyDot" fill="#22C55E" filter="url(#glow)">
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                path="M40 18 H195"
              />
            </use>

            {/* Bottom Bus */}
            <path
              d="M40 195 H195"
              stroke="#D97706"
              strokeWidth="2"
              strokeDasharray="6 6"
              fill="none"
            />
            <use href="#energyDot" fill="#22C55E" filter="url(#glow)">
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                path="M40 195 H195"
              />
            </use>

            {modules.map((m, index) => (
              <React.Fragment key={`t-${m.id}`}>
                <path
                  d={`M${60 + index * 35} 18 V36`}
                  stroke={getLineColor(m.alarm ? "alarm" : "normal")}
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  fill="none"
                />
                <use href="#energyDot" fill={m.alarm ? "#EF4444" : "#22C55E"} filter="url(#glow)">
                  <animateMotion
                    dur="1s"
                    repeatCount="indefinite"
                    path={`M${60 + index * 35} 18 V36`}
                  />
                </use>
              </React.Fragment>
            ))}

            {modules.map((m, index) => (
              <React.Fragment key={`b-${m.id}`}>
                <path
                  d={`M${60 + index * 35} 195 V176`}
                  stroke={getLineColor(m.alarm ? "alarm" : "normal")}
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  fill="none"
                />
                <use href="#energyDot" fill={m.alarm ? "#EF4444" : "#22C55E"} filter="url(#glow)">
                  <animateMotion
                    dur="1s"
                    repeatCount="indefinite"
                    path={`M${60 + index * 35} 195 V176`}
                  />
                </use>
              </React.Fragment>
            ))}

          </svg>
        </Box>

        {/* ================= MODULE GRID ================= */}

        <Grid
          flex="1"
          minH="0"
          ml="42px"
          templateColumns="repeat(4, minmax(110px, 1fr))"
          rowGap="8px"
          columnGap="8px"
          zIndex={2}
          alignItems="start"
          position="relative"
          overflowY="auto"
          overflowX="hidden"
        >
          {modules.map((m) => (
            <ModuleCard
              key={m.id}
              id={m.id}
              alarm={m.alarm}
              selected={selectedModule === m.id}
              onClick={() => onModuleSelect(m.id)}
            />
          ))}
        </Grid>

      </Flex>
            {/* ================= BOTTOM SUMMARY ================= */}

      <Flex
        h="46px"
        px="18px"
        align="center"
        justify="space-between"
        borderTop="1px solid"
        borderColor={border}
        flexShrink={0}
      >
        <HStack spacing="26px">

          <Text
            fontSize="12px"
            fontWeight="700"
            color={title}
          >
            Rack Total
          </Text>

          <HStack spacing="4px">
            <Text
              fontSize="11px"
              color={label}
            >
              Voltage:
            </Text>

            <Text
              fontSize="11px"
              fontWeight="700"
              color={title}
            >
              768.32 V
            </Text>
          </HStack>

          <HStack spacing="4px">
            <Text
              fontSize="11px"
              color={label}
            >
              Current:
            </Text>

            <Text
              fontSize="11px"
              fontWeight="700"
              color={title}
            >
              149.43 A
            </Text>
          </HStack>

          <HStack spacing="4px">
            <Text
              fontSize="11px"
              color={label}
            >
              Power:
            </Text>

            <Text
              fontSize="11px"
              fontWeight="700"
              color={title}
            >
              114.80 kW
            </Text>
          </HStack>

          <HStack spacing="4px">
            <Text
              fontSize="11px"
              color={label}
            >
              Energy:
            </Text>

            <Text
              fontSize="11px"
              fontWeight="700"
              color={title}
            >
              155.25 kWh
            </Text>
          </HStack>

        </HStack>

      </Flex>

    </Box>
  );
}