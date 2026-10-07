import Highcharts from "highcharts";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";
import { useColorModeValue } from "@chakra-ui/react";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";
import useTimeseriesData from "../../../hooks/useTimeseriesData";

HighchartsExporting(Highcharts);

const PowerSummaryCard = () => {

  const chartRef = useRef<any>(null);
  const [isFull, setIsFull] = useState(false);
  const textColor = useColorModeValue("#111", "#fff");
  const labelColor = useColorModeValue("#7a8aa0", "#8aa4bf");

  const { config: timeWindowConfig } = useTimeHandle(
    24,
    "hour",
    "avg",
    [1, "hour"],
    60000,
    {
      timeRange: {
        type: "relative",
        relativeType: "currentDaySoFar",
      },
    }
  );

  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    fetchData({
      devices: {
        patterns: [],
        ids: ["plant_1_plant_device"],
      },
      keys: [
        {
          key: "inv_total_power",
          alias: "Solar Gen (kW)",
          keyType: "common",
        },
        {
          key: "total_grid_power",
          alias: "BESS Discharged (kW)",
          keyType: "common",
        },
        {
          key: "ppa_delivered_power",
          alias: "PPA Delivered (kW)",
          keyType: "common",
        },
      ],
      aggregation: timeWindowConfig.aggregation,
      timeRange: timeWindowConfig.timeRange,
      orderBy: "ASC",
    });
  }, [timeWindowConfig]);

  const values = useMemo(() => {
    if (!data || typeof data !== "object") return [0, 0, 0];

    const requestedAliases = [
      "Solar Gen (kW)",
      "BESS Discharged (kW)",
      "PPA Delivered (kW)",
    ];

    return requestedAliases.map((alias) => {
      let latestValue = 0;

      Object.values(data).forEach((deviceObj: any) => {
        if (!deviceObj || typeof deviceObj !== "object") return;

        const points = (deviceObj as Record<string, any>)[alias];
        if (Array.isArray(points) && points.length) {
          latestValue = Number(points[points.length - 1]?.value ?? 0);
        }
      });

      return latestValue;
    });
  }, [data]);

  useEffect(() => {

    const handler = () => {
      setIsFull(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handler);

    return () =>
      document.removeEventListener("fullscreenchange", handler);

  }, []);

  const options: Highcharts.Options = {

    chart:{
      type:"column",
      height: null,
      backgroundColor:"transparent"
    },

    title:{ text:undefined },

    exporting:{ enabled:false },

    xAxis:{
      categories:["Solar Gen","BESS Discharged","PPA Delivered"],
      labels:{
        style:{
          color:labelColor,
          fontSize:"12px"
        }
      }
    },

    yAxis:{ visible:false },

    legend:{ enabled:false },

    tooltip: {
      useHTML: true,
      formatter: function () {
        return `
          <b>${this.key}</b><br/>
          <span style="color:${this.color}">●</span>
          <b>${Number(this.y).toFixed(2)}</b>
        `;
      },
    },

    plotOptions:{
      column:{
        borderRadius:10,
        pointWidth:80,
        dataLabels:{
          enabled:true,
          inside:false,
          crop:false,
          overflow:"allow",
          y:6,
          formatter:function(){
            return `<b>${Number(this.y).toFixed(2)}</b>`;
          },
          useHTML:true,
          style:{
            color:textColor,
            textOutline:"none",
            fontWeight:"600"
          }
        }
      }
    },

    series:[
      {
        type:"column",
        data:[
          { y: values[0], color:"#66a9ff" },
          { y: values[1], color:"#52c7bb" },
          { y: values[2], color:"#63d786" }
        ]
      }
    ],

    credits:{ enabled:false }

  };

  return (
    <GraphLayout
      title="TODAY'S POWER SUMMARY"
      width={["440px"]}
      height="250px"
      fullScreen
    >
      <div
        style={{
          height: isFull ? "calc(100vh - 120px)" : "200px",
          width: "100%",
          transition: "all .3s"
        }}
      >
        <HighchartsReact
          ref={chartRef}
          highcharts={Highcharts}
          options={options}
          containerProps={{ style: { height: "100%", width: "100%" } }}
        />
      </div>
    </GraphLayout>
  );
};

export default PowerSummaryCard;