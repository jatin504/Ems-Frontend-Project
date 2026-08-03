import {
  Box,
  Text,
  VStack,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  useEffect,
  useMemo,
} from "react";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";

type Props = {
  selectedMeter?: string;
};

const EnergyByPhase = ({
  selectedMeter,
}: Props) => {
  const { data, fetchData } =
    useTimeseriesData();

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
            key: "daily_active_energy_import",
            alias: "daily_active_energy_import",
            keyType: "timeseries",
          },
          {
            key: "daily_active_energy_export",
            alias: "daily_active_energy_export",
            keyType: "timeseries",
          },
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

    const interval = setInterval(
      doFetch,
      60000
    );

    return () =>
      clearInterval(interval);
  }, [selectedMeter]);

  const phaseData = useMemo(() => {
    const meterData =
      (data as any)?.[
        selectedMeter || ""
      ] || {};

    const totalImport = Number(
      meterData
        ?.daily_active_energy_import?.[0]
        ?.value || 0
    );

    const totalExport = Number(
      meterData
        ?.daily_active_energy_export?.[0]
        ?.value || 0
    );

    const currentR = Number(
      meterData?.current_r?.[0]
        ?.value || 0
    );

    const currentY = Number(
      meterData?.current_y?.[0]
        ?.value || 0
    );

    const currentB = Number(
      meterData?.current_b?.[0]
        ?.value || 0
    );

    const totalCurrent =
      currentR +
      currentY +
      currentB;

    const rRatio =
      totalCurrent > 0
        ? currentR /
          totalCurrent
        : 1 / 3;

    const yRatio =
      totalCurrent > 0
        ? currentY /
          totalCurrent
        : 1 / 3;

    const bRatio =
      totalCurrent > 0
        ? currentB /
          totalCurrent
        : 1 / 3;

    const rImport =
      totalImport * rRatio;

    const yImport =
      totalImport * yRatio;

    const bImport =
      totalImport * bRatio;

    const rExport =
      totalExport * rRatio;

    const yExport =
      totalExport * yRatio;

    const bExport =
      totalExport * bRatio;

    return [
      {
        phase: "R",
        import: rImport,
        export: rExport,
        net:
          rImport - rExport,
      },
      {
        phase: "Y",
        import: yImport,
        export: yExport,
        net:
          yImport - yExport,
      },
      {
        phase: "B",
        import: bImport,
        export: bExport,
        net:
          bImport - bExport,
      },
    ];
  }, [data, selectedMeter]);

  const totals = useMemo(() => {
    const meterData =
      (data as any)?.[
        selectedMeter || ""
      ] || {};

    const totalImport = Number(
      meterData
        ?.daily_active_energy_import?.[0]
        ?.value || 0
    );

    const totalExport = Number(
      meterData
        ?.daily_active_energy_export?.[0]
        ?.value || 0
    );

    return {
      import:
        totalImport.toLocaleString(
          undefined,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ),

      export:
        totalExport.toLocaleString(
          undefined,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ),

      net: (
        totalImport -
        totalExport
      ).toLocaleString(
        undefined,
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      ),
    };
  }, [data, selectedMeter]);

  const bg = useColorModeValue(
    "#FFFFFF",
    "#082647"
  );

  const borderColor =
    useColorModeValue(
      "#D9E2F0",
      "#123A63"
    );

  const textColor =
    useColorModeValue(
      "#1A202C",
      "#FFFFFF"
    );

  const headerColor =
    useColorModeValue(
      "#718096",
      "#B7C6DA"
    );

  const dividerColor =
    useColorModeValue(
      "#E2E8F0",
      "rgba(255,255,255,0.08)"
    );

  const format = (
    value: number
  ) =>
    value.toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  return (
    <Box
      bg={bg}
      border={`1px solid ${borderColor}`}
      borderRadius="10px"
      p="16px"
      h="100%"
    >
      <Text
        fontSize="15px"
        fontWeight="700"
        color={textColor}
        mb="16px"
      >
        ENERGY BY PHASE (TODAY)
      </Text>

      <HStack py="8px">
        <Box flex="1">
          <Text
            fontSize="13px"
            color={headerColor}
            fontWeight="500"
          >
            Phase
          </Text>
        </Box>

        <Box
          flex="1.5"
          textAlign="right"
        >
          <Text
            fontSize="13px"
            color={headerColor}
            fontWeight="500"
          >
            Import (kWh)
          </Text>
        </Box>

        <Box
          flex="1.5"
          textAlign="right"
        >
          <Text
            fontSize="13px"
            color={headerColor}
            fontWeight="500"
          >
            Export (kWh)
          </Text>
        </Box>

        <Box
          flex="1.2"
          textAlign="right"
        >
          <Text
            fontSize="13px"
            color={headerColor}
            fontWeight="500"
          >
            Net (kWh)
          </Text>
        </Box>
      </HStack>

      <Box
        h="1px"
        bg={dividerColor}
        mb="2px"
      />

      <VStack
        spacing="0"
        align="stretch"
      >
        {phaseData.map(
          (row, index) => (
            <Box key={index}>
              <HStack py="12px">
                <Box flex="1">
                  <Text
                    fontSize="15px"
                    color={textColor}
                  >
                    {row.phase}
                  </Text>
                </Box>

                <Box
                  flex="1.5"
                  textAlign="right"
                >
                  <Text
                    fontSize="15px"
                    color={textColor}
                  >
                    {format(
                      row.import
                    )}
                  </Text>
                </Box>

                <Box
                  flex="1.5"
                  textAlign="right"
                >
                  <Text
                    fontSize="15px"
                    color={textColor}
                  >
                    {format(
                      row.export
                    )}
                  </Text>
                </Box>

                <Box
                  flex="1.2"
                  textAlign="right"
                >
                  <Text
                    fontSize="15px"
                    color={textColor}
                  >
                    {format(
                      row.net
                    )}
                  </Text>
                </Box>
              </HStack>

              <Box
                h="1px"
                bg={dividerColor}
              />
            </Box>
          )
        )}
      </VStack>

      <HStack
        pt="22px"
        pb="6px"
      >
        <Box flex="1">
          <Text
            fontSize="16px"
            fontWeight="700"
            color={textColor}
          >
            Total
          </Text>
        </Box>

        <Box
          flex="1.5"
          textAlign="right"
        >
          <Text
            fontSize="16px"
            fontWeight="700"
            color={textColor}
          >
            {totals.import}
          </Text>
        </Box>

        <Box
          flex="1.5"
          textAlign="right"
        >
          <Text
            fontSize="16px"
            fontWeight="700"
            color={textColor}
          >
            {totals.export}
          </Text>
        </Box>

        <Box
          flex="1.2"
          textAlign="right"
        >
          <Text
            fontSize="16px"
            fontWeight="700"
            color={textColor}
          >
            {totals.net}
          </Text>
        </Box>
      </HStack>
    </Box>
  );
};

export default EnergyByPhase;