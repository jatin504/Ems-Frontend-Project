import {
  Box,
  Flex,
  Text,
  Icon,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaIndustry } from "react-icons/fa";
import { MdShowChart } from "react-icons/md";
import { BsSun } from "react-icons/bs";
import { IoTimeOutline } from "react-icons/io5";

const ItemBox = ({ icon, label, value }: any) => {
  const boxBg = useColorModeValue("#F4F6F8", "gray.600");
  const labelColor = useColorModeValue("gray.600", "gray.300");
  const valueColor = useColorModeValue("gray.700", "gray.100");

  return (
    <Flex
      align="center"
      bg={boxBg}
      px={3}
      py={2}
      borderRadius="8px"
      gap={2}
      flex="1"
    >
      <Icon as={icon} color="#3182CE" boxSize={5} />
      <Text fontSize="13px" color={labelColor}>
        {label}
      </Text>
      <Text fontSize="13px" fontWeight="600" ml="auto" color={valueColor}>
        {value}
      </Text>
    </Flex>
  );
};

const DeemedGeneration = () => {
  const bg = useColorModeValue("white", "#161B1B");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const subTextColor = useColorModeValue("gray.600", "gray.300");
  const shadow = useColorModeValue("0 2px 8px rgba(0,0,0,0.06)", "0 2px 8px rgba(0,0,0,0.85)");

  return (
    <Box
      bg={bg}
      borderRadius="12px"
      boxShadow={shadow}
      p={4}
    >
      {/* Header */}
      <Flex justify="space-between" align="center">
        <Text color={textColor} fontWeight="600" fontSize="15px">
          Deemed Generation Engine
        </Text>
      </Flex>

      {/* Top 4 boxes */}
      <Flex mt={3} gap={3}>
        <ItemBox
          icon={FaIndustry}
          label="Capacity"
          value="30 MW"
        />
        <ItemBox
          icon={MdShowChart}
          label="PR"
          value="Seasonal Benchmark"
        />
      </Flex>

      <Flex mt={2} gap={3}>
        <ItemBox
          icon={BsSun}
          label="Irradiance"
          value="POA"
        />
        <ItemBox
          icon={IoTimeOutline}
          label="Curt"
          value="Hours (intern)"
        />
      </Flex>

      {/* Formula Blue Box */}
      <Box
        mt={4}
        borderRadius="10px"
        overflow="hidden"
      >
        {/* Top Label */}
        <Box
          bg="#2B6CB0"
          px={4}
          py={2}
        >
          <Text color="white" fontSize="13px" fontWeight="700">
            DG = Capacity × PR × Irradiance × Curtailment Time
          </Text>
        </Box>

        {/* Bottom Result */}
        <Box
          bg="#E6F0FA"
          px={4}
          py={3}
        >
          <Text
            fontSize="16px"
            fontWeight="700"
            color="#1A202C"
          >
            30 MW × 71.5% × 0.65 × 4 hr = 55.77 MWh
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default DeemedGeneration;