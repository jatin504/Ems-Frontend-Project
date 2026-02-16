import { Box, Image } from "@chakra-ui/react";
import illustration from "./login.png";

/**
 * Decorative eco glows behind the illustration for a premium feel.
 */
const LoginIllustration = () => {
  return (
    <Box
      flex="1"
      position="relative"
      display="flex"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
    >
      {/* Soft eco glows */}
      <Box
        position="absolute"
        w="70vmin"
        h="70vmin"
        rounded="full"
        filter="blur(90px)"
        bgGradient="radial(closest-side, rgba(16,185,129,0.35), transparent)"
        top="10%"
        left="10%"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        w="60vmin"
        h="60vmin"
        rounded="full"
        filter="blur(90px)"
        bgGradient="radial(closest-side, rgba(45,212,191,0.35), transparent)"
        bottom="10%"
        right="5%"
        pointerEvents="none"
      />

      <Image
        src={illustration}
        mt={{ base: 6, md: 10 }}
        alt="Login Illustration"
        maxH={{ base: "280px", md: "520px" }}
        filter="drop-shadow(0px 12px 40px rgba(0,0,0,0.25))"
      />
    </Box>
  );
};

export default LoginIllustration;
