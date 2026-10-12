import React from "react";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Text,
  VStack,
  HStack,
  Box,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";

interface ControlPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;

  currentUser: string;
  controlOwner: string | null;
  permissionRequestedBy: string | null;
  permissionGrantedTo: string | null;

  onRequestPermission: () => void;
  onGrant: () => void;
  onDeny: () => void;
}

const ControlPermissionModal: React.FC<
  ControlPermissionModalProps
> = ({
  isOpen,
  onClose,
  currentUser,
  controlOwner,
  permissionRequestedBy,
  permissionGrantedTo,
  onRequestPermission,
  onGrant,
  onDeny,
}) => {
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);

  const cardBg = useColorModeValue("#ffffff", "#161B1B");
  const borderColor = useColorModeValue("#e5e7eb", "#2A3030");
  const mutedColor = useColorModeValue("#64748b", "#94A3B8");
  const softBg = useColorModeValue("#f8fafc", "#1C2121");

  const isOwner = controlOwner === currentUser;

  const isGranted =
    permissionGrantedTo === currentUser;

  /*
   * CURRENT USER ALREADY HAS CONTROL
   */
  if (isGranted) {
    return (
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="10px"
        >
          <AlertDialogHeader fontSize="md" fontWeight="700">
            Control Permission Granted
          </AlertDialogHeader>

          <AlertDialogBody>
            <VStack align="stretch" spacing={3}>
              <Box
                bg={softBg}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="8px"
                p={3}
              >
                <HStack justify="space-between">
                  <Text fontSize="sm">
                    Current Controller
                  </Text>

                  <Badge
                    colorScheme="green"
                    fontSize="10px"
                  >
                    Granted
                  </Badge>
                </HStack>

                <Text
                  mt={1}
                  fontSize="sm"
                  fontWeight="600"
                >
                  {currentUser}
                </Text>
              </Box>

              <Text fontSize="sm" color={mutedColor}>
                You now have permission to control this
                module.
              </Text>
            </VStack>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              size="sm"
              colorScheme="teal"
              onClick={onClose}
            >
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  /*
   * OWNER RECEIVES REQUEST
   */
  if (
    isOwner &&
    permissionRequestedBy &&
    permissionRequestedBy !== currentUser
  ) {
    return (
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="10px"
        >
          <AlertDialogHeader fontSize="md" fontWeight="700">
            Control Permission Request
          </AlertDialogHeader>

          <AlertDialogBody>
            <VStack align="stretch" spacing={3}>
              <Box
                bg={softBg}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="8px"
                p={3}
              >
                <Text
                  fontSize="xs"
                  color={mutedColor}
                  mb={1}
                >
                  Permission requested by
                </Text>

                <HStack justify="space-between">
                  <Text
                    fontSize="sm"
                    fontWeight="700"
                  >
                    {permissionRequestedBy}
                  </Text>

                  <Badge
                    colorScheme="orange"
                    fontSize="10px"
                  >
                    Pending
                  </Badge>
                </HStack>
              </Box>

              <Text fontSize="sm">
                {permissionRequestedBy} is requesting
                control access.
              </Text>

              <Text
                fontSize="xs"
                color={mutedColor}
              >
                Granting access will transfer Control Mode
                control to this user.
              </Text>
            </VStack>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              size="sm"
              variant="outline"
              onClick={onDeny}
            >
              Deny
            </Button>

            <Button
              ml={3}
              size="sm"
              colorScheme="teal"
              onClick={onGrant}
            >
              Grant Access
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  /*
   * USER ALREADY SENT REQUEST
   */
  if (
    permissionRequestedBy === currentUser &&
    controlOwner !== currentUser
  ) {
    return (
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="10px"
        >
          <AlertDialogHeader fontSize="md" fontWeight="700">
            Permission Request Sent
          </AlertDialogHeader>

          <AlertDialogBody>
            <VStack align="stretch" spacing={3}>
              <Box
                bg={softBg}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="8px"
                p={3}
              >
                <HStack justify="space-between">
                  <Text fontSize="sm">
                    Request Status
                  </Text>

                  <Badge
                    colorScheme="orange"
                    fontSize="10px"
                  >
                    Pending
                  </Badge>
                </HStack>
              </Box>

              <Text fontSize="sm">
                Your permission request has been sent to{" "}
                <Text as="span" fontWeight="700">
                  {controlOwner || "the current controller"}
                </Text>
                .
              </Text>

              <Text
                fontSize="xs"
                color={mutedColor}
              >
                You can apply Control Mode changes after
                the current controller grants access.
              </Text>
            </VStack>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  /*
   * ANOTHER USER OWNS CONTROL
   */
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent
        bg={cardBg}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="10px"
      >
        <AlertDialogHeader fontSize="md" fontWeight="700">
          Control Permission Required
        </AlertDialogHeader>

        <AlertDialogBody>
          <VStack align="stretch" spacing={3}>
            <Box
              bg={softBg}
              border="1px solid"
              borderColor={borderColor}
              borderRadius="8px"
              p={3}
            >
              <HStack justify="space-between">
                <Text fontSize="sm">
                  Current Controller
                </Text>

                <Badge
                  colorScheme="red"
                  fontSize="10px"
                >
                  Locked
                </Badge>
              </HStack>

              <Text
                mt={1}
                fontSize="sm"
                fontWeight="700"
              >
                {controlOwner || "Another User"}
              </Text>
            </Box>

            <Text fontSize="sm">
              Control Mode is currently being controlled
              by{" "}
              <Text as="span" fontWeight="700">
                {controlOwner || "another user"}
              </Text>
              .
            </Text>

            <Text
              fontSize="sm"
              color={mutedColor}
            >
              You need permission from the current
              controller before applying changes.
            </Text>
          </VStack>
        </AlertDialogBody>

        <AlertDialogFooter>
          <Button
            ref={cancelRef}
            size="sm"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            ml={3}
            size="sm"
            colorScheme="teal"
            onClick={onRequestPermission}
            isDisabled={
              permissionRequestedBy === currentUser
            }
          >
            {permissionRequestedBy === currentUser
              ? "Request Sent"
              : "Request Permission"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ControlPermissionModal;