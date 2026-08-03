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

import CommonCard from "./CommonCard";
import { useEffect, useMemo } from "react";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";

type Props = {
  selectedMeter?: string;
};

const RealTimeParameters = ({ selectedMeter }: Props) => {

  const {
    data,
    loading,
    fetchData,
  } = useTimeseriesData();

  useEffect(() => {
    if (!selectedMeter) return;

    const payload = {
      devices: {
        ids: [selectedMeter],
        patterns: [],
      },

      keys: [
        { key: "voltage_ln_r", alias: "voltage_ln_r", keyType: "timeseries" },
        { key: "voltage_ln_y", alias: "voltage_ln_y", keyType: "timeseries" },
        { key: "voltage_ln_b", alias: "voltage_ln_b", keyType: "timeseries" },
        { key: "avg_voltage_ln", alias: "avg_voltage_ln", keyType: "timeseries" },

        { key: "voltage_ll_ry", alias: "voltage_ll_ry", keyType: "timeseries" },
        { key: "voltage_ll_yb", alias: "voltage_ll_yb", keyType: "timeseries" },
        { key: "voltage_ll_br", alias: "voltage_ll_br", keyType: "timeseries" },
        { key: "avg_voltage_l", alias: "avg_voltage_l", keyType: "timeseries" },

        { key: "current_r", alias: "current_r", keyType: "timeseries" },
        { key: "current_y", alias: "current_y", keyType: "timeseries" },
        { key: "current_b", alias: "current_b", keyType: "timeseries" },
        { key: "avg_current_l", alias: "avg_current_l", keyType: "timeseries" },

        { key: "active_power_r", alias: "active_power_r", keyType: "timeseries" },
        { key: "active_power_y", alias: "active_power_y", keyType: "timeseries" },
        { key: "active_power_b", alias: "active_power_b", keyType: "timeseries" },

        { key: "reactive_power_r", alias: "reactive_power_r", keyType: "timeseries" },
        { key: "reactive_power_y", alias: "reactive_power_y", keyType: "timeseries" },
        { key: "reactive_power_b", alias: "reactive_power_b", keyType: "timeseries" },

        { key: "apparent_power_r", alias: "apparent_power_r", keyType: "timeseries" },
        { key: "apparent_power_y", alias: "apparent_power_y", keyType: "timeseries" },
        { key: "apparent_power_b", alias: "apparent_power_b", keyType: "timeseries" },

        { key: "pf_r", alias: "pf_r", keyType: "timeseries" },
        { key: "pf_y", alias: "pf_y", keyType: "timeseries" },
        { key: "pf_b", alias: "pf_b", keyType: "timeseries" },

        { key: "frequency", alias: "frequency", keyType: "timeseries" },

        { key: "total_active_power", alias: "total_active_power", keyType: "timeseries" },
        { key: "total_reactive_power", alias: "total_reactive_power", keyType: "timeseries" },
        { key: "total_apparent_power", alias: "total_apparent_power", keyType: "timeseries" },

        { key: "avg_pf", alias: "avg_pf", keyType: "timeseries" },
      ],

      aggregation: {
        func: "last",
        interval: 1,
        intervalType: "minutes",
      },

      timeRange: {
        type: "last",
        interval: 5,
        intervalType: "minutes",
      },

      orderBy: "DESC",
    };

    const fetchRealtime = () => {
      fetchData(payload);
    };

    // Initial fetch
    fetchRealtime();

    // Auto refresh every 1 minute
    const interval = setInterval(fetchRealtime, 60000);

    return () => clearInterval(interval);

  }, [selectedMeter]);

  const meterData = data?.[selectedMeter || ""] || {};

  const getValue = (key: string) => {
    return meterData?.[key]?.[0]?.value ?? "--";
  };

  const formatValue = (value: any, digits = 2) => {
    const num = Number(value);

    if (isNaN(num)) return "--";

    return num.toFixed(digits);
  };

  const rows = useMemo(() => [
    {
      parameter: "Voltage (L-N)",
      r: `${formatValue(getValue("voltage_ln_r"))} V`,
      y: `${formatValue(getValue("voltage_ln_y"))} V`,
      b: `${formatValue(getValue("voltage_ln_b"))} V`,
      avg: `${formatValue(getValue("avg_voltage_ln"))} V`,
    },

    {
      parameter: "Voltage (L-L)",
      r: `${formatValue(getValue("voltage_ll_ry"))} V`,
      y: `${formatValue(getValue("voltage_ll_yb"))} V`,
      b: `${formatValue(getValue("voltage_ll_br"))} V`,
      avg: `${formatValue(getValue("avg_voltage_l"))} V`,
    },

    {
      parameter: "Current",
      r: `${formatValue(getValue("current_r"))} A`,
      y: `${formatValue(getValue("current_y"))} A`,
      b: `${formatValue(getValue("current_b"))} A`,
      avg: `${formatValue(getValue("avg_current_l"))} A`,
    },

    {
      parameter: "Active Power",
      r: `${formatValue(getValue("active_power_r"))} kW`,
      y: `${formatValue(getValue("active_power_y"))} kW`,
      b: `${formatValue(getValue("active_power_b"))} kW`,
      avg: `${formatValue(getValue("total_active_power"))} kW`,
    },

    {
      parameter: "Reactive Power",
      r: `${formatValue(getValue("reactive_power_r"))} kvar`,
      y: `${formatValue(getValue("reactive_power_y"))} kvar`,
      b: `${formatValue(getValue("reactive_power_b"))} kvar`,
      avg: `${formatValue(getValue("total_reactive_power"))} kvar`,
    },

    {
      parameter: "Apparent Power",
      r: `${formatValue(getValue("apparent_power_r"))} kVA`,
      y: `${formatValue(getValue("apparent_power_y"))} kVA`,
      b: `${formatValue(getValue("apparent_power_b"))} kVA`,
      avg: `${formatValue(getValue("total_apparent_power"))} kVA`,
    },

    {
      parameter: "Power Factor",
      r: formatValue(getValue("pf_r"), 3),
      y: formatValue(getValue("pf_y"), 3),
      b: formatValue(getValue("pf_b"), 3),
      avg: formatValue(getValue("avg_pf"), 3),
    },

    {
      parameter: "Frequency",
      r: "",
      y: "",
      b: "",
      avg: `${formatValue(getValue("frequency"), 2)} Hz`,
    },
  ], [data, selectedMeter]);

  const textColor = useColorModeValue(
    "#1A202C",
    "#d7e4ff"
  );

  const headerColor = useColorModeValue(
    "#4A5568",
    "#8ea6c9"
  );

  const borderColor = useColorModeValue(
    "#d9e2f0",
    "rgba(255,255,255,0.06)"
  );

  const bg = useColorModeValue(
    "#ffffff",
    "primary.dark"
  );

  const valueColor = useColorModeValue("#1A202C", "#d7e4ff");
  const fontFamily = "'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial";

  return (
    <CommonCard p="0px">
      <Box
        bg={bg}
        borderRadius="8px"
        px="14px"
        py="12px"
        h="100%"
        fontFamily={fontFamily}
      >

        <Text
          fontSize="15px"
          fontWeight="700"
          color={textColor}
          mb="12px"
          letterSpacing="0.3px"
        >
          Real-time Parameters
        </Text>

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
                px="0px"
                pb="10px"
                borderBottom={`1px solid ${borderColor}`}
                textTransform="none"
              >
                Parameter
              </Th>

              <Th
                color={headerColor}
                fontSize="11px"
                textAlign="center"
                borderBottom={`1px solid ${borderColor}`}
                textTransform="none"
              >
                R
              </Th>

              <Th
                color={headerColor}
                fontSize="11px"
                textAlign="center"
                borderBottom={`1px solid ${borderColor}`}
                textTransform="none"
              >
                Y
              </Th>

              <Th
                color={headerColor}
                fontSize="11px"
                textAlign="center"
                borderBottom={`1px solid ${borderColor}`}
                textTransform="none"
              >
                B
              </Th>

              <Th
                color={headerColor}
                fontSize="11px"
                textAlign="right"
                borderBottom={`1px solid ${borderColor}`}
                textTransform="none"
              >
                Avg/Total
              </Th>

            </Tr>
          </Thead>

          <Tbody>
            {rows.map((row, index) => (
              <Tr key={index}>

                <Td
                  px="0px"
                  py="5px"
                  color={textColor}
                  fontSize="13px"
                  fontWeight="600"
                  whiteSpace="nowrap"
                >
                  {row.parameter}
                </Td>

                <Td
                  py="5px"
                  textAlign="center"
                  color={valueColor}
                  fontSize="13px"
                  fontWeight="600"
                  whiteSpace="nowrap"
                >
                  {row.r}
                </Td>

                <Td
                  py="5px"
                  textAlign="center"
                  color={valueColor}
                  fontSize="13px"
                  fontWeight="600"
                  whiteSpace="nowrap"
                >
                  {row.y}
                </Td>

                <Td
                  py="5px"
                  textAlign="center"
                  color={valueColor}
                  fontSize="13px"
                  fontWeight="600"
                  whiteSpace="nowrap"
                >
                  {row.b}
                </Td>

                <Td
                  py="5px"
                  pr="0px"
                  textAlign="right"
                  color={valueColor}
                  fontSize="13px"
                  fontWeight="700"
                  whiteSpace="nowrap"
                >
                  {row.avg}
                </Td>

              </Tr>
            ))}
          </Tbody>

        </Table>

      </Box>
    </CommonCard>
  );
};

export default RealTimeParameters;