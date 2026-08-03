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
  value: number;
}

interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}

type Props = {
  selectedDevice: string;
};

const stringRows = Array.from(
  { length: 24 },
  (_, i) => i + 1
);

const StringHealth: React.FC<Props> = ({
  selectedDevice,
}) => {

  const cardBg = useColorModeValue(
    "#ffffff",
    "#0F2235"
  );

  const borderColor = useColorModeValue(
    "#E6EEF6",
    "#1F3B56"
  );

  const textColor = useColorModeValue(
    "gray.800",
    "white"
  );

  const subText = useColorModeValue(
    "#5A6B78",
    "#8FA8C0"
  );

  const dividerColor = useColorModeValue(
    "#E2E8F0",
    "#29445C"
  );

  const { data, fetchData } =
    useTimeseriesData();

  /* ================= API ================= */

  useEffect(() => {

    fetchData({
      devices: {
        patterns: [
          "_inverter_inverter_",
        ],
        ids: [],
      },

      keys: stringRows.map(
        (index) => ({
          key: `string_${index}_current`,
          alias: `string_${index}_current`,
          keyType: "common",
        })
      ),

      aggregation: {
        func: "last",
        interval: 1,
        intervalType: "minute",
      },

      timeRange: {
        type: "relative",
        relativeType:
          "currentDaySoFar",
      },

      orderBy: "DESC",
    } as any);

  }, [selectedDevice]);

  /* ================= MAP ================= */

  const healthData = useMemo(() => {

    const widgetData =
      data as WidgetData | null;

    if (!widgetData) {

      return {
        healthStats: [
          {
            label: "Good",
            value: 0,
            percent: "0.0%",
            color: "#7ED321",
          },

          {
            label: "Warning",
            value: 0,
            percent: "0.0%",
            color: "#F5A623",
          },

          {
            label: "Critical",
            value: 0,
            percent: "0.0%",
            color: "#FF5A3D",
          },

          {
            label: "Offline",
            value: 24,
            percent: "100%",
            color: "#8C98A4",
          },
        ],

        stringHealthData: [],
      };

    }

    

    const latest = (
      arr?: WidgetPoint[]
    ) =>
      arr && arr.length > 0
        ? Number(
            arr[arr.length - 1].value
          )
        : 0;

    const stringValues: any[] = [];

    Object.keys(widgetData).forEach(
      (deviceId) => {

        const d =
          widgetData[deviceId];

        stringRows.forEach(
          (index) => {

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

            stringValues.push({
              name: `${deviceId} - String ${index}`,
              value,
            });

          }
        );

      }
    );

    const validStrings =
      stringValues.filter(
        (s) => s.value > 0
      );

    const maxCurrent =
      validStrings.length > 0
        ? Math.max(
            ...validStrings.map(
              (s) => s.value
            )
          )
        : 0;

    let good = 0;
    let warning = 0;
    let critical = 0;
    let offline = 0;

    const stringHealthData =
      stringValues
        .map((s) => {

          // OFFLINE
          if (s.value <= 0) {

            offline += 1;

            return {
              name: s.name,
              current: s.value,
              percent: 0,
              status: "Offline",
              color: "#8C98A4",
            };

          }

          const percent =
            maxCurrent > 0
              ? (
                  (s.value /
                    maxCurrent) *
                  100
                )
              : 0;

          // GOOD
          if (percent >= 90) {

            good += 1;

            return {
              name: s.name,
              current: s.value,
              percent:
                Number(
                  percent.toFixed(1)
                ),
              status: "Good",
              color: "#7ED321",
            };

          }

          // WARNING
          if (percent >= 85) {

            warning += 1;

            return {
              name: s.name,
              current: s.value,
              percent:
                Number(
                  percent.toFixed(1)
                ),
              status: "Warning",
              color: "#F5A623",
            };

          }

          // CRITICAL
          critical += 1;

          return {
            name: s.name,
            current: s.value,
            percent:
              Number(
                percent.toFixed(1)
              ),
            status: "Critical",
            color: "#FF5A3D",
          };

        })
        .sort((a, b) => {

          const order: any = {
            Good: 1,
            Warning: 2,
            Critical: 3,
            Offline: 4,
          };

          return (
            order[a.status] -
            order[b.status]
          );

        });

    const total =
      stringValues.length;

    return {

      healthStats: [
        {
          label: "Good",
          value: good,
          percent: `${(
            (good / total) *
            100
          ).toFixed(1)}%`,
          color: "#7ED321",
        },

        {
          label: "Warning",
          value: warning,
          percent: `${(
            (warning / total) *
            100
          ).toFixed(1)}%`,
          color: "#F5A623",
        },

        {
          label: "Critical",
          value: critical,
          percent: `${(
            (critical / total) *
            100
          ).toFixed(1)}%`,
          color: "#FF5A3D",
        },

        {
          label: "Offline",
          value: offline,
          percent: `${(
            (offline / total) *
            100
          ).toFixed(1)}%`,
          color: "#8C98A4",
        },
      ],

      stringHealthData,

    };

  }, [data, selectedDevice]);

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="12px"
      p={4}
      h="100%"
    >
      <Text
        color={textColor}
        fontSize="16px"
        fontWeight="800"
        mb={5}
      >
        String Health
      </Text>

      {/* TOP BAR */}
      <Flex
        w="100%"
        h="12px"
        borderRadius="20px"
        overflow="hidden"
        mb={6}
      >
        {healthData.healthStats.map(
          (item, index) => (
            <Box
              key={index}
              bg={item.color}
              w={item.percent}
              h="100%"
            />
          )
        )}
      </Flex>

      {/* BOTTOM STATS */}
      <Flex
        align="center"
        justify="space-between"
      >
        {healthData.healthStats.map(
          (item, index) => (
            <React.Fragment
              key={index}
            >
              <Box flex="1">
                <Flex
                  align="center"
                  gap={2}
                  mb={2}
                >
                  <Box
                    w="8px"
                    h="8px"
                    borderRadius="2px"
                    bg={item.color}
                  />

                  <Text
                    color={subText}
                    fontSize="11px"
                  >
                    {item.label}
                  </Text>
                </Flex>

                <Text
                  color={textColor}
                  fontSize="26px"
                  fontWeight="700"
                  lineHeight="24px"
                >
                  {item.value}
                </Text>

                <Text
                  color={subText}
                  fontSize="12px"
                  mt={1}
                >
                  {item.percent}
                </Text>
              </Box>

              {/* DIVIDER */}
              {index !==
                healthData
                  .healthStats
                  .length -
                  1 && (
                <Box
                  w="1px"
                  h="55px"
                  bg={dividerColor}
                  mx={4}
                />
              )}
            </React.Fragment>
          )
        )}
      </Flex>
    </Box>
  );
};

export default StringHealth;