import { Box, HStack, VStack } from "@chakra-ui/react";

import VoltageParametersCard from "./VoltageParametersCard";
import CurrentParametersCard from "./CurrentParametersCard";
import PowerParametersCard from "./PowerParametersCard";
import FrequencyPowerFactorCard from "./FrequencyPowerFactorCard";
import OtherParametersCard from "./OtherParametersCard";

type Props = {
    selectedMeter?: string;
};

const ElectricalParametersDashboard = ({ selectedMeter }: Props) => {
    return (
        <VStack spacing="12px" align="stretch">

            {/* Row 1 */}
            <HStack spacing="12px" align="stretch" w="100%">
                <Box w="33.33%">
                    <VoltageParametersCard selectedMeter={selectedMeter} />
                </Box>

                <Box w="33.33%">
                    <CurrentParametersCard selectedMeter={selectedMeter} />
                </Box>

                <Box w="33.33%">
                    <PowerParametersCard selectedMeter={selectedMeter} />
                </Box>
            </HStack>

            {/* Row 2 */}
            <HStack spacing="12px" align="stretch" w="100%">
                <Box w="50%">
                    <FrequencyPowerFactorCard selectedMeter={selectedMeter} />
                </Box>

                <Box w="50%">
                    <OtherParametersCard selectedMeter={selectedMeter} />
                </Box>
            </HStack>

        </VStack>
    );
};

export default ElectricalParametersDashboard;
