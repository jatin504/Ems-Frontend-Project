import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { useEffect, useMemo } from "react";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";

type Props = {
  selectedMeter?: string;
};

const CurrentParametersCard = ({
  selectedMeter,
}: Props) => {
  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    if (!selectedMeter) return;

    const doFetch = () => {
      fetchData({
      devices: {
        patterns: [],
        ids: [selectedMeter],
      },

      keys: [
        {
          key: "current_r",
          alias: "current_r",
          keyType: "timeseries",
        },
        {
          key: "current_y",
          alias: "current_y",
          keyType: "timeseries",
        },
        {
          key: "current_b",
          alias: "current_b",
          keyType: "timeseries",
        },
        {
          key: "current_n",
          alias: "current_n",
          keyType: "timeseries",
        },
        {
          key: "avg_current_l",
          alias: "avg_current_l",
          keyType: "timeseries",
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

      orderBy: "DESC",
      } as any);
    };

    doFetch();
    const interval = setInterval(doFetch, 60000);

    return () => clearInterval(interval);
  }, [selectedMeter]);

  const currentData = useMemo(() => {
    const meterData =
      (data as any)?.[selectedMeter || ""] || {};

    const currentR = Number(
      meterData?.current_r?.[0]?.value || 0
    );

    const currentY = Number(
      meterData?.current_y?.[0]?.value || 0
    );

    const currentB = Number(
      meterData?.current_b?.[0]?.value || 0
    );

    const neutralCurrent = Number(
      meterData?.current_n?.[0]?.value || 0
    );

    const avgCurrent =
      Number(
        meterData?.avg_current_l?.[0]?.value || 0
      ) ||
      (currentR + currentY + currentB) / 3;

    const maxCurrent = Math.max(
      currentR,
      currentY,
      currentB
    );

    const minCurrent = Math.min(
      currentR,
      currentY,
      currentB
    );

    const currentUnbalance =
      avgCurrent > 0
        ? (
            (Math.max(
              Math.abs(currentR - avgCurrent),
              Math.abs(currentY - avgCurrent),
              Math.abs(currentB - avgCurrent)
            ) /
              avgCurrent) *
            100
          ).toFixed(2)
        : "0.00";

    return [
      {
        parameter: "Current",
        r: currentR.toFixed(2),
        y: currentY.toFixed(2),
        b: currentB.toFixed(2),
        avg: avgCurrent.toFixed(2),
        unit: "A",
      },

      {
        parameter: "Current Maximum",
        r: maxCurrent.toFixed(2),
        y: "",
        b: "",
        avg: maxCurrent.toFixed(2),
        unit: "A",
      },

      {
        parameter: "Current Minimum",
        r: minCurrent.toFixed(2),
        y: "",
        b: "",
        avg: minCurrent.toFixed(2),
        unit: "A",
      },

      {
        parameter: "Current Unbalance",
        r: "",
        y: "",
        b: "",
        avg: currentUnbalance,
        unit: "%",
      },

      {
        parameter: "Neutral Current",
        r: "",
        y: "",
        b: "",
        avg: neutralCurrent.toFixed(2),
        unit: "A",
      },

      {
        parameter: "Current THD",
        r: "",
        y: "",
        b: "",
        avg: "--",
        unit: "%",
      },

      {
        parameter: "K-Factor",
        r: "",
        y: "",
        b: "",
        avg: "--",
        unit: "—",
      },

      {
        parameter: "Peak Current",
        r: "--",
        y: "--",
        b: "--",
        avg: "--",
        unit: "A",
      },
    ];
  }, [data, selectedMeter]);

  const bg = useColorModeValue(
    "#ffffff",
    "#071d36"
  );

  const borderColor = useColorModeValue(
    "rgba(0,0,0,0.08)",
    "rgba(255,255,255,0.08)"
  );

  const textColor = useColorModeValue(
    "#1A202C",
    "#D7E4FF"
  );

  const headerColor = useColorModeValue(
    "#4A5568",
    "#B8C7E0"
  );

  return (
    <Box
      bg={bg}
      borderRadius="8px"
      overflow="hidden"
      border={`1px solid ${borderColor}`}
      h="100%"
    >
      <Box
        px="14px"
        py="10px"
        borderBottom={`1px solid ${borderColor}`}
      >
        <Text
          fontSize="13px"
          fontWeight="700"
          color={textColor}
          letterSpacing="0.3px"
        >
          CURRENT PARAMETERS
        </Text>
      </Box>

      <Table
        variant="unstyled"
        size="sm"
      >
        <Thead>
          <Tr>
            <Th
              color={headerColor}
              fontSize="11px"
              textTransform="none"
            >
              Parameter
            </Th>

            <Th
              color={headerColor}
              textAlign="center"
              fontSize="11px"
              textTransform="none"
            >
              R (L1)
            </Th>

            <Th
              color={headerColor}
              textAlign="center"
              fontSize="11px"
              textTransform="none"
            >
              Y (L2)
            </Th>

            <Th
              color={headerColor}
              textAlign="center"
              fontSize="11px"
              textTransform="none"
            >
              B (L3)
            </Th>

            <Th
              color={headerColor}
              textAlign="center"
              fontSize="11px"
              textTransform="none"
            >
              Avg
            </Th>

            <Th
              color={headerColor}
              textAlign="center"
              fontSize="11px"
              textTransform="none"
            >
              Unit
            </Th>
          </Tr>
        </Thead>

        <Tbody>
          {currentData.map((row) => (
            <Tr key={row.parameter}>
              <Td
                color={textColor}
                fontSize="11px"
                borderTop={`1px solid ${borderColor}`}
              >
                {row.parameter}
              </Td>

              <Td
                color={textColor}
                fontSize="11px"
                textAlign="center"
                borderTop={`1px solid ${borderColor}`}
              >
                {row.r}
              </Td>

              <Td
                color={textColor}
                fontSize="11px"
                textAlign="center"
                borderTop={`1px solid ${borderColor}`}
              >
                {row.y}
              </Td>

              <Td
                color={textColor}
                fontSize="11px"
                textAlign="center"
                borderTop={`1px solid ${borderColor}`}
              >
                {row.b}
              </Td>

              <Td
                color={textColor}
                fontSize="11px"
                textAlign="center"
                borderTop={`1px solid ${borderColor}`}
              >
                {row.avg}
              </Td>

              <Td
                color={textColor}
                fontSize="11px"
                textAlign="center"
                borderTop={`1px solid ${borderColor}`}
              >
                {row.unit}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default CurrentParametersCard;