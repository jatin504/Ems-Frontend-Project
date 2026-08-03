import {
  Box,
  Flex,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useMemo } from "react";
import useTimeseriesData from "../../../hooks/useTimeseriesData";

/* ================= TYPES ================= */

interface WidgetPoint {
  ts: number;
  value: number | string;
}

interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}

interface SmbStaticInfosProps {
  selectedSMB?: string;
}

/* ================= COMPONENT ================= */

const SmbStaticInfos: React.FC<SmbStaticInfosProps> = ({
  selectedSMB,
}) => {
  const { data, fetchData } = useTimeseriesData();
  const smbId = selectedSMB || "plant_1_pcs_2_bank_bank_1";

  /* ================= API CALL ================= */

  useEffect(() => {
    // console.log("SmbStaticInfos → selected SMB:", smbId);

    fetchData({
      devices: {
        patterns: [],
        ids: [smbId],
      },
      keys: [
        { key: "soc", alias: "makeModel", keyType: "common" },
        { key: "energy_charged_today", alias: "dcCapacity", keyType: "common" },
        { key: "alarm_1", alias: "installationType", keyType: "common" },
        { key: "alarm_2", alias: "installationDir", keyType: "common" },
        { key: "rated_power", alias: "azimuthAngle", keyType: "common" },
        { key: "Active_power", alias: "zenithAngle", keyType: "common" },
        { key: "dc_bus_voltage", alias: "avgAmps", keyType: "common" },
        { key: "dc_bus_current", alias: "avgVolt", keyType: "common" },
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
  }, [smbId]);

  /* ================= MAP DATA (WMS STYLE) ================= */

  const metrics = useMemo(() => {
    const widgetData = data as WidgetData | null;

    if (!widgetData || !widgetData[smbId]) {
      return {
        makeModel: "--",
        dcCapacity: "--",
        installationType: "--",
        installationDir: "--",
        azimuthAngle: "--",
        zenithAngle: "--",
        avgAmps: "--",
        avgVolt: "--",
      };
    }

    const d = widgetData[smbId];

    const latest = (arr?: WidgetPoint[]) =>
      arr && arr.length > 0 ? arr[arr.length - 1].value : "--";

    return {
      makeModel: latest(d["makeModel"]),
      dcCapacity: latest(d["dcCapacity"]),
      installationType: latest(d["installationType"]),
      installationDir: latest(d["installationDir"]),
      azimuthAngle: latest(d["azimuthAngle"]),
      zenithAngle: latest(d["zenithAngle"]),
      avgAmps: latest(d["avgAmps"]),
      avgVolt: latest(d["avgVolt"]),
    };
  }, [data, smbId]);

  /* ================= UI ================= */

  return (
    <Box
      width="100%"
      height="259px"
      p="20px"
      bg={useColorModeValue("white", "#131512")}
      mt={5}
    >
      <HStack
        color={useColorModeValue("#062D59", "#fff")}
        alignItems="flex-start"
      >
        {/* ===== COLUMN 1 ===== */}
        <Flex
          flexDir="column"
          height="219px"
          width="337px"
          pr="20px"
          borderRight="1px solid #DDE3E8"
          gap="20px"
          mr="20px"
        >
          <Metric value={metrics.makeModel} label="Make & Model" />
          <Metric value={metrics.azimuthAngle} label="Azimuth Angle" />
        </Flex>

        {/* ===== COLUMN 2 ===== */}
        <Flex
          flexDir="column"
          height="219px"
          width="337px"
          pr="20px"
          borderRight="1px solid #DDE3E8"
          gap="20px"
          mr="20px"
        >
          <Metric value={metrics.dcCapacity} label="DC Capacity" />
          <Metric value={metrics.zenithAngle} label="Zenith Angle" />
        </Flex>

        {/* ===== COLUMN 3 ===== */}
        <Flex
          flexDir="column"
          height="136px"
          width="337px"
          pr="20px"
          borderRight="1px solid #DDE3E8"
          gap="20px"
          mr="20px"
        >
          <Metric value={metrics.installationType} label="Installation Type" />
          <Metric value={metrics.avgAmps} label="Avg Amps" />
        </Flex>

        {/* ===== COLUMN 4 ===== */}
        <Flex
          flexDir="column"
          height="136px"
          width="337px"
          pr="20px"
          gap="20px"
          mr="20px"
        >
          <Metric value={metrics.installationDir} label="Installation Dir." />
          <Metric value={metrics.avgVolt} label="Avg Volt" />
        </Flex>
      </HStack>
    </Box>
  );
};

/* ================= REUSABLE METRIC ================= */

const Metric = ({
  value,
  label,
}: {
  value: number | string;
  label: string;
}) => {
  return (
    <VStack spacing={0} alignItems="flex-start">
      <Text fontWeight={700} fontSize="16px">
        {value}
      </Text>
      <Text fontSize="14px" color="#9BABBD">
        {label}
      </Text>
    </VStack>
  );
};

export default SmbStaticInfos;
