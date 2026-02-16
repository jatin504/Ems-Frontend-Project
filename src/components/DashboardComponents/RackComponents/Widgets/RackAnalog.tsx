import { Box, Flex, Tag, Text, useColorModeValue } from "@chakra-ui/react";




const AnalogTile = ({ label, value, tag }: { label: string; value: string; tag?: string }) => {
  const tileBg = useColorModeValue("#ffffff", "#2A2F34");
  const tileBorder = useColorModeValue("#e5e7eb", "#1c2635");
  const labelColor = useColorModeValue("#475569", "#96A0AA");
  const valueColor = useColorModeValue("#0f172a", "#E6EAED");

  return (
    <Box bg={tileBg} border={`1px solid ${tileBorder}`} borderRadius="10px" p="12px">
      <Text fontSize="12px" color={labelColor} mb="6px">
        {label}
      </Text>
      <Flex align="center" justify="space-between">
        <Text fontSize="16px" fontWeight="700" color={valueColor}>
          {value}
        </Text>
        {tag && (
          <Tag bg="transparent" color={valueColor} border="0" fontWeight="700" fontSize="12px">
            {tag}
          </Tag>
        )}
      </Flex>
    </Box>
  );
};


export default function RackAnalog() {
    const cardBg = useColorModeValue("#ffffff", "#161B1B");
    const cardBorder = useColorModeValue("#e5e7eb", "#1c2635");
    const headingColor = useColorModeValue("#0f172a", "#ffffff");

    return (
        <Box
            w="237px"
            h="535.5825px"
            bg={cardBg}
            border={`1px solid ${cardBorder}`}
            borderRadius="12px"
            p="16px"
            display="flex"
            flexDirection="column"
            gap="20px"
        >
            <Text fontSize="14px" fontWeight="600" color={headingColor}>
                Analogs
            </Text>
            <AnalogTile label="String voltage" value="632.50 V" />
            <AnalogTile label="String current" value="~50.00 A" />
            <AnalogTile label="Max. Cell voltage" value="3.84 V" tag="Module 4" />
            <AnalogTile label="Min. Cell voltage" value="3.68 V" tag="Module 2" />
            <AnalogTile label="Average Cell voltage" value="3.76 V" />
        </Box>

    );
}
