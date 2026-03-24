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
  useToast,
  Select
} from "@chakra-ui/react";
import CommercialModeDashboard from "../../Dashboard/CommercialModeDashboard";

const plantTypeOptions = [
  { label: "pv_grid_captive", value: 0 },
  { label: "pv_grid", value: 1 },
  { label: "pv_bess", value: 2 },
  { label: "bess", value: 3 },
  { label: "pv_bess_grid", value: 4 },
  { label: "pv_bess_grid_captive", value: 5 },
  { label: "pv_bess_dg", value: 6 },
  { label: "pv_bess_dg_grid", value: 7 },
  { label: "pv_bess_dg_grid_captive", value: 8 }
];

export default function PlantConfigFullScreenForm() {

  const toast = useToast()

  const bg = useColorModeValue("white", "#161B1B");

  const [loading,setLoading] = useState(false)

  const [plantType,setPlantType] = useState(7)

  const [plant, setPlant] = useState({
    plantName: "",
    capacityMW: 0,
    capacitorKVAR: 0,
    location: "",
    description: "",
  });

  const savePlantConfig = async () => {

    try{

      setLoading(true)

      const res = await fetch("http://75.119.146.115:5179/api/save-plant-config",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          plant_type: plantType,
          plant_config: plant
        })
      })

      const data = await res.json()

      if(data.success){
        toast({
          title:"Plant Config Saved",
          status:"success",
          duration:3000,
          isClosable:true
        })
      }else{
        toast({
          title:"Error Saving",
          description:data.message,
          status:"error"
        })
      }

    }catch(e){
      toast({
        title:"Server Error",
        status:"error"
      })
    }finally{
      setLoading(false)
    }

  }

  return (
    <Box bg={bg} p={6} borderRadius="md">
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

              {/*  Plant Type Dropdown */}
              <FormControl isRequired>
                <FormLabel>Plant Type</FormLabel>
                <Select
                  value={plantType}
                  onChange={(e)=>setPlantType(Number(e.target.value))}
                >
                  {plantTypeOptions.map(opt=>(
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Plant Name</FormLabel>
                <Input
                  value={plant.plantName}
                  onChange={(e)=>setPlant({...plant,plantName:e.target.value})}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Plant Capacity (MW)</FormLabel>
                <NumberInput
                  value={plant.capacityMW}
                  onChange={(_,v)=>setPlant({...plant,capacityMW:v})}
                >
                  <NumberInputField/>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Capacitor Bank (kVAR)</FormLabel>
                <NumberInput
                  value={plant.capacitorKVAR}
                  onChange={(_,v)=>setPlant({...plant,capacitorKVAR:v})}
                >
                  <NumberInputField/>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Location</FormLabel>
                <Input
                  value={plant.location}
                  onChange={(e)=>setPlant({...plant,location:e.target.value})}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={plant.description}
                  onChange={(e)=>setPlant({...plant,description:e.target.value})}
                />
              </FormControl>

              <Flex justify="flex-end" pt={4}>
                <Button
                  colorScheme="teal"
                  isLoading={loading}
                  onClick={savePlantConfig}
                >
                  Save Plant Config
                </Button>
              </Flex>

            </VStack>
          </TabPanel>

          <TabPanel>
            <CommercialModeDashboard/>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}