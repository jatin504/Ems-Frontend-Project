import { HStack, Stack, Text, VStack, Box, Grid } from "@chakra-ui/react";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import StripsPieChart from "../../Graphs/StripsPieChart";

// 🔹 Dummy data
const StatusLabel = ["Generating", "Non Generating", "Non Communicating"];
const StatusData = [18, 5, 2]; // dummy counts

const SmbStringStatus = () => {
  const total = StatusData[0] + StatusData[1] + StatusData[2];

  const StatItem = ({
    value,
    label,
    color,
  }: {
    value: number;
    label: string;
    color: string;
  }) => (
    <VStack spacing={0} alignItems="flex-start">
      <Text color={color} fontSize="16px" fontWeight={700}>
        {value}
      </Text>
      <Text fontSize="12px" fontWeight={500} color="#9BABBD">
        {label}
      </Text>
    </VStack>
  );

  return (
    <GraphLayout
      title="Status"
      width={["full", "100%"]}
      height="100%"
      titleLengthSVG={40}
      titleLengthLongSVG={170}
      downloadOption={false}
    >
      <HStack align="center" spacing={6}>
        {/* ===== LEFT : PIE CHART ===== */}
        <Box minW="140px">
          <StripsPieChart
            height={120}
            names={StatusLabel}
            apiData={StatusData}
            color={["#7086FD", "#6FD195", "#FFAE4C"]}
          />
        </Box>

        {/* ===== RIGHT : STATUS GRID ===== */}
        <Grid
          templateColumns="repeat(2, 1fr)"
          rowGap={4}
          columnGap={8}
        >
          {/* Row 1 */}
          <StatItem
            value={StatusData[0]}
            label="Generating"
            color="#7086FD"
          />
          <StatItem
            value={StatusData[1]}
            label="Non Generating"
            color="#6FD195"
          />

          {/* Row 2 */}
          <StatItem
            value={StatusData[2]}
            label="Non Communicating"
            color="#FFAE4C"
          />
          <StatItem
            value={total}
            label="Total"
            color="#07DBFA"
          />
        </Grid>
      </HStack>
    </GraphLayout>
  );
};

export default SmbStringStatus;
