import React from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import GraphLayout from "../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import AreasplineGraph from "../Graphs/RevampCharts/AreasplineGraph";

const ForecastSection = ({
  title,
  color,
}: {
  title: string;
  color: string;
}) => {
  const bg = useColorModeValue("#ffffff", "#0f2235");
  const border = useColorModeValue("#e2e8f0", "#1f3b5b");
  const subTextColor = useColorModeValue("#4A5568", "#B9B9B9");

  return (
    <Box
      bg={bg}
      border={`1px solid ${border}`}
      borderRadius="lg"
      p={2}
      boxShadow="0 8px 20px rgba(0,0,0,0.25)"
      transition="0.2s"
      _hover={{
        boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
        transform: "translateY(-2px)",
      }}
    >
      <GraphLayout
        title={title}
        width={["100%"]}
        height="200px"
        downloadOption={false}
      >
        <AreasplineGraph
          apiData={[
            {
              name: title,
              color: color,
              type: "areaspline", // ✅ important
              data: [
                [Date.UTC(2024, 0, 1, 0), 50],
                [Date.UTC(2024, 0, 1, 4), 120],
                [Date.UTC(2024, 0, 1, 8), 200],
                [Date.UTC(2024, 0, 1, 12), 420],
                [Date.UTC(2024, 0, 1, 16), 350],
                [Date.UTC(2024, 0, 1, 20), 300],
                [Date.UTC(2024, 0, 1, 24), 320],
              ],
            },
          ]}
          height={140}
          props={{
            chart: {
              backgroundColor: "transparent",
            },

            plotOptions: {
              areaspline: {
                fillOpacity: 0.4, //  color fill
                lineWidth: 3,
              },
            },

            xAxis: {
              type: "datetime",
              labels: {
                style: { color: subTextColor, fontSize: "10px" },
              },
            },

            yAxis: {
              labels: {
                style: { color: subTextColor, fontSize: "10px" },
              },
              title: { text: "" },
            },

            legend: { enabled: false },
          }}
        />
      </GraphLayout>
    </Box>
  );
};

export default ForecastSection;