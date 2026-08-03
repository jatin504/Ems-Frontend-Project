import React, {
  useEffect,
  useMemo,
} from "react";

import {
  Box,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";

import useTimeseriesData from "../../../hooks/useTimeseriesData";

interface WidgetPoint {
  ts: number;
  value: number;
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

const StringGroupSummary = () => {

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

    const fetchSummary = () => {

      fetchData({
        devices: {
          patterns: ["_inverter_inverter_"],
          ids: [],
        },

        keys: [

          {
            key: "total_dc_power",
            alias: "total_dc_power",
            keyType: "common",
          },

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

    fetchSummary();

    const interval = setInterval(() => {

      fetchSummary();

    }, 60000);

    return () => clearInterval(interval);

  }, []);

  /* ================= MAP ================= */

  const rows = useMemo(() => {

    const widgetData =
      data as WidgetData | null;

    if (!widgetData) return [];

    const groupedData: any = {};

    Object.keys(widgetData).forEach(
      (deviceId) => {

        const d = widgetData[deviceId];

        /* ===== DEVICE ID ===== */

        if (!groupedData[deviceId]) {

          groupedData[deviceId] = {

            group: deviceId.replace("plant_1_", "").replace("_inverter_", " "),

            total: 0,

            online: 0,

            offline: 0,

            high: 0,

            low: 0,

            power: 0,

            currents: [],
          };

        }

        /* ===== POWER ===== */

        const powerArr =
          d["total_dc_power"];

        const power =
          powerArr &&
          powerArr.length > 0
            ? Number(
                powerArr[
                  powerArr.length - 1
                ]?.value
              )
            : 0;

        groupedData[deviceId]
          .power += power;

        /* ===== STRING ===== */

        stringRows.forEach((index) => {

          groupedData[deviceId]
            .total += 1;

          const arr =
            d[
              `string_${index}_current`
            ];

          const value =
            arr &&
            arr.length > 0
              ? Number(
                  arr[
                    arr.length - 1
                  ]?.value
                )
              : 0;

          groupedData[deviceId]
            .currents.push(value);

          if (value > 0) {

            groupedData[deviceId]
              .online += 1;

          } else {

            groupedData[deviceId]
              .offline += 1;

          }

          if (value > 12) {

            groupedData[deviceId]
              .high += 1;

          }

          if (
            value > 0 &&
            value < 1
          ) {

            groupedData[deviceId]
              .low += 1;

          }

        });

      }
    );

    const values = Object.values(groupedData);

    values.sort((a: any, b: any) => {
      const getLastNumber = (s: string) => {
        const m = s && s.toString().match(/(\d+)(?!.*\d)/);
        return m ? parseInt(m[1], 10) : NaN;
      };

      const na = getLastNumber(a.group);
      const nb = getLastNumber(b.group);

      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      if (!isNaN(na)) return -1;
      if (!isNaN(nb)) return 1;
      return a.group.toString().localeCompare(b.group.toString());
    });

    return values.map((g: any) => {

      const avg =
        g.currents.length > 0
          ? (
              g.currents.reduce(
                (
                  a: number,
                  b: number
                ) => a + b,
                0
              ) /
              g.currents.length
            ).toFixed(2)
          : "--";

      const max =
        g.currents.length > 0
          ? Math.max(
              ...g.currents
            ).toFixed(2)
          : "--";

      const min =
        g.currents.length > 0
          ? Math.min(
              ...g.currents
            ).toFixed(2)
          : "--";

      const onlinePercent =
        (
          (g.online / g.total) *
          100
        ).toFixed(1);

      const offlinePercent =
        (
          (g.offline / g.total) *
          100
        ).toFixed(1);

      const highPercent =
        (
          (g.high / g.total) *
          100
        ).toFixed(1);

      const lowPercent =
        (
          (g.low / g.total) *
          100
        ).toFixed(1);

      return {

        group: g.group,

        total: g.total,

        online: `${g.online} (${onlinePercent}%)`,

        high: `${g.high} (${highPercent}%)`,

        low: `${g.low} (${lowPercent}%)`,

        offline: `${g.offline} (${offlinePercent}%)`,

        avg,

        max,

        min,

        power:
          (
            g.power / 1000
          ).toFixed(2),
      };

    });

  }, [data]);

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="12px"
      p={4}
      overflowX="auto"
      overflowY="auto"
      h="260px"
      maxH="320px"
      sx={{
        "&::-webkit-scrollbar": {
          width: "6px",
          height: "6px",
        },
      }}
    >
      <Text
        color={text}
        fontWeight="700"
        fontSize="13px"
        mb={4}
      >
        STRING GROUP SUMMARY
      </Text>

      <Table size="sm">
        <Thead
          position="sticky"
          top={0}
          zIndex={1}
          bg={bg}
        >
          <Tr>
            <Th color={sub}>Group</Th>
            <Th color={sub}>Total</Th>
            <Th color={sub}>Online</Th>
            <Th color={sub}>High</Th>
            <Th color={sub}>Low</Th>
            <Th color={sub}>Offline</Th>
            <Th color={sub}>Avg</Th>
            <Th color={sub}>Max</Th>
            <Th color={sub}>Min</Th>
            <Th color={sub}>DC Power (kW)</Th>
          </Tr>
        </Thead>

        <Tbody>
          {rows.map(
            (row: any, index) => (
              <Tr key={index}>

                <Td textTransform={"capitalize"} color={text}>
                  {row.group}
                </Td>

                <Td color={text}>
                  {row.total}
                </Td>

                <Td color={text}>
                  {row.online}
                </Td>

                <Td color={text}>
                  {row.high}
                </Td>

                <Td color={text}>
                  {row.low}
                </Td>

                <Td color={text}>
                  {row.offline}
                </Td>

                <Td color={text}>
                  {row.avg}
                </Td>

                <Td color={text}>
                  {row.max}
                </Td>

                <Td color={text}>
                  {row.min}
                </Td>

                <Td color={text}>
                  {row.power}
                </Td>

              </Tr>
            )
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default StringGroupSummary;