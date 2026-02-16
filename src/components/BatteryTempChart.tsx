import { Box, Text, HStack, VStack, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { FaExpandArrowsAlt, FaCompressArrowsAlt, FaEllipsisV } from 'react-icons/fa';
import { useESSHistoryLast12Hours } from '../hooks/ess/useESSHistoryLast12Hours';

// Load Highcharts modules with dynamic import for compatibility with TypeScript and React
import('highcharts/modules/exporting').then(module => {
  module.default(Highcharts);
});
import('highcharts/modules/export-data').then(module => {
  module.default(Highcharts);
});


const BatteryTempChart = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

    const [seriesData, setSeriesData] = useState<any[]>([{}])

  const chartOptions: Highcharts.Options = {
    chart: {
      backgroundColor: 'transparent',
      height: 220,
    },
    title: { text: '' },
    xAxis: {
      type: 'datetime',
      lineColor: '#666',
      labels: { style: { color: '#aaa' } },
      title : {
        text : ""
      }
    },
    yAxis: {
      gridLineColor: '#444',
      labels: { style: { color: '#aaa' } },
      tickLength: 6,
      title : {
        text : ""
      }
    },
    legend: {
      enabled: true,
      itemStyle: { color: '#aaa', fontWeight: 'normal' },
    },
    tooltip: {
      shared: true,
      backgroundColor: '#222',
      borderColor: '#888',
      style: { color: '#fff' },
    },
    series: seriesData,
    exporting: {
      enabled: false,
    },
    credits: { enabled: false },
  };

  // [
  //     {
  //       type: 'line',
  //       name: 'Max Ambient',
  //       data: [26, 26, 27, 27, 28, 28],
  //       color: '#e49a3d',
  //     },
  //     {
  //       type: 'line',
  //       name: 'Min Ambient',
  //       data: [22, 22, 23, 23, 24, 24],
  //       color: '#00c2ff',
  //     },
  //   ]

  const keys = useMemo(() => ['temperature'], []);
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
  
  
    // if (status === 'loading') return <div>Loading history...</div>;
    if (status === 'error') return <div>Error: {error}</div>;

  return (
    <Box
      bg="gray.900"
      borderRadius="md"
      p={4}
      minW="240px"
      flex="1"
      boxShadow="md"
      w={isFullscreen ? '100vw' : '100%'}
      h={isFullscreen ? '100vh' : '300px'}
      position={isFullscreen ? 'fixed' : 'relative'}
      top={isFullscreen ? 0 : 'auto'}
      left={isFullscreen ? 0 : 'auto'}
      zIndex={isFullscreen ? 1000 : 'auto'}
      overflow="hidden"
    >
      {/* Header Bar */}
      <HStack justify="space-between" mb={5}>
        <Text fontSize="xl" fontWeight="semibold" px={5}>
          Temperature
        </Text>

        <HStack spacing={2}>
          <Menu>
            <MenuButton
              as={IconButton}
              size="sm"
              variant="ghost"
              icon={<FaEllipsisV />}
              aria-label="Options"
              color="gray.400"
              _hover={{ color: 'black' }}
            />
            <MenuList bg="gray.800" borderColor="gray.600">
              <MenuItem
              color="black"
                onClick={() =>
                  Highcharts.charts[0]?.exportChart({}, {})
                }
              >
                Download PNG
              </MenuItem>
              <MenuItem
              color={"black"}
                onClick={() =>
                  Highcharts.charts[0]?.downloadCSV?.()
                }
              >
                Download CSV
              </MenuItem>
            </MenuList>
          </Menu>

          <IconButton
            aria-label="Toggle Fullscreen"
            icon={
              isFullscreen ? (
                <FaCompressArrowsAlt />
              ) : (
                <FaExpandArrowsAlt />
              )
            }
            size="sm"
            variant="ghost"
            color="gray.400"
            onClick={() => setIsFullscreen(!isFullscreen)}
            _hover={{ color: 'white' }}
          />
        </HStack>
      </HStack>

      {/* Info Text */}
      {/* <VStack align="start" spacing={1} mb={2} fontSize="sm" color="gray.300">
        <HStack spacing={3}>
          <Text>Battery ambient</Text>
          <Text fontWeight="bold">26 / 22</Text>
        </HStack>
        <HStack spacing={3}>
          <Text>Battery cell</Text>
          <Text fontWeight="bold">21 / 19</Text>
        </HStack>
        <HStack spacing={3}>
          <Text>Battery humidity</Text>
          <Text fontWeight="bold">52%</Text>
        </HStack>
      </VStack> */}

      {/* Chart */}
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </Box>
  );
};

export default BatteryTempChart;


function convertToSeries(data : any) {
    const seriesData = [];
    
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            seriesData.push({
                name: key.replace('temperature', 'Temp') + " °C",
                opacity : 0.8,
                data: data[key].map((item : any) => [new Date(item.ts).getTime() + 1000*60*60*5.5, parseFloat(item.value)])
            });
        }
    }
    
    return seriesData;
}
