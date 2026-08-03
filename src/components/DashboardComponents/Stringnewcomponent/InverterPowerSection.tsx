import React, {
  useEffect,
  useMemo,
} from "react";

import {
  Flex,
  Text,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

import useTimeseriesData from "../../../hooks/useTimeseriesData";
import StaleIndicator from "../../Common/StaleIndicator";

type CardProps = {
  title: string;
  value: string;
  unit?: string;
  color: string;
  borderRight?: boolean;
  ts?: number | null;
};

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

const PowerCard = ({
  title,
  value,
  unit,
  color,
  borderRight = true,
  ts,
}: CardProps) => {

  const titleColor = useColorModeValue(
    "#5F738C",
    "#8FA6C1"
  );

  const unitColor = useColorModeValue(
    "#70839A",
    "#8FA6C1"
  );

  const dividerColor = useColorModeValue(
    "#DCE6F2",
    "#163554"
  );

  return (
    <Flex
      flex="1"
      minW="150px"
      h="100%"
      direction="column"
      justify="center"
      align="center"
      position="relative"
      py={2}
    >
      {borderRight && (
        <Box
          position="absolute"
          right="0"
          top="16px"
          bottom="16px"
          w="1px"
          bg={dividerColor}
        />
      )}

      <Text
        fontSize="11px"
        fontWeight="500"
        color={titleColor}
        mb="8px"
        textAlign="center"
        whiteSpace="nowrap"
        lineHeight="14px"
      >
        {title}
      </Text>

      <Flex
        align="center"
        justify="center"
        gap="6px"
      >

        <Flex align="baseline">

          <Text
            fontSize="28px"
            fontWeight="700"
            color={color}
            lineHeight="30px"
            letterSpacing="0.2px"
          >
            {value}
          </Text>

          {unit && (
            <Text
              ml="5px"
              fontSize="13px"
              fontWeight="600"
              color={unitColor}
              lineHeight="18px"
            >
              {unit}
            </Text>
          )}

        </Flex>

        <StaleIndicator
          ts={ts}
          value={value}
        />

      </Flex>
    </Flex>
  );
};

const InverterPowerSection = ({
  selectedDevice,
}: any) => {

  const bg = useColorModeValue(
    "#FFFFFF",
    "#071D36"
  );

  const border = useColorModeValue(
    "#DCE6F2",
    "#102D4D"
  );

  const { data, fetchData } =
    useTimeseriesData();

  const deviceId =
    selectedDevice?.value;

  /* ================= API HIT ================= */

  useEffect(() => {

    if (!deviceId) return;

    const fetchPowerData = () => {

      fetchData({
        devices: {
          patterns: [],
          ids: [deviceId],
        },

        keys: [
          {
            key: "total_dc_power",
            alias: "total_dc_power",
            keyType: "common",
          },

          {
            key: "active_power",
            alias: "active_power",
            keyType: "common",
          },

          {
            key: "avg_voltage",
            alias: "avg_voltage",
            keyType: "common",
          },

          {
            key: "total_dc_current",
            alias: "total_dc_current",
            keyType: "common",
          },

          ...stringRows.map((index) => ({
            key: `string_${index}_current`,
            alias: `string_${index}_current`,
            keyType: "common",
          })),
        ],

        aggregation: {
          func: "none",
          interval: 1,
          intervalType: "minute",
        },

        timeRange: {
        type: "last",
        interval: 1,
        intervalType: "minute",
      },

        orderBy: "ASC",
      } as any);

    };

    fetchPowerData();

    const interval = setInterval(() => {

      fetchPowerData();

    }, 60000);

    return () => clearInterval(interval);

  }, [deviceId]);

  /* ================= DATA MAP ================= */

  const mappedData = useMemo(() => {

    const widgetData =
      data as WidgetData | null;

    if (
      !widgetData ||
      !deviceId ||
      !widgetData[deviceId]
    ) {

      return {
        dcPower: "--",
        acPower: "--",
        dcVoltage: "--",
        dcCurrent: "--",
        stringsOnline: "--",
        dcPowerTs: 0,
        acPowerTs: 0,
        dcVoltageTs: 0,
        dcCurrentTs: 0,
      };
    }

    const d = widgetData[deviceId];

    const latest = (
      key: string
    ) => {

      const arr = d[key];

      return arr && arr.length > 0
        ? Number(
            arr[arr.length - 1]
              ?.value
          ).toFixed(1)
        : "--";
    };

    /* ===== STRINGS ONLINE ===== */

    let onlineCount = 0;

    stringRows.forEach((index) => {

      const arr =
        d[`string_${index}_current`];

      const value =
        arr && arr.length > 0
          ? Number(
              arr[arr.length - 1]
                ?.value
            )
          : 0;

      if (value > 0) {
        onlineCount += 1;
      }

    });

    return {

      dcPower:
        latest("total_dc_power"),

      acPower:
        latest("active_power"),

      dcVoltage:
        latest("avg_voltage"),

      dcCurrent:
        latest("total_dc_current"),

      dcPowerTs:
        d["total_dc_power"]?.[
          d["total_dc_power"].length - 1
        ]?.ts || 0,

      acPowerTs:
        d["active_power"]?.[
          d["active_power"].length - 1
        ]?.ts || 0,

      dcVoltageTs:
        d["avg_voltage"]?.[
          d["avg_voltage"].length - 1
        ]?.ts || 0,

      dcCurrentTs:
        d["total_dc_current"]?.[
          d["total_dc_current"].length - 1
        ]?.ts || 0,

      stringsOnline:
        onlineCount.toString(),
    };

  }, [data, deviceId]);

  return (
    <Flex
      w="100%"
      bg={bg}
      border={`1px solid ${border}`}
      borderRadius="10px"
      overflowX="auto"
      minH="99px"
      align="stretch"
    >
      <PowerCard
        title="DC Power"
        value={mappedData.dcPower}
        unit="kW"
        color="#6DDB63"
        ts={mappedData.dcPowerTs}
      />

      <PowerCard
        title="AC Power"
        value={mappedData.acPower}
        unit="kW"
        color="#57A8FF"
        ts={mappedData.acPowerTs}
      />

      <PowerCard
        title="DC Voltage (Avg.)"
        value={mappedData.dcVoltage}
        unit="V"
        color="#BC6FFF"
        ts={mappedData.dcVoltageTs}
      />

      <PowerCard
        title="DC Current (Total)"
        value={mappedData.dcCurrent}
        unit="A"
        color="#E9A43A"
        ts={mappedData.dcCurrentTs}
      />

      <PowerCard
        title="Strings Online"
        value={mappedData.stringsOnline}
        unit="/ 24"
        color="#74DE69"
      />

      <PowerCard
        title="Strings in Alarm"
        value="---"
        color="#FF5A4E"
        borderRight={false}
      />
    </Flex>
  );
};

export default InverterPowerSection;