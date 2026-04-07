import { Box, Grid, GridItem, Text, HStack, VStack, useColorModeValue } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FaBolt, FaRupeeSign } from "react-icons/fa";
import { MdOutlineTrendingUp } from "react-icons/md";

const data = [
  {
    label: "Total Generation",
    value: "12.5 MWh",
    icon: <FaBolt />,
    color: "#38A169",
  },
  {
    label: "Deemed Generation",
    value: "104,676",
    icon: <SearchIcon />,
    color: "#3182CE",
  },
  {
    label: "Export Energy",
    value: "11.8 MWh",
    icon: <MdOutlineTrendingUp />,
    color: "#38A169",
  },
  {
    label: "Revenue",
    value: "34.0 Lakh",
    icon: <FaRupeeSign />,
    color: "#2F855A",
  },
  {
    label: "Curtailment",
    value: "7.5 hrs",
    icon: <FaBolt />,
    color: "#DD6B20",
  },
];

const TopStatsRow = () => {
  const cardBg = useColorModeValue("white", "#161B1B");
  const cardShadow = useColorModeValue("sm", "sm");
  const primaryText = useColorModeValue("gray.800", "gray.100");
  const secondaryText = useColorModeValue("gray.500", "gray.300");

  return (
    <Grid templateColumns={`repeat(${data.length}, 1fr)`} gap={4}>
      {data.map((item, i) => (
        <GridItem key={i}>
          <Box
            bg={cardBg}
            borderRadius="12px"
            px="14px"
            py="12px"
            boxShadow={cardShadow}
          >
            {item.label === "Curtailment" ? (
              <HStack justify="space-between" align="center">
                
                {/* LEFT */}
                <HStack spacing="12px">
                  <Box
                    w="34px"
                    h="34px"
                    borderRadius="full"
                    bg={item.color}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="white"
                    fontSize="16px"
                  >
                    {item.icon}
                  </Box>

                  <Box>
                    <Text fontSize="18px" fontWeight="700" lineHeight="1" color={primaryText}>
                      {item.value}
                    </Text>
                    <Text fontSize="12px" color={secondaryText} mt="2px">
                      {item.label}
                    </Text>
                  </Box>
                </HStack>

                {/* RIGHT */}
                <VStack align="end" spacing="1px" lineHeight="1">
                  <Text fontSize="10px" color="gray.400">
                    Feed Rate
                  </Text>
                  <Text fontSize="11px" fontWeight="600">
                    +1.5 km/…
                  </Text>
                  <Text fontSize="9px" color="gray.400">
                    Today’s alterned
                  </Text>
                </VStack>

              </HStack>
            ) : (
              <HStack spacing="12px" align="center" pl="56px">
                <Box
                  w="34px"
                  h="34px"
                  borderRadius="full"
                  bg={item.color}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontSize="16px"
                >
                  {item.icon}
                </Box>

                <Box>
                  <Text fontSize="18px" fontWeight="700" lineHeight="1" color={primaryText}>
                    {item.value}
                  </Text>

                  <Text fontSize="12px" color={secondaryText} mt="2px">
                    {item.label}
                  </Text>
                </Box>
              </HStack>
            )}
          </Box>
        </GridItem>
      ))}
    </Grid>
  );
};

export default TopStatsRow;