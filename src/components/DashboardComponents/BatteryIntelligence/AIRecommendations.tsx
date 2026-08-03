import React from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  InfoOutlineIcon,
  RepeatIcon,
  SettingsIcon,
  TimeIcon,
} from "@chakra-ui/icons";

const recommendations = [
  {
    icon: InfoOutlineIcon,
    text: "Maintain cell temperature below 40°C for optimal life.",
  },
  {
    icon: RepeatIcon,
    text: "Avoid continuous charging above 0.6C.",
  },
  {
    icon: SettingsIcon,
    text: "Perform active balancing regularly.",
  },
  {
    icon: TimeIcon,
    text: "Schedule preventive inspection in next 45 days.",
  },
];

const AIRecommendations = () => {
  const cardBg = useColorModeValue("#FFFFFF", "#071827");
  const borderColor = useColorModeValue("#D9E2EC", "#1E3345");
  const headingColor = useColorModeValue("#1A202C", "#FFFFFF");
  const textColor = useColorModeValue("#475569", "#CBD5E1");
  const dividerColor = useColorModeValue("#E5E7EB", "#173040");

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="10px"
      px={3}
      py={2}
      h="100%"
      display="flex"
      flexDirection="column"
    >
      <Text
        fontSize="15px"
        fontWeight="700"
        color={headingColor}
        mb={2}
      >
        AI Recommendations
      </Text>

      <VStack
        spacing={0}
        align="stretch"
        flex="1"
        justify="space-evenly"
      >
                {recommendations.map((item, index) => (
          <React.Fragment key={index}>
            <Flex
              align="center"
                  py={1}
                  minH="32px"
                >
                  {/* Icon */}
                  <Flex
                    w="24px"
                    h="24px"
                    borderRadius="full"
                    bg="#0F5EA8"
                    align="center"
                    justify="center"
                    flexShrink={0}
                    mr={2}
                  >
                    <Icon
                      as={item.icon}
                      color="white"
                      boxSize={3}
                    />
                  </Flex>

                  {/* Recommendation */}
                  <Text
                    flex="1"
                    fontSize="12px"
                    color={textColor}
                    lineHeight="16px"
                    noOfLines={1}
                  >
                    {item.text}
                  </Text>
            </Flex>

            {index !== recommendations.length - 1 && (
              <Box
                h="0.5px"
                bg={dividerColor}
                opacity={0.6}
              />
            )}
          </React.Fragment>
        ))}
      </VStack>
    </Box>
  );
};

export default AIRecommendations;
    