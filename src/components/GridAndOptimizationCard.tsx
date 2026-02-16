import { Box, Text, Flex, Icon } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'

const GridAndOptimizationCard = () => {
  return (
    <Box p={4} bg="gray.900" borderRadius="xl" height="200px" width="820px" shadow="md" color="white">
      <Flex height="100%">
        {/* Left section: Grid Connection */}
        <Flex direction="column" flex="1" pr={4} justify="space-between">
          <Box>
            <Text mb={3} fontWeight="bold" fontSize="lg">
              Grid Connection
            </Text>

            <Flex align="center" mb={1} color="green.400">
              <Icon as={CheckCircleIcon} mr={2} />
              <Text fontWeight="medium" color="white">
                Connected
              </Text>
            </Flex>

            {/* Horizontal line under Connected */}
            <Box height="1px" bg="gray.600" my={2} />
          </Box>

          <Text fontSize="md" color="gray.400">
            Real-time Energy Consumption
          </Text>
        </Flex>

        {/* Vertical Divider - full height */}
        <Box width="1px" bg="gray.600" />

        {/* Right section: Optimization */}
        <Flex direction="column" flex="1" pl={4} justify="space-between">
          <Box>
            <Text mb={1} fontWeight="bold" fontSize="lg">
              Optimization Objective
            </Text>
            <Text fontSize="md" mb={1}>
              Cost Optimization
            </Text>
            <Text fontSize="3xl" fontWeight="semibold" height="500px">
              34,5 kW
            </Text>
          </Box>
          <Box /> {/* Optional spacer for alignment */}
        </Flex>
      </Flex>
    </Box>
  )
}

export default GridAndOptimizationCard
