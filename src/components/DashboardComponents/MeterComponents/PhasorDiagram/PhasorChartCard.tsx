import React, {
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  Box,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";

HighchartsMore(Highcharts);

type Props = {
  selectedMeter?: string;
};

const PhasorChartCard = ({
  selectedMeter,
}: Props) => {
  const chartRef = useRef<any>(null);

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

    const interval = setInterval(
      doFetch,
      60000
    );

    return () =>
      clearInterval(interval);
  }, [selectedMeter]);

  const phasorSeries = useMemo(() => {
    const meterData =
      (data as any)?.[
        selectedMeter || ""
      ] || {};

    const voltageR = Number(
      meterData?.voltage_ln_r?.[0]
        ?.value || 0
    );

    const voltageY = Number(
      meterData?.voltage_ln_y?.[0]
        ?.value || 0
    );

    const voltageB = Number(
      meterData?.voltage_ln_b?.[0]
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

    const avgPf = Number(
      meterData?.avg_pf?.[0]?.value ||
        0.95
    );

    const pf =
      Math.min(
        Math.max(avgPf, -1),
        1
      );

    const phaseShift =
      Math.acos(pf) *
      (180 / Math.PI);

    return [
      {
        type: "line" as const,
        name: "Va",
        color: "#FACC15",
        data: [
          [0, 0],
          [0, voltageR],
        ],
      },

      {
        type: "line" as const,
        name: "Vb",
        color: "#84CC16",
        data: [
          [240, 0],
          [240, voltageY],
        ],
      },

      {
        type: "line" as const,
        name: "Vc",
        color: "#C084FC",
        data: [
          [120, 0],
          [120, voltageB],
        ],
      },

      {
        type: "line" as const,
        name: "Ia",
        color: "#FACC15",
        dashStyle: "Dash",
        data: [
          [phaseShift, 0],
          [phaseShift, currentR],
        ],
      },

      {
        type: "line" as const,
        name: "Ib",
        color: "#84CC16",
        dashStyle: "Dash",
        data: [
          [240 + phaseShift, 0],
          [240 + phaseShift, currentY],
        ],
      },

      {
        type: "line" as const,
        name: "Ic",
        color: "#C084FC",
        dashStyle: "Dash",
        data: [
          [120 + phaseShift, 0],
          [120 + phaseShift, currentB],
        ],
      },
    ];
  }, [data, selectedMeter]);

  const bg = useColorModeValue(
    "#ffffff",
    "#071d36"
  );

  const borderColor =
    useColorModeValue(
      "rgba(0,0,0,0.08)",
      "rgba(255,255,255,0.08)"
    );

  const textColor =
    useColorModeValue(
      "#1A202C",
      "#D7E4FF"
    );

  const gridColor = "#2E5A8A";

  const options: Highcharts.Options = {
    chart: {
      polar: true,
      animation: false,
      backgroundColor:
        "transparent",
      height: 330,
    },

    title: {
      text: undefined,
    },

    credits: {
      enabled: false,
    },

    exporting: {
      enabled: false,
    },

    pane: {
      size: "85%",
    },

    xAxis: {
      min: 0,
      max: 360,

      tickPositions: [
        0,
        45,
        90,
        135,
        180,
        225,
        270,
        315,
      ],

      labels: {
        style: {
          color: "#8EA7CF",
          fontSize: "12px",
        },
      },

      lineWidth: 0,
      gridLineColor: gridColor,
    },

    yAxis: {
      min: 0,

      max: Math.max(
        300,
        ...phasorSeries.flatMap(
          (s: any) =>
            s.data.map(
              (p: any) => p[1]
            )
        )
      ),

      tickAmount: 5,

      labels: {
        enabled: false,
      },

      gridLineColor: gridColor,
    },

    legend: {
      align: "right",
      verticalAlign: "middle",
      layout: "vertical",
      x: -24,

      itemStyle: {
        color: textColor,
      },
    },

    tooltip: {
      shared: false,

      pointFormatter:
        function () {
          return `<b>${this.series.name}</b>: ${Number(
            this.y
          ).toFixed(2)}`;
        },
    },

    plotOptions: {
      series: {
        animation: false,

        marker: {
          enabled: true,
          radius: 3,
        },

        lineWidth: 2,
      },
    },

    series:
      phasorSeries as Highcharts.SeriesOptionsType[],
  };

  return (
    <Box
      bg={bg}
      borderRadius="8px"
      border={`1px solid ${borderColor}`}
      overflow="hidden"
      h="390px"
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
        >
          PHASOR DIAGRAM
        </Text>
      </Box>

      <Box p={3}>
        <HighchartsReact
          ref={chartRef}
          highcharts={Highcharts}
          options={options}
        />
      </Box>
    </Box>
  );
};

export default PhasorChartCard;