// src/pages/Index.tsx
import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Text,
  Spinner,
  Center,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

import PlantStatusPanel from '../components/PlantStatusPanel';
import EnergyFlowCard from '../components/EnergyFlowCard';
import AlertsCard from '../components/AlertsCard';
import BatteryBankCard from '../components/BatteryBankCard';
import BessPowerChart from '../components/BessPowerChart';
import SocAvgChart from '../components/SocAvgChart';
import InverterTable from '../components/InverterTable';
import BatteryTempChart from '../components/BatteryTempChart';
import MeterCard from '../components/MeterCard';
import BatteryEnergyChart from '../components/BatteryEnergyChart';
import BatteryBankWidget from '../components/Widgets/PlantViewWidgets/BatteryBankWidget';

interface BatteryBank {
  name: string;
  soc: number | null;
  voltage: number | null;
  amps: number | null;
  temperature: number | null;
  device_time_stamps?: string[];
}

const Dashboard = () => {
  const [banks, setBanks] = useState<BatteryBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Date & Time state
  const [dateTime, setDateTime] = useState<string>("");

  useEffect(() => {
    // Format function for date & time
    const formatDateTime = (date: Date) => {
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
      const yyyy = date.getFullYear();

      const hh = String(date.getHours()).padStart(2, "0");
      const min = String(date.getMinutes()).padStart(2, "0");
      const ss = String(date.getSeconds()).padStart(2, "0");

      return `${dd}-${mm}-${yyyy} | ${hh}:${min}:${ss}`;
    };

    const interval = setInterval(() => {
      const now = new Date();
      setDateTime(formatDateTime(now));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   async function fetchBanks() {
  //     try {
  //       const res = await fetch('http://75.119.146.115:5179/api/battery-banks/');
  //       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  //       const data = await res.json();
  //       if (data.success) {
  //         setBanks(data.data);
  //       } else {
  //         throw new Error(data.error || 'Failed to fetch battery banks');
  //       }
  //     } catch (err: any) {
  //       console.error('Error fetching battery banks:', err);
  //       setError(err.message || 'Failed to fetch');
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchBanks();
  //   const interval = setInterval(fetchBanks, 10000);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <Box bg="gray.900" minH="100vh" color="white" px={4} py={6}>
      <Box
        w="100%"
        mx="auto"
        bg="gray.800"
        borderRadius="lg"
        p={6}
        shadow="lg"
      >
        {/* Breadcrumb + Date/Time */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="gray.500" />}
            fontWeight="medium"
            fontSize="sm"
          >
            <BreadcrumbItem>
              <BreadcrumbLink
                as={Link}
                to="/"
                _hover={{
                  bg: 'gray.700',
                  px: 2,
                  py: 1,
                  borderRadius: 'md',
                }}
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink
                as={Link}
                to="/portfolio"
                _hover={{
                  bg: 'gray.700',
                  px: 2,
                  py: 1,
                  borderRadius: 'md',
                }}
              >
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* 📅 Date & Time */}
          <Text fontSize="sm" fontWeight="medium" color="gray.300">
            {dateTime}
          </Text>
        </Box>

        {/* SECTION 1: BESS Cards */}
        <Grid
          templateColumns={{
            base: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          }}
          gap={6}
          mb={6}
        >
          <Box gridColumn={{ base: '1', md: '1 / span 1' }}>
            <PlantStatusPanel />
          </Box>
          <Box gridColumn={{ base: '1', md: '2 / span 2' }}>
            <EnergyFlowCard />
          </Box>
          <Box gridColumn={{ base: '1', md: '4 / span 1' }}>
            <MeterCard />
          </Box>
        </Grid>

        {/* SECTION 2: Charts */}
        <Box display="flex" gap={4} flexWrap="nowrap" mb={5}>
          <Box minW="700px" flex="1">
            <BessPowerChart />
          </Box>
          <Box minW="500px" flex="1">
            <BatteryEnergyChart />
          </Box>
        </Box>

        {/* SECTION 3: Battery Bank + Inverters */}
        <Box display="flex" gap={6} flexWrap="wrap" mt={6}>
          <Box
            width="500px"
            display="flex"
            flexDirection="column"
            gap={4}
            flexShrink={0}
          >
            <BatteryBankWidget />
            <Box display="flex" gap={4} flexWrap="nowrap" mb={5}>
              <Box flex="1" minW="720px" h="250px">
                <SocAvgChart />
              </Box>
              <Box flex="2" minW="700px">
                <BatteryTempChart />
              </Box>
            </Box>
          </Box>
          <Box flex="1" minW="0">
            <InverterTable />
          </Box>
        </Box>

        <Box gridColumn={{ base: '1', sm: '1 / span 2', md: '1 / span 4' }}>
          <AlertsCard />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
