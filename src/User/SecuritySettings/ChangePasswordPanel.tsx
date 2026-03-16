// src/User/SecuritySettings/ChangePasswordPanel.tsx

import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  HStack,
  Radio,
  RadioGroup,
  Text,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";

/** Same strong password policy as backend */
const STRONG_PW =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString()?.replace(/\/$/, "") || "";

const ChangePasswordPanel: React.FC = () => {
  const [mode, setMode] = useState<"withCurrent" | "withoutCurrent">("withCurrent");
  const [identifier, setIdentifier] = useState(""); // username or email (admin mode)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Adaptive colors
  const cardBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("gray.700", "gray.200");
  const labelColor = useColorModeValue("gray.700", "gray.200");
  const helperColor = useColorModeValue("gray.600", "gray.300");
  const inputBg = useColorModeValue("white", "gray.700");
  const inputColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const cardShadow = useColorModeValue("sm", "md");

  const validate = () => {
    if (!newPassword || !confirmPassword) {
      toast({ title: "Enter new password and confirm it", status: "warning", duration: 3000 });
      return false;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "New password and confirm password do not match", status: "error", duration: 3000 });
      return false;
    }
    if (!STRONG_PW.test(newPassword)) {
      toast({
        title: "Weak password",
        description: "Min 8 chars, include uppercase, lowercase, number, and symbol.",
        status: "warning",
        duration: 4000,
      });
      return false;
    }
    if (mode === "withCurrent" && !currentPassword) {
      toast({ title: "Enter your current password", status: "warning", duration: 3000 });
      return false;
    }
    if (mode === "withoutCurrent" && !identifier.trim()) {
      toast({ title: "Enter username or email of the target user", status: "warning", duration: 3000 });
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (!validate()) return;

    const token = sessionStorage.getItem("token"); // LoginForm sets this
    if (!token) {
      toast({ title: "Not authenticated", description: "Please login again.", status: "error", duration: 3000 });
      return;
    }

    setLoading(true);
    try {
      let url = "";
      let body: Record<string, string> = {};

      if (mode === "withCurrent") {
        url = `${API_BASE}/api/change-password`;
        body = {
          current_password: currentPassword,
          new_password: newPassword,
        };
      } else {
        url = `${API_BASE}/api/users/set-password`;
        body = {
          identifier: identifier.trim(),
          new_password: newPassword,
        };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        toast({
          title: mode === "withCurrent" ? "Password changed" : "Password set for user",
          status: "success",
          duration: 3000,
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        if (mode === "withoutCurrent") setIdentifier("");
      } else {
        toast({
          title: "Action failed",
          description: data?.message || "Unknown error",
          status: "error",
          duration: 4000,
        });
      }
    } catch {
      toast({
        title: "Network error",
        description: "Unable to reach backend",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg={cardBg} p={6} rounded="md" shadow={cardShadow} mt={6}>
      <Heading size="md" mb={4} color={headingColor}>
        {mode === "withCurrent" ? "2. Change Password" : "2. Set User Password (Admin)"}
      </Heading>

      {/* Mode selection */}
      <RadioGroup
        value={mode}
        onChange={(v) => setMode(v as "withCurrent" | "withoutCurrent")}
        mb={5}
      >
        <HStack spacing={8}>
          <Radio value="withCurrent" colorScheme="blue">
            Change (with current)
          </Radio>
          <Radio value="withoutCurrent" colorScheme="blue">
            Set (no current) — Admin
          </Radio>
        </HStack>
      </RadioGroup>

      <VStack spacing={4} align="stretch">
        {mode === "withoutCurrent" && (
          <FormControl isRequired>
            <FormLabel color={labelColor}>Username or Email (target user)</FormLabel>
            <Input
              placeholder="e.g. john_doe or john@site.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              bg={inputBg}
              color={inputColor}
            />
          </FormControl>
        )}

        {mode === "withCurrent" && (
          <FormControl isRequired>
            <FormLabel color={labelColor}>Current Password</FormLabel>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              bg={inputBg}
              color={inputColor}
            />
          </FormControl>
        )}

        <HStack spacing={4} flexWrap="wrap">
          <FormControl isRequired minW={{ base: "100%", md: "240px" }}>
            <FormLabel color={labelColor}>New Password</FormLabel>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              bg={inputBg}
              color={inputColor}
            />
          </FormControl>

          <FormControl isRequired minW={{ base: "100%", md: "240px" }}>
            <FormLabel color={labelColor}>Confirm New Password</FormLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              bg={inputBg}
              color={inputColor}
            />
          </FormControl>
        </HStack>

        <Text fontSize="sm" color={helperColor}>
          Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.
        </Text>

        <Button colorScheme="blue" onClick={submit} isLoading={loading} loadingText="Submitting">
          {mode === "withCurrent" ? "Change Password" : "Set Password"}
        </Button>
      </VStack>
    </Box>
  );
};

export default ChangePasswordPanel;
