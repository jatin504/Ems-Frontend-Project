import React from "react";
import {
  Box,
  Flex,
  Image,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

interface PCSOverviewCardProps {
  name?: string;
  model?: string;
  block?: string;
  ratedPower?: string;
  ratedVoltage?: string;
  image?: string;
}

const PCSOverviewCard: React.FC<PCSOverviewCardProps> = ({
  name = "PCS-01",
  model = "Hopewind HPPS-2500B",
  block = "Power Block 1",
  ratedPower = "25.0 MW",
  ratedVoltage = "33.0 kV",
  image = "/src/assets/pcs.png",
}) => {
  const bg = useColorModeValue("#FFFFFF", "#1A202C");
  const border = useColorModeValue("#E2E8F0", "#2D3748");
  const heading = useColorModeValue("#1A202C", "#F7FAFC");
  const text = useColorModeValue("#718096", "#A0AEC0");

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="12px"
      p={4}
      h="200px"
      w="100%"
    >
      <Text
        fontSize="15px"
        fontWeight="700"
        mb={4}
        color={heading}
      >
        PCS Overview
      </Text>

      <Flex align="center" gap={5}>
        <Image
          src={image}
          alt="PCS"
          w="82px"
          h="110px"
          objectFit="contain"
        />

        <VStack align="start" spacing={1}>
          <Text
            fontSize="24px"
            fontWeight="700"
            color={heading}
          >
            {name}
          </Text>

          <Text fontSize="13px" color={text}>
            {model}
          </Text>

          <Text fontSize="13px" color={text}>
            {block}
          </Text>

          <Text fontSize="13px" color={text}>
            Rated Power:{" "}
            <Text as="span" fontWeight="600">
              {ratedPower}
            </Text>
          </Text>

          <Text fontSize="13px" color={text}>
            Rated Voltage:{" "}
            <Text as="span" fontWeight="600">
              {ratedVoltage}
            </Text>
          </Text>
        </VStack>
      </Flex>
    </Box>
  );
};

export default PCSOverviewCard;