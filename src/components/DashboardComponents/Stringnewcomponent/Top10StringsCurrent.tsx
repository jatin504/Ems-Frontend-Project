import React, {
  useEffect,
  useMemo,
} from "react";

import {
  Box,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import useTimeseriesData from "../../../hooks/useTimeseriesData";

interface WidgetPoint {
  ts: number;
  value: number | null;
}

interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}

const stringRows = Array.from(
  { length: 24 },
  (_, i) => i + 1
);

const Top10StringsCurrent = () => {

  const bg = useColorModeValue(
    "#ffffff",
    "#0F2235"
  );

  const border = useColorModeValue(
    "#E6EEF6",
    "#1F3B56"
  );

  const text = useColorModeValue(
    "gray.800",
    "white"
  );

  const sub = useColorModeValue(
    "#5A6B78",
    "#8FA8C0"
  );

  const { data, fetchData } =
    useTimeseriesData();

  /* ================= API ================= */

  useEffect(() => {

    const fetchTopStrings = () => {

      fetchData({
        devices: {
          patterns: ["_inverter_inverter_"],
          ids: [],
        },

        keys: [
          ...stringRows.map((index) => ({
            key: `string_${index}_current`,
            alias: `string_${index}_current`,
            keyType: "common",
          })),
        ],

        aggregation: {
          func: "last",
          interval: 1,
          intervalType: "minute",
        },

        timeRange: {
          type: "relative",
          relativeType: "currentDaySoFar",
        },

        orderBy: "DESC",
      } as any);

    };

    fetchTopStrings();

    const interval = setInterval(() => {

      fetchTopStrings();

    }, 60000);

    return () => clearInterval(interval);

  }, []);

  /* ================= MAP ================= */

  const topStrings = useMemo(() => {

    const widgetData =
      data as WidgetData | null;

    if (!widgetData) return [];

    const allStrings: any[] = [];

    Object.keys(widgetData)

      /* DEVICE ID SORT */

      .sort((a, b) =>
        a.localeCompare(
          b,
          undefined,
          {
            numeric: true,
          }
        )
      )

      .forEach((deviceId) => {

        const device =
          widgetData[deviceId];

        stringRows.forEach((index) => {

          const key =
            `string_${index}_current`;

          const arr =
            device[key];

          const value =
            arr &&
            arr.length > 0
              ? Number(
                  arr[
                    arr.length - 1
                  ]?.value ?? 0
                )
              : 0;

          allStrings.push({

            rank: 0,

            deviceId,

            stringName:
              `STR-${String(index).padStart(2, "0")}`,

            current: value,

            status: "---",

          });

        });

      });

    const sorted = allStrings

      .filter(
        (item) =>
          item.current !== null
      )

      .sort(
        (a, b) =>
          b.current - a.current
      )

      .slice(0, 10)

      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));

    return sorted;

  }, [data]);

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="12px"
      p={4}
      overflowY="auto"
      h="320px"
      maxH="320px"
      sx={{
        "&::-webkit-scrollbar": {
          width: "6px",
        },
      }}
    >

      {/* ================= TITLE ================= */}

      <Text
        color={text}
        fontWeight="700"
        fontSize="13px"
        mb={4}
      >
        Top 10 Strings by Current
      </Text>

      {/* ================= HEADER ================= */}

      <Flex
        px={1}
        pb={2}
        borderBottom="1px solid"
        borderColor={border}
        mb={2}
        gap={2}
      >

        <Text
          color={sub}
          fontSize="11px"
          w="35px"
        >
          Rank
        </Text>

        <Text
          color={sub}
          fontSize="11px"
          flex={1}
        >
          String ID
        </Text>

        <Text
          color={sub}
          fontSize="11px"
          w="70px"
          textAlign="right"
        >
          Current (A)
        </Text>

        <Text
          color={sub}
          fontSize="11px"
          w="60px"
          textAlign="right"
        >
          Status
        </Text>

      </Flex>

      {/* ================= ROWS ================= */}

      {topStrings.map(
        (item, index) => (

          <Flex
            key={index}
            align="center"
            py={2}
            px={1}
            borderBottom="1px solid"
            borderColor={border}
            gap={2}
          >

            {/* RANK */}

            <Text
              color={text}
              fontSize="12px"
              w="35px"
            >
              {item.rank}
            </Text>

            {/* STRING */}

            <Box
              flex={1}
              minW={0}
            >

              <Text
  color={sub}
  fontSize="10px"
  noOfLines={1}
>
  {item.deviceId
    ?.split("_inverter_")
    ?.pop()
    ?.replace(
      "inverter_",
      "Inverter_"
    ) || item.deviceId}
</Text>

              <Text
                color={text}
                fontSize="12px"
                fontWeight="600"
              >
                {item.stringName}
              </Text>

            </Box>

            {/* CURRENT */}

            <Text
              color={text}
              fontSize="12px"
              fontWeight="700"
              w="70px"
              textAlign="right"
              whiteSpace="nowrap"
            >
              {item.current.toFixed(2)}
            </Text>

            {/* STATUS */}

            <Text
              color="#FF6B35"
              fontSize="12px"
              w="60px"
              textAlign="right"
              whiteSpace="nowrap"
            >
              {item.status}
            </Text>

          </Flex>
        )
      )}

    </Box>
  );
};

export default Top10StringsCurrent;