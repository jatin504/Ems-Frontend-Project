import React from "react";
import { Box, HStack, VStack } from "@chakra-ui/react";

import BatteryIntelligenceHeader from "../components/DashboardComponents/BatteryIntelligence/BatteryIntelligenceHeader";
import BatteryIntelligenceTopRibbon from "../components/DashboardComponents/BatteryIntelligence/BatteryIntelligenceTopRibbon";

import HealthScoreBreakdown from "../components/DashboardComponents/BatteryIntelligence/HealthScoreBreakdown";
import SOHTrendPrediction from "../components/DashboardComponents/BatteryIntelligence/SOHTrendPrediction";
import DegradationFactors from "../components/DashboardComponents/BatteryIntelligence/DegradationFactors";
import RackHealthRanking from "../components/DashboardComponents/BatteryIntelligence/RackHealthRanking";
import LifetimeAnalytics from "../components/DashboardComponents/BatteryIntelligence/LifetimeAnalytics";
import PredictedRemainingCapacity from "../components/DashboardComponents/BatteryIntelligence/PredictedRemainingCapacity";
import AnomalyDetection from "../components/DashboardComponents/BatteryIntelligence/AnomalyDetection";
import EventImpactAnalysis from "../components/DashboardComponents/BatteryIntelligence/EventImpactAnalysis";
import AIRecommendations from "../components/DashboardComponents/BatteryIntelligence/AIRecommendations";
import NextMaintenancePrediction from "../components/DashboardComponents/BatteryIntelligence/NextMaintenancePrediction";

const BatteryIntelligenceDashboard = () => {
    return (
        <Box p={4} w="100%">
            <VStack spacing={4} align="stretch">
                {/* Header */}
                <BatteryIntelligenceHeader />

                {/* Top Ribbon */}
                <Box mt="-12px">
                    <BatteryIntelligenceTopRibbon />
                </Box>

                {/* First Row */}
                <HStack spacing={4} align="stretch" w="100%">
                    <Box w="610px" h="280px">
                        <HealthScoreBreakdown />
                    </Box>

                    <Box w="610px" h="280px" mt="-16px" alignSelf="flex-start">
                        <SOHTrendPrediction />
                    </Box>

                    <Box w="610px" h="280px">
                        <DegradationFactors />
                    </Box>
                </HStack>

                <HStack spacing={4} align="stretch">
                    <Box w="610px" h="280px" >
                        <RackHealthRanking />
                    </Box>

                    <Box w="610px" h="280px" >
                        <LifetimeAnalytics />
                    </Box>

                    <Box w="610px" h="280px" mt="-16px" alignSelf="flex-start">
                        <PredictedRemainingCapacity />
                    </Box>
                </HStack>

                {/* Third Row */}
                <HStack spacing={4} align="stretch">
                    <Box w="460px" h="240px">
                        <AnomalyDetection />
                    </Box>

                    <Box w="520px" h="240px">
                        <EventImpactAnalysis />
                    </Box>

                    <Box w="500px" h="240px">
                        <AIRecommendations />
                    </Box>

                    <Box w="420px" h="240px">
                        <NextMaintenancePrediction />
                    </Box>
                </HStack>
            </VStack>
        </Box>
    );
};

export default BatteryIntelligenceDashboard;