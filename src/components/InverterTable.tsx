import {
  Box,
  Text,
  HStack,
  VStack,
  IconButton,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@chakra-ui/react';
import {
  FaExpandArrowsAlt,
  FaCompressArrowsAlt,
} from 'react-icons/fa';
import { useMemo, useState } from 'react';
import { useLatestPCSData } from '../hooks/pcs/useLatestPCSData';
import { useSSE } from '../hooks/sse/useSSE';
// import { useLatestPCSData } from '../hooks/pcs/useLatestPCSData';

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString()?.replace(/\/$/, "") || "";

type PCSData = {
  table_name: string;
  active_power_kw: number;
  reactive_power_kvar: number;
  charge_energy_kwh: number;
  discharge_energy_kwh: number;
  voltage: number;
  amps: number;
};

const InverterTable = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const pcsCol = ["ID",
    "DC_Volt",
  "DC_Current_B1",
  "DC_Current_B2",
  "DC_Current_B3",
  "DC_Current_Total",
  "DC_Volt_Total",
  "DC_Volt_B1",
  "DC_Volt_B2",
  "DC_Volt_B3",
  "AC_Current_L1",
  "AC_Current_L2",
  "AC_Current_L3",
  "PF",
  "Apparent_Power",
  "Active_Power",
  "Reactive_Power",
  "AC_Volt_L1L2",
  "AC_Volt_L2L3",
  "AC_Volt_L3L1",
  "Grid_Frequency",
  "Temp_Cab_AC",
  "Temp_Cab_DC",
  "Temp_Cab_Electronics",
  "Temp_Cab_Max",
  "Temp_Bridge_IGBT_Max",
  "Temp_Bridge_PCB_Max",
  "Temp_Outside",
  "Temp_MV_Transformer",
  "DC_Switch_1_Status",
  "DC_Switch_2_Status",
  "DC_Switch_3_Status",
  "AC_Circuit_Breaker_Status",
  "Capacitor_Contactor_Status",
  "Precharge_Contactor_Status",
  "Total_FeedIn_Time",
  "Total_Operating_Time",
  "Total_DC_Energy",
  "Total_AC_Energy",
  "Daily_DC_Energy",
  "Daily_AC_Energy",
  "Fan_Cabinet_1_Time",
  "Fan_Cabinet_2_Time",
  "Fan_Bridge_Time",
  "Heater_Cabinet_Time",
  "Heater_Minus40_Time",
  "Error_Location",
  "Inverter_Error_Status",
  "Error_Number",
  "Inverter_Op_State",
  "StartStop_Key_Switch",
  "Grid_Connect_Wait_Time",
  "Inverter_Serial_Number",
  "GFDI_Switch_Status",
  "Active_Power_Setpoint",
  "Max_Apparent_Power_Setpoint",
  "Reactive_Power_Setpoint",
  "Power_Factor_Setpoint"
  ];
const keys = [
    "DC_Volt",
  "DC_Current_B1",
  "DC_Current_B2",
  "DC_Current_B3",
  "DC_Current_Total",
  "DC_Volt_Total",
  "DC_Volt_B1",
  "DC_Volt_B2",
  "DC_Volt_B3",
  "AC_Current_L1",
  "AC_Current_L2",
  "AC_Current_L3",
  "PF",
  "Apparent_Power",
  "Active_Power",
  "Reactive_Power",
  "AC_Volt_L1L2",
  "AC_Volt_L2L3",
  "AC_Volt_L3L1",
  "Grid_Frequency",
  "Temp_Cab_AC",
  "Temp_Cab_DC",
  "Temp_Cab_Electronics",
  "Temp_Cab_Max",
  "Temp_Bridge_IGBT_Max",
  "Temp_Bridge_PCB_Max",
  "Temp_Outside",
  "Temp_MV_Transformer",
  "DC_Switch_1_Status",
  "DC_Switch_2_Status",
  "DC_Switch_3_Status",
  "AC_Circuit_Breaker_Status",
  "Capacitor_Contactor_Status",
  "Precharge_Contactor_Status",
  "Total_FeedIn_Time",
  "Total_Operating_Time",
  "Total_DC_Energy",
  "Total_AC_Energy",
  "Daily_DC_Energy",
  "Daily_AC_Energy",
  "Fan_Cabinet_1_Time",
  "Fan_Cabinet_2_Time",
  "Fan_Bridge_Time",
  "Heater_Cabinet_Time",
  "Heater_Minus40_Time",
  "Error_Location",
  "Inverter_Error_Status",
  "Error_Number",
  "Inverter_Op_State",
  "StartStop_Key_Switch",
  "Grid_Connect_Wait_Time",
  "Inverter_Serial_Number",
  "GFDI_Switch_Status",
  "Active_Power_Setpoint",
  "Max_Apparent_Power_Setpoint",
  "Reactive_Power_Setpoint",
  "Power_Factor_Setpoint"
  ];
  // const keys = useMemo(() => [
  //   'active_power_kw',
  //   'reactive_power_kvar',
  //   'charge_energy_kwh',
  //   'discharge_energy_kwh',
  //   'voltage',
  //   'amps'
  // ], []);

  // const { data, status, error } = useLatestPCSData(keys);

  // const pcsData = data? data.length > 0 ? data : [] : []
    const [dataMap, setDataMap] = useState<Record<string, any>>({});
  
  useSSE({
          url: `${API_BASE}/stream?topics=${[
            "plant_1_block_1_inverter_inverter_1",
            "plant_1_block_1_inverter_inverter_2",
            "plant_1_block_2_inverter_inverter_3",
            "plant_1_block_2_inverter_inverter_4"
          ].join(",")}`,
          onMessage: ({ topic, message }: { topic: string; message: any }) => {
            setDataMap((prev) => ({ ...prev, [topic]: message }));
          },
          onError: (err: unknown) => console.error("SSE error:", err),
        });

        // console.log(new Date().toLocaleString(), dataMap)
      
        // const dataESS1 = dataMap["plant_1_pcs_1_ess_ess_1"];
        // const dataESS2 = dataMap["plant_1_pcs_1_ess_ess_2"];
  // if (status === 'error') return <div>Error: {error}</div>;

  // const pcsData: PCSData[] = [
  //   {
  //     table_name: "plant_1_pcs_inverter_1",
  //     active_power_kw: 120.5,
  //     reactive_power_kvar: 15.2,
  //     charge_energy_kwh: 80.0,
  //     discharge_energy_kwh: 20.5,
  //     voltage: 480,
  //     amps: 200,
  //   },
  //   {
  //     table_name: "plant_1_pcs_inverter_2",
  //     active_power_kw: 130.2,
  //     reactive_power_kvar: 18.0,
  //     charge_energy_kwh: 90.5,
  //     discharge_energy_kwh: 30.2,
  //     voltage: 485,
  //     amps: 210,
  //   },
  //   {
  //     table_name: "plant_1_pcs_inverter_3",
  //     active_power_kw: 110.8,
  //     reactive_power_kvar: 14.5,
  //     charge_energy_kwh: 70.2,
  //     discharge_energy_kwh: 25.1,
  //     voltage: 475,
  //     amps: 190,
  //   },
  // ];

  return (
    <Box
      bg="#2D3748"
      borderRadius="lg"
      boxShadow="lg"
      p={4}
      mt={0}
      w="100%"
    >
      <Box
        w={isFullscreen ? '100vw' : '100%'}
        h={isFullscreen ? '100vh' : '485px'}
        position={isFullscreen ? 'fixed' : 'relative'}
        top={isFullscreen ? '0' : 'auto'}
        left={isFullscreen ? '0' : 'auto'}
        zIndex={isFullscreen ? 999 : 'auto'}
        p={isFullscreen ? 4 : 0}
        bg="gray.900"
      >
        <Box
          bg="gray.900"
          borderRadius="md"
          border="1px solid #4A5568"
          overflow="hidden"
          h="100%"
          display="flex"
          flexDirection="column"
        >
          <HStack
            p={4}
            borderBottom="1px solid #4A5568"
            justifyContent="space-between"
            bg="gray.900"
          >
            <Text fontSize="lg" color="gray.300" fontWeight="semibold">
              PCS
            </Text>
            <IconButton
              aria-label="Toggle Fullscreen"
              icon={isFullscreen ? <FaCompressArrowsAlt /> : <FaExpandArrowsAlt />}
              size="sm"
              variant="ghost"
              color="gray.400"
              onClick={() => setIsFullscreen(!isFullscreen)}
              _hover={{ color: 'white' }}
            />
          </HStack>

          <Box
            flex="1"
            overflowY="auto"
            px={4}
            py={4}
            sx={{
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#718096',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'gray.900',
              },
            }}
            >
            {/* Table Rows */}
            {/* <VStack spacing={2} align="stretch">
              {pcsData.map((elem, index) => (
                <Box
                  key={index}
                  py={2}
                  borderRadius="md"
                  bg="gray.800"
                >
                  <HStack fontSize="xs" width="100%" color="white">
                    <Box textAlign="center" flex="1">{index + 1}</Box>
                    <Box textAlign="center" flex="1">{elem['active_power_kw']}</Box>
                    <Box textAlign="center" flex="1">{elem['reactive_power_kvar']}</Box>
                    <Box textAlign="center" flex="1">{elem['charge_energy_kwh']}</Box>
                    <Box textAlign="center" flex="1">{elem['discharge_energy_kwh']}</Box>
                    <Box textAlign="center" flex="1">{elem['voltage']}</Box>
                    <Box textAlign="center" flex="1">{elem['amps']}</Box>
                  </HStack>
                </Box>
              ))}
            </VStack> */}
            {/* Table Header */}
            {/* <HStack pb={3} fontSize="sm" height="30px" color="gray.400" fontWeight="semibold" width="100%">
              {pcsCol.map((col, i) => (
                <Text key={i} textAlign="center" flex="1">
                  {col}
                </Text>
              ))}
            </HStack>


            <VStack spacing={2} align="stretch">
              {Object.values(dataMap).length > 0 ? Object.values(dataMap).map((elem : any, index) => (
                <Box
                  key={index}
                  py={2}
                  borderRadius="md"
                  bg="gray.800"
                >
                  <HStack fontSize="xs" width="100%" color="white">
                    <Box textAlign="center" flex="1">{index + 1}</Box>
                    {keys.map((key, i) => (
                      <Box textAlign="center" flex="1">{elem[key]["value"]}</Box>
                    ))}
                  </HStack>
                </Box>
              )) : (<></>)}
            </VStack> */}
            <TableContainer>
  <Table variant="unstyled" colorScheme="gray">
    {/* Table Header */}
    <Thead>
      <Tr>
        {/* The first header cell for the index column */}
        {/* <Th textAlign="center">#</Th> */}
        {/* Map over pcsCol to create the rest of the header cells */}
        {pcsCol.map((col, i) => (
          <Th key={i} textAlign="center">
            {col}
          </Th>
        ))}
      </Tr>
    </Thead>

    {/* Table Body */}
    <Tbody>
      {Object.values(dataMap).length > 0 ? (
        Object.values(dataMap).map((elem, index) => (
          <Tr key={index}>
            {/* The first data cell for the index */}
            <Td textAlign="center">{index + 1}</Td>
            {/* Map over keys to create the data cells for each row */}
            {keys.map((key, i) => (
              <Td key={i} textAlign="center">
                {elem[key]["value"]}
              </Td>
            ))}
          </Tr>
        ))
      ) : (
        <Tr>
          <Td colSpan={keys.length + 1} textAlign="center">
            No data available.
          </Td>
        </Tr>
      )}
    </Tbody>
  </Table>
</TableContainer>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InverterTable;