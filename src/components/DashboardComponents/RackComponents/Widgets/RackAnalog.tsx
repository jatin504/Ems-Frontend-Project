import React from "react";
import {
  Box,
  Flex,
  Tag,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";

type Props = {
  rackId?: string;
};

const AnalogTile = ({
  label,
  value,
  tag,
}: {
  label: string;
  value: string;
  tag?: string;
}) => {
  const tileBg = useColorModeValue("#ffffff", "#2A2F34");
  const tileBorder = useColorModeValue("#e5e7eb", "#1c2635");
  const labelColor = useColorModeValue("#475569", "#96A0AA");
  const valueColor = useColorModeValue("#0f172a", "#E6EAED");

  return (
    <Box
      bg={tileBg}
      border={`1px solid ${tileBorder}`}
      borderRadius="10px"
      p="12px"
    >
      <Text
        fontSize="12px"
        color={labelColor}
        mb="6px"
      >
        {label}
      </Text>

      <Flex
        align="center"
        justify="space-between"
      >
        <Text
          fontSize="16px"
          fontWeight="700"
          color={valueColor}
        >
          {value}
        </Text>

        {tag && (
          <Tag
            bg="transparent"
            color={valueColor}
            border="0"
            fontWeight="700"
            fontSize="12px"
          >
            {tag}
          </Tag>
        )}
      </Flex>
    </Box>
  );
};

export default function RackAnalog({
  rackId,
}: Props) {
  const cardBg = useColorModeValue(
    "#ffffff",
    "#161B1B"
  );

  const cardBorder = useColorModeValue(
    "#e5e7eb",
    "#1c2635"
  );

  const headingColor = useColorModeValue(
    "#0f172a",
    "#ffffff"
  );

  const { data, fetchData } =
    useTimeseriesData();

  React.useEffect(() => {
    if (!rackId) return;

    fetchData({
      devices: {
        ids: [rackId],
        patterns: [],
      },

      keys: [
        {
          key: "voltage",
          alias: "voltage",
          keyType: "common",
        },
        {
          key: "current",
          alias: "current",
          keyType: "common",
        },
        {
          key: "max_cell_voltage",
          alias: "max_cell_voltage",
          keyType: "common",
        },
        {
          key: "cell_number_in_rack_of_max_cell_voltage",
          alias: "max_cell_no",
          keyType: "common",
        },
        {
          key: "min_cell_voltage",
          alias: "min_cell_voltage",
          keyType: "common",
        },
        {
          key: "cell_number_in_rack_of_min_cell_voltage",
          alias: "min_cell_no",
          keyType: "common",
        },
        {
          key: "avg_cell_voltage",
          alias: "avg_cell_voltage",
          keyType: "common",
        },
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
  }, [rackId]);
    const values = React.useMemo(() => {
    if (!data || typeof data !== "object") return null;

    const latestValues: Record<string, any> = {};

    Object.values(data).forEach((deviceObj: any) => {
      if (deviceObj && typeof deviceObj === "object") {
        Object.entries(deviceObj).forEach(([metric, points]: any) => {
          if (Array.isArray(points) && points.length > 0) {
            const latestPoint = points[points.length - 1];
            latestValues[metric] = latestPoint?.value ?? 0;
          }
        });
      }
    });

    return {
      voltage: latestValues["voltage"] ?? 0,
      current: latestValues["current"] ?? 0,
      maxVolt: latestValues["max_cell_voltage"] ?? 0,
      maxCellNo: latestValues["max_cell_no"] ?? "-",
      minVolt: latestValues["min_cell_voltage"] ?? 0,
      minCellNo: latestValues["min_cell_no"] ?? "-",
      avgVolt: latestValues["avg_cell_voltage"] ?? 0,
    };
  }, [data]);

  return (
    <Box
      w="237px"
      h="535.5825px"
      bg={cardBg}
      border={`1px solid ${cardBorder}`}
      borderRadius="12px"
      p="16px"
      display="flex"
      flexDirection="column"
      gap="20px"
    >
      <Text
        fontSize="14px"
        fontWeight="600"
        color={headingColor}
      >
        Analogs
      </Text>

      <AnalogTile
        label="String voltage"
        value={`${Number(values?.voltage ?? 0).toFixed(2)} V`}
      />

      <AnalogTile
        label="String current"
        value={`${Number(values?.current ?? 0).toFixed(2)} A`}
      />

      <AnalogTile
        label="Max. Cell voltage"
        value={`${Number(values?.maxVolt ?? 0).toFixed(2)} V`}
        tag={`Cell ${values?.maxCellNo ?? "-"}`}
      />

      <AnalogTile
        label="Min. Cell voltage"
        value={`${Number(values?.minVolt ?? 0).toFixed(2)} V`}
        tag={`Cell ${values?.minCellNo ?? "-"}`}
      />

      <AnalogTile
        label="Average Cell voltage"
        value={`${Number(values?.avgVolt ?? 0).toFixed(2)} V`}
      />
    </Box>
  );
}