import { Box, Text, HStack, VStack, useColorModeValue } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

const ValidationAudit = () => {
  const bg = useColorModeValue("white", "#161B1B");
  const headerBg = useColorModeValue("#5F8F74", "#2D6A4F");
  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const secondaryColor = useColorModeValue("#2D3748", "#A3BFFA");
  const lineColor = useColorModeValue("#E2E8F0", "rgba(255,255,255,0.15)");
  const footerBg = useColorModeValue("#F7F7F7", "#1F272E");

  return (
    <Box
      mt={4}
      borderRadius="10px"
      overflow="hidden"
      bg={bg}
      boxShadow="sm"
      minH="200px"
    >
      {/* Header (ONLY GREEN PART) */}
      <HStack
        justify="space-between"
        px="12px"
        py="8px"
        bg={headerBg}
      >
        <Text fontSize="13px" fontWeight="600" color="white">
          Validation & Audit
        </Text>

        <HStack spacing="4px">
          <Box w="4px" h="4px" bg="white" borderRadius="full" opacity={0.8} />
          <Box w="4px" h="4px" bg="white" borderRadius="full" opacity={0.8} />
          <Box w="4px" h="4px" bg="white" borderRadius="full" opacity={0.8} />
        </HStack>
      </HStack>

      {/* Rows */}
      <VStack align="stretch" spacing="0">
        {[
          { label: "SLDC Curtailment", status: "Verified" },
          { label: "SCADA PR Source", status: "Enabled" },
          { label: "WMS Irradiance", status: "Verified" },
        ].map((item, i) => (
          <HStack
            key={i}
            justify="space-between"
            px="12px"
            py="10px"
            borderBottom={i !== 2 ? `1px solid ${lineColor}` : "none"}
          >
            <HStack spacing="8px">
              <CheckIcon color="#2F855A" boxSize="13px" />

              <Text fontSize="13px" color={textColor}>
                {item.label}:{" "}
                <Text as="span" fontWeight="600" color="#2F855A">
                  {item.status}
                </Text>
              </Text>
            </HStack>

            {/* Right tick */}
            <CheckIcon color="#2F855A" boxSize="13px" />
          </HStack>
        ))}
      </VStack>

      {/* Bottom */}
      <HStack
        justify="space-between"
        px="12px"
        py="10px"
        bg={footerBg}
      >
        <Text fontSize="13px" color={secondaryColor}>
          23 Logs
        </Text>

        <Text fontSize="13px" color="#2D3748" cursor="pointer">
          View Logs ›
        </Text>
      </HStack>
    </Box>
  );
};

export default ValidationAudit;