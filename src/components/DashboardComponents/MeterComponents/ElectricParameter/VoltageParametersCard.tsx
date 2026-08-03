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

const VoltageParametersCard = ({
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
          key: "voltage_ln_r",
          alias: "voltage_ln_r",
          keyType: "timeseries",
        },
        {
          key: "voltage_ln_y",
          alias: "voltage_ln_y",
          keyType: "timeseries",
        },
        {
          key: "voltage_ln_b",
          alias: "voltage_ln_b",
          keyType: "timeseries",
        },

        {
          key: "voltage_ll_ry",
          alias: "voltage_ll_ry",
          keyType: "timeseries",
        },
        {
          key: "voltage_ll_yb",
          alias: "voltage_ll_yb",
          keyType: "timeseries",
        },
        {
          key: "voltage_ll_br",
          alias: "voltage_ll_br",
          keyType: "timeseries",
        },

        {
          key: "avg_voltage_ln",
          alias: "avg_voltage_ln",
          keyType: "timeseries",
        },
        {
          key: "avg_voltage_l",
          alias: "avg_voltage_l",
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

  const voltageData = useMemo(() => {
    const meterData =
      (data as any)?.[selectedMeter || ""] || {};

    const lnR = Number(
      meterData?.voltage_ln_r?.[0]?.value || 0
    );

    const lnY = Number(
      meterData?.voltage_ln_y?.[0]?.value || 0
    );

    const lnB = Number(
      meterData?.voltage_ln_b?.[0]?.value || 0
    );

    const llRY = Number(
      meterData?.voltage_ll_ry?.[0]?.value || 0
    );

    const llYB = Number(
      meterData?.voltage_ll_yb?.[0]?.value || 0
    );

    const llBR = Number(
      meterData?.voltage_ll_br?.[0]?.value || 0
    );

    const avgLN =
      Number(
        meterData?.avg_voltage_ln?.[0]?.value || 0
      ) ||
      (lnR + lnY + lnB) / 3;

    const avgLL =
      Number(
        meterData?.avg_voltage_l?.[0]?.value || 0
      ) ||
      (llRY + llYB + llBR) / 3;

    const maxVoltage = Math.max(
      lnR,
      lnY,
      lnB
    );

    const minVoltage = Math.min(
      lnR,
      lnY,
      lnB
    );

    const unbalance =
      avgLN > 0
        ? (
            (Math.max(
              Math.abs(lnR - avgLN),
              Math.abs(lnY - avgLN),
              Math.abs(lnB - avgLN)
            ) /
              avgLN) *
            100
          ).toFixed(2)
        : "0.00";

    return [
      {
        parameter: "Phase Voltage (L-N)",
        r: lnR.toFixed(2),
        y: lnY.toFixed(2),
        b: lnB.toFixed(2),
        avg: avgLN.toFixed(2),
        unit: "V",
      },

      {
        parameter: "Line Voltage (L-L)",
        r: llRY.toFixed(2),
        y: llYB.toFixed(2),
        b: llBR.toFixed(2),
        avg: avgLL.toFixed(2),
        unit: "V",
      },

      {
        parameter: "Voltage Maximum",
        r: maxVoltage.toFixed(2),
        y: "",
        b: "",
        avg: maxVoltage.toFixed(2),
        unit: "V",
      },

      {
        parameter: "Voltage Minimum",
        r: minVoltage.toFixed(2),
        y: "",
        b: "",
        avg: minVoltage.toFixed(2),
        unit: "V",
      },

      {
        parameter: "Voltage Unbalance",
        r: "",
        y: "",
        b: "",
        avg: unbalance,
        unit: "%",
      },

      {
        parameter: "Voltage THD",
        r: "",
        y: "",
        b: "",
        avg: "--",
        unit: "%",
      },

      {
        parameter:
          "Negative Sequence Voltage",
        r: "",
        y: "",
        b: "",
        avg: "--",
        unit: "V",
      },

      {
        parameter:
          "Zero Sequence Voltage",
        r: "",
        y: "",
        b: "",
        avg: "--",
        unit: "V",
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
          VOLTAGE PARAMETERS
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
              fontWeight="600"
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
          {voltageData.map((row) => (
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

export default VoltageParametersCard;