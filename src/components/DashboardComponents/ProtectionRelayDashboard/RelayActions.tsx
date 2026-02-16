// RelayActions.tsx
import { Button, HStack, Box } from "@chakra-ui/react";

export default function RelayActions() {
  return (
    <Box>
      <HStack spacing={2}>
        <Button size="xs" fontSize="3xs" colorScheme="red">
          CLEAR ALARM
        </Button>
        <Button size="xs" fontSize="3xs" colorScheme="green">
          RESET RELAY
        </Button>
      </HStack>
    </Box>
  );
}
