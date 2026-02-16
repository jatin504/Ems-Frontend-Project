import { Box, Text } from "@chakra-ui/react";

export default function SOCDisplay() {
  return (
    <Box bg="gray.800" borderRadius="md" p={4} textAlign="center" alignContent={"center"} height={"100%"}>
      <Text fontSize="md" fontWeight="bold" mb={2}>
        Tariff (MH)
      </Text>
      <Text fontSize="md" color={"gray.400"} fontWeight="bold" mb={2}>
        13:00 - 13:15
      </Text>
      <Text fontSize="2xl" color="white">
        3.50 <span style={{ fontSize: "sm" }}> ₹</span>
      </Text>
    </Box>
  );
}
