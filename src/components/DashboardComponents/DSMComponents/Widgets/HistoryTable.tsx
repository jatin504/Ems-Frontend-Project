import React, { useEffect, useState } from "react";
import {
 Box, Table, Thead, Tbody, Tr, Th, Td, Text, useColorModeValue
} from "@chakra-ui/react";

type DSMBlock = {
 actual_export_kwh: string
 actual_import_kwh: string
 block_no: number
 block_time: string
 deemed_energy_kwh: string
 delivered_energy_kwh: string
 deviation_kwh: string
 dsm_charge: string
 dsm_rate: string
 frequency: string
 net_export_kwh: string
 plant_id: string
 scheduled_energy_kwh: string
 scheduled_power_kw: string
};

const HistoryTable: React.FC = () => {

 const [rows, setRows] = useState<DSMBlock[]>([])
 const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString()?.replace(/\/$/, "") || ""; 
 useEffect(() => {
   fetch(`${API_BASE}/api/dsm/block_summary?plant_id=plant_1&date=2026-08-11`)
     .then(res => res.json())
     .then(data => {
       setRows(data.data)
     })
 }, [])

 const bg = useColorModeValue("rgba(255,255,255,1)", "rgba(22,27,27,1)");
 const borderColor = useColorModeValue("#E2E8F0", "#1F2733");
 const headerBg = useColorModeValue("#F0F0F0", "rgba(22,27,27,1)");
 const headerText = useColorModeValue("#161B1B", "#FFF");
 const hoverBg = useColorModeValue("#F5F7FA", "#0f1421");

 return (
   <Box border={`1px solid ${borderColor}`} borderRadius="xl" bg={bg} px={4} py={4} w={"1336px"} h="100%" overflow={"auto"}>
     <Text color={headerText} mb={3} fontWeight="semibold">
       Historical Data
     </Text>

     <Box h="100%" border={`1px solid ${borderColor}`}>

       <Table size="sm" variant="simple">

         <Thead>
           <Tr>
             <Th bg={headerBg}>Time</Th>
             <Th bg={headerBg}>Schedule (MW)</Th>
             <Th bg={headerBg}>Actual (MW)</Th>
             <Th bg={headerBg}>Deviation</Th>
             <Th bg={headerBg}>Tariff (₹)</Th>
             <Th bg={headerBg}>DSM Penalty (₹)</Th>
           </Tr>
         </Thead>

         <Tbody>
           {rows.map((r) => {

			   const time = (r.block_time)

             const scheduleMW = Number(r.scheduled_power_kw) / 1000
             const actualMW = Number(r.net_export_kwh) * 4 / 1000
             const deviationMW = Number(r.deviation_kwh) * 4 / 1000

             return (
               <Tr key={r.block_no} _hover={{ bg: hoverBg }}>

                 <Td>{time}</Td>

                 <Td>{scheduleMW.toFixed(2)}</Td>

                 <Td>{actualMW.toFixed(2)}</Td>

                 <Td>
                   {deviationMW > 0 ? "+" : ""}
                   {deviationMW.toFixed(2)} MW
                 </Td>

                 <Td>{r.dsm_rate}</Td>

                 <Td>₹{Number(r.dsm_charge).toFixed(0)}</Td>

               </Tr>
             )
           })}
         </Tbody>

       </Table>

     </Box>
   </Box>
 )
}

export default HistoryTable