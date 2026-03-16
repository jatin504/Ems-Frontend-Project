import { Box, HStack, VStack } from "@chakra-ui/react"

import PlantCard from "../components/DashboardComponents/SolarviewDashboard/Widgets/PlantCard";
import MeterCard from "../components/DashboardComponents/SolarviewDashboard/Widgets/MeterCard";
import PowerFlow from "../components/DashboardComponents/SolarviewDashboard/Widgets/PowerFlow";
import PlantViewTable from "../components/DashboardComponents/SolarviewDashboard/Widgets/PlantViewTable";

import PowerCurve from "../components/DashboardComponents/SolarviewDashboard/Widgets/PowerCurve";
import SoCGraph from "../components/DashboardComponents/SolarviewDashboard/Widgets/SoCGraph";

import PRBarGraph from "../components/DashboardComponents/SolarviewDashboard/Widgets/PRBarGraph";

import PRGraph from "../components/DashboardComponents/SolarviewDashboard/Widgets/PRGraph";
import PVTemperatureGraph from "../components/DashboardComponents/SolarviewDashboard/Widgets/PVTemperatureGraph";
import MeterWidget from "../components/DashboardComponents/SolarviewDashboard/Widgets/MeterWidget";
import BatteryBanks from "../components/DashboardComponents/SolarviewDashboard/Widgets/BatteryBanks";


const SolarView = () => {
    return (
        <Box width={"100%"}>

            <HStack
                width={"100%"}
                height={"308px"}
                gap={'20px'}
            >

                <Box width={"330px"} height={"100%"}>
                    <PlantCard />
                </Box>

                <Box width={"330px"} height={"100%"}>
                    <MeterCard />
                </Box>

                <Box width={"330px"} height={"100%"}>
                    <PowerFlow />
                </Box>

                <Box width={"820px"} height={"100%"}>
                    <PlantViewTable />
                </Box>

            </HStack>

            <HStack
                width={"100%"}
                height={"1072px"}
                gap={"20px"}
            >

                <VStack
                    width={"1176px"}
                    height={"100%"}
                    gap={"20px"}
                >

                    <HStack
                        width={"100%"}
                        height={"344px"}
                        gap={"20px"}
                    >

                        <Box width={"605px"} height={"100%"}>
    <PowerCurve />
</Box>

<Box width={"605px"} height={"100%"}>
    <PVTemperatureGraph />
</Box>

<Box width={"605px"} height={"100%"}>
    <MeterWidget />
</Box>

                    </HStack>

                    <HStack
                        width={"100%"}
                        height={"344px"}
                        gap={"20px"}
                    >

                        <Box width={"1176px"} height={"100%"}>
                            <PRBarGraph />
                        </Box>

                    </HStack>

                    <HStack
                        width={"100%"}
                        height={"344px"}
                        gap={"20px"}
                    >

                        <Box width={"578px"} height={"100%"}>
                            <SoCGraph />
                        </Box>

                        <Box width={"578px"} height={"100%"}>
                            <PRGraph />
                        </Box>

                    </HStack>

                </VStack>

                <Box
                    width={"666px"}
                    height={"708px"}
                    mt={"400px"}
                >
                    <BatteryBanks />
                </Box>

            </HStack>

        </Box>
    )
};

export default SolarView;