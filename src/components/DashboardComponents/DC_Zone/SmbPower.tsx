import {
  Box,
  Flex,
  Image,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useMemo } from "react";
import SmbImg from "../../../assets/SmbImg.png";
import useTimeseriesData from "../../../hooks/useTimeseriesData";

/* TYPES*/

interface WidgetPoint {
  ts: number;
  value: number;
}

interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}

/* COMPONENT  */

const SmbPower = () => {
  const { data, fetchData } = useTimeseriesData();

  
  const deviceId = "plant_1_pcs_2_bank_bank_1";
  /*  API CALL  */

  useEffect(() => {
    fetchData({
      devices: {
        patterns: [],
        ids: [deviceId],
      },
      keys: [
        {
          key: "power_factor",
          alias: "smbPower",
          keyType: "common",
          type: "spline",
          color: "#22c55e",
        },
      ],
      aggregation: {
        func: "avg",
        interval: 15,
        intervalType: "minute",
      },
      timeRange: {
        type: "relative",
        relativeType: "currentDaySoFar",
      },
      orderBy: "DESC",
    } as any);
  }, []);

  /* MAP DATA   */

  const powerValue = useMemo(() => {
    const widgetData = data as WidgetData | null;

    if (
      !widgetData ||
      !widgetData[deviceId] ||
      !widgetData[deviceId]["smbPower"] ||
      widgetData[deviceId]["smbPower"].length === 0
    ) {
      return 0;
    }

    const arr = widgetData[deviceId]["smbPower"];
    return arr[arr.length - 1].value;
  }, [data]);

  let displayValue: string | number = powerValue;
  if (typeof powerValue === "number" && !isNaN(powerValue)) {
    displayValue = powerValue.toFixed(2);
  }

  /*  UI  */

  return (
    <Box
      width="100%"
      height="100%"
      p="20px"
      bg={useColorModeValue("white", "#131512")}
      mt={5}
      overflow="hidden"
    >
      <Flex flexDir="column" height="100%">
        {/* VALUE */}
        <VStack spacing={2} alignItems="flex-start">
          <Flex alignItems="baseline" gap={1}>
            <Text fontWeight={700} fontSize="22px">
              {displayValue}
            </Text>
            <Text fontWeight={500} fontSize="14px">
              kW
            </Text>
          </Flex>
          <Text fontSize="16px" color="#9BABBD">
            SMB Power
          </Text>
        </VStack>

        {/* IMAGE  */}
        <Box alignSelf="flex-end" mt="auto">
          <Image
            height="150px"
            src={SmbImg}
            alt="SMB Power"
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default SmbPower;
