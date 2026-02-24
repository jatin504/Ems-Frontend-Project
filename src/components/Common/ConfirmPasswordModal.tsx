import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React from "react";

const API_BASE =
  (import.meta as any).env?.VITE_API_URL ?? "http://75.119.146.115:5179/api";

function getToken(): string {
  return sessionStorage.getItem("token") || "";
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}

export default function ConfirmPasswordModal({
  isOpen,
  onClose,
  onConfirm,
}: Props) {
  const toast = useToast();

  const [password, setPassword] = React.useState("");
  const [verifying, setVerifying] = React.useState(false);

  const handleConfirm = async () => {
    if (!password) return;

    try {
      setVerifying(true);

      // 🔥 PASSWORD VERIFY API CALL
      const res = await fetch(`${API_BASE}/verify-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Password verification failed");
      }

      // ✅ PASSWORD CORRECT
      onConfirm(password);
      setPassword("");
      onClose();
    } catch (err: any) {
      toast({
        title: err.message || "Invalid password",
        status: "error",
        duration: 3000,
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Password</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={3}>
            <Text fontSize="sm">
              Enter your password to perform control action
            </Text>

            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              colorScheme="blue"
              w="100%"
              onClick={handleConfirm}
              isLoading={verifying}
            >
              Confirm
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
