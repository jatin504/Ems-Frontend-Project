import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";

interface DeleteWidgetAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  widgetTitle: string;
}

const DeleteWidgetAlert = ({ isOpen, onClose, onConfirm, widgetTitle }: DeleteWidgetAlertProps) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay />
      <AlertDialogContent bg="gray.800" color="white">
        <AlertDialogHeader fontSize="lg" fontWeight="bold">
          Delete Widget
        </AlertDialogHeader>
        <AlertDialogBody>
          Are you sure you want to delete "
          <strong>{widgetTitle}</strong>"? This action cannot be undone.
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" colorScheme="red" onClick={onConfirm} ml={3}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteWidgetAlert;