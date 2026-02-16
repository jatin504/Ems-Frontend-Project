import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Textarea,
  VStack,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
} from "@chakra-ui/react";
import CommercialModeDashboard from "../../Dashboard/CommercialModeDashboard";

export type PlantConfig = {
  plantName: string;
  capacityMW: number;
  capacitorKVAR: number;
  location: string;
  description?: string;
};

type Props = {
  mode?: "inline" | "fullscreen";
  onSubmit: (plant: PlantConfig) => void;
};

export default function PlantConfigFullScreenForm({
  mode = "inline",
  onSubmit,
}: Props) {
  const bg = useColorModeValue("white", "#161B1B");
  const color = useColorModeValue("black", "white");

  const [plant, setPlant] = useState<PlantConfig>({
    plantName: "",
    capacityMW: 0,
    capacitorKVAR: 0,
    location: "",
    description: "",
  });

  return (
    <Box bg={bg} color={color} p={6} borderRadius="md">
      <Heading size="md" mb={6}>
        Plant Configuration
      </Heading>

      <Tabs>
        <TabList>
          <Tab>Plant Config</Tab>
          <Tab>Commercial Mode</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Plant Name</FormLabel>
                <Input
                  value={plant.plantName}
                  onChange={(e) =>
                    setPlant({ ...plant, plantName: e.target.value })
                  }
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Plant Capacity (MW)</FormLabel>
                <NumberInput
                  min={0}
                  value={plant.capacityMW}
                  onChange={(_, v) =>
                    setPlant({ ...plant, capacityMW: v })
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Capacitor Bank (kVAR)</FormLabel>
                <NumberInput
                  min={0}
                  value={plant.capacitorKVAR}
                  onChange={(_, v) =>
                    setPlant({ ...plant, capacitorKVAR: v })
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Location</FormLabel>
                <Input
                  value={plant.location}
                  onChange={(e) =>
                    setPlant({ ...plant, location: e.target.value })
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={plant.description}
                  onChange={(e) =>
                    setPlant({ ...plant, description: e.target.value })
                  }
                />
              </FormControl>

              <Flex justify="flex-end" pt={4}>
                <Button colorScheme="teal" onClick={() => onSubmit(plant)}>
                  Save Plant Config
                </Button>
              </Flex>
            </VStack>
          </TabPanel>

          <TabPanel>
            <CommercialModeDashboard />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
