import React from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Text, useColorModeValue } from "@chakra-ui/react";


const rows = [
["11:45","22.0","23.6","+1.6 MW","3.5","₹1,200"],
["12:00","21.0","22.6","+1.6 MW","3.4","₹1,050"],
["12:15","21.5","23.0","+1.5 MW","3.2","₹1,050"],
["12:30","21.9","21.8","-0.1 MW","3.1","₹1,000"],
["12:45","21.3","21.2","-0.1 MW","3.2","₹1,050"],
["13:00","20.8","20.9","+0.1 MW","3.2","₹920"],
["13:15","21.0","21.8","+0.8 MW","2.8","₹900"],
["13:30","18.3","20.1","+1.8 MW","3.0","₹880"],
["13:45","17.0","19.8","+0.6 MW","2.7","₹800"],
];


const HistoryTable: React.FC = () => {
	const bg = useColorModeValue("rgba(255,255,255,1)", "rgba(22,27,27,1)");
	const borderColor = useColorModeValue("#E2E8F0", "#1F2733");
	const headerBg = useColorModeValue("#F0F0F0", "rgba(22,27,27,1)");
	const headerText = useColorModeValue("#161B1B", "#FFF");
	const cellText = useColorModeValue("#161B1B", "#c9d6f2");
	const hoverBg = useColorModeValue("#F5F7FA", "#0f1421");
	const subText = useColorModeValue("#7b8aa8", "#7b8aa8");
	const colBg = useColorModeValue("rgba(240,240,240,1)", "inherit");
	return (
		<Box border={`1px solid ${borderColor}`} borderRadius="xl" bg={bg} px={4} py={4} w={"1336px"} h="100%" overflow={"auto"}>
			<Text color={headerText} mb={3} fontWeight="semibold">Historical Data</Text>
			<Box h="100%" border={`1px solid ${borderColor}`}> 
				<Table
					size="sm"
					variant="simple"
					// sx={{
					// 	"td:not(:last-child), th:not(:last-child)": { borderRight: `1px solid ${borderColor}` },
					// 	"td, th": { borderColor: borderColor, color: cellText },
					// 	"td": { background: colBg }
					// }}
				>
					<Thead height={"49px"}>
						<Tr height={"100%"}>
							<Th bg={headerBg} color={headerText}>Time</Th>
							<Th bg={headerBg} color={headerText}>Schedule (MW)</Th>
							<Th bg={headerBg} color={headerText}>Actual (MW)</Th>
							<Th bg={headerBg} color={headerText}>Deviation</Th>
							<Th bg={headerBg} color={headerText}>Tariff (₹)</Th>
							<Th bg={headerBg} color={headerText}>DSM Penalty (₹)</Th>
						</Tr>
					</Thead>
					<Tbody>
						{rows.map((r, i) => (
							<Tr key={i} _hover={{ bg: hoverBg }}>
								{r.map((c, j) => (
									<Td fontSize={"14px"} height={"49px"} key={j}>{c}</Td>
								))}
							</Tr>
						))}
					</Tbody>
				</Table>
			</Box>
		</Box>
	);
};
export default HistoryTable;