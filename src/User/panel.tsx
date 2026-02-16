import { Box, Badge, HStack, Text, useColorModeValue } from "@chakra-ui/react";

type Slide = {
  title: string;
  subtitle?: string;
  tag?: string;
  imageUrl?: string; 
  align?: "left" | "right";
};

export default function HeroSliderPanel({
  slides,
  side = "right",
}: {
  slides: Slide[];
  side?: "left" | "right";
}) {
  const slide = slides[0]; 
  const overlay = useColorModeValue(
    "linear-gradient(90deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.55) 100%)",
    "linear-gradient(90deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0.75) 100%)"
  );

  return (
    <Box
      flex="1"
      order={{ base: side === "right" ? 1 : 2, lg: side === "right" ? 2 : 1 }}
      
      minH="100dvh"
      alignSelf="stretch"
      display="block"
      position="relative"
      
      bgImage={slide?.imageUrl ? `url(${slide.imageUrl})` : undefined}
      bgSize="cover"
      bgPos="center"
      bgRepeat="no-repeat"
    >
      {/* dark overlay for text contrast */}
      <Box position="absolute" inset={0} bgGradient={overlay} />

      {/* caption */}
      <Box
        position="absolute"
        insetY={0}
        left={side === "right" ? "6" : "auto"}
        right={side === "right" ? "auto" : "6"}
        display="flex"
        flexDir="column"
        justifyContent="center"
        maxW="520px"
        color="white"
        px={{ base: 6, md: 12 }}
        py={{ base: 10, md: 0 }}
      >
        {slide?.tag && (
          <HStack mb={3}>
            <Badge colorScheme="green" variant="solid">
              {slide.tag}
            </Badge>
          </HStack>
        )}
        {slide?.title && (
          <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold">
            {slide.title}
          </Text>
        )}
        {slide?.subtitle && (
          <Text opacity={0.9} mt={2} fontSize={{ base: "md", md: "lg" }}>
            {slide.subtitle}
          </Text>
        )}
      </Box>
    </Box>
  );
}
