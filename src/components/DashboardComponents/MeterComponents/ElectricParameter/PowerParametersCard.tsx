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

const PowerParametersCard = ({
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
          key: "active_power_r",
          alias: "active_power_r",
          keyType: "timeseries",
        },
        {
          key: "active_power_y",
          alias: "active_power_y",
          keyType: "timeseries",
        },
        {
          key: "active_power_b",
          alias: "active_power_b",
          keyType: "timeseries",
        },
        {
          key: "total_active_power",
          alias: "total_active_power",
          keyType: "timeseries",
        },

        {
          key: "reactive_power_r",
          alias: "reactive_power_r",
          keyType: "timeseries",
        },
        {
          key: "reactive_power_y",
          alias: "reactive_power_y",
          keyType: "timeseries",
        },
        {
          key: "reactive_power_b",
          alias: "reactive_power_b",
          keyType: "timeseries",
        },
        {
          key: "total_reactive_power",
          alias: "total_reactive_power",
          keyType: "timeseries",
        },

        {
          key: "apparent_power_r",
          alias: "apparent_power_r",
          keyType: "timeseries",
        },
        {
          key: "apparent_power_y",
          alias: "apparent_power_y",
          keyType: "timeseries",
        },
        {
          key: "apparent_power_b",
          alias: "apparent_power_b",
          keyType: "timeseries",
        },
        {
          key: "total_apparent_power",
          alias: "total_apparent_power",
          keyType: "timeseries",
        },

        {
          key: "pf_r",
          alias: "pf_r",
          keyType: "timeseries",
        },
        {
          key: "pf_y",
          alias: "pf_y",
          keyType: "timeseries",
        },
        {
          key: "pf_b",
          alias: "pf_b",
          keyType: "timeseries",
        },
        {
          key: "avg_pf",
          alias: "avg_pf",
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

  const powerData = useMemo(() => {
    const meterData =
      (data as any)?.[selectedMeter || ""] || {};

    const activeR = Number(
      meterData?.active_power_r?.[0]?.value || 0
    );

    const activeY = Number(
      meterData?.active_power_y?.[0]?.value || 0
    );

    const activeB = Number(
      meterData?.active_power_b?.[0]?.value || 0
    );

    const totalActive = Number(
      meterData?.total_active_power?.[0]?.value || 0
    );

    const reactiveR = Number(
      meterData?.reactive_power_r?.[0]?.value || 0
    );

    const reactiveY = Number(
      meterData?.reactive_power_y?.[0]?.value || 0
    );

    const reactiveB = Number(
      meterData?.reactive_power_b?.[0]?.value || 0
    );

    const totalReactive = Number(
      meterData?.total_reactive_power?.[0]?.value || 0
    );

    const apparentR = Number(
      meterData?.apparent_power_r?.[0]?.value || 0
    );

    const apparentY = Number(
      meterData?.apparent_power_y?.[0]?.value || 0
    );

    const apparentB = Number(
      meterData?.apparent_power_b?.[0]?.value || 0
    );

    const totalApparent = Number(
      meterData?.total_apparent_power?.[0]?.value || 0
    );

    const pfR = Number(
      meterData?.pf_r?.[0]?.value || 0
    );

    const pfY = Number(
      meterData?.pf_y?.[0]?.value || 0
    );

    const pfB = Number(
      meterData?.pf_b?.[0]?.value || 0
    );

    const avgPF =
      Number(
        meterData?.avg_pf?.[0]?.value || 0
      ) ||
      (pfR + pfY + pfB) / 3;

    const activeMax = Math.max(
      activeR,
      activeY,
      activeB
    );

    const activeMin = Math.min(
      activeR,
      activeY,
      activeB
    );

    return [
      {
        parameter: "Active Power (kW)",
        r: activeR.toFixed(2),
        y: activeY.toFixed(2),
        b: activeB.toFixed(2),
        avg: totalActive.toFixed(2),
        unit: "kW",
      },

      {
        parameter: "Reactive Power (kvar)",
        r: reactiveR.toFixed(2),
        y: reactiveY.toFixed(2),
        b: reactiveB.toFixed(2),
        avg: totalReactive.toFixed(2),
        unit: "kvar",
      },

      {
        parameter: "Apparent Power (kVA)",
        r: apparentR.toFixed(2),
        y: apparentY.toFixed(2),
        b: apparentB.toFixed(2),
        avg: totalApparent.toFixed(2),
        unit: "kVA",
      },

      {
        parameter: "Power Factor",
        r: pfR.toFixed(3),
        y: pfY.toFixed(3),
        b: pfB.toFixed(3),
        avg: avgPF.toFixed(3),
        unit: "—",
      },

      {
        parameter: "Displacement PF",
        r: "",
        y: "",
        b: "",
        avg: "--",
        unit: "—",
      },

      {
        parameter: "Active Power Max (kW)",
        r: activeMax.toFixed(2),
        y: "",
        b: "",
        avg: activeMax.toFixed(2),
        unit: "kW",
      },

      {
        parameter: "Active Power Min (kW)",
        r: activeMin.toFixed(2),
        y: "",
        b: "",
        avg: activeMin.toFixed(2),
        unit: "kW",
      },

      {
        parameter: "Reactive Power (Leading +)",
        r: "",
        y: "",
        b: "",
        avg: "--",
        unit: "—",
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
          POWER PARAMETERS
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
          {powerData.map((row) => (
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

export default PowerParametersCard;