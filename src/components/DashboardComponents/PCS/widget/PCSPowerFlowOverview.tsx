import React from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";

/* ================= Battery SVG ================= */

const BatteryIcon = ({ color = "#8DE44B" }: { color?: string }) => (
  <svg
    width="56"
    height="56"
    viewBox="0 0 34 34"
    fill="none"
    style={{ transform: "scale(1.28)" }}
  >
    <rect
      x="5"
      y="6"
      width="22"
      height="22"
      rx="3"
      stroke={color}
      strokeWidth="2"
    />

    <rect
      x="27"
      y="13"
      width="2.8"
      height="8"
      rx="1"
      fill={color}
    />

    <rect
      x="8"
      y="9"
      width="16"
      height="16"
      rx="2"
      fill={color}
    />

    <path
      d="M16.5 12
         L13.8 17
         H16
         L15.2 22
         L20 15.8
         H17.8
         L19 12
         Z"
      fill="white"
    />
  </svg>
);

/* ================= Flow Card ================= */

interface FlowCardProps {
  title: string;
  value: string;
  label: string;
  subValue: string;
  icon: React.ReactNode;
  inlineBottom?: boolean;
}

const FlowCard = ({
  title,
  value,
  label,
  subValue,
  icon,
  inlineBottom = false,
}: FlowCardProps) => {
  const cardBg = useColorModeValue("#F8FAFC", "#10263C");
  const cardBorder = useColorModeValue("rgba(15,23,42,0.12)", "#1D3957");
  const titleColor = useColorModeValue("#475569", "#D5E1EC");
  const valueColor = useColorModeValue("#0F172A", "white");
  const labelColor = useColorModeValue("#64748B", "#8DA4BA");
  const subValueColor = useColorModeValue("#0F172A", "white");
  const iconColor = useColorModeValue("#475569", "#E4E7EC");
  const renderedIcon = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<{ color?: string }>, {
        color: iconColor,
      })
    : icon;

  return (
    <Box
      w="92px"
      h="180px"
      bg={cardBg}
      border={`1px solid ${cardBorder}`}
      borderRadius="7px"
      px="8px"
      py="6px"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Text
        color={titleColor}
        fontSize="10px"
        mb={1}
      >
        {title}
      </Text>

      <Box
        mt={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        h="72px"
      >
        {renderedIcon}
      </Box>

      <Text
        mt={2}
        color={valueColor}
        fontSize="15px"
        fontWeight="700"
        textAlign="center"
        lineHeight="20px"
      >
        {value}
      </Text>

      {inlineBottom ? (
        <Flex
          mt="auto"
          w="100%"
          pt={1}
          justify="space-between"
          align="center"
          gap={1}
        >
          <Text
            color={labelColor}
            fontSize="10px"
            lineHeight="1.3"
            whiteSpace="nowrap"
          >
            {label}
          </Text>

          <Text
            color={subValueColor}
            fontSize="10px"
            fontWeight="600"
            textAlign="right"
            whiteSpace="nowrap"
            lineHeight="1.3"
          >
            {subValue}
          </Text>
        </Flex>
      ) : (
        <Box
          mt="auto"
          w="100%"
          pt={1}
        >
          <Text
            color={labelColor}
            fontSize="10px"
            lineHeight="1.3"
            mb={1}
          >
            {label}
          </Text>

          <Text
            color={subValueColor}
            fontSize="10px"
            fontWeight="600"
            textAlign="left"
            whiteSpace="pre-line"
            lineHeight="1.3"
          >
            {subValue}
          </Text>
        </Box>
      )}
    </Box>
  );
};

/* ================= Arrow ================= */

const FlowArrow = () => (
  <Flex
    flex="1"
    justify="center"
    align="center"
    px={2}
  >
    <Box
      className="flow-arrow"
      position="relative"
      w="75px"
      h="2px"
      bg="#4B8FFF"
      borderRadius="999px"
    >
      <Box
        position="absolute"
        right="-6px"
        top="-4px"
        borderTop="5px solid transparent"
        borderBottom="5px solid transparent"
        borderLeft="7px solid #4B8FFF"
      />
    </Box>
  </Flex>
);

/* ================= PCS SVG ================= */

