import { Box } from "@chakra-ui/react";
import EnergyFlowCardSVG from "../../EnergyFlowCard";
import MeterCard from "../../MeterCard";
import CircularProgressWidgetRenderer from "./CircularProgressWidgetRenderer";
import SolidGaugeWidgetRenderer from "./SolidGaugeWidgetRenderer";

const CHART_COMPONENTS = {
    CircularProgressWidget: CircularProgressWidgetRenderer,
    EnergyFlowCardSVG: EnergyFlowCardSVG,
    MeterCard: MeterCard,
    SolidGauge: SolidGaugeWidgetRenderer,
} as any;

const StandardWidgetRenderer: React.FC<{ config: any, data: any }> = ({ config, data }) => {

    const StandardComponent = CHART_COMPONENTS[config.standard.componentName];

    return (
        <Box
            h="100%"
            w="100%"
            borderRadius="md"
            overflow="hidden"
            boxShadow="md"
        >

            <StandardComponent
                data={data}
                config={config}
            />
        </Box>
    );
};

export default StandardWidgetRenderer;