import React from "react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

import GensetControlUI from "./GensetDashboard";
import GridControlDashboard from "./GridControlDashboard";

export default function PPCDashboard() {
  return (
    <Box w="100%" p={3} bg="#f5f6f7">
      <Tabs
        w="100%"
        variant="unstyled"
      >
        {/* RIGHT SIDE BUTTON TABS */}
        <Box
          w="100%"
          display="flex"
          justifyContent="flex-end"
          mb={4}
        >
          <TabList gap={3}>
            <Tab
              h="38px"
              px={5}
              border="1px solid #2aa7a0"
              borderRadius="8px"
              fontSize="14px"
              fontWeight="600"
              color="#2aa7a0"
              bg="white"
              _selected={{
                bg: "#2aa7a0",
                color: "white",
                borderColor: "#2aa7a0",
              }}
              _hover={{
                bg: "#2aa7a0",
                color: "white",
              }}
            >
              Genset Control
            </Tab>

            <Tab
              h="38px"
              px={5}
              border="1px solid #2aa7a0"
              borderRadius="8px"
              fontSize="14px"
              fontWeight="600"
              color="#2aa7a0"
              bg="white"
              _selected={{
                bg: "#2f3b52",
                color: "white",
                borderColor: "#2f3b52",
              }}
              _hover={{
                bg: "#2f3b52",
                color: "white",
              }}
            >
              Grid Control
            </Tab>
          </TabList>
        </Box>

        {/* FULL WIDTH CONTENT */}
        <TabPanels w="100%">
          <TabPanel p={0}>
            <GensetControlUI />
          </TabPanel>

          <TabPanel p={0}>
            <GridControlDashboard />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}