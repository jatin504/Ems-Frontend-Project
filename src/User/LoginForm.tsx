// src/User/LoginForm.tsx
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  HStack,
  Checkbox,
  Text,
  Link as ChakraLink,
  Heading,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  // Light/Dark adaptive styles
  const cardBg = useColorModeValue("rgba(255,255,255,0.7)", "rgba(18,24,20,0.6)");
  const cardBorder = useColorModeValue("blackAlpha.200", "whiteAlpha.200");
  const inputBg = useColorModeValue("white", "whiteAlpha.100");
  const placeholderColor = useColorModeValue("blackAlpha.500", "whiteAlpha.700");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") handleLogin();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [identifier, password]);

  const handleLogin = async () => {
    if (!identifier || !password) {
      toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://75.119.146.115:5179/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem("token", data.access_token);

        const displayName =
          data?.user?.fullName ||
          [data?.user?.firstName, data?.user?.lastName].filter(Boolean).join(" ") ||
          data?.name ||
          data?.fullName ||
          identifier;

        sessionStorage.setItem("userName", displayName);
        window.dispatchEvent(new Event("storage"));

        toast({
          title: "Welcome back",
          description: `Logged in as ${displayName}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        navigate("/plantview");
      } else {
        toast({
          title: "Login failed",
          description: data.message || "Invalid credentials",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Network error",
        description: "Unable to connect to backend",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      w="100%"
      maxW="440px"
      p={{ base: 6, md: 8 }}
      rounded="2xl"
      backdropFilter="blur(10px)"
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorder}
      boxShadow={useColorModeValue(
        "0 8px 30px rgba(0,0,0,0.15)",
        "0 8px 30px rgba(0,0,0,0.35)"
      )}
      color={textColor}
    >
      <VStack spacing={5} align="stretch">
        <Heading size="lg" lineHeight={1.1}>
          Sign in to{" "}
          <Text
            as="span"
            bgGradient={useColorModeValue(
              "linear(to-r, green.600, teal.500)",
              "linear(to-r, green.300, teal.200)"
            )}
            bgClip="text"
          >
            Cogneta Green
          </Text>
        </Heading>

        <FormControl>
          <FormLabel>Email or Username</FormLabel>
          <Input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="you@cogneta.green"
            bg={inputBg}
            _placeholder={{ color: placeholderColor }}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your secure password"
              bg={inputBg}
              _placeholder={{ color: placeholderColor }}
            />
            <InputRightElement>
              <IconButton
                aria-label={showPwd ? "Hide password" : "Show password"}
                size="sm"
                variant="ghost"
                onClick={() => setShowPwd((s) => !s)}
                icon={showPwd ? <ViewOffIcon /> : <ViewIcon />}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        {/* Bottom row: only Remember me (Forgot password removed) */}
        <HStack justify="flex-start">
          <Checkbox defaultChecked colorScheme="green">Remember me</Checkbox>
        </HStack>

        <Button
          colorScheme="green"
          size="lg"
          onClick={handleLogin}
          isLoading={loading}
          loadingText="Signing in"
          isDisabled={!identifier || !password}
          _hover={{ transform: "translateY(-1px)" }}
          transition="all 0.15s ease"
        >
          Sign in
        </Button>

        <Divider borderColor={useColorModeValue("blackAlpha.300", "whiteAlpha.300")} />

        
      </VStack>
    </Box>
  );
}
