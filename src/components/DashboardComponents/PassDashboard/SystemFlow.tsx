import { Box, Text, Button, Flex, useColorModeValue } from "@chakra-ui/react";

const SystemDataFlowCard = () => {
  const bg = useColorModeValue("white", "#161B1B");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      bg={bg}
      borderRadius="12px"
      p="14px"
      boxShadow="sm"
      minH="120px"

    >
      <Text fontSize="16px" fontWeight="600" color={textColor}>
        System Data Flow
      </Text>

      <Flex mt={10} justify="flex-end">
        <Button size="sm" colorScheme="blue">
          Download Invoice
        </Button>
      </Flex>
    </Box>
  );
};

export default SystemDataFlowCard;