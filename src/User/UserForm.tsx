import {
  Box,
  Button,
  VStack,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import type { User } from "./User";

// ADD
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString()?.replace(/\/$/, "") || "";

export default function UserForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (user: User) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value })); // fixed spread
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true })); // fixed spread
  };

  const handleRoleSelect = (role: string) => {
    setFormData((prev) => ({ ...prev, role })); // fixed spread
  };

  const handleSubmit = async () => {
    const { firstName, lastName, email, phone, role, password } = formData;

    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!firstName || !nameRegex.test(firstName)) {
      toast({ title: "Invalid First Name", status: "error", duration: 3000 });
      return;
    }
    if (!lastName || !nameRegex.test(lastName)) {
      toast({ title: "Invalid Last Name", status: "error", duration: 3000 });
      return;
    }
    if (!email || !emailRegex.test(email)) {
      toast({ title: "Invalid Email", status: "error", duration: 3000 });
      return;
    }
    if (!phone || !phoneRegex.test(phone)) {
      toast({ title: "Invalid Phone Number", status: "error", duration: 3000 });
      return;
    }
    if (!role) {
      toast({ title: "Select a Role", status: "warning", duration: 3000 });
      return;
    }
    if (!strongPasswordRegex.test(password)) {
      toast({
        title: "Weak Password",
        description:
          "Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol required.",
        status: "warning",
      });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          username: `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
          email,
          password,
          role,
          phone,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "User Created",
          description: `User ${email} successfully created.`,
          status: "success",
          duration: 3000,
        });

        // backend se user_id aata hai
        onSubmit({
          id: data.user_id,
          firstName,
          lastName,
          email,
          phone,
          role,
          is_blocked: false,
        });

        onCancel();
      } else {
        toast({
          title: "User Creation Failed",
          description: data.message || "Something went wrong.",
          status: "error",
          duration: 3000,
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Network Error",
        description: "Could not reach backend.",
        status: "error",
        duration: 3000,
      });
    }
  };

  const roles = ["Admin", "Operator", "Engineer", "Supervisor"];

  const bgOuter = useColorModeValue("gray.100", "gray.900");
  const bgInner = useColorModeValue("white", "gray.800");
  const textClr = useColorModeValue("gray.900", "white");
  const inputBg = useColorModeValue("gray.200", "gray.700");
  const roleActiveBg = useColorModeValue("blue.400", "blue.500");
  const roleInactiveBg = useColorModeValue("gray.200", "gray.700");
  return (
    <Box bg={bgOuter} minH="100vh" display="flex" justifyContent="center" alignItems="center">
      <Box bg={bgInner} color={textClr} p={6} borderRadius="md" w="100%" maxW="480px" boxShadow="md">
        <VStack spacing={4} align="stretch">
          <Text fontSize="lg" fontWeight="bold">Create User</Text>

          <FormControl isRequired isInvalid={touched.firstName && !/^[A-Za-z]+$/.test(formData.firstName)}>
            <FormLabel>First Name</FormLabel>
            <Input name="firstName" value={formData.firstName} onChange={handleChange} onBlur={handleBlur} bg={inputBg} color={textClr} />
            <FormErrorMessage>Only alphabets allowed</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={touched.lastName && !/^[A-Za-z]+$/.test(formData.lastName)}>
            <FormLabel>Last Name</FormLabel>
            <Input name="lastName" value={formData.lastName} onChange={handleChange} onBlur={handleBlur} bg={inputBg} color={textClr} />
            <FormErrorMessage>Only alphabets allowed</FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={
              touched.email &&
              !/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
            }
          >
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              bg={inputBg}
              color={textClr}
            />
            <FormErrorMessage>Invalid email</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={touched.phone && !/^[0-9]{10}$/.test(formData.phone)}>
            <FormLabel>Phone</FormLabel>
            <Input name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur} bg={inputBg} color={textClr} />
            <FormErrorMessage>Must be 10 digits</FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={touched.password && !strongPasswordRegex.test(formData.password)}
          >
            <FormLabel>Password</FormLabel>
            <Input type="password" name="password" value={formData.password} onChange={handleChange} bg={inputBg} color={textClr} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Role</FormLabel>
            <HStack spacing={3} wrap="wrap">
              {roles.map((role) => (
                <Box
                  key={role}
                  px={4}
                  py={2}
                  borderRadius="md"
                  cursor="pointer"
                  bg={formData.role === role ? roleActiveBg : roleInactiveBg}
                  color={formData.role === role ? "white" : textClr}
                  border={formData.role === role ? "2px solid" : "1px solid"}
                  borderColor={formData.role === role ? roleActiveBg : roleInactiveBg}
                  onClick={() => handleRoleSelect(role)}
                  transition="background 0.2s"
                >
                  {role}
                </Box>
              ))}
            </HStack>
          </FormControl>

          <Button onClick={handleSubmit} colorScheme="blue" w="full">Create User</Button>
          <Button onClick={onCancel} colorScheme={useColorModeValue("gray", "whiteAlpha")} w="full">Cancel</Button>
        </VStack>
      </Box>
    </Box>
  );
}
