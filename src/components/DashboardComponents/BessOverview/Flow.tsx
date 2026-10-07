import React from "react";
import { keyframes } from "@emotion/react";
import {
  Box,
  Flex,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import WidgetTitle from "../../Common/WidgetTitle";

const GridIcon = () => (
  <svg width="42" height="88" viewBox="0 0 42 88" fill="none">
    <g stroke="#7B8794" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">

      {/* Main Legs */}
      <path d="M21 4 L7 84" />
      <path d="M21 4 L35 84" />
      <path d="M21 4 L21 84" />

      {/* Top */}
      <path d="M13 12 L29 12" />
      <path d="M10 18 L32 18" />

      {/* Arms */}
      <path d="M6 26 L36 26" />
      <path d="M8 38 L34 38" />
      <path d="M10 50 L32 50" />
      <path d="M12 62 L30 62" />

      {/* Cross Bracing */}
      <path d="M13 12 L21 18 L29 12" />
      <path d="M6 26 L21 18 L36 26" />
      <path d="M8 38 L21 26 L34 38" />
      <path d="M10 50 L21 38 L32 50" />
      <path d="M12 62 L21 50 L30 62" />
      <path d="M10 84 L21 62 L32 84" />

      {/* Base */}
      <path d="M4 84 H38" />

      {/* Hanging Insulators */}
      <line x1="6" y1="26" x2="6" y2="32" />
      <line x1="36" y1="26" x2="36" y2="32" />
      <line x1="8" y1="38" x2="8" y2="43" />
      <line x1="34" y1="38" x2="34" y2="43" />

    </g>
  </svg>
);

const PCSIcon = () => (
  <svg width="24" height="42" viewBox="0 0 24 42" fill="none">
    <rect
      x="2"
      y="2"
      width="20"
      height="38"
      rx="2"
      fill="white"
      stroke="#A0AEC0"
      strokeWidth="1.5"
    />

    <circle cx="12" cy="8" r="1.4" fill="#718096" />

    <path
      d="M8 16H16"
      stroke="#718096"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    <path
      d="M9 20H15"
      stroke="#718096"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    <path
      d="M8 24H16"
      stroke="#718096"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    <circle
      cx="12"
      cy="31"
      r="3"
      stroke="#718096"
      strokeWidth="1.4"
    />
  </svg>
);

const BatteryRack = () => (
  <svg width="34" height="86" viewBox="0 0 34 86" fill="none">
    <polygon
      points="4,8 24,3 24,77 4,83"
      fill="#636A74"
      stroke="#9AA3AE"
      strokeWidth="1"
    />

    <polygon
      points="24,3 30,7 30,81 24,77"
      fill="#4E545D"
      stroke="#8B949F"
      strokeWidth="1"
    />

    {Array.from({ length: 6 }).map((_, i) => (
      <g key={i}>
        <rect
          x="8"
          y={10 + i * 11}
          width="12"
          height="7"
          rx="1"
          fill="#3D434C"
        />
        <rect
          x="9"
          y={11 + i * 11}
          width="2"
          height="5"
          fill="#8BE65A"
        />
      </g>
    ))}
  </svg>
);

const LoadIcon = () => (
  <svg width="38" height="38" viewBox="0 0 48 48" fill="none">
    <path
      d="M8 36H40V21L33 16L28 23L20 15L12 22L8 20V36Z"
      stroke="#7C8795"
      strokeWidth="2"
      fill="none"
    />

    <rect
      x="14"
      y="27"
      width="5"
      height="9"
      fill="#7C8795"
    />

    <rect
      x="23"
      y="24"
      width="5"
      height="12"
      fill="#7C8795"
    />

    <rect
      x="32"
      y="19"
      width="3"
      height="17"
      fill="#7C8795"
    />

    <circle
      cx="33.5"
      cy="15"
      r="2"
      fill="#7C8795"
    />
  </svg>
);

const Flow = () => {
  const flowAnimation = keyframes`
    from {
      background-position-x: 0;
    }
    to {
      background-position-x: 18px;
    }
  `;
  const bg = useColorModeValue("#FFFFFF", "#0B1728");
  const border = useColorModeValue("#D8DEE8", "#344155");
  const text = useColorModeValue("#1A202C", "#FFFFFF");
  const sub = useColorModeValue("#5E6B7A", "#B8C3D1");
  const card = useColorModeValue("#F8FAFC", "#162437");

  return (
    <Box
      w="570px"
      h="100%"
      bg={bg}
      borderRadius="12px"
      px={4}
      py={3}
    >
      <Box mb={4}>
        <WidgetTitle color={text}>System Topology</WidgetTitle>
      </Box>

      <Flex
        h="210px"
        align="center"
        position="relative"
      >
        {/* GRID */}

        <Box w="40px" textAlign="center">
          <Text
            fontSize="13px"
            color={sub}
            mb={2}
          >
            Grid
          </Text>

          <GridIcon />
        </Box>

        <Box
          h="78px"
          w="1px"
          bg={border}
          mx={2}
        />

        <Box
          w="44px"
          h="2px"
          mx={1}
          alignSelf="center"
          bg="#22A8FF"
        />

        <Box
          w="360px"
          h="170px"
          position="absolute"
          left="86px"
          top="108px"
          pointerEvents="none"
        >
          <svg
            width="360"
            height="170"
            viewBox="0 0 360 170"
          >
            <path
              d="M0 0 V112 H316"
              fill="none"
              stroke="#22A8FF"
              strokeWidth="3"
              strokeDasharray="6 6"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="13;0"
                dur="0.7s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </Box>

        {/* PCS */}

        <Box
          w="90px"
          textAlign="center"
        >
          <Text
            fontSize="13px"
            color={sub}
            fontWeight="600"
          >
            PCS
          </Text>

          <Text
            fontSize="8px"
            color={sub}
            mb={2}
          >
            50 MW / 100 MWh
          </Text>

          <Flex
            h="72px"
            borderRadius="8px"
            border="1px solid"
            borderColor={border}
            bg={card}
            justify="center"
            align="center"
          >
            <PCSIcon />
          </Flex>
        </Box>

        {/* PCS → Battery / Load Step Line */}

        <Box
          w="70px"
          h="90px"
          mx={1}
          display="flex"
          alignItems="center"
        >
          <svg
            width="70"
            height="90"
            viewBox="0 0 70 90"
          >
            <path
              d="M0 70 H18 V8 H64"
              fill="none"
              stroke="#73D54C"
              strokeWidth="2"
              strokeDasharray="8 5"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="13;0"
                dur="0.7s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </Box>

        <Box
          w="90px"
          h="115px"
          position="absolute"
          left="199px"
          top="138px"
          pointerEvents="none"
        >
          <svg
            width="90"
            height="115"
            viewBox="0 0 90 115"
          >
            <path
              d="M0 0 H36 V74"
              fill="none"
              stroke="#22A8FF"
              strokeWidth="3"
              strokeDasharray="6 6"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="13;0"
                dur="0.7s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </Box>

        {/* Right Side */}

        <Flex
          direction="column"
          justify="space-between"
          align="center"
          h="180px"
          ml={4}
          pt={0}
          mt={-2}
        >
          <Box w="240px" mt={-55}>
            <Text
              textAlign="center"
              color={sub}
              fontWeight="600"
              fontSize="13px"
              mb={2}
            >
              Battery System
            </Text>

            <Box
              h="110px"
              border="1px solid"
              borderColor={border}
              borderRadius="10px"
              bg={card}
              px={3}
              display="flex"
              alignItems="center"
              justifyContent="space-evenly"
            >
              <BatteryRack />
              <BatteryRack />
              <BatteryRack />
              <BatteryRack />
            </Box>

            <Flex
              mt={2}
              justify="space-between"
              fontSize="11px"
              color={text}
              fontWeight="600"
              px={1}
            >
              <Text>10 Banks</Text>
              <Text>40 Racks</Text>
              <Text>280 Modules</Text>
              <Text>4480 Cells</Text>
            </Flex>
          </Box>

          <Box textAlign="center" mt={12}>
            <Text
              fontSize="13px"
              color={sub}
              mb={2}
            >
              Load
            </Text>
            <LoadIcon />
          </Box>
        </Flex>
      </Flex>

      <Box
        mt={8}
        mb={4}
        h="1px"
        bg={border}
      />

      <HStack
        justify="center"
        spacing={10}
        mt={4}
      >
        <HStack spacing={2}>
          <Box
            w="26px"
            borderTop="3px solid #22A8FF"
          />
          <Text fontSize="12px">AC Power</Text>
        </HStack>

        <HStack spacing={2}>
          <Box
            w="26px"
            borderTop="3px dashed #73D54C"
          />
          <Text fontSize="12px">DC Power</Text>
        </HStack>

        <HStack spacing={2}>
          <Box
            w="26px"
            borderTop="3px dashed #22A8FF"
          />
          <Text fontSize="12px">Communication</Text>
        </HStack>
      </HStack>
    </Box>
  );
};

export default Flow;