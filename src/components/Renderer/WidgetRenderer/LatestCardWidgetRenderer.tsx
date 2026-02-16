import { Box } from "@chakra-ui/react";
import CircularProgressWidgetRenderer from "./CircularProgressWidgetRenderer";

const CHART_COMPONENTS: Record<string, React.FC<any>> = {
    CircularProgressWidget: CircularProgressWidgetRenderer
};

const LatestCardWidgetRenderer: React.FC<{ config: any; data: any }> = ({ config, data }) => {

    // ✅ Guard checks
    if (!config || !config.latest_card || !config.latest_card.componentName) {
        console.warn(
            "LatestCardWidgetRenderer: latest_card config missing",
            config
        );
        return null;
    }

    const LatestCardComponent =
        CHART_COMPONENTS[config.latest_card.componentName];

    // ✅ Component not registered case
    if (!LatestCardComponent) {
        console.warn(
            `LatestCardWidgetRenderer: Component not found for`,
            config.latest_card.componentName
        );
        return null;
    }

    return (
        <Box
            h="100%"
            w="100%"
            borderRadius="md"
            overflow="hidden"
            boxShadow="md"
        >
            <LatestCardComponent
                data={data}
                config={config}
            />
        </Box>
    );
};

export default LatestCardWidgetRenderer;
