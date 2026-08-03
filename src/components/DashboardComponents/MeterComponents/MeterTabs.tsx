import {
  Box,
  HStack,
  Text,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";

const tabs = [
  "Plant Meters Overview",
  "Outgoing Meters",
  // "Incomer Meters",
  "Auxiliary Meters",
  "LT Meters",
];

type MeterTabsProps = {
  activeTab?: string;
  onChange?: (tab: string) => void;
};

const MeterTabs = ({
  activeTab = tabs[0],
  onChange = () => {},
}: MeterTabsProps) => {
  const containerBg = useColorModeValue(
    "#ffffff",
    "#081f3c"
  );

  const activeTabBg = useColorModeValue(
    "#f3f6fb",
    "#0d2b4f"
  );

  const borderColor = useColorModeValue(
    "#d9e2f0",
    "#16365f"
  );

  const textColor = useColorModeValue(
    "#1a202c",
    "#ffffff"
  );

  const inactiveText = useColorModeValue(
    "#4a5568",
    "#b8c7dd"
  );


  return (
    <Flex
      justify="space-between"
      align="center"
      gap="12px"
      flexWrap="wrap"
    >
      <HStack
        spacing="0"
        bg={containerBg}
        border={`1px solid ${borderColor}`}
        borderRadius="6px 6px 0px 0px"
        overflow="hidden"
      >
        {tabs.map((tab, index) => {
          const isActive = tab === activeTab;
          return (
            <Box
              key={index}
              px="20px"
              py="10px"
              cursor="pointer"
              bg={isActive ? activeTabBg : "transparent"}
              borderRight={
                index !== tabs.length - 1
                  ? `1px solid ${borderColor}`
                  : "none"
              }
              onClick={() => onChange(tab)}
              _hover={{
                bg: activeTabBg,
              }}
              transition="0.2s"
            >
              <Text
                color={isActive ? textColor : inactiveText}
                fontSize="15px"
                fontWeight={isActive ? "600" : "500"}
              >
                {tab}
              </Text>
            </Box>
          );
        })}
      </HStack>

      {/* Dropdown removed per request */}
    </Flex>
  );
};

export default MeterTabs;