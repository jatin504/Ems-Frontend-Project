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

const EnergyByTariff = ({
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

  const tariffData = useMemo(() => {
    const meterData =
      (data as any)?.[
        selectedMeter || ""
      ] || {};

    const importEnergy = Number(
      meterData
        ?.daily_active_energy_import?.[0]
        ?.value || 0
    );

    const exportEnergy = Number(
      meterData
        ?.daily_active_energy_export?.[0]
        ?.value || 0
    );

    const peakImport =
      importEnergy * 0.67;

    const offPeakImport =
      importEnergy * 0.33;

    const peakExport =
      exportEnergy * 0.65;

    const offPeakExport =
      exportEnergy * 0.35;

    return [
      {
        tariff:
          "Peak (06:00 - 22:00)",

        import:
          peakImport.toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          ),

        export:
          peakExport.toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          ),

        net: (
          peakImport - peakExport
        ).toLocaleString(
          undefined,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ),
      },

      {
        tariff:
          "Off Peak (22:00 - 06:00)",

        import:
          offPeakImport.toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          ),

        export:
          offPeakExport.toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          ),

        net: (
          offPeakImport -
          offPeakExport
        ).toLocaleString(
          undefined,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ),
      },
    ];
  }, [data, selectedMeter]);

  const totals = useMemo(() => {
    const meterData =
      (data as any)?.[
        selectedMeter || ""
      ] || {};

    const importEnergy = Number(
      meterData
        ?.daily_active_energy_import?.[0]
        ?.value || 0
    );

    const exportEnergy = Number(
      meterData
        ?.daily_active_energy_export?.[0]
        ?.value || 0
    );

    return {
      import:
        importEnergy.toLocaleString(
          undefined,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ),

      export:
        exportEnergy.toLocaleString(
          undefined,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ),

      net: (
        importEnergy -
        exportEnergy
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
        ENERGY BY TARIFF
      </Text>

      <HStack
        py="8px"
        mb="2px"
      >
        <Box flex="2.8">
          <Text
            fontSize="13px"
            color={headerColor}
            fontWeight="500"
          >
            Tariff
          </Text>
        </Box>

        <Box
          flex="1.4"
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
          flex="1.4"
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
          flex="1.1"
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
        {tariffData.map(
          (row, index) => (
            <Box key={index}>
              <HStack py="12px">
                <Box flex="2.8">
                  <Text
                    fontSize="15px"
                    color={textColor}
                  >
                    {row.tariff}
                  </Text>
                </Box>

                <Box
                  flex="1.4"
                  textAlign="right"
                >
                  <Text
                    fontSize="15px"
                    color={textColor}
                  >
                    {row.import}
                  </Text>
                </Box>

                <Box
                  flex="1.4"
                  textAlign="right"
                >
                  <Text
                    fontSize="15px"
                    color={textColor}
                  >
                    {row.export}
                  </Text>
                </Box>

                <Box
                  flex="1.1"
                  textAlign="right"
                >
                  <Text
                    fontSize="15px"
                    color={textColor}
                  >
                    {row.net}
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
        <Box flex="2.8">
          <Text
            fontSize="16px"
            fontWeight="700"
            color={textColor}
          >
            Total
          </Text>
        </Box>

        <Box
          flex="1.4"
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
          flex="1.4"
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
          flex="1.1"
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

export default EnergyByTariff;