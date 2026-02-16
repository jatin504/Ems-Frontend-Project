import { Box, Text, HStack, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Maximize2, Minimize2, MoreVertical } from 'lucide-react';
import { useESSHistoryLast5Minutes } from '../hooks/ess/useESSHistoryLast5Minutes copy';

// Highcharts modules
import('highcharts/modules/exporting').then(m => m.default(Highcharts));
import('highcharts/modules/export-data').then(m => m.default(Highcharts));

const BatteryEnergyChart = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const [seriesData, setSeriesData] = useState<any[]>([{}]);

  const keys = useMemo(() => ['charge_energy_kwh', 'discharge_energy_kwh'], []);
  const { data, status, error } = useESSHistoryLast5Minutes(keys);

  useEffect(() => {
    if (data) setSeriesData(convertToSeries(data));
  }, [data]);

  // ---- heights (increased) ----
  const BOX_HEIGHT = isFullscreen ? '100vh' : '340px';                 // was 300px
  const CHART_HEIGHT = isFullscreen ? Math.max(200, window.innerHeight - 80) : 270; // was 220

  const chartOptions: Highcharts.Options = useMemo(
    () => ({
      chart: {
        backgroundColor: 'transparent',
        height: CHART_HEIGHT,         // <-- important
      },
      title: { text: '' },
      xAxis: {
        type: 'datetime',
        lineColor: '#666',
        labels: { style: { color: '#aaa' } },
        title: { text: '' },
        tickAmount: 5,
      },
      yAxis: {
        gridLineColor: '#444',
        labels: { style: { color: '#aaa' } },
        tickLength: 6,
        title: { text: '' },
        tickAmount: 6,
      },
      legend: { enabled: true, itemStyle: { color: '#aaa', fontWeight: 'normal' } },
      tooltip: {
        shared: true,
        backgroundColor: '#222',
        borderColor: '#888',
        style: { color: '#fff' },
      },
      series: seriesData,
      exporting: { enabled: false },
      credits: { enabled: false },
    }),
    [CHART_HEIGHT, seriesData]
  );

  // reflow on fullscreen + resize
  useEffect(() => {
    const reflow = () => chartRef.current?.chart?.reflow();
    const t = setTimeout(reflow, 50);
    if (isFullscreen) window.addEventListener('resize', reflow);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', reflow);
    };
  }, [isFullscreen]);

  if (status === 'error') return <div>Error: {String(error)}</div>;

  return (
    <Box
      bg="gray.900"
      borderRadius={isFullscreen ? '0' : 'md'}
      p={4}
      minW="240px"
      flex="1"
      boxShadow="md"
      w={isFullscreen ? '100vw' : '100%'}
      h={BOX_HEIGHT}                 // <-- taller card
      position={isFullscreen ? 'fixed' : 'relative'}
      top={isFullscreen ? 0 : 'auto'}
      left={isFullscreen ? 0 : 'auto'}
      zIndex={isFullscreen ? 1000 : 'auto'}
      overflow="hidden"
    >
      {/* Header Bar */}
      <HStack justify="space-between" mb={5}>
        <Text fontSize="xl" fontWeight="semibold" px={5}>
          Charge/Discharge
        </Text>

        <HStack spacing={2}>
          <Menu>
            <MenuButton
              as={IconButton}
              size="sm"
              variant="ghost"
              icon={<MoreVertical size={16} />}
              aria-label="Options"
              color="gray.400"
              _hover={{ color: 'black' }}
            />
            <MenuList bg="gray.800" borderColor="gray.600">
              <MenuItem color="black" onClick={() => chartRef.current?.chart?.exportChart({}, {})}>
                Download PNG
              </MenuItem>
              <MenuItem color="black" onClick={() => chartRef.current?.chart?.downloadCSV?.()}>
                Download CSV
              </MenuItem>
            </MenuList>
          </Menu>

          <IconButton
            aria-label="Toggle Fullscreen"
            icon={isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            size="sm"
            variant="ghost"
            color="gray.400"
            onClick={() => setIsFullscreen(!isFullscreen)}
            _hover={{ color: 'white' }}
          />
        </HStack>
      </HStack>

      {/* Chart */}
      <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chartRef} />
    </Box>
  );
};

export default BatteryEnergyChart;

function convertToSeries(data: any) {
  const seriesData: any[] = [];
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      seriesData.push({
        // NOTE: names adjusted; remove temperature label
        name: key,
        type: 'column', // 'column' is the vertical bar; change back to 'bar' if you want horizontal
        data: data[key].map((item: any) => [
          new Date(item.ts).getTime() + 1000 * 60 * 60 * 5.5,
          parseFloat(item.value),
        ]),
      });
    }
  }
  return seriesData;
}
