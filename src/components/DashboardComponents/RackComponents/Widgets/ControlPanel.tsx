import { Box, Flex, Text, Button, HStack, VStack, useColorModeValue } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { FiLink } from "react-icons/fi";
import React from "react";

const Dot = ({ color }: { color: string }) => (
  <Box w="10px" h="10px" borderRadius="full" bg={color} flex="0 0 auto" />
);

export default function ControlPanel() {
  const cardBg = useColorModeValue("#ffffff", "#161B1B");
  const cardBorder = useColorModeValue("#e5e7eb", "#1c2635");
  const headingColor = useColorModeValue("#0f172a", "#ffffff");
  const subColor = useColorModeValue("#475569", "#a7b0ba");

  const buttonBg = useColorModeValue("#f9fafb", "#2A2F34");
  const buttonBorder = useColorModeValue("#e5e7eb", "#3b4248");
  const buttonText = useColorModeValue("#0f172a", "#E5E7EB");

  return (
    <Box
      w="497px"
      h="302.4175px"
      bg={cardBg}
      border={`1px solid ${cardBorder}`}
      borderRadius="12px"
      p="16px"
      display="flex"
      flexDirection="column"
      gap="16px"
      overflow="hidden"
    >
      {/* Connect String */}
      <Box w="100%" h="46px">
        <VStack align="stretch" spacing={0} h="100%">
          <HStack h="28px" align="center" justify="space-between">
            <Text fontSize="14px" fontWeight="600" color={headingColor}>
              Connect String
            </Text>
            <HStack spacing="10px">
              <Button
                w="103px"
                h="37px"
                borderRadius="6px"
                opacity={1}
                pt="8px"
                pr="12px"
                pb="8px"
                pl="12px"
                bg={buttonBg}
                color={buttonText}
                _hover={{ bg: useColorModeValue("#f3f4f6", "#30363b") }}
                border={`1px solid ${buttonBorder}`}
                fontWeight="600"
              >
                Disconnect
              </Button>
              <Button
                w="85px"
                h="37px"
                borderRadius="6px"
                opacity={1}
                pt="8px"
                pr="12px"
                pb="8px"
                pl="12px"
                bg="#33D2D2"
                color="#0b1516"
                _hover={{ bg: "#2ac4c4" }}
                fontWeight="700"
              >
                Connect
              </Button>
            </HStack>
          </HStack>

          <HStack h="18px" align="center" spacing="8px">
            <Box w="16px" h="16px">
              <FiLink size={16} color="#22c55e" />
            </Box>
            <Text fontSize="12px" lineHeight="18px" color={subColor}>
              Connected
            </Text>
          </HStack>
        </VStack>
      </Box>

      {/* Enable String */}
      <Box w="100%" h="46px">
        <VStack align="stretch" spacing={0} h="100%">
          <HStack h="28px" align="center" justify="space-between">
            <Text fontSize="14px" fontWeight="600" color={headingColor}>
              Enable String
            </Text>
            <HStack spacing="10px">
              <Button
                w="77px"
                h="37px"
                borderRadius="6px"
                opacity={1}
                pt="8px"
                pr="12px"
                pb="8px"
                pl="12px"
                bg={buttonBg}
                color={buttonText}
                _hover={{ bg: useColorModeValue("#f3f4f6", "#30363b") }}
                border={`1px solid ${buttonBorder}`}
                fontWeight="600"
              >
                Disable
              </Button>
              <Button
                w="72px"
                h="37px"
                borderRadius="6px"
                opacity={1}
                pt="8px"
                pr="12px"
                pb="8px"
                pl="12px"
                bg="#33D2D2"
                color="#0b1516"
                _hover={{ bg: "#2ac4c4" }}
                fontWeight="700"
              >
                Enable
              </Button>
            </HStack>
          </HStack>

          <HStack h="18px" align="center" spacing="8px">
            <CheckCircleIcon boxSize="14px" color="#22c55e" />
            <Text fontSize="12px" lineHeight="18px" color={subColor}>
              Enabled
            </Text>
          </HStack>
        </VStack>
      </Box>

      <Box w="100%" h="0" borderTop={`1px solid ${cardBorder}`} />

      {/* ===== Status (exact Figma layout) ===== */}
      <Box w="464.6667px" h="130px">
        <VStack align="stretch" spacing="16px" h="100%">
          <Text fontSize="14px" fontWeight="600" color={headingColor} lineHeight="18px">
            Status
          </Text>

          {/* two columns: each 228.3333px wide, 8px column gap, 90px tall */}
          <HStack w="464.6667px" h="90px" spacing="8px" align="start">
            {/* Left four layout */}
            <VStack w="228.3333px" h="90px" align="start" spacing="6px">
              <HStack h="18px" align="center" spacing="8px">
                <Dot color="#13BF74" />
                <Text fontSize="13px" lineHeight="18px" color={subColor}>No failure</Text>
              </HStack>
              <HStack h="18px" align="center" spacing="8px">
                <Dot color="#E6AAFF" />
                <Text fontSize="13px" lineHeight="18px" color={subColor}>Button pushed</Text>
              </HStack>
              <HStack h="18px" align="center" spacing="8px">
                <Dot color="#FFDE64" />
                <Text fontSize="13px" lineHeight="18px" color={subColor}>Fuse open</Text>
              </HStack>
              <HStack h="18px" align="center" spacing="8px">
                <Dot color="#FF6B81" />
                <Text fontSize="13px" lineHeight="18px" color={subColor}>Contactor fail</Text>
              </HStack>
            </VStack>

            {/* Right four layout */}
            <VStack w="228.3333px" h="90px" align="start" spacing="6px">
              <HStack h="18px" align="center" spacing="8px">
                <Dot color="#4359FF" />
                <Text fontSize="13px" lineHeight="18px" color={subColor}>String ground</Text>
              </HStack>
              <HStack h="18px" align="center" spacing="8px">
                <Dot color="#FF442B" />
                <Text fontSize="13px" lineHeight="18px" color={subColor}>Fault</Text>
              </HStack>
              <HStack h="18px" align="center" spacing="8px">
                <Dot color="#FF7C67" />
                <Text fontSize="13px" lineHeight="18px" color={subColor}>Precharge fail</Text>
              </HStack>
              <HStack h="18px" align="center" spacing="8px">
                <Dot color="#FF68A7" />
                <Text fontSize="13px" lineHeight="18px" color={subColor}>String fault</Text>
              </HStack>
            </VStack>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
}
