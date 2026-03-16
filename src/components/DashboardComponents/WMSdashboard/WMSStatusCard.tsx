import { Box, Stack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import StripsPieChart from "../../Graphs/StripsPieChart";
import { getWMSStatus } from "../../../Services/dashboard";

interface ExportFunctions {
  exportPNG: () => void;
  exportCSV: () => void;
}

const WMSStatusCard = () => {
  const [online, setOnline] = useState(0);   // UI Online = backend active
  const [offline, setOffline] = useState(0); // UI Offline = backend inactive
  const [total, setTotal] = useState(0);     // UI Total = backend online
  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await getWMSStatus({
        pattern: "_bank_bank_",
        column: "active_power",
      });

      const data = res.data;

      //  FINAL & CORRECT MAPPING
      setOnline(data.active);     // active ---- Online
      setOffline(data.inactive);  // inactive ---- Offline
      setTotal(data.online);      // online ---- Total
    };

    fetchStatus();
  }, []);

  return (
    <GraphLayout
      title="Status"
      width={["full", "100%"]}
      height="260px"
      downloadOption={true}
      onExport={exportFunctions}
    >
      <Stack direction="row" padding="16px" spacing={5}>
        {/* ===== Pie Chart ===== */}
        <Box width="169px">
          <StripsPieChart
            height={170}
            width={170}
            names={["Online", "Offline"]}
            apiData={[online, offline]}
            color={["#7086FD", "#FFAE4C"]}
            onExportReady={setExportFunctions}
          />
        </Box>

        {/* ===== Numbers ===== */}
        <VStack align="start" justify="center" spacing={3}>
          <VStack align="flex-start">
            <Text color="#7086FD" fontSize="16px" fontWeight={700}>
              {online}
            </Text>
            <Text fontSize="12px" color="#9BABBD">Online</Text>
          </VStack>

          <VStack align="flex-start">
            <Text color="#FFAE4C" fontSize="16px" fontWeight={700}>
              {offline}
            </Text>
            <Text fontSize="12px" color="#9BABBD">Offline</Text>
          </VStack>

          <VStack align="flex-start">
            <Text color="#07DBFA" fontSize="16px" fontWeight={700}>
              {total}
            </Text>
            <Text fontSize="12px" color="#9BABBD">Total</Text>
          </VStack>
        </VStack>
      </Stack>
    </GraphLayout>
  );
};

export default WMSStatusCard;
