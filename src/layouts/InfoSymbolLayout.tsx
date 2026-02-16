import { Box, Flex, HStack, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import React from "react";

const InfoSymbol: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const infoBG = useColorModeValue("rgba(255,255,255,1)", "#1b1f26");
  const textColor = useColorModeValue("#062D59", "rgba(255,255,255,0.92)");
  const borderColor = useColorModeValue("#DDE3E8", "rgba(255,255,255,0.12)");

  return (
    <Popover placement="left-start" isLazy>
      <PopoverTrigger>
        <Box as="span" display="inline-block">{children}</Box>
      </PopoverTrigger>
      <PopoverContent width="auto" height="auto" overflow="hidden" bgColor={infoBG} color={textColor} borderColor={borderColor}>
        <PopoverArrow />
        <PopoverHeader borderColor="transparent" pos="absolute" right={0}>
          <PopoverCloseButton bg="rgba(255,255,255,0.3)" borderRadius="50%" />
        </PopoverHeader>
        <PopoverBody overflow="auto" scrollBehavior="smooth">
          <HStack justifyContent="space-between" p="0px">
            <Flex flexDirection="column" alignItems="flex-start" color={textColor}>
              <VStack align="flex-start" borderBottom={`1px solid ${borderColor}`} mb={3}>
                {/* content goes here if needed */}
              </VStack>
            </Flex>
          </HStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default InfoSymbol;
