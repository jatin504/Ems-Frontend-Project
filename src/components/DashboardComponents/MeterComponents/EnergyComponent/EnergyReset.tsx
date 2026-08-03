import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";

const EnergyReset = () => {
  const bg = useColorModeValue(
    "#FFFFFF",
    "#082647"
  );

  const borderColor = useColorModeValue(
    "#D9E2F0",
    "#123A63"
  );

  const textColor = useColorModeValue(
    "#1A202C",
    "#FFFFFF"
  );

  const labelColor = useColorModeValue(
    "#4A5568",
    "#B7C6DA"
  );

  const dividerColor = useColorModeValue(
    "#E2E8F0",
    "rgba(255,255,255,0.08)"
  );

  return (
    <Box
      bg={bg}
      border={`1px solid ${borderColor}`}
      borderRadius="10px"
      p="16px"
      h="100%"
    >
      <Text
        fontSize="15px"
        fontWeight="700"
        color={textColor}
        mb="18px"
      >
        ENERGY RESET
      </Text>

      <VStack
        spacing="0"
        align="stretch"
      >
        {/* Row 1 */}

        <HStack
          justify="space-between"
          py="10px"
        >
          <Text
            fontSize="15px"
            color={labelColor}
          >
            Last Reset (Import Energy)
          </Text>

          <Text
            fontSize="15px"
            fontWeight="600"
            color={textColor}
          >
            01 Jun 2022&nbsp;&nbsp;00:00
          </Text>
        </HStack>

        <Box
          h="1px"
          bg={dividerColor}
        />

        {/* Row 2 */}

        <HStack
          justify="space-between"
          py="10px"
        >
          <Text
            fontSize="15px"
            color={labelColor}
          >
            Last Reset (Export Energy)
          </Text>

          <Text
            fontSize="15px"
            fontWeight="600"
            color={textColor}
          >
            01 Jun 2022&nbsp;&nbsp;00:00
          </Text>
        </HStack>

        <Box
          h="1px"
          bg={dividerColor}
        />

        {/* Row 3 */}

        <HStack
          justify="space-between"
          py="10px"
        >
          <Text
            fontSize="15px"
            color={labelColor}
          >
            Billing Cycle
          </Text>

          <Text
            fontSize="15px"
            fontWeight="600"
            color={textColor}
          >
            Monthly
          </Text>
        </HStack>

        <Box
          h="1px"
          bg={dividerColor}
          mb="18px"
        />

        {/* Button */}

        <Button
          leftIcon={<RepeatIcon />}
          bg="#1976D2"
          color="white"
          fontWeight="500"
          size="md"
          h="42px"
          _hover={{
            bg: "#1565C0",
          }}
          _active={{
            bg: "#1565C0",
          }}
        >
          Reset Energy (With Confirmation)
        </Button>
      </VStack>
    </Box>
  );
};

export default EnergyReset;