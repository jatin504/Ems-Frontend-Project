import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { useEffect } from "react";
import useTimeseriesData from "../../../hooks/useTimeseriesData";

export default function TransformerSLD({serial}: { serial: string }) {
  const primaryBg = useColorModeValue(
    "primary.light",
    "primary.dark"
  );

  const primaryColor = useColorModeValue(
    "primaryText.light",
    "primaryText.dark"
  );

  const secondaryColor = useColorModeValue(
    "secondaryText.light",
    "secondaryText.dark"
  );

  const strokeColor = useColorModeValue(
    "black",
    "white"
  );

  // ===== TIMESERIES HOOK =====
  const { data, fetchData } = useTimeseriesData();

  // ===== FETCH BREAKER STATUS =====
  useEffect(() => {
    fetchData({
      devices: {
        ids: ["plant_1_vcb_vcb_og_"+serial],
        patterns: [],
      },

      keys: [
        {
          key: "breaker_close",
          alias: "breaker_close",
          keyType: "timeseries",
        },
      ],

      aggregation: {
        func: "last",
        interval: 1,
        intervalType: "minute",
      },

      timeRange: {
        type: "last",
        interval: 1,
        intervalType: "day",
      },

      orderBy: "DESC",
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== DEBUG =====
  // console.log("BREAKER RESPONSE =>", data);

  // ===== DEVICE DATA =====
  const deviceData = Object.values(data || {})?.[0] as any;

  // ===== BREAKER VALUE =====
  const breakerValue = Number(
    deviceData?.breaker_close?.[0]?.value ?? 0
  );

  // ===== COLOR LOGIC =====
  // 0 => RED
  // 1 => GREEN
  const breakerColor =
    breakerValue === 1
      ? "limegreen"
      : "red";

  return (
    <Box
      width="320px"
      height="438px"
      p="16px"
      rounded="12px"
      bg={primaryBg}
      display="flex"
      flexDirection="column"
      color={primaryColor}
    >
      {/* ===== TITLE ===== */}
      <Text
        fontSize="16px"
        fontWeight="600"
        mb={2}
      >
        Bay Local / Remote
      </Text>

      {/* ===== SVG WRAPPER ===== */}
      <Box
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
      >
        <svg
          viewBox="0 0 300 420"
          preserveAspectRatio="xMidYMid meet"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* TOP BUS */}
          <line
            x1="30"
            y1="50"
            x2="270"
            y2="50"
            stroke={strokeColor}
            strokeWidth="2"
          />

          {/* MAIN VERTICAL LINE */}
          <line
            x1="150"
            y1="50"
            x2="150"
            y2="160"
            stroke={strokeColor}
            strokeWidth="2"
          />

          {/* ISOLATOR */}
          <circle
            cx="150"
            cy="105"
            r="4"
            fill={strokeColor}
          />

          <text
            x="180"
            y="110"
            fontSize="11"
            fill={secondaryColor}
          >
            89A
          </text>

          {/* BREAKER */}
          <rect
            x="135"
            y="160"
            width="30"
            height="30"
            fill={breakerColor}
          />

          <text
            x="180"
            y="180"
            fontSize="11"
            fill={secondaryColor}
          >
            52
          </text>

          {/* CONTINUE LINE */}
          <line
            x1="150"
            y1="190"
            x2="150"
            y2="255"
            stroke={strokeColor}
            strokeWidth="2"
          />

          {/* TRANSFORMER SYMBOL */}
          <ellipse
            cx="150"
            cy="275"
            rx="14"
            ry="10"
            fill="none"
            stroke="#5bc0eb"
            strokeWidth="2"
          />

          <ellipse
            cx="150"
            cy="290"
            rx="14"
            ry="10"
            fill="none"
            stroke="#f0ad4e"
            strokeWidth="2"
          />

          {/* TRANSFORMER TEXT */}
          <text
            x="180"
            y="275"
            fontSize="11"
            fill={secondaryColor}
          >
            33 / 11 KV
          </text>

          <text
            x="180"
            y="290"
            fontSize="11"
            fill={secondaryColor}
          >
            TRANSFORMER
          </text>

          <text
            x="180"
            y="305"
            fontSize="11"
            fill={secondaryColor}
          >
            
          </text>

          <text
            x="180"
            y="320"
            fontSize="11"
            fill={secondaryColor}
          >
            
          </text>

          {/* DOWN LINE */}
          <line
            x1="150"
            y1="300"
            x2="150"
            y2="355"
            stroke={strokeColor}
            strokeWidth="2"
          />

          {/* EARTH / DELTA */}
          <polygon
            points="150,380 135,350 165,350"
            fill="none"
            stroke="red"
            strokeWidth="2"
          />

          {/* BOTTOM TEXT */}
          <text
            x="105"
            y="410"
            fontSize="11"
            fill={secondaryColor}
          >
            TO 33 KV SIDE
          </text>

          {/* INTERLOCK BOX */}
          <rect
            x="210"
            y="90"
            width="80"
            height="80"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.5"
          />

          <text
            x="220"
            y="105"
            fontSize="11"
            fontWeight="600"
            fill={secondaryColor}
          >
            INTERLOCK
          </text>

          {/* 52 STATUS (always green) */}
          <circle cx="225" cy="125" r="5" fill="limegreen" />

          <text x="240" y="130" fontSize="11" fill="limegreen">
            52
          </text>

          {/* 89A STATUS */}
          <circle
            cx="225"
            cy="145"
            r="5"
            fill="#9CA3AF"
          />

          <text
            x="240"
            y="150"
            fontSize="11"
            fill="#9CA3AF"
          >
            89A
          </text>
        </svg>
      </Box>
    </Box>
  );
}