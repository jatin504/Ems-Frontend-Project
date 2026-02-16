import React, { useEffect, useState } from 'react';
import {
  Box, Text, Grid, HStack, VStack, CircularProgress, CircularProgressLabel, Button, Divider, SimpleGrid, GridItem, IconButton,
  Heading,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const StringDashboard = () => {

  const [time, setTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
  const formatDateTime = (date: Date) => {
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
      const yyyy = date.getFullYear();

      const hh = String(date.getHours()).padStart(2, "0");
      const min = String(date.getMinutes()).padStart(2, "0");
      const ss = String(date.getSeconds()).padStart(2, "0");

      return `${dd}-${mm}-${yyyy} | ${hh}:${min}:${ss}`;
    };

    const interval = setInterval(() => {
      const now = new Date();
      setTime(formatDateTime(now));
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  const navigate = useNavigate();

  const location = useLocation();

  const { currentBank, currentString } = location.state || {};

  return (
    <Box bg="#1A202C" color="white" minH="100vh" p={6} fontSize="sm">
      <HStack justify="space-between" align="center" mb={6}>
  {/* Breadcrumbs */}
  <HStack spacing={2}>
    <Text
      fontSize="sm"
      color="blue.300"
      cursor="pointer"
      onClick={() => navigate('/')}
      _hover={{ textDecoration: 'underline' }}
    >
      Home
    </Text>
    <Text color="gray.500">{'>'}</Text>

  

    <Text fontSize="sm" color="blue.300" onClick={() => navigate('/batterybank', {state : {currentBank}})}  textTransform={"capitalize"}>
      {currentBank.replace(/_/g, '-')}
    </Text>
    <Text color="gray.500">{'>'}</Text>

  

    <Text fontSize="sm" fontWeight="bold" color="white" textTransform={'capitalize'}>
      {currentString.replace(/_/g, '-')}
    </Text>
  </HStack>

  {/* Right side time (no button) */}
  <Text fontSize="sm" color="gray.300">
    {time}
  </Text>
</HStack>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {/* LEFT COLUMN */}
        <VStack align="stretch" spacing={4}>
          {/* Cell Balancing */}
          <Box bg="#2D3748" p={1} borderRadius="md" width="400px" height="250px">
            <Text fontWeight="bold" mb={3} color="white">Cell Balancing</Text>

            <Box display="flex" alignItems="center" height="100%" mt={"-8"}>
              {/* Left: Circular Progress */}
              <Box flex="0 0 160px" display="flex" justifyContent="center" >
                <CircularProgress value={100} size="140px" thickness="10px" color="gray.500">
                  <CircularProgressLabel fontWeight="bold" fontSize="lg" color="white">
                    1400
                  </CircularProgressLabel>
                </CircularProgress>
              </Box>

              {/* Right: Text info */}
              <HStack align="start" spacing={6} ml={6}>
                <VStack align="start" spacing={1}>
                  <Text color="gray.400" fontSize="sm">ACTIVE</Text>
                  <Text color="white" fontWeight="semibold" fontSize="xl">10</Text>
                  <Text color="gray.400" fontSize="sm" mt={2}>BALANCED</Text>
                  <Text color="orange.300" fontWeight="bold" fontSize="xl">1400</Text>
                </VStack>

                <VStack align="start" spacing={1}>
                  <Text color="gray.400" fontSize="sm">STRING ID</Text>
                  <Text color="white" fontWeight="semibold" fontSize="xl">2</Text>
                  <Text color="gray.400" fontSize="sm" mt={2}>CYCLE COUNT</Text>
                  <Text color="white" fontWeight="semibold" fontSize="xl">0</Text>
                </VStack>
              </HStack>
            </Box>
          </Box>

          {/* Temperatures */}
          <GridItem bg="#2D3748" borderRadius="md" p={4} width="400px" height="250px">
            <Text fontSize="lg" mb={3} color="white">Temperatures</Text>


            <Box pl={2}>
              {/* Max Temp */}
              <HStack justify="space-between" mb={1}>
                <Text fontSize="sm" color="gray.300">Max. Module temp</Text>
                <Text fontSize="sm" fontWeight="bold" color="red.300" mr={"150px"}>35.61°C</Text>
              </HStack>

              <HStack spacing={2} mb={3} align="flex-start">
                <Box as="svg" viewBox="0 0 44 24" boxSize={5} fill="none">
                  <path d="M16 4 V16" stroke="white" strokeWidth="4" strokeLinecap="round" />
                  <path d="M16 16 H50" stroke="white" strokeWidth="4" strokeLinecap="round" />
                  <path d="M33 13 L50 16 L33 19" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </Box>
                <Box ml={"140px"}>
                  <Text fontSize="xs" color="gray.300">Module <b>5</b></Text>
                </Box>
              </HStack>

              {/* Min Temp */}
              <HStack justify="space-between" mb={1}>
                <Text fontSize="sm" color="gray.300">Min. Module temp</Text>
                <Text fontSize="sm" fontWeight="bold" color="blue.300" mr={"150px"}>32.86°C</Text>
              </HStack>

              <HStack spacing={2} mb={3} align="flex-start">
                <Box as="svg" viewBox="0 0 44 24" boxSize={5} fill="none">
                  <path d="M16 4 V16" stroke="white" strokeWidth="4" strokeLinecap="round" />
                  <path d="M16 16 H50" stroke="white" strokeWidth="4" strokeLinecap="round" />
                  <path d="M33 13 L50 16 L33 19" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </Box>
                <Box ml={"140px"}>
                  <Text fontSize="xs" color="gray.300">Module <b>2</b></Text>
                </Box>
              </HStack>

              {/* Avg Temp */}
              <HStack justify="space-between" mt={2}>
                <Text fontSize="sm" color="gray.300">Average Module temp</Text>
                <Text fontSize="sm" fontWeight="bold" color="gray.100" mr={"150px"}>34.20°C</Text>
              </HStack>
            </Box>
          </GridItem>




          {/* Modules */}
          <Box bg="#2D3748" p={4} borderRadius="md" width="670px" height="250px">
            <Text fontWeight="bold" color="white" mb={3}>Modules</Text>

            {[
              { id: 'S02.M01', temp: '28.67', volt: '3.80', soc: '64.32', dod: '35.68' },
              { id: 'S02.M02', temp: '28.41', volt: '3.80', soc: '64.32', dod: '35.68' },
              { id: 'S02.M03', temp: '28.81', volt: '3.80', soc: '64.32', dod: '35.68' },
              { id: 'S02.M04', temp: '28.74', volt: '3.81', soc: '65.16', dod: '34.84' },
              { id: 'S02.M05', temp: '28.50', volt: '3.81', soc: '65.16', dod: '34.84' },
            ].map((mod) => (
              <HStack
                key={mod.id}
                justify="space-between"
                fontSize="sm"
                py={1}
                borderBottom="1px solid #4A5568"
                color="white"
              >
                <Text w="80px">{mod.id}</Text>

                <HStack spacing={4} w="full" justify="space-between">
                  <HStack spacing={1}>
                    <Text color="orange.300">{mod.temp} °C</Text>
                    <Text fontSize="xs" color="gray.400">Max.</Text>
                  </HStack>

                  <HStack spacing={1}>
                    <Text color="green.300">{mod.volt} V</Text>
                    <Text fontSize="xs" color="gray.400">Max.</Text>
                  </HStack>

                  <HStack spacing={1}>
                    <Text color="pink.300">{mod.soc} %</Text>
                    <Text fontSize="xs" color="gray.400">SoC</Text>
                  </HStack>

                  <Text>{mod.dod} DoD</Text>

                  <HStack spacing={1}>
                    <Text color="green.200">100.00 %</Text>
                    <Text fontSize="xs" color="gray.400">SoH</Text>
                  </HStack>

                  <Text color="gray.400" fontWeight="bold">⋯</Text>
                </HStack>
              </HStack>
            ))}
          </Box>
        </VStack>

        {/* MIDDLE COLUMN */}
        <HStack align="start" spacing={6}>
          {/* LEFT SIDE: String + Battery */}
          <Box bg="#2D3748" p={4} borderRadius="md" w="260px" h="520px" ml={"-280px"} color="white">
            {/* Top Row */}
            <HStack justify="space-between">
              <Text fontWeight="bold" fontSize="md">String</Text>
              <Text fontSize="xs" color="gray.400">BK1.S02</Text>
            </HStack>

            {/* Middle Row */}
            <HStack align="start" justify="space-between" mt={20}>
              <VStack spacing={6} align="start" ml={2}>
                {['S02.M01', 'S02.M02', 'S02.M03', 'S02.M04', 'S02.M05'].map((mod) => (
                  <Text key={mod} color="gray.300">{mod}</Text>
                ))}
              </VStack>

              <Box
                w="80px"
                h="300px"
                border="2px solid #CBD5E0"
                borderRadius="md"
                position="relative"
                bg="#1A202C"
                overflow="hidden"
              >
                <HStack spacing={1} position="absolute" top="5px" left="6px">
                  <Box w="8px" h="8px" bg="green.400" borderRadius="full" />
                  <Box w="8px" h="8px" bg="green.400" borderRadius="full" />
                  <Box w="8px" h="8px" bg="yellow.300" borderRadius="full" />
                </HStack>

                <VStack spacing={2} mt={8} px={2}>
                  {[...Array(5)].map((_, i) => (
                    <Box
                      key={i}
                      w="full"
                      h="35px"
                      border="1px solid #4A5568"
                      bg="#2D3748"
                      borderRadius="sm"
                      position="relative"
                    >
                      <Box
                        position="absolute"
                        left="4px"
                        top="4px"
                        bottom="4px"
                        w="2px"
                        bg="red.500"
                      />
                    </Box>
                  ))}
                </VStack>
              </Box>
            </HStack>
          </Box>

          {/* RIGHT SIDE: Connect String Box */}
          <Box
            bg="#2D3748"
            p={4}
            borderRadius="md"
            color="white"
            ml={-2}
            w="390px"
            maxH="520px" // fixed max height
            overflowY="auto" // scroll enable
          >
            {/* Connect String Section */}
            <Text fontWeight="bold" mb={2} fontSize="lg" w="full">
              Connect String
            </Text>
            <VStack align="stretch" spacing={2} w="full">
              <Button size="md" colorScheme="blue" w="full">
                Connect String
              </Button>
              <Button
                size="md"
                bg="gray.600"
                _hover={{ bg: "gray.500" }}
                w="full"
              >
                Disconnect String
              </Button>
            </VStack>

            {/* Enable String Section */}
            <Text fontWeight="bold" mt={6} mb={2} fontSize="lg" w="full">
              Enable String
            </Text>
            <VStack align="stretch" spacing={2} w="full">
              <Button size="md" colorScheme="blue" w="full">
                Enable String
              </Button>
              <Button
                size="md"
                bg="gray.600"
                _hover={{ bg: "gray.500" }}
                w="full"
              >
                Disable String
              </Button>
            </VStack>

            {/* Connected/Enabled Status */}
            <HStack justify="space-between" mt={6} w="full">
              <HStack>
                <Button
                  size="xs"
                  bg="limegreen"
                  borderRadius="full"
                  minW="16px"
                  h="16px"
                  p={0}
                  _hover={{ bg: "limegreen" }}
                />
                <Text fontSize="md">CONNECTED</Text>
              </HStack>
              <HStack>
                <Button
                  size="xs"
                  bg="limegreen"
                  borderRadius="full"
                  minW="16px"
                  h="16px"
                  p={0}
                  _hover={{ bg: "limegreen" }}
                />
                <Text fontSize="md">ENABLED</Text>
              </HStack>
            </HStack>

            {/* STATUS Section */}
            <Text fontWeight="bold" mt={6} mb={2} fontSize="lg" w="full">
              STATUS
            </Text>
            <SimpleGrid columns={2} spacingY={3} spacingX={2} w="full">
              {([
                ["green.400", "No failure"],
                ["purple.400", "Fuse open"],
                ["gray.300", "Button pushed"],
                ["gray.300", "Contactor fail"],
                ["gray.300", "String ground"],
                ["gray.300", "Precharge fail"],
                ["gray.300", "Fault"],
                ["gray.300", "String fault"],
                ["gray.300", "Voltage range"],
                ["", "StringNot enabled"], // right side only
              ] as [string, string][]).map(([color, label], idx) =>
                label ? (
                  <HStack key={idx} spacing={2} w="full">
                    <Button
                      size="xs"
                      bg={color || "transparent"}
                      borderRadius="full"
                      minW="14px"
                      h="14px"
                      p={0}
                      _hover={{ bg: color || "transparent" }}
                    />
                    <Text fontSize="sm" color="gray.200" w="full">
                      {label}
                    </Text>
                  </HStack>
                ) : (
                  <Box key={idx} />
                )
              )}
            </SimpleGrid>
          </Box>


        </HStack>

        {/* RIGHT COLUMN */}
        <VStack align="stretch" spacing={4}>
          {/* String Events */}
          <Box
            bg="#2D3748"
            p={6}
            borderRadius="md"
            h="520px"
            w="380px"
            ml="-6px"
            color="white"
            overflowY="auto"
          >
            <Text fontWeight="bold" mb={4} fontSize="lg" w="full">
              String Events
            </Text>

            <SimpleGrid columns={2} spacingY={3} spacingX={3} w="full">
              {[
                'Comm error', 'SoC Max alarm',
                'Temp. alarm', 'SoC Max warning',
                'Temp. warning', 'Voltage warning',
                'Charge alarm', 'Temp alarm',
                'Charge warning', 'Contactor error',
                'Fan error', 'Ground fault',
                'Dischg alarm', 'Door error',
                'Dischg warning', 'Reserved 1',
                'Volt alarm', 'Other warning',
                'Volt warning', 'Reserved 2',
                'SoC Min alarm', 'Config alarm',
                'SoC Min warning', 'Config warning'
              ].map((e, idx) => (
                <HStack key={idx} spacing={2} align="center" w="full">
                  <Box
                    w="10px"
                    h="10px"
                    bg="gray.400"
                    borderRadius="full"
                    flexShrink={0}
                  />
                  <Text
                    fontSize="md"
                    color="gray.200"
                    flex="1"
                    noOfLines={1}
                  >
                    {e}
                  </Text>
                </HStack>
              ))}
            </SimpleGrid>
          </Box>

          {/* Analogs */}
          <Box
            bg="#2D3748"
            p={4}
            borderRadius="md"
            color="white"
            w="800px"
            h="240px"
            mt={0}
            ml="-420px"
          >
            <Text fontWeight="bold" mb={3} fontSize="lg">
              Analogs
            </Text>

            <HStack align="start" justify="space-between" spacing={10}>
              {/* Left Side */}
              <VStack align="start" spacing={3}>
                <HStack spacing={2}>
                  <Text fontSize="sm">String voltage:</Text>
                  <Text color="green.300" fontWeight="semibold" fontSize="sm">632.50 V</Text>
                </HStack>
                <HStack spacing={2}>
                  <Text fontSize="sm">String current:</Text>
                  <Text color="teal.300" fontWeight="semibold" fontSize="sm">-50.00 A</Text>
                </HStack>
              </VStack>

              {/* Right Side */}
              <VStack align="start" spacing={3}>
                <HStack spacing={2} align="center">
                  <Text fontSize="sm">Max. Cell voltage:</Text>
                  <Text color="pink.400" fontWeight="semibold" fontSize="sm">3.84 V</Text>
                  <HStack spacing={1}>
                    <Box as="svg" viewBox="0 0 24 24" boxSize={3}>
                      <path d="M5 12h14M13 18l6-6-6-6" stroke="white" strokeWidth="2" fill="none" />
                    </Box>
                    <Text fontSize="sm">Module <b>4</b></Text>
                  </HStack>
                </HStack>

                <HStack spacing={2} align="center">
                  <Text fontSize="sm">Min. Cell voltage:</Text>
                  <Text color="blue.300" fontWeight="semibold" fontSize="sm">3.68 V</Text>
                  <HStack spacing={1}>
                    <Box as="svg" viewBox="0 0 24 24" boxSize={3}>
                      <path d="M5 12h14M13 18l6-6-6-6" stroke="white" strokeWidth="2" fill="none" />
                    </Box>
                    <Text fontSize="sm">Module <b>2</b></Text>
                  </HStack>
                </HStack>

                <HStack spacing={2}>
                  <Text fontSize="sm">Average Cell voltage:</Text>
                  <Text color="white" fontWeight="semibold" fontSize="sm">3.76 V</Text>
                </HStack>
              </VStack>
            </HStack>
          </Box>


        </VStack>
      </Grid>
    </Box>
  );
};

export default StringDashboard;
