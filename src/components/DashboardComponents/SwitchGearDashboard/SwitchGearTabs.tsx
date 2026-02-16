import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";

import VCBStatusCard from "./VCBStatusCard";
import IsolatorStatusCard from "./IsolatorStatusCard";
import EarthSwitchStatusCard from "./EarthSwitchStatusCard";

/* ================== DATA ================== */

const vcbData = [
  {
    id: "VCB-1",
    breakerStatus: "CLOSED",
    springCharged: "YES",
    tripCoilHealthy: "YES",
    sf6Pressure: "NORMAL",
    operationCount: "4,832",
    lastOperation: "11:02 - CLOSE",
  },
  {
    id: "VCB-2",
    breakerStatus: "OPEN",
    springCharged: "YES",
    tripCoilHealthy: "YES",
    sf6Pressure: "NORMAL",
    operationCount: "3,456",
    lastOperation: "10:45 - OPEN",
  },
  {
    id: "VCB-3",
    breakerStatus: "CLOSED",
    springCharged: "NO",
    tripCoilHealthy: "YES",
    sf6Pressure: "LOW",
    operationCount: "2,891",
    lastOperation: "09:30 - CLOSE",
  },
];

const isolatorData = [
  {
    id: "ISO-1",
    isolatorStatus: "OPEN" as const,
    earthSwitch: "NOT DISCONNECTED",
    mechanicalLock: "ENGAGED",
    positionFeedback: "VALID",
  },
  {
    id: "ISO-2",
    isolatorStatus: "CLOSED" as const,
    earthSwitch: "NOT DISCONNECTED",
    mechanicalLock: "ENGAGED",
    positionFeedback: "VALID",
  },
];

const earthSwitchData = [
  {
    id: "ES-1",
    earthSwitchStatus: "CLOSED",
    earthSwitch: "NOT DISCONNECTED",
    mechanicalLock: "ENGAGED",
    positionFeedback: "VALID",
  },
  {
    id: "ES-2",
    earthSwitchStatus: "OPEN",
    earthSwitch: "NOT DISCONNECTED",
    mechanicalLock: "ENGAGED",
    positionFeedback: "VALID",
  },
];

/* ================== COMPONENT ================== */

export default function SwitchGearTabs() {
  const tabBg = useColorModeValue("#E2E8F0", "#2D3748");
  const tabSelectedBg = useColorModeValue("#2D3748", "#1A202C");

  return (
    <Tabs defaultIndex={0} variant="unstyled">
      {/* ===== TOP TABS ===== */}
      <TabList gap="4px" mb="8px">
        {["VCB", "Isolator", "Earth Switch"].map((tab) => (
          <Tab
            key={tab}
            px="12px"
            py="6px"
            fontSize="13px"
            fontWeight={600}
            bg={tabBg}
            borderRadius="md"
            _selected={{
              bg: tabSelectedBg,
              color: "white",
            }}
          >
            {tab}
          </Tab>
        ))}
      </TabList>

      {/* ===== CONTENT ===== */}
      <TabPanels>
        {/* ===== VCB ===== */}
        <TabPanel p="0">
          <SimpleGrid
            gridTemplateColumns="repeat(auto-fit, minmax(300px, 300px))"
            gap="12px"
          >
            {vcbData.map((item) => (
              <VCBStatusCard key={item.id} data={item} />
            ))}
          </SimpleGrid>
        </TabPanel>

        {/* ===== ISOLATOR ===== */}
        <TabPanel p="0">
          <SimpleGrid
            gridTemplateColumns="repeat(auto-fit, minmax(300px, 300px))"
            gap="12px"
          >
            {isolatorData.map((item) => (
              <IsolatorStatusCard key={item.id} data={item} />
            ))}
          </SimpleGrid>
        </TabPanel>

        {/* ===== EARTH SWITCH ===== */}
        <TabPanel p="0">
          <SimpleGrid
            gridTemplateColumns="repeat(auto-fit, minmax(300px, 300px))"
            gap="12px"
          >
            {earthSwitchData.map((item) => (
              <EarthSwitchStatusCard key={item.id} data={item} />
            ))}
          </SimpleGrid>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
