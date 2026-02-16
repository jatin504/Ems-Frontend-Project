import { Box, Text } from "@chakra-ui/react"
import BatteryBankCard from "../../BatteryBankCard"
import { useLatestDynamicData } from "../../../hooks/Dynamics/useLatestPCSData";
import { useMemo } from "react";



const BatteryBankWidget = () => {
    
      const keys = useMemo(() => [
        'active_power_kw'
      ], []);
    
      const { data, status, error } = useLatestDynamicData(keys, '_bank_bank');
    
      const bankData = data? data.length > 0 ? data : [] : []
      if (status === 'error') return <div>Error: {error}</div>;

    return (
        <Box
            bg="gray.700"
            height={"520px"}
            overflowY={"auto"}
            borderRadius="lg"
            p={4}
            boxShadow="md"
            sx={{
                "&::-webkit-scrollbar": {
                    width: "5px",
                },
                "&::-webkit-scrollbar-thumb": {
                    background: "gray.500",
                    borderRadius: "full",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                    background: "gray.400",
                },
                "&::-webkit-scrollbar-track": {
                    background: "transparent",
                },
            }}
        >
            <Text fontSize="md" fontWeight="semibold" mb={4}>
                Battery Banks
            </Text>
            <Box display="flex" flexDirection="column" gap={4}>
                {bankData.map((elem : any, index) => (
                    <BatteryBankCard
                        title={formatString(elem.table_name)}
                        connected={10}
                        disabled={0}
                        voltage={623.6}
                        current={33.5}
                        tempLow={27.54}
                        tempHigh={31.75}
                    />
                ))}
            </Box>
        </Box>
    )
};


export default BatteryBankWidget;


function formatString(input: string): string {
  // Regex to capture pcs number and bank number
  const regex = /pcs_(\d+).*?bank_(\d+)/;
  const match = input.match(regex);

  if (match) {
    const [, pcsNum, bankNum] = match;
    return `pcs_${pcsNum}_bank_${bankNum}`;
  }

  return input; // fallback if regex doesn't match
}
