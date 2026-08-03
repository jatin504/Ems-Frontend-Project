import React, {
  useEffect,
  useMemo,
} from "react";

import {
  Box,
  Flex,
  Text,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";

import useTimeseriesData from "../../../hooks/useTimeseriesData";

const RowItem = ({
  label,
  value,
}: any) => {

  const labelColor = useColorModeValue(
    "#7B92AA",
    "#7B92AA"
  );

  const valueColor = useColorModeValue(
    "#1A202C",
    "white"
  );

  return (
    <Flex
      align="center"
      justify="space-between"
      w="100%"
      mb="8px"
    >
      <Text
        fontSize="12px"
        fontWeight="500"
        color={labelColor}
        minW="110px"
        lineHeight="14px"
      >
        {label}
      </Text>

      <Text
        fontSize="12px"
        fontWeight="700"
        color={valueColor}
        flex="1"
        textAlign="left"
        pl={2}
        lineHeight="14px"
      >
        {value}
      </Text>
    </Flex>
  );
};

const InverterInfoSection = ({
  selectedDevice,
}: any) => {

  const { data, fetchData } =
    useTimeseriesData();

  const deviceId =
    selectedDevice?.value;

  /* ================= API HIT ================= */

  useEffect(() => {

    if (!deviceId) return;

    const fetchStatusData = () => {

      fetchData({
        devices: {
          patterns: [],
          ids: [deviceId],
        },

        keys: [
          {
            key: "active_power",
            alias: "active_power",
            keyType: "common",
          },
        ],

        aggregation: {
          func: "none",
          interval: 1,
          intervalType: "minute",
        },

        timeRange: {
          type: "relative",
          relativeType: "currentDaySoFar",
        },

        orderBy: "ASC",
      } as any);

    };

    fetchStatusData();

    const interval = setInterval(() => {

      fetchStatusData();

    }, 60000);

    return () => clearInterval(interval);

  }, [deviceId]);

  /* ================= DATA MAP ================= */

  const mappedData = useMemo(() => {

    if (
      !data ||
      !deviceId ||
      !(data as any)[deviceId]
    ) {

      return {
        activePower: 0,
        lastTs: 0,
      };
    }

    const d = (data as any)[deviceId];

    const activePowerArr =
      d["active_power"];

    const latestPoint =
      activePowerArr &&
      activePowerArr.length > 0
        ? activePowerArr[
            activePowerArr.length - 1
          ]
        : null;

    const latestValue =
      latestPoint?.value;

    const activePower =
      latestValue === null ||
      latestValue === undefined ||
      latestValue === ""
        ? null
        : Number(latestValue);

    const lastTs =
      latestPoint
        ? latestPoint.ts
        : 0;

    return {
      activePower,
      lastTs,
    };

  }, [data, deviceId]);

  /* ================= STATUS LOGIC ================= */

  const now = Date.now();

  let status = "STOP";

  let statusColor = "#EF4444";

  if (
    !mappedData.lastTs ||
    now - mappedData.lastTs >
      4 * 60 * 1000 ||
    mappedData.activePower === null
  ) {

    status = "NON-COMM";

    statusColor = "#F59E0B";

  } else if (
    mappedData.activePower > 0
  ) {

    status = "RUNNING";

    statusColor = "#22C55E";

  } else {

    status = "STOP";

    statusColor = "#EF4444";

  }

  /* ================= DEBUG LOGS ================= */

  console.log(
    "=============================="
  );

  console.log(
    "TIMESERIES DATA =>",
    data
  );

  console.log(
    "mappedData =>",
    mappedData
  );

  console.log(
    "status =>",
    status
  );

  console.log(
    "=============================="
  );

  return (
    <Flex
      bg={useColorModeValue(
        "white",
        "#131512"
      )}
      border={`1px solid ${useColorModeValue(
        "#E6EEF2",
        "#062D59"
      )}`}
      borderRadius="8px"
      h="100px"
      overflow="hidden"
      flex="1"
      align="center"
    >
      {/* IMAGE + NAME */}
      <Flex
        align="center"
        px={5}
        borderRight={`1px solid ${useColorModeValue(
          "#E6EEF2",
          "#173554"
        )}`}
        minW="230px"
        h="100%"
      >
        {/* SVG INVERTER */}
        <Box
          w="72px"
          h="84px"
          borderRadius="12px"
          mr={4}
          overflow="hidden"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="white"
          border={`2px solid ${statusColor}`}
          boxShadow={`0 0 14px ${statusColor}`}
        >
          <svg
            width="54"
            height="74"
            viewBox="0 0 54 74"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="4"
              y="2"
              width="46"
              height="70"
              rx="8"
              fill="#F5F5F5"
              stroke="#D9D9D9"
              strokeWidth="1.5"
            />

            <rect
              x="6"
              y="4"
              width="42"
              height="66"
              rx="7"
              fill={statusColor}
              fillOpacity="0.18"
            >
              <animate
                attributeName="fill-opacity"
                values="0.15;0.75;0.15"
                dur="1s"
                repeatCount="indefinite"
              />
            </rect>

            <circle
              cx="42"
              cy="10"
              r="1.5"
              fill="#D1D5DB"
            />

            <rect
              x="34"
              y="28"
              width="10"
              height="10"
              rx="2"
              fill="#111827"
            />

            <circle
              cx="39"
              cy="33"
              r="2"
              fill={statusColor}
            >
              <animate
                attributeName="opacity"
                values="1;0.2;1"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>

            <rect
              x="10"
              y="55"
              width="34"
              height="10"
              rx="2"
              fill="#111111"
            />

            <circle
              cx="38"
              cy="60"
              r="1"
              fill="#9CA3AF"
            />

            <circle
              cx="42"
              cy="60"
              r="1"
              fill="#9CA3AF"
            />
          </svg>
        </Box>

        {/* NAME */}
        <Box>
          <Text
            fontSize="28px"
            fontWeight="700"
            color={useColorModeValue(
              "gray.800",
              "white"
            )}
            lineHeight="28px"
          >
            {selectedDevice?.label ||
              "INV-01"}
          </Text>

          <Badge
            mt={3}
            bg={statusColor}
            color="white"
            fontSize="10px"
            fontWeight="700"
            px={4}
            py="5px"
            borderRadius="4px"
            letterSpacing="0.5px"
          >
            {status}
          </Badge>
        </Box>
      </Flex>

      {/* COLUMN 1 */}
      <Flex
        direction="column"
        justify="center"
        px={6}
        flex="1"
      >
        <RowItem
          label="Make"
          value={
            selectedDevice?.make ||
            "--"
          }
        />

        <RowItem
          label="Model"
          value={
            selectedDevice?.model ||
            "--"
          }
        />

        <RowItem
          label="S/N"
          value={
            selectedDevice?.sn ||
            "--"
          }
        />

        <RowItem
          label="AC Capacity"
          value={`${selectedDevice?.ac_capacity || "--"} kW`}
        />
      </Flex>

      {/* COLUMN 2 */}
      <Flex
        direction="column"
        justify="center"
        px={6}
        flex="1"
        borderLeft={`1px solid ${useColorModeValue(
          "#E6EEF2",
          "#173554"
        )}`}
      >
        <RowItem
          label="Connected DC"
          value={`${selectedDevice?.dc_capacity || "--"} kW`}
        />

        <RowItem
          label="Operating Time"
          value="3175 Hrs"
        />

        <RowItem
          label="Last Data Update"
          value={
  mappedData.lastTs
    ? new Date(
        mappedData.lastTs
      )
        .toUTCString()
        .split(" ")[4]
    : "--"
}
        />

        <Box h="14px" />
      </Flex>
    </Flex>
  );
};

export default InverterInfoSection;