import CircularProgressWidget from "../../LatestCard/CircularProgressWidget";

const CircularProgressWidgetRenderer: React.FC<{ config: any, data: any }> = ({ config, data }) => {

    return (

        <CircularProgressWidget
            widgetTitle={config.title}
            apiData={data}
            {...config.latest_card.componentProps.containerProps}
            {...config.latest_card.componentProps.circularProgress}
            {...config.latest_card.componentProps.circularProgressLabel}
        />

    );
};

export default CircularProgressWidgetRenderer;