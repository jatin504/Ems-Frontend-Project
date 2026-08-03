import React from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  GridItem,
  HStack,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

const Row = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) => {
  const labelColor = useColorModeValue("#64748B", "#94A3B8");
  const valueColor = color || useColorModeValue("#1E293B", "#F8FAFC");

  return (
    <HStack justify="space-between" py="8px">
      <Text fontSize="12px" color={labelColor}>
        {label}
      </Text>

      <Text
        fontSize="12px"
        fontWeight="600"
        color={valueColor}
      >
        {value}
      </Text>
    </HStack>
  );
};

export default function ControlLimits() {
  const bg = useColorModeValue("#ffffff", "#0F172A");
  const border = useColorModeValue("#E2E8F0", "#243447");
  const title = useColorModeValue("#1E293B", "#F8FAFC");

  return (
    <Box
      w="100%"
      h="100%"
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="10px"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      {/* Header */}
      <Box
        px="16px"
        py="12px"
        borderBottom="1px solid"
        borderColor={border}
        flexShrink={0}
      >
        <Text
          fontSize="14px"
          fontWeight="700"
          color={title}
        >
          Control & Limits{" "}
          <Text
            as="span"
            fontSize="11px"
            color="gray.500"
            fontWeight="500"
          >
            (BMS Real-time)
          </Text>
        </Text>
      </Box>

      {/* Values */}
      <Box px="16px" py="10px" flex="1" minH="0" overflowY="auto">

        <Row
          label="Max Charge Current"
          value="200.00 A"
        />

        <Divider borderColor={border} />

        <Row
          label="Max Discharge Current"
          value="200.00 A"
        />

        <Divider borderColor={border} />

        <Row
          label="Max Charge Power"
          value="160.00 kW"
        />

        <Divider borderColor={border} />

        <Row
          label="Max Discharge Power"
          value="160.00 kW"
        />

        <Divider borderColor={border} />

        <Row
          label="Precharge Status"
          value="Completed"
          color="#22C55E"
        />

        <Divider borderColor={border} />

        <Row
          label="Contactor Status"
          value="Closed"
          color="#22C55E"
        />

        <Divider borderColor={border} />

        <Row
          label="HVIL Status"
          value="Closed"
          color="#22C55E"
        />
      </Box>

      {/* Buttons */}
      <Grid
        templateColumns="repeat(2,1fr)"
        gap="10px"
        px="12px"
        pb="12px"
        pt="8px"
        flexShrink={0}
      >
        <GridItem>
          <Button
            w="100%"
            size="sm"
            colorScheme="green"
            fontSize="12px"
          >
            Connect
          </Button>
        </GridItem>

        <GridItem>
          <Button
            w="100%"
            size="sm"
            variant="outline"
            borderColor={border}
          >
            Disconnect
          </Button>
        </GridItem>

        <GridItem>
          <Button
            w="100%"
            size="sm"
            colorScheme="green"
            fontSize="12px"
          >
            Enable
          </Button>
        </GridItem>

        <GridItem>
          <Button
            w="100%"
            size="sm"
            variant="outline"
            borderColor={border}
          >
            Disable
          </Button>
        </GridItem>
      </Grid>
    </Box>
  );
}