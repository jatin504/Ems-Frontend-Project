// RelayActions.tsx
import { Button, HStack, Box } from "@chakra-ui/react";

export default function RelayActions() {
  return (
    <Box
      w="100%"        // ⬅️ fixed width removed
      mt={2}          // ⬅️ FaultDetails se niche push
    >
      <HStack spacing={2} justify="flex-start">
        <Button
          size="sm"
          fontSize="xs"
          colorScheme="red"
        >
          CLEAR ALARM
        </Button>

        <Button
          size="sm"
          fontSize="xs"
          colorScheme="green"
        >
          RESET RELAY
        </Button>
      </HStack>
    </Box>
  );
}
