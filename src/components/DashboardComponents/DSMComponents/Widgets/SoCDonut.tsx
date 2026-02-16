import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Center,
  useColorModeValue,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";
import React from "react";

function Donut({
  percent = 57
}: {
  percent?: number;
}) {

  return (
    <Box position="relative" w={`200px`} h={`229px`}>
      <CircularProgress 
        size={"189px"} 
        width={"200px"}
        height={"100%"}
        // bg={"red"}
        alignContent={"center"}
        alignSelf={"center"}
        justifySelf={"center"}
        alignItems={"center"}
        value={percent} 
        thickness={"15px"} 
        color='rgba(255, 157, 107, 1)' 
        trackColor="rgba(56, 192, 255, 1)"
        sx={{
          'circle': {
            // Inner shadow (spread inside the circular bar)
            filter: 'drop-shadow(-2px 1px 3px rgba(255, 157, 107, 0.3))',
          },
        }}
        >
        <CircularProgressLabel fontWeight={"600"} fontSize={"24px"}>{percent}%</CircularProgressLabel>
      </CircularProgress>
    </Box>
  );
}

/* Example card — only ring changed to match screenshot */
export default function SOCDonut() {
  const cardBg = useColorModeValue("rgba(255,255,255,1)", "rgba(22,27,27,1)");
  const cardBorder = useColorModeValue("#E2E8F0", "#1F2733");
  const headingColor = useColorModeValue("#161B1B", "#e6f0ff");

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius="12px"
      w="392px"
      h="285px"
      p="16px"
      display="flex"
      flexDirection="column"
      gap="16px"
      opacity={1}
      style={{ transform: "rotate(0deg)" }}
    >
      <Heading as="h3" size="sm" color={headingColor}>
        SOC %
      </Heading>

      <Center>
        {/* Same ring as screenshot: orange 57%, blue 43%, seam at bottom */}
        <Donut percent={57} />
      </Center>
    </Box>
  );
}
