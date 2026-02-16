import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  VStack,
  Text,
} from '@chakra-ui/react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Maximize2, Minimize2, MoreVertical } from 'lucide-react';
import { useESSHistoryLast12Hours } from '../hooks/ess/useESSHistoryLast12Hours';

const BessPowerChart = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  const handleFullScreenToggle = () => {
    const elem = document.getElementById('bess-power-chart-container');
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


  const options: Highcharts.Options = {
    chart: {
      type: 'area',
      backgroundColor: 'transparent',
      height: isFullscreen ? '100%' : 230,
      style: { fontFamily: 'Segoe UI, sans-serif' },
    },
    title: { text: '' },
    xAxis: {
      type: 'datetime',
      gridLineColor: '#4A5568',
      lineColor: '#A0AEC0',
      labels: { style: { color: '#E2E8F0' } },
    },
    yAxis: {
      title: {
        text: 'Power (kW)',
        style: { color: '#E2E8F0' },
      },
      gridLineColor: '#4A5568',
      labels: { style: { color: '#E2E8F0' } },
    },
    tooltip: {
      shared: true,
      backgroundColor: '#1A202C',
      borderColor: '#38B2AC',
      style: { color: '#E2E8F0' },
    },
    legend: { 
      enabled: true ,
      itemStyle : {
        color : '#ffffffb3'
      }
    },
    series: seriesData,
    credits: { enabled: false },
    exporting: {
      enabled: false,
    }
  };

   const keys = useMemo(() => ['active_power_kw', 'reactive_power_kvar'], []);
//   const startTs = useMemo(() => '2025-06-18 14:50:00', []);
// const endTs = useMemo(() => '2025-06-18 15:50:00', []);

  const { data, status, error } = useESSHistoryLast12Hours(keys);
  // console.log(data)
  useEffect(() => {
    if(data) {
    //   console.log(convertToSeries(data))

    setSeriesData(convertToSeries(data));
    }
  },[data])

  return (
    <Box
      id="bess-power-chart-container"
      maxW={isFullscreen ? '100vw' : '1220px'}
      height={isFullscreen ? '100vh' : 'auto'}
      mx="auto"
      mt={2}
      p={isFullscreen ? 4 : 6}
      bg="gray.900"
      borderRadius={isFullscreen ? 'none' : 'lg'}
      boxShadow="lg"
      // position="relative"
    >
      <HStack mb={5} justifyContent={'space-between'}>

        {/* title */}
        <Box px={5}>
          <Text fontSize="xl" fontWeight="semibold">
            Power
          </Text>
        </Box>

        <Box>
          {/* Fullscreen Toggle */}
          <IconButton
            icon={isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            aria-label="Toggle Fullscreen"
            size="sm"
            variant="ghost"
            color="whiteAlpha.800"
            // position="absolute"
            // top="8px"
            // right="40px"
            zIndex={10}
            onClick={handleFullScreenToggle}
          />

          {/* Menu Icon */}
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<MoreVertical size={16} />}
              variant="ghost"
              color="whiteAlpha.800"
              size="sm"
              // position="absolute"
              // top="8px"
              // right="8px"
              zIndex={10}
            />
            <MenuList bg="gray.700" color="black">
              <MenuItem onClick={() => console.log('Download PNG clicked')}>Download PNG</MenuItem>
              <MenuItem onClick={() => console.log('Download CSV clicked')}>Download CSV</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </HStack>



      {/* Chart */}
      <Box height={isFullscreen ? 'calc(100% - 40px)' : 'auto'}>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
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

export default BessPowerChart;


function convertToSeries(data : any) {
    const seriesData = [];
    
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            seriesData.push({
                name: key.includes("active_power_kw") ? key.replace('active_power_kw', 'Active') + " kW" : key.replace('reactive_power_kvar', 'Reactive') + " kVAR",
                opacity : 0.8,
                data: data[key].map((item : any) => [new Date(item.ts).getTime() + 1000*60*60*5.5, parseFloat(item.value)])
            });
        }
    }
    
    return seriesData;
}
