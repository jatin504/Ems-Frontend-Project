import { Box, Text, VStack } from '@chakra-ui/react'
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/progress'
import { useMemo } from 'react';
import { useLatestESSData } from '../../hooks/ess/useLatestESSData';

interface CircularProgressWidgetType {
    // Container
    padding? : number | string;
    width?  : number | string;
    height? : number | string;
    borderRadius? : number | string;
    shadow? : number | string;
    textAlign? : "center" | "end" | "justify" | "left" | "match-parent" | "right" | "start";
    ContainerColor? : string;
    backgroundColor? : string;

    // Circular Progress
    maxValue? : number;
    size? : number | string;
    CircularColor? : string;
    trackColor? : string;
    thickness? : number | string;

    // Circular Label
    fontSize? : number | string;
    CircularLabelColor? : string;
    unit? : string;

    // Widget Title
    widgetTitle? : string;

    // Data
    apiData? : number;
}

const CircularProgressWidget : React.FC<CircularProgressWidgetType> = (
    {
        padding,
        width,
        height,
        borderRadius,
        shadow,
        textAlign,
        ContainerColor,
        backgroundColor,

        maxValue,
        size,
        CircularColor,
        trackColor,
        thickness,

        fontSize,
        CircularLabelColor,
        unit,

        widgetTitle,

        apiData
    }
) => {
  const keys = useMemo(() => ['soc'], []); // you can change this dynamically
  const { data, status, error } = useLatestESSData(keys);

  if (status === 'error') return <div>Error: {error}</div>;

  // console.log(data)

  const sumSoC = data ? data.reduce((sum, item) => sum + parseFloat(item.soc), 0) : 0;

  // Calculate the average
  const avgSoc = data ? sumSoC / data.length : 1;

  return (
    <Box
      p={padding || 4}
      w={width || "380px"}
      h={height || "250px"}
      bg={backgroundColor || "gray.900"}
      borderRadius={borderRadius || "xl"}
      shadow={shadow || "md"}
      textAlign={textAlign || "center"}
      color={ContainerColor || "white"}
    >
      <VStack spacing={3}>
        <Text fontSize="md" color="gray.200">
          {widgetTitle || " "}
        </Text>
        <CircularProgress value={(avgSoc*100 / (maxValue || 100))} size={size || "180px"} color={CircularColor || "green.400"} trackColor={trackColor || 'gray.600'} thickness={thickness || "12px"}>
          <CircularProgressLabel fontSize={fontSize || "2xl"} color={CircularLabelColor || "white.300"}>
            {avgSoc} {unit || ""}
          </CircularProgressLabel>
        </CircularProgress>
      </VStack>
    </Box>
  )
}
export default CircularProgressWidget
