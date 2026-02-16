import { Box, Flex, Grid, Text } from "@chakra-ui/react"
import { useMemo, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useLatestDynamicData } from "../../../hooks/Dynamics/useLatestPCSData";




const StringConnectedWidget : FC<{currentBank : string}> = ({currentBank}) => {
    const keys = useMemo(() => [
        'active_power_kw'
    ], []);

    const { data, status, error } = useLatestDynamicData(keys,`${currentBank}_rack_rack_`);

    const rackData = data ? data.length > 0 ? data : [] : []
    if (status === 'error') return <div>Error: {error}</div>;
    const navigate = useNavigate();
    return (
        <Box
            overflowY={'auto'}
            p={0}
        >
            <Text fontWeight="bold" fontSize="lg" mb={4}>
                String Connected Layout
            </Text>

            <Flex wrap={'wrap'} gap={2} p={0} height={'100%'} overflowY={'auto'}>
                {rackData.map((elem : any, i) => {
                    const id = `BK1.S${(i + 1).toString().padStart(2, '0')}`;
                    const title = formatString(elem.table_name)
                    return (
                        <Box
                            key={i}
                            bg="#4A5568"
                            p={2}
                            borderRadius="md"
                            textAlign="center"
                            cursor="pointer"
                            _hover={{ bg: '#2C5282' }}
                            onClick={() => navigate(`/string`, {state : {currentString : title, currentBank : currentBank}})}
                        >
                            <Text fontSize="xs" fontWeight="bold">{id}</Text>
                            <Text fontSize="2xs" color={"green.200"}>CONNECTED</Text>
                            {/* <Text fontSize="2xs" color={elem.active_power_kw ? "green.200" : 'red.500'}>{elem.active_power_kw ? "CONNECTED" : 'DISABLE'}</Text> */}
                            <Box mt={2} h="30px" bg="gray.700" borderRadius="md"></Box>
                        </Box>
                    );
                })}
                {rackData.length == 0 ? (
                    <Text textAlign={'center'} fontSize={'12px'}>No Racks present in this bank!</Text>
                ) : (<></>)}
            </Flex>
        </Box>
    )
};


export default StringConnectedWidget;


function formatString(input: string): string {
  // Regex to capture pcs number and bank number
  const regex = /pcs_(\d+).*?bank_(\d+).*?rack_(\d+)/;
  const match = input.match(regex);

  if (match) {
    const [, pcsNum, bankNum, rackNum] = match;
    return `pcs_${pcsNum}_bank_${bankNum}_rack_${rackNum}`;
  }

  return input; // fallback if regex doesn't match
}