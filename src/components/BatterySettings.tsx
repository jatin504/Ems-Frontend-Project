import {
  Box,
  Text,
  Input,
  Select,
  HStack,
  VStack,
  Checkbox,
  Divider,
  RadioGroup,
  Stack,
  Radio,
} from "@chakra-ui/react";
import { useState } from "react";
import { useCurrentStrategy } from "../hooks/current_strategy/useCurrentStrategy";

const BatterySettings = () => {

  const [value, setValue] = useState('1');

  const { strategy, loading, updateStrategy } = useCurrentStrategy();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVal = e.target.value;
    updateStrategy(newVal);
  };

  return (
    <Box
      bg="gray.900"
      borderWidth="1px"
      borderColor="gray.700"
      borderRadius="md"
      boxShadow="md"
      color="white"
      p={4}
      width="100%"
      height="380px"
    >
      <VStack align="stretch" spacing={5} height="100%">
        {/* Battery Capacity */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={1}>
            Total Rated Battery Capacity
          </Text>
          <HStack spacing={2}>
            <Input
              defaultValue=""
              size="sm"
              width="80px"
              color="teal.300"
              border="1px solid"
              borderColor="gray.600"
              bg="gray.800"
              _focus={{ boxShadow: "none", borderColor: "teal.400" }}
            />
            <Text fontSize="md" color="gray.400">
              kWh
            </Text>
          </HStack>
        </Box>

        <Divider borderColor="gray.700" />

        {/* Checkbox */}
        <Box fontSize={"lg"}>
          <Checkbox colorScheme="teal" defaultChecked>
            Take the Self Utilization Credit
          </Checkbox>
        </Box>

        <Divider borderColor="gray.700" />

        {/* Control Strategy */}
        <Box>
          <Text fontSize="md" fontWeight="semibold" mb={1}>
            Control Strategy
          </Text>
          <RadioGroup onChange={setValue} value={value} mb={3}>
            <Stack direction='row'>
              <Radio value='1'>Single Meter Injection</Radio>
              <Radio value='2'>Multi Meter Injection</Radio>
              <Radio value='3'>VPP</Radio>
            </Stack>
          </RadioGroup>
          { value == '1' ? (
            <Select
            size="md"
            bg="gray.800"
            color="teal.300"
            borderColor="gray.700"
            defaultValue="Basic"
            maxW="200px"
            _hover={{ borderColor: "teal.400" }}
            _focus={{ borderColor: "teal.400", boxShadow: "none" }}
            sx={{
              option: {
                backgroundColor: "gray.800",
                color: "white",
              },
            }}
            isDisabled={loading}
            value={strategy}
            onChange={handleChange}
          >
            <option value="0" defaultChecked>Basic</option>
            <option value="3">Smart-ToU</option>
            <option value="4">Flat-ToU</option>
            <option value="5">Peak Shaving</option>
            <option value={'200'}>Disable</option>
          </Select>
          ) : value == '2' ? (
            <HStack spacing={5}>
              <VStack alignItems={"flex-start"}>
                <Text>POI-1</Text>
                  <Select
                    size="md"
                    bg="gray.800"
                    color="teal.300"
                    borderColor="gray.700"
                    defaultValue="Basic"
                    maxW="200px"
                    _hover={{ borderColor: "teal.400" }}
                    _focus={{ borderColor: "teal.400", boxShadow: "none" }}
                    sx={{
                      option: {
                        backgroundColor: "gray.800",
                        color: "white",
                      },
                    }}
                    isDisabled={loading}
                    value={strategy}
                    onChange={handleChange}
                  >
                    <option value="0">Basic</option>
                    <option value="4">Flat-ToU</option>
                            <option value="Time-of-Use(TOU-ToU)">Smart</option>
                    <option value="5">Peak Shaving</option>
                    <option value={'200'}>Disable</option>
                  </Select>
              </VStack>
              <VStack alignItems={"flex-start"}>
                <Text>POI-2</Text>
                  <Select
                    size="md"
                    bg="gray.800"
                    color="teal.300"
                    borderColor="gray.700"
                    defaultValue="Basic"
                    maxW="200px"
                    _hover={{ borderColor: "teal.400" }}
                    _focus={{ borderColor: "teal.400", boxShadow: "none" }}
                    sx={{
                      option: {
                        backgroundColor: "gray.800",
                        color: "white",
                      },
                    }}
                    isDisabled={loading}
                    value={strategy}
                    onChange={handleChange}
                  >
                    <option value="0">Basic</option>
                    <option value="4">Flat-ToU</option>
                            <option value="Time-of-Use(TOU-ToU)">Smart</option>
                    <option value="5">Peak Shaving</option>
                    <option value={'200'}>Disable</option>
                  </Select>
              </VStack>
            </HStack>
          ) : (<Select
            size="md"
            bg="gray.800"
            color="teal.300"
            borderColor="gray.700"
            defaultValue="Basic"
            maxW="200px"
            _hover={{ borderColor: "teal.400" }}
            _focus={{ borderColor: "teal.400", boxShadow: "none" }}
            sx={{
              option: {
                backgroundColor: "gray.800",
                color: "white",
              },
            }}
            isDisabled={loading}
            value={strategy}
            onChange={handleChange}
          >
            <option value="0">Basic</option>
            <option value="4">Flat-ToU</option>
            <option value="3">Smart-ToU</option>
            <option value="5">Peak Shaving</option>
            <option value={'200'}>Disable</option>
          </Select>)}
          {/* <Select
            size="md"
            bg="gray.800"
            color="teal.300"
            borderColor="gray.700"
            defaultValue="Basic"
            maxW="200px"
            _hover={{ borderColor: "teal.400" }}
            _focus={{ borderColor: "teal.400", boxShadow: "none" }}
            sx={{
              option: {
                backgroundColor: "gray.800",
                color: "white",
              },
            }}
            isDisabled={loading}
            value={strategy}
            onChange={handleChange}
          >
          <option value="0">Basic</option>
          <option value="4">Flat-ToU</option>
          <option value="3">Smart-ToU</option>
          <option value="5">Peak Shaving</option>
          <option value={'200'}>Disable</option>
          </Select> */}
        </Box>

        <Box flex="1" />
      </VStack>
    </Box>
  );
};

export default BatterySettings;
