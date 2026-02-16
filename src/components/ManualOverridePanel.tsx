import {
  Box,
  Text,
  Input,
  Button,
  HStack,
  VStack,
  Checkbox,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import { useState } from "react";

export default function ManualOverridePanel() {
  const [selectedMode, setSelectedMode] = useState<"discharge" | "reserve" | null>(null);

  return (
    <Box
      bg="gray.900"
      color="white"
      borderRadius="md"
      p={4}
      height="100%"
      width="100%"
      overflowY="auto"
    >
      <Text fontWeight="bold" mb={2}>Manual Override</Text>

      <HStack mb={4}>
        <Input placeholder="Charge" size="sm" />
        <Input placeholder="s" size="sm" w="60px" />
        <Input placeholder="kW" size="sm" w="60px" />
      </HStack>

      <Text fontWeight="bold" mb={1}>Max SOC Limits</Text>
      <Input placeholder="" size="sm" mb={4} />

      <Button colorScheme="blue" size="sm" mb={4} w="100%">
        Force Charge, Discharge
      </Button>

      <Text fontWeight="bold" mb={2}>Manual Override</Text>
      <HStack mb={2} justify="space-between">
        <Text fontSize="sm">Charge</Text>
        <Text fontSize="sm">Discharge</Text>
      </HStack>

      <HStack mb={2} align="center">
        <Text fontSize="sm">Setpoint</Text>
        <Input size="sm" w="40px" />
        <Checkbox />
        <Text fontSize="sm">kW</Text>
      </HStack>

      <HStack mb={4}>
        <Text fontSize="sm">Min SOC Limit</Text>
        <Input size="sm" w="60px" placeholder="0" />
      </HStack>

      <Text fontWeight="bold" mb={2}>Real-time Control</Text>
      <HStack mb={2} flexWrap="wrap">
        <Input placeholder="Charge" size="sm" flex="1" />
        <Input placeholder="-" size="sm" w="40px" />
        <Input placeholder="kW" size="sm" w="60px" />
        <Input placeholder="Max SOC" size="sm" flex="1" />
      </HStack>

      <HStack mb={4}>
        <Button
          size="sm"
          colorScheme={selectedMode === "discharge" ? "blue" : "white"}
          variant={selectedMode === "discharge" ? "solid" : "outline"}
          flex="1"
          onClick={() => setSelectedMode("discharge")}
        >
          Discharge
        </Button>
        <Button
          size="sm"
          colorScheme={selectedMode === "reserve" ? "blue" : "white"}
          variant={selectedMode === "reserve" ? "solid" : "outline"}
          flex="1"
          onClick={() => setSelectedMode("reserve")}
        >
          Reserve (List)
        </Button>
      </HStack>

      <Text fontWeight="semibold" fontSize="sm" mb={1}>
        Max SOC / Min SOC Limits
      </Text>
      <HStack mb={0}>
        <Input size="sm" placeholder="" w="80px" />
        <Text fontSize="sm">kW</Text>
      </HStack>

      <Slider defaultValue={40} colorScheme="blue">
        <SliderTrack><SliderFilledTrack /></SliderTrack>
        <SliderThumb />
      </Slider>
    </Box>
  );
}
