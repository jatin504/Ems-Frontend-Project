import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import Highcharts, { color } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Maximize2, Minimize2, MoreVertical } from 'lucide-react';
import { useESSHistoryLast12Hours } from '../hooks/ess/useESSHistoryLast12Hours';
import { useTargetIdKeyHistoryLast12Hours } from '../hooks/target/useTargetIdKeyHistoryLast12Hours';

const AnalyticsChart = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  const handleFullScreenToggle = () => {
    const elem = document.getElementById('analytics-chart-container');
    if (!isFullscreen && elem?.requestFullscreen) {
      elem.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleChange = () => {
      const full = !!document.fullscreenElement;
      setIsFullscreen(full);

      // Resize chart
      setTimeout(() => {
        chartRef.current?.chart.reflow();
      }, 300);
    };

    document.addEventListener('fullscreenchange', handleChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleChange);
    };
  }, []);

  const [seriesData, setSeriesData] = useState<any[]>([{}])

  const chartOptions: Highcharts.Options = {
  chart: {
    type: "spline",
    backgroundColor: "transparent",
    height: 290,
  },
  title: { text: undefined },
  tooltip : {
      enabled : true,
      shared : true,
      backgroundColor: '#222',
      borderColor: '#888',
      style: { color: '#fff' },
    },
  xAxis: {
      type: 'datetime',
      labels: { style: { color: '#ffffffb3' } },
      lineWidth: 1,
      lineColor: '#ffffff66',
      gridLineWidth: 0,
      tickLength: 0,
    },
    yAxis: [{
      title: { text: null },
      labels: { style: { color: '#ffffffb3' } },
      gridLineWidth: 1,
      lineWidth: 1,
      lineColor: '#ffffff66',
      tickLength: 6,
    },{
      title: { text: null },
      labels: { style: { color: '#ffffffb3' } },
      gridLineWidth: 1,
      lineWidth: 1,
      lineColor: '#ffffff66',
      tickLength: 6,
      opposite : true
    }],
  legend: {
    align: "center",
    verticalAlign: "bottom",
    itemStyle: { color: "#ccc" },
  },
  series: seriesData,
  credits: { enabled: false },
  exporting : {enabled : false}
};

  const keys = useMemo(() => [
  { id: "plant_1_pcs_1_ess_ess_1", key: "active_power_kw" },
  { id: "plant_1_poi_meter_1", key: "power_kw" },
  { id: "plant_1_poi_meter_1", key: "total_pv_power" },
  { id: "plant_1_pcs_controller_1", key: "chargeah" },
], []);
//   const startTs = useMemo(() => '2025-06-18 14:50:00', []);
// const endTs = useMemo(() => '2025-06-18 15:50:00', []);

  const { data, status, error } = useTargetIdKeyHistoryLast12Hours(keys);
  // console.log(data)
  useEffect(() => {
    if(data) {
    //   console.log(convertToSeries(data))

    setSeriesData(convertToSeries(data));
    }
  },[data])


  // if (status === 'loading') return <div>Loading history...</div>;
  if (status === 'error') return <div>Error: {error}</div>;

  return (
    <Box
      id="analytics-chart-container"
      bg="gray.900"
      borderRadius={isFullscreen ? 'none' : 'md'}
      p={4}
      shadow="md"
      width="100%"
      maxW={isFullscreen ? '100vw' : '500px'}
      height={isFullscreen ? '100vh' : '380px'}
      position="relative"
      overflow={"hidden"}
    >
      {/* Fullscreen Toggle Button */}
      <IconButton
        icon={isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        aria-label={isFullscreen ? 'Minimize' : 'Full screen'}
        size="sm"
        variant="ghost"
        color="whiteAlpha.800"
        position="absolute"
        top="8px"
        right="40px"
        zIndex={10}
        onClick={handleFullScreenToggle}
      />

      {/* 3-dot menu with options only */}
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<MoreVertical size={16} />}
          variant="ghost"
          color="whiteAlpha.800"
          position="absolute"
          top="8px"
          right="8px"
          size="sm"
          zIndex={10}
        />
        <MenuList bg="gray.900" color="black">
          <MenuItem onClick={() => console.log('Download PNG clicked')}>
            Download PNG
          </MenuItem>
          <MenuItem onClick={() => console.log('Download CSV clicked')}>
            Download CSV
          </MenuItem>
        </MenuList>
      </Menu>

      <HStack justify="space-between" align="start" mb={2}>
        <VStack align="start" spacing={1} px={5}>
          <Text fontSize="xl" fontWeight="semibold">
            Analytics
          </Text>
          {/* <Text fontSize="sm" opacity={0.7}>
            Max / Min &nbsp; 63% / 49%
          </Text> */}
        </VStack>

        {/* <HStack spacing={4} align="end" mt={4}>
          {['5M', '15M', '30M', '1H'].map((label) => (
            <Box key={label} textAlign="center">
              <Text
                fontSize="sm"
                fontWeight="bold"
                color={label === '15M' ? 'yellow.400' : 'whiteAlpha.700'}
              >
                {label}
              </Text>
              {label === '15M' && (
                <Box height="2px" bg="yellow.400" mt="4px" borderRadius="full" />
              )}
            </Box>
          ))}
        </HStack> */}
      </HStack>

      <Box mt={5} height={isFullscreen ? 'calc(100% - 80px)' : '100%'}>
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          ref={chartRef}
          containerProps={{
            style: {
              height: '100%',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default AnalyticsChart;


function convertToSeries(data : any) {
    const seriesData = [];
    
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
          if(key.includes("active_power_kw")) {
            seriesData.push({
                name: "ESS kW",
                opacity : 0.8,
                data: data[key].map((item : any) => [new Date(item.ts).getTime() + 1000*60*60*5.5, parseFloat(item.value)]),
                color : "blue"
            });
          } else if(key.includes("power_kw")) {
            seriesData.push({
                name: "Load kW",
                opacity : 0.8,
                data: data[key].map((item : any) => [new Date(item.ts).getTime() + 1000*60*60*5.5, parseFloat(item.value)]),
                color : "red"
            });
          } else if(key.includes("total_pv_power")) {
            seriesData.push({
                name: "Plant kW",
                opacity : 0.8,
                data: data[key].map((item : any) => [new Date(item.ts).getTime() + 1000*60*60*5.5, parseFloat(item.value)]),
                color : "green"
            });
          } else if(key.includes("chargeah")) {
            seriesData.push({
                name: "Setpoint kW",
                opacity : 0.8,
                data: data[key].map((item : any) => [new Date(item.ts).getTime() + 1000*60*60*5.5, parseFloat(item.value)]),
                yAxis : 1,
                opposite : true,
                color : "yellow"
            });
          }
        }
    }
    
    return seriesData;
}


// const chartOptions: Highcharts.Options = {
//   chart: {
//     type: "spline",
//     backgroundColor: "transparent",
//     height: 270,
//   },
//   title: { text: undefined },
//   xAxis: {
//     categories: ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
//     labels: { style: { color: "#ccc" } },
//   },
//   yAxis: {
//     labels: { style: { color: "#ccc" } },
//     gridLineColor: "#444",
//     title : {
//       text : ""
//     }
//   },
//   legend: {
//     align: "center",
//     verticalAlign: "bottom",
//     itemStyle: { color: "#ccc" },
//   },
//   series: [
//     {
//       name: "PCS Power",
//       data: [22, 40, 55, 70, 110, 95, 10],
//       type: "spline",
//       color: "blue",
//     },
//     {
//       name: "Load Power",
//       data: [10, 28, 45, 60, 100, 130, 125, 20],
//       type: "spline",
//       color: "red",
//     },
//     {
//       name: "Plant Power",
//       data: [30, 10, 45, 100, 80, 95, 135, 30],
//       type: "spline",
//       color: "green",
//     },
//   ],
//   credits: { enabled: false },
//   exporting : {enabled : false}
// };