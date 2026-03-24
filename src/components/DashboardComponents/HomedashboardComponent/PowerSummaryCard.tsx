import Highcharts from "highcharts";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";
import { useColorModeValue } from "@chakra-ui/react";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import { useEffect, useState, useRef } from "react";

HighchartsExporting(Highcharts);

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString()?.replace(/\/$/, "") || "";

const DEVICE_ID = "plant_1_pcs_2_bank_bank_1";

const PowerSummaryCard = () => {

  const chartRef = useRef<any>(null);
  const [isFull, setIsFull] = useState(false);
  const textColor = useColorModeValue("#111", "#fff");
  const labelColor = useColorModeValue("#7a8aa0", "#8aa4bf");

  const [values, setValues] = useState([0,0,0]);

  const getVal = (deviceObj:any, key:string) => {

    const realKey = Object.keys(deviceObj)
      .find(k => k.trim() === key);

    if(!realKey) return 0;

    return Number(deviceObj[realKey]?.value ?? 0);
  };

  /*  FETCH FUNCTION */
  const loadData = () => {

    fetch(
      `${API_BASE}/api/lastest-direct-data/multiple-latest-devices`,
      {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          device_ids: DEVICE_ID
        })
      }
    )
    .then(r=>r.json())
    .then(j=>{

      if(!j.success) return;

      const d = j.data?.[DEVICE_ID];
      if(!d) return;

      const v1 = getVal(d,"BCU_1_Pack_with_highest_temperature");
      const v2 = getVal(d,"BCU_1_Rack_current");
      const v3 = getVal(d,"Battery_cabin_humidity_1");

      setValues([v1,v2,v3]);

    })
    .catch(console.error);

  };

  useEffect(() => {

    loadData(); //  initial load

    const interval = setInterval(() => {
      loadData();
    }, 60000); //  1 minute

    return () => clearInterval(interval); //  cleanup

  }, []);

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

    plotOptions:{
      column:{
        borderRadius:10,
        pointWidth:80,
        dataLabels:{
          enabled:true,
          formatter:function(){
            return `<b>${this.y}</b>`;
          },
          useHTML:true,
          style:{
            color:textColor,
            textOutline:"none"
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
      width={["450px"]}
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