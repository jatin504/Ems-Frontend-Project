import React from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

const ThermalStatusCard = () => {
  const bg = useColorModeValue("#FFFFFF", "#1A202C");
  const border = useColorModeValue("#E8EDF3", "#2D3748");
  const title = useColorModeValue("#111827", "#F8FAFC");
  const shadow = useColorModeValue(
    "0 2px 8px rgba(15,23,42,0.05)",
    "none"
  );

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="14px"
      boxShadow={shadow}
      p={5}
      h="220px"
      w="100%"
      overflow="hidden"
    >
      <Text
        fontSize="18px"
        fontWeight="700"
        color={title}
        mb={3}
      >
        Thermal Status
      </Text>

      <Flex
        justify="space-between"
        align="flex-start"
        h="100%"
        gap={2}
      >
        <Box flex={1} minW={0}>
          <svg
            width="100%"
            height="150"
            viewBox="0 0 760 170"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="cabinet"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#FCFCFC"
                />
                <stop
                  offset="55%"
                  stopColor="#ECEFF2"
                />
                <stop
                  offset="100%"
                  stopColor="#D5DCE3"
                />
              </linearGradient>

              <linearGradient
                id="door"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop
                  offset="0%"
                  stopColor="#FFFFFF"
                />
                <stop
                  offset="100%"
                  stopColor="#E3E7EC"
                />
              </linearGradient>

              <filter id="shadow">
                <feDropShadow
                  dx="0"
                  dy="1"
                  stdDeviation="1"
                  floodOpacity=".18"
                />
              </filter>
            </defs>

            {/* ================= LEFT PCS ================= */}

            <g
              transform="translate(18 28)"
              filter="url(#shadow)"
            >
              {/* Tall Cabinet */}

              <rect
                x="32"
                y="0"
                width="44"
                height="64"
                rx="1"
                fill="url(#door)"
                stroke="#8E98A5"
              />

              <line
                x1="54"
                y1="3"
                x2="54"
                y2="61"
                stroke="#C1C8D0"
              />

              <circle
                cx="61"
                cy="32"
                r="2"
                fill="#404040"
              />

              {/* Lower Cabinet */}

              <rect
                x="0"
                y="64"
                width="175"
                height="58"
                rx="1"
                fill="url(#cabinet)"
                stroke="#98A4AF"
              />

              {/* Door 1 */}

              <rect
                x="5"
                y="67"
                width="30"
                height="52"
                fill="url(#door)"
                stroke="#8D98A5"
              />

              <rect
                x="14"
                y="80"
                width="10"
                height="10"
                fill="#AEB6BF"
                stroke="#6F7A86"
              />

              {/* Door 2 */}

              <rect
                x="37"
                y="67"
                width="48"
                height="52"
                fill="url(#door)"
                stroke="#8D98A5"
              />

              <line
                x1="61"
                y1="69"
                x2="61"
                y2="117"
                stroke="#C4CBD2"
              />

              {/* Door 3 */}

              <rect
                x="87"
                y="67"
                width="48"
                height="52"
                fill="url(#door)"
                stroke="#8D98A5"
              />

              <line
                x1="111"
                y1="69"
                x2="111"
                y2="117"
                stroke="#C4CBD2"
              />

              {/* Vent */}

              <rect
                x="137"
                y="67"
                width="33"
                height="52"
                fill="#EEF2F5"
                stroke="#9BA6B2"
              />

              <line x1="142" y1="74" x2="165" y2="74" stroke="#A9B2BC"/>
              <line x1="142" y1="79" x2="165" y2="79" stroke="#A9B2BC"/>
              <line x1="142" y1="84" x2="165" y2="84" stroke="#A9B2BC"/>
              <line x1="142" y1="89" x2="165" y2="89" stroke="#A9B2BC"/>
              <line x1="142" y1="94" x2="165" y2="94" stroke="#A9B2BC"/>
              <line x1="142" y1="99" x2="165" y2="99" stroke="#A9B2BC"/>
              <line x1="142" y1="104" x2="165" y2="104" stroke="#A9B2BC"/>
              <line x1="142" y1="109" x2="165" y2="109" stroke="#A9B2BC"/>

              {/* Base */}

              <rect
                x="-2"
                y="122"
                width="180"
                height="5"
                fill="#5E6670"
              />
            </g>

            {/* Lower Battery */}

            <g transform="translate(92 150)">
              <rect
                x="0"
                y="0"
                width="125"
                height="45"
                fill="url(#cabinet)"
                stroke="#98A5B2"
              />

              <line
                x1="42"
                y1="0"
                x2="42"
                y2="45"
                stroke="#C2CAD2"
              />

              <line
                x1="83"
                y1="0"
                x2="83"
                y2="45"
                stroke="#C2CAD2"
              />

              <circle cx="20" cy="4" r="1.2" fill="#22C55E"/>
              <circle cx="62" cy="4" r="1.2" fill="#22C55E"/>
              <circle cx="104" cy="4" r="1.2" fill="#22C55E"/>
            </g>
                        {/* ================= CENTER PCS ================= */}

            <g
              transform="translate(235 28)"
              filter="url(#shadow)"
            >
              {/* Tall Cabinet */}

              <rect
                x="32"
                y="0"
                width="44"
                height="64"
                rx="1"
                fill="url(#door)"
                stroke="#8E98A5"
              />

              <line
                x1="54"
                y1="3"
                x2="54"
                y2="61"
                stroke="#C1C8D0"
              />

              <circle
                cx="61"
                cy="32"
                r="2"
                fill="#404040"
              />

              {/* Lower Cabinet */}

              <rect
                x="0"
                y="64"
                width="175"
                height="58"
                rx="1"
                fill="url(#cabinet)"
                stroke="#98A4AF"
              />

              {/* Left Door */}

              <rect
                x="5"
                y="67"
                width="30"
                height="52"
                fill="url(#door)"
                stroke="#8D98A5"
              />

              <rect
                x="14"
                y="80"
                width="10"
                height="10"
                fill="#AEB6BF"
                stroke="#6F7A86"
              />

              {/* Middle Door */}

              <rect
                x="37"
                y="67"
                width="48"
                height="52"
                fill="url(#door)"
                stroke="#8D98A5"
              />

              <line
                x1="61"
                y1="69"
                x2="61"
                y2="117"
                stroke="#C4CBD2"
              />

              {/* Right Door */}

              <rect
                x="87"
                y="67"
                width="48"
                height="52"
                fill="url(#door)"
                stroke="#8D98A5"
              />

              <line
                x1="111"
                y1="69"
                x2="111"
                y2="117"
                stroke="#C4CBD2"
              />

              {/* Vent */}

              <rect
                x="137"
                y="67"
                width="33"
                height="52"
                fill="#EEF2F5"
                stroke="#9BA6B2"
              />

              {Array.from({ length: 8 }).map((_, i) => (
                <line
                  key={i}
                  x1="142"
                  y1={74 + i * 5}
                  x2="165"
                  y2={74 + i * 5}
                  stroke="#A9B2BC"
                />
              ))}

              {/* Base */}

              <rect
                x="-2"
                y="122"
                width="180"
                height="5"
                fill="#5E6670"
              />
            </g>

            {/* ================= IGBT TOP ================= */}

            <g transform="translate(250 0)">
              <rect
                width="96"
                height="44"
                rx="6"
                fill="#FFFFFF"
                stroke="#D5DDE6"
              />

              <text
                x="48"
                y="15"
                textAnchor="middle"
                fontSize="11"
                fill="#666"
                fontWeight="600"
              >
                IGBT Top
              </text>

              <text
                x="48"
                y="32"
                textAnchor="middle"
                fontSize="16"
                fill="#22C55E"
                fontWeight="700"
              >
                26.1 °C
              </text>

              <line
                x1="48"
                y1="44"
                x2="48"
                y2="93"
                stroke="#E53935"
                strokeWidth="1.2"
              />

              <circle
                cx="48"
                cy="93"
                r="3"
                fill="#E53935"
              />
            </g>
                        {/* ================= THIRD PCS ================= */}

            <g
              transform="translate(452 28)"
              filter="url(#shadow)"
            >
              {/* Tall Cabinet */}

              <rect
                x="32"
                y="0"
                width="44"
                height="64"
                rx="1"
                fill="url(#door)"
                stroke="#8E98A5"
              />

              <line
                x1="54"
                y1="3"
                x2="54"
                y2="61"
                stroke="#C1C8D0"
              />

              <circle
                cx="61"
                cy="32"
                r="2"
                fill="#404040"
              />

              {/* Lower Cabinet */}

              <rect
                x="0"
                y="64"
                width="175"
                height="58"
                rx="1"
                fill="url(#cabinet)"
                stroke="#98A4AF"
              />

              {/* Left Door */}

              <rect
                x="5"
                y="67"
                width="30"
                height="52"
                fill="url(#door)"
                stroke="#8D98A5"
              />

              <rect
                x="14"
                y="80"
                width="10"
                height="10"
                fill="#AEB6BF"
                stroke="#6F7A86"
              />

              {/* Middle Door */}

              <rect
                x="37"
                y="67"
                width="48"
                height="52"
                fill="url(#door)"
                stroke="#8D98A5"
              />

              <line
                x1="61"
                y1="69"
                x2="61"
                y2="117"
                stroke="#C4CBD2"
              />

              {/* Right Door */}

              <rect
                x="87"
                y="67"
                width="48"
                height="52"
                fill="url(#door)"
                stroke="#8D98A5"
              />

              <line
                x1="111"
                y1="69"
                x2="111"
                y2="117"
                stroke="#C4CBD2"
              />

              {/* Vent */}

              <rect
                x="137"
                y="67"
                width="33"
                height="52"
                fill="#EEF2F5"
                stroke="#9BA6B2"
              />

              {Array.from({ length: 8 }).map((_, i) => (
                <line
                  key={i}
                  x1="142"
                  y1={74 + i * 5}
                  x2="165"
                  y2={74 + i * 5}
                  stroke="#A9B2BC"
                />
              ))}

              {/* Base */}

              <rect
                x="-2"
                y="122"
                width="180"
                height="5"
                fill="#5E6670"
              />
            </g>

            {/* ================= IGBT MID ================= */}

            <g transform="translate(468 0)">
              <rect
                width="96"
                height="44"
                rx="6"
                fill="#FFFFFF"
                stroke="#D5DDE6"
              />

              <text
                x="48"
                y="15"
                textAnchor="middle"
                fontSize="11"
                fill="#666"
                fontWeight="600"
              >
                IGBT Mid
              </text>

              <text
                x="48"
                y="32"
                textAnchor="middle"
                fontSize="16"
                fill="#22C55E"
                fontWeight="700"
              >
                25.3 °C
              </text>

              <line
                x1="48"
                y1="44"
                x2="48"
                y2="93"
                stroke="#E53935"
                strokeWidth="1.2"
              />

              <circle
                cx="48"
                cy="93"
                r="3"
                fill="#E53935"
              />
            </g>

            {/* ================= CENTER BATTERY ================= */}

            <g transform="translate(305 150)">
              <rect
                width="125"
                height="45"
                fill="url(#cabinet)"
                stroke="#98A5B2"
              />

              <line
                x1="42"
                y1="0"
                x2="42"
                y2="45"
                stroke="#C2CAD2"
              />

              <line
                x1="83"
                y1="0"
                x2="83"
                y2="45"
                stroke="#C2CAD2"
              />

              <circle cx="20" cy="4" r="1.3" fill="#22C55E"/>
              <circle cx="62" cy="4" r="1.3" fill="#22C55E"/>
              <circle cx="104" cy="4" r="1.3" fill="#22C55E"/>
            </g>
                        {/* ================= RIGHT PCS ================= */}

            <g
              transform="translate(640 28)"
              filter="url(#shadow)"
            >
              {/* Tall Cabinet */}

              <rect
                x="32"
                y="0"
                width="44"
                height="64"
                rx="1"
                fill="url(#door)"
                stroke="#8E98A5"
              />

              <line
                x1="54"
                y1="3"
                x2="54"
                y2="61"
                stroke="#C1C8D0"
              />

              <circle
                cx="61"
                cy="32"
                r="2"
                fill="#404040"
              />

              {/* Lower Cabinet */}

              <rect
                x="0"
                y="64"
                width="175"
                height="58"
                rx="1"
                fill="url(#cabinet)"
                stroke="#98A4AF"
              />

              <rect
                x="5"
                y="67"
                width="30"
                height="52"
                fill="url(#door)"
                stroke="#8D98A5"
              />

              <rect
                x="14"
                y="80"
                width="10"
                height="10"
                fill="#AEB6BF"
                stroke="#6F7A86"
              />

              <rect
                x="37"
                y="67"
                width="48"
                height="52"
                fill="url(#door)"
                stroke="#8D98A5"
              />

              <line
                x1="61"
                y1="69"
                x2="61"
                y2="117"
                stroke="#C4CBD2"
              />

              <rect
                x="87"
                y="67"
                width="48"
                height="52"
                fill="url(#door)"
                stroke="#8D98A5"
              />

              <line
                x1="111"
                y1="69"
                x2="111"
                y2="117"
                stroke="#C4CBD2"
              />

              <rect
                x="137"
                y="67"
                width="33"
                height="52"
                fill="#EEF2F5"
                stroke="#9BA6B2"
              />

              {Array.from({ length: 8 }).map((_, i) => (
                <line
                  key={i}
                  x1="142"
                  y1={74 + i * 5}
                  x2="165"
                  y2={74 + i * 5}
                  stroke="#A9B2BC"
                />
              ))}

              <rect
                x="-2"
                y="122"
                width="180"
                height="5"
                fill="#5E6670"
              />
            </g>

            {/* ================= IGBT BOTTOM ================= */}

            <g transform="translate(685 0)">
              <rect
                width="102"
                height="44"
                rx="6"
                fill="#FFFFFF"
                stroke="#D6DEE7"
              />

              <text
                x="51"
                y="15"
                textAnchor="middle"
                fontSize="11"
                fill="#666"
                fontWeight="600"
              >
                IGBT Bottom
              </text>

              <text
                x="51"
                y="32"
                textAnchor="middle"
                fontSize="16"
                fill="#22C55E"
                fontWeight="700"
              >
                24.8 °C
              </text>
            </g>

            {/* ================= Bottom Labels ================= */}

            <text
              x="40"
              y="165"
              fontSize="12"
              fill="#666"
              fontWeight="600"
            >
              Ambient
            </text>

            <text
              x="40"
              y="184"
              fontSize="18"
              fill="#22C55E"
              fontWeight="700"
            >
              28.6 °C
            </text>

            <text
              x="310"
              y="165"
              fontSize="12"
              fill="#666"
              fontWeight="600"
            >
              Heatsink Inlet
            </text>

            <text
              x="322"
              y="184"
              fontSize="18"
              fill="#22C55E"
              fontWeight="700"
            >
              24.0 °C
            </text>

            <text
              x="585"
              y="165"
              fontSize="12"
              fill="#666"
              fontWeight="600"
            >
              Heatsink Outlet
            </text>

            <text
              x="595"
              y="184"
              fontSize="18"
              fill="#22C55E"
              fontWeight="700"
            >
              29.1 °C
            </text>

          </svg>
        </Box>

        {/* ================= TEMPERATURE SCALE ================= */}

        <VStack
          spacing={1}
          ml={2}
          mr={1}
          align="center"
          flexShrink={0}
        >
          <Text fontSize="12px" fontWeight="600">
            High
          </Text>

          <Box
            w="14px"
            h="100px"
            borderRadius="4px"
            border="1px solid #D4D8DD"
            bg="linear-gradient(to top,#22C55E 0%,#FACC15 55%,#DC2626 100%)"
            flexShrink={0}
          />

          <Text fontSize="12px" fontWeight="600">
            Low
          </Text>
        </VStack>
      </Flex>
    </Box>
  );
};

export default ThermalStatusCard;