import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from "@chakra-ui/react";

import SMBsDashboard from "./SMBsDashboard";
import StringDashboard from "./StringDashboard";

const DCZoneTabs: React.FC = () => {
  return (
    <Box w="100%">
      <Tabs variant="enclosed" isLazy>
        <TabList>
          <Tab>SMBs</Tab>
          <Tab>String</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <SMBsDashboard />
          </TabPanel>

          <TabPanel p={0}>
            <StringDashboard />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default DCZoneTabs;
