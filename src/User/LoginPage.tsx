// src/User/LoginPage.tsx
import {
  Box,
  Flex,
  HStack,
  Text,
  Badge,
  IconButton,
  Image as ChakraImage,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import React, { useEffect, useMemo, useState } from "react";
import LoginForm from "./LoginForm";

const SLIDE = {
  tag: "SOLAR • BESS • O&M",
  title: "Powering a sustainable\nfuture.",
  subtitle:
    "Cogneta Green Solution EMS — monitoring, control,\nand insights in one place.",
};

/** White/near-white background ko transparent karta hai */
function LightLogoProcessed({
  src,
  size = { base: "56px", md: "72px" },
  threshold = 244,
  tolerance = 40,
}: {
  src: string;
  size?: any;
  threshold?: number;
  tolerance?: number;
}) {
  const [out, setOut] = useState<string>(src);
  const cacheKey = useMemo(
    () => `logoClean:${src}:t${threshold}:d${tolerance}`,
    [src, threshold, tolerance]
  );

  useEffect(() => {
    let cancelled = false;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setOut(cached);
      return;
    }

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      try {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        if (!w || !h) throw new Error("bad dims");

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no ctx");

        ctx.drawImage(img, 0, 0, w, h);
        const imgData = ctx.getImageData(0, 0, w, h);
        const d = imgData.data;

        for (let i = 0; i < d.length; i += 4) {
          const r = d[i], g = d[i + 1], b = d[i + 2];
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          if (r >= threshold && g >= threshold && b >= threshold && max - min <= tolerance) {
            d[i + 3] = 0;
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const url = canvas.toDataURL("image/png");
        if (!cancelled) {
          sessionStorage.setItem(cacheKey, url);
          setOut(url);
        }
      } catch {
        if (!cancelled) setOut(src);
      }
    };

    img.onerror = () => {
      if (!cancelled) setOut(src);
    };

    return () => {
      cancelled = true;
    };
  }, [cacheKey, src, threshold, tolerance]);

  return (
    <ChakraImage
      src={out}
      alt="logo"
      w={size}
      h={size}
      objectFit="contain"
      draggable={false}
    />
  );
}

const LoginPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const gridDot = useColorModeValue("rgba(255,255,255,0.15)", "rgba(0,0,0,0.25)");
  const footerColor = useColorModeValue("blackAlpha.800", "whiteAlpha.800");
  const headingColor = useColorModeValue("black", "white");
  const captionShadow = useColorModeValue(
    "0 2px 14px rgba(0,0,0,0.25)",
    "0 2px 14px rgba(0,0,0,0.55)"
  );

  const lightLogo = "/cogneta-logo.png";
  const darkLogo  = "/Cogneta.jpg";

  return (
    <Box
      minH="100dvh"
      position="relative"
      bgImage={`url(/solar.jpg)`}
      bgSize="cover"
      bgPos="center"
      bgRepeat="no-repeat"
    >
      {/* readability gradient */}
      <Box
        position="absolute"
        inset={0}
        bgGradient={useColorModeValue(
          "linear-gradient(90deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.38) 35%, rgba(0,0,0,0.35) 100%)",
          "linear-gradient(90deg, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.50) 35%, rgba(0,0,0,0.30) 100%)"
        )}
      />

      {/* dotted texture */}
      <Box
        position="absolute"
        inset={0}
        bgImage={`radial-gradient(${gridDot} 1px, transparent 1px)`}
        backgroundSize="22px 22px"
        pointerEvents="none"
      />

      {/* color mode toggle */}
      <IconButton
        aria-label="Toggle color mode"
        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        variant="ghost"
        position="absolute"
        top={{ base: 4, md: 6 }}
        right={{ base: 4, md: 6 }}
        zIndex={3}
        onClick={toggleColorMode}
      />

      {/* Top-left brand */}
      <HStack
        spacing={2}  // ⬅️ gap kam
        position="absolute"
        top={{ base: 4, md: 6 }}
        left={{ base: 4, md: 8 }}
        zIndex={3}
        align="center"
        color={headingColor}
      >
        {/* 1) Cogneta logo FIRST */}
        {/* {
          useColorModeValue(
            <LightLogoProcessed src={lightLogo} />,
            <Box
              w={{ base: "56px", md: "72px" }}
              h={{ base: "56px", md: "72px" }}
              bg="#fff"
              sx={{
                WebkitMaskImage: `url(${darkLogo})`,
                maskImage: `url(${darkLogo})`,
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                maskMode: "luminance",
              }}
            />
          )
        } */}

        {/* 2) Flux logo SECOND — SVG (transparent) */}
        <LightLogoProcessed
          src="/NewEtaFluxLogo.svg"          // ⬅️ replaced here
          size={{ base: "22px", md: "52px" }}
          threshold={244}
          tolerance={40}
        />

        {/* 3) Brand text — thoda aur kareeb */}
        <Box ml={1}>
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
            Cogneta <Text as="span" color="green.300">Green</Text> Solution
          </Text>
          <Badge colorScheme="green" variant="solid">
            SUSTAINABLE ENERGY PLATFORM
          </Badge>
        </Box>
      </HStack>

      {/* LEFT: Login card */}
      <Flex
        position="relative"
        zIndex={2}
        minH="100dvh"
        align="center"
        justify={{ base: "center", lg: "flex-start" }}
        px={{ base: 4, md: 10, lg: 16 }}
      >
        <Box w="full" maxW="560px">
          <LoginForm />
        </Box>
      </Flex>

      {/* RIGHT: Hero copy */}
      <Box
        position="absolute"
        zIndex={2}
        insetY={0}
        right={{ base: 4, md: 10, lg: 16 }}
        left={{ base: "auto", lg: "50%" }}
        display="flex"
        flexDir="column"
        justifyContent="center"
        maxW={{ base: "unset", lg: "620px" }}
        color="white"
        px={{ base: 6, md: 8 }}
        textShadow={captionShadow}
      >
        <Box mb={3}>
          <Badge colorScheme="green" variant="solid">
            {SLIDE.tag}
          </Badge>
        </Box>

        <Text
          fontWeight="extrabold"
          lineHeight="1.1"
          fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
          whiteSpace="pre-line"
        >
          {SLIDE.title}
        </Text>

        <Text
          mt={3}
          opacity={0.95}
          fontSize={{ base: "md", md: "lg" }}
          whiteSpace="pre-line"
        >
          {SLIDE.subtitle}
        </Text>
      </Box>

      {/* footer */}
      <Box
        position="absolute"
        bottom={{ base: 3, md: 5 }}
        left={{ base: 4, md: 8 }}
        fontSize="xs"
        color={footerColor}
        zIndex={3}
      >
        © {new Date().getFullYear()} Cogneta Green Solution — All rights reserved.
      </Box>
    </Box>
  );
};

export default LoginPage;
