import React, {
  useEffect,
  useMemo,
} from "react";

import {
  Box,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import ColumnGraph from "../../Graphs/RevampCharts/ColumnGraph";

import useTimeseriesData from "../../../hooks/useTimeseriesData";

interface WidgetPoint {
  ts: number;
  value: number;
}

interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}

const stringRows = Array.from(
  { length: 24 },
  (_, i) => i + 1
);

/* ================= RANGE ================= */

const ranges = [
  {
    label: "0-2",
    min: 0,
    max: 2,
  },

  {
    label: "2-4",
    min: 2,
    max: 4,
  },

  {
    label: "4-6",
    min: 4,
    max: 6,
  },

  {
    label: "6-8",
    min: 6,
    max: 8,
  },

  {
    label: "8-10",
    min: 8,
    max: 10,
  },

  {
    label: "10-12",
    min: 10,
    max: 12,
  },

  {
    label: "12-14",
    min: 12,
    max: 14,
  },

  {
    label: ">14",
    min: 14,
    max: Infinity,
  },
];

const StringCurrentDistribution = () => {

  const cardBg = useColorModeValue(
    "#ffffff",
    "#0F2235"
  );

  const borderColor = useColorModeValue(
    "#E6EEF6",
    "#1F3B56"
  );

  const textColor = useColorModeValue(
    "gray.800",
    "white"
  );

  const labelColor = useColorModeValue(
    "#5A6B78",
    "#9FB3C8"
  );

  const { data, fetchData } =
    useTimeseriesData();

  /* ================= API ================= */

  useEffect(() => {

    fetchData({
      devices: {
        patterns: [
          "_inverter_inverter_",
        ],
        ids: [],
      },

      keys: stringRows.map(
        (index) => ({
          key: `string_${index}_current`,
          alias: `string_${index}_current`,
          keyType: "common",
        })
      ),

      aggregation: {
        func: "last",
        interval: 1,
        intervalType: "minute",
      },

      timeRange: {
        type: "relative",
        relativeType:
          "currentDaySoFar",
      },

      orderBy: "DESC",
    } as any);

  }, []);

  /* ================= MAP ================= */

  const distributionData =
    useMemo(() => {

      const widgetData =
        data as WidgetData | null;

      if (!widgetData) {

        return ranges.map(
          (range) => ({
            label: range.label,
            value: 0,
          })
        );

      }

      const counts: any = {};

      ranges.forEach((r) => {

        counts[r.label] = 0;

      });

      Object.keys(widgetData).forEach(
        (deviceId) => {

          const d =
            widgetData[deviceId];

          stringRows.forEach(
            (index) => {

              const arr =
                d[
                  `string_${index}_current`
                ];

              const value =
                arr &&
                arr.length > 0
                  ? Number(
                      arr[
                        arr.length -
                          1
                      ]?.value
                    )
                  : 0;

              ranges.forEach(
                (range) => {

                  const inRange =
                    value >=
                      range.min &&
                    value <
                      range.max;

                  if (inRange) {

                    counts[
                      range.label
                    ] += 1;

                  }

                }
              );

            }
          );

        }
      );

      return ranges.map((r) => ({
        label: r.label,
        value:
          counts[r.label],
      }));

    }, [data]);

  /* ================= Y AXIS ================= */

  const maxValue = Math.max(
    ...distributionData.map(
      (d) => d.value
    ),
    10
  );

  const yAxisLabels = [
    maxValue,
    Math.floor(maxValue * 0.75),
    Math.floor(maxValue * 0.5),
    Math.floor(maxValue * 0.25),
    0,
  ];

  return (
    <GraphLayout
      title="String Current Distribution"
      width={["740px"]}
      height="220px"
    >
      <ColumnGraph
        apiData={
          [
            {
              type: 'column',
              name: 'Count',
              color: '#3FA9F5',
              data: distributionData.map((d) => d.value),
            },
          ]
        }
        category={distributionData.map((d) => d.label)}
        height={180}
        props={{
          plotOptions: {
            column: {
              dataLabels: { enabled: false },
              borderWidth: 0,
              pointWidth: 18,
              borderRadius: 6,
            },
          },
          xAxis: {
            categories: distributionData.map((d) => d.label),
            labels: { style: { color: labelColor, fontSize: '11px' } },
          },
          yAxis: {
            min: 0,
            title: { text: '' },
            labels: { style: { color: labelColor, fontSize: '11px' } },
          },
        }}
      />
    </GraphLayout>
  );
};

export default StringCurrentDistribution;