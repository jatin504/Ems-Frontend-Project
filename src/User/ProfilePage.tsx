import { Box, Heading, Text } from "@chakra-ui/react";

export default function ProfilePage() {
  return (
    <Box bg="gray.800" color="white" minH="100vh" p={6}>
      <Heading mb={4}>Profile</Heading>
      <Text>User profile details will appear here.</Text>
    </Box>
  );
}