const PCSIcon = ({ color = "#475569" }: { color?: string }) => (
  <svg width="60" height="60" viewBox="0 0 64 64" fill="none">
    <rect
      x="10"
      y="8"
      width="44"
      height="48"
      rx="4"
      stroke={color}
      strokeWidth="3"
    />

    <line
      x1="15"
      y1="51"
      x2="50"
      y2="13"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />

    <polyline
      points="18,28 22,20 26,28 30,23 34,28"
      stroke={color}
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <line
      x1="38"
      y1="41"
      x2="50"
      y2="41"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />

    <polygon
      points="38,41 42,38 42,44"
      fill={color}
    />

    <polygon
      points="50,41 46,38 46,44"
      fill={color}
    />

    <line
      x1="44"
      y1="33"
      x2="44"
      y2="49"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

/* ================= GRID SVG ================= */

const GridIcon = ({ color = "#9BBEFF" }: { color?: string }) => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 48 48"
    fill="none"
    style={{ transform: "scale(1.22)" }}
  >
    <g
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Top box */}
      <rect
        x="20"
        y="3"
        width="8"
        height="5"
        rx="1"
      />

      {/* Neck */}
      <line x1="24" y1="8" x2="24" y2="13" />

      {/* Top arm */}
      <line x1="16" y1="13" x2="32" y2="13" />

      <line x1="16" y1="13" x2="10" y2="17" />
      <line x1="32" y1="13" x2="38" y2="17" />

      {/* Second arm */}
      <line x1="12" y1="18" x2="36" y2="18" />

      <line x1="12" y1="18" x2="6" y2="22" />
      <line x1="36" y1="18" x2="42" y2="22" />

      {/* Main body */}
      <line x1="24" y1="13" x2="15" y2="42" />
      <line x1="24" y1="13" x2="33" y2="42" />

      {/* Center */}
      <line x1="24" y1="13" x2="24" y2="42" />

      {/* Cross braces */}
      <line x1="18" y1="20" x2="30" y2="27" />
      <line x1="30" y1="20" x2="18" y2="27" />

      <line x1="17" y1="27" x2="31" y2="34" />
      <line x1="31" y1="27" x2="17" y2="34" />

      <line x1="16" y1="34" x2="32" y2="40" />
      <line x1="32" y1="34" x2="16" y2="40" />

      {/* Bottom legs */}
      <line x1="15" y1="42" x2="11" y2="46" />
      <line x1="33" y1="42" x2="37" y2="46" />

      {/* Bottom bar */}
      <line x1="18" y1="39" x2="30" y2="39" />
    </g>
  </svg>
);

/* ================= Component ================= */

const PCSPowerFlowOverview = () => {
  const cardBg = useColorModeValue("#FFFFFF", "#0B2239");
  const cardBorder = useColorModeValue("rgba(15,23,42,.08)", "rgba(255,255,255,.06)");
  const titleColor = useColorModeValue("#0F172A", "white");

  return (
    <Box
      bg={cardBg}
      borderRadius="10px"
      border={`1px solid ${cardBorder}`}
      p={4}
      h="300px"
    >
      <Text
        color={titleColor}
        fontWeight="600"
        fontSize="13px"
        mb={5}
      >
        Power Flow Overview
      </Text>

      <Flex align="center">
        <FlowCard
          title="Battery"
          value="26.05 MW"
          label="SOC"
          subValue="56.2 %"
          icon={<BatteryIcon />}
          inlineBottom
        />

        <FlowArrow />

        <FlowCard
          title="PCS Fleet"
          value="25.40 MW"
          label="Efficiency"
          subValue="97.85 %"
          icon={<PCSIcon />}
          inlineBottom
        />

        <FlowArrow />

        <FlowCard
          title="PCC / Grid"
          value="25.38 MW"
          label="50.02 Hz"
          subValue="33.01 kV"
          icon={<GridIcon />}
        />
      </Flex>

      

      <style>
        {`
          @keyframes flowPulse {
            0% {
              opacity: .35;
              transform: scaleX(.75);
            }

            50% {
              opacity: 1;
              transform: scaleX(1);
            }

            100% {
              opacity: .35;
              transform: scaleX(.75);
            }
          }

          .flow-arrow{
            animation:flowPulse 1.3s linear infinite;
          }
        `}
      </style>
    </Box>
  );
};

export default PCSPowerFlowOverview;