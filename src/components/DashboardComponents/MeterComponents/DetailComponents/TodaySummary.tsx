// TodaySummary.tsx

import {
  Box,
  Flex,
  Grid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  FiCalendar,
} from "react-icons/fi";

import {
  HiOutlineChartBar,
} from "react-icons/hi";

import {
  BsInfinity,
} from "react-icons/bs";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import CommonCard from "./CommonCard";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";

type Props = {
  selectedMeter?: string;
};

const commonIconColor =
  "#60a5fa";

const TodaySummary = ({
  selectedMeter,
}: Props) => {

  const {
    data,
    fetchData,
  } = useTimeseriesData();

  const [
    energyData,
    setEnergyData,
  ] = useState<any>({
    today: 0,
    month: 0,
    year: 0,
    total: 0,
  });

  /* ================= FETCH API ================= */

  useEffect(() => {

    if (!selectedMeter)
      return;

    const ids = [

      `${selectedMeter}_1_day`,

      `${selectedMeter}_1_month`,

      `${selectedMeter}_1_year`,

      `${selectedMeter}_total`,

    ];

    const fetchingObj = {

      devices: {
        patterns: [],
        ids,
      },

      keys: [

        {
          key:
            "daily_active_energy_export",

          alias:
            "daily_active_energy_export",

          keyType:
            "timeseries",
        },

      ],

      aggregation: {
        func: "last",
        interval: 1,
        intervalType: "day",
      },

      timeRange: {
        type: "absolute",
        startTs: 0,
        endTs: Date.now(),
      },

      orderBy: "DESC",

    };

    const fetchAll =
      async () => {

        try {

          

          await fetchData(
            fetchingObj as any
          );

        } catch (err) {

          

        }

      };

    fetchAll();

    const interval =
      setInterval(() => {

        fetchAll();

      }, 60000);

    return () =>
      clearInterval(interval);

  }, [selectedMeter]);

  /* ================= MAP DATA ================= */

  useEffect(() => {

    if (
      !data ||
      !selectedMeter
    )
      return;

    const dayId =
      `${selectedMeter}_1_day`;

    const monthId =
      `${selectedMeter}_1_month`;

    const yearId =
      `${selectedMeter}_1_year`;

    const totalId =
      `${selectedMeter}_total`;


    setEnergyData({

      today: Number(

        (data as any)?.[
          dayId
        ]?.daily_active_energy_export?.[0]
          ?.value || 0

      ),

      month: Number(

        (data as any)?.[
          monthId
        ]?.daily_active_energy_export?.[0]
          ?.value || 0

      ),

      year: Number(

        (data as any)?.[
          yearId
        ]?.daily_active_energy_export?.[0]
          ?.value || 0

      ),

      total: Number(

        (data as any)?.[
          totalId
        ]?.daily_active_energy_export?.[0]
          ?.value || 0

      ),

    });

  }, [data, selectedMeter]);

  /* ================= FORMAT ================= */

  const formatEnergy = (
    value: number
  ) => {

    if (value >= 1000000) {

      return `${(
        value / 1000000
      ).toFixed(2)} GWh`;

    }

    if (value >= 1000) {

      return `${(
        value / 1000
      ).toFixed(2)} MWh`;

    }

    return `${value.toFixed(
      2
    )} kWh`;

  };

  /* ================= COLORS ================= */

  const textColor =
    useColorModeValue(
      "#0f172a",
      "#ffffff"
    );

  const borderColor =
    useColorModeValue(
      "#dbe7f3",
      "#16395c"
    );

  const cardBg =
    useColorModeValue(
      "#ffffff",
      "primary.dark"
    );

  const isDark =
    useColorModeValue(
      false,
      true
    );

  /* ================= ROWS ================= */

  const rows =
    useMemo(() => {

      return [

        {
          title:
            "Today",

          value:
            formatEnergy(
              energyData.today
            ),

          icon:
            <FiCalendar />,

          color:
            commonIconColor,
        },

        {
          title:
            "This Month",

          value:
            formatEnergy(
              energyData.month
            ),

          icon:
            <HiOutlineChartBar />,

          color:
            commonIconColor,
        },

        {
          title:
            "This Year",

          value:
            formatEnergy(
              energyData.year
            ),

          icon:
            <FiCalendar />,

          color:
            commonIconColor,
        },

        {
          title:
            "Lifetime",

          value:
            formatEnergy(
              energyData.total
            ),

          icon:
            <BsInfinity />,

          color:
            commonIconColor,
        },

      ];

    }, [energyData]);

  return (

    <CommonCard
      bg={cardBg}
      p="14px"
      borderRadius="10px"
      h="100%"
      overflow="hidden"
    >

      <Text
        fontSize="15px"
        fontWeight="700"
        color={textColor}
        mb="14px"
      >
        Export Energy
      </Text>

      <Box
        h="1px"
        bg={
          isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(15,23,42,0.08)"
        }
        mb="18px"
      />

      <Grid
        templateColumns="repeat(4,1fr)"
        h="calc(100% - 58px)"
      >

        {rows.map(
          (
            row,
            index
          ) => (

            <Flex
              key={row.title}
              direction="column"
              align="center"
              justify="center"
              borderRight={
                index !== 3
                  ? `1px solid ${borderColor}`
                  : "none"
              }
              px="12px"
            >

              <Text
                color={
                  isDark
                    ? "#dbeafe"
                    : "#334155"
                }
                fontSize="13px"
                fontWeight="500"
                mb="18px"
              >
                {row.title}
              </Text>

              <Flex
                fontSize="34px"
                color={row.color}
                mb="18px"
                align="center"
                justify="center"
              >
                {row.icon}
              </Flex>

              <Text
                color={textColor}
                fontSize="18px"
                fontWeight="500"
                letterSpacing="0.2px"
                whiteSpace="nowrap"
              >
                {row.value}
              </Text>

            </Flex>

          )
        )}

      </Grid>

    </CommonCard>

  );

};

export default TodaySummary;