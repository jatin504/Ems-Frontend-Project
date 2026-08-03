import {
  Box,
  Flex,
  Grid,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

import CommonCard from "./CommonCard";

// Titles retained; numeric values removed — placeholders will display when absent
const circleData = [
  { title: "THDv" },
  { title: "THDi" },
  { title: "Unbalance (V)" },
  { title: "Unbalance (I)" },
];

const boxData = [
  { title: "Flicker (Pst)" },
  { title: "Flicker (Plt)" },
];

const PowerQualitySummary = () => {

  const cardBg = useColorModeValue(
    "#ffffff",
    "primary.dark"
  );

  const textColor = useColorModeValue(
    "#0f172a",
    "#e8f0ff"
  );

  const subText = useColorModeValue(
    "#334155",
    "#b9c8de"
  );

  const border = useColorModeValue(
    "#d7dfeb",
    "#16365f"
  );

  const green = "#63d13d";

  return (
    <CommonCard
      bg={cardBg}
      p="18px"
      borderRadius="12px"
      fontFamily="Poppins"
    >
      <Text
        fontSize="13px"
        fontWeight="700"
        color={textColor}
        mb="18px"
        letterSpacing="0.4px"
        fontFamily="Poppins"
      >
        Power Quality Summary
      </Text>

      {/* TOP CIRCLE SECTION */}
      <Grid
        templateColumns="repeat(4,1fr)"
        gap="14px"
        mb="18px"
      >
        {circleData.map((item, index) => (
          <VStack
            key={index}
            spacing="6px"
          >
            <Text
              fontSize="11px"
              fontWeight="500"
              color={subText}
              fontFamily="Poppins"
            >
              {item.title}
            </Text>

            <Flex
              position="relative"
              w="78px"
              h="78px"
              align="center"
              justify="center"
              overflow="visible"
            >
              {/* FULL GREEN CIRCLE */}
              <Box
                position="absolute"
                w="78px"
                h="78px"
                borderRadius="50%"
                border="4px solid"
                borderColor={green}
              />

              {/* SMALL CUT */}
              <Box
                position="absolute"
                top="-1px"
                right="4px"
                w="18px"
                h="18px"
                borderRadius="50%"
                bg={cardBg}
              />

              <VStack spacing="0">
                <Text
                  fontSize="24px"
                  lineHeight="24px"
                  fontWeight="700"
                  color={textColor}
                  fontFamily="Poppins"
                >
                  {item.value ?? "-"}
                </Text>

                <Text
                  fontSize="12px"
                  lineHeight="12px"
                  fontWeight="700"
                  color={textColor}
                  mt="2px"
                  fontFamily="Poppins"
                >
                  %
                </Text>
              </VStack>
            </Flex>
          </VStack>
        ))}
      </Grid>

      {/* BOTTOM SECTION */}
      <Grid
        templateColumns="0.9fr 0.9fr 2fr"
        gap="12px"
      >
        {boxData.map((item, index) => (
          <VStack
            key={index}
            border={`1px solid ${border}`}
            borderRadius="8px"
            h="108px"
            justify="center"
            spacing="8px"
          >
            <Text
              fontSize="11px"
              fontWeight="500"
              color={subText}
              fontFamily="Poppins"
            >
              {item.title}
            </Text>

            <Text
              fontSize="26px"
              lineHeight="26px"
              fontWeight="700"
              color={textColor}
              fontFamily="Poppins"
            >
              {item.value ?? "-"}
            </Text>
          </VStack>
        ))}

        {/* HARMONIC COMPLIANCE */}
        <Box
          border={`1px solid ${border}`}
          borderRadius="8px"
          px="18px"
          py="14px"
        >
          <Text
            textAlign="center"
            fontSize="13px"
            fontWeight="700"
            color={textColor}
            mb="18px"
            fontFamily="Poppins"
          >
            Dominant Harmonic
          </Text>

          <Flex
            justify="space-around"
            align="center"
          >
            <VStack spacing="6px">
              <Text
                fontSize="16px"
                fontWeight="700"
                color={textColor}
                fontFamily="Poppins"
              >
                Voltage
              </Text>

              <Text
                fontSize="20px"
                lineHeight="20px"
                fontWeight="700"
                color={green}
                fontFamily="Poppins"
              >
                0 V
              </Text>
            </VStack>

            <VStack spacing="6px">
              <Text
                fontSize="16px"
                fontWeight="700"
                color={textColor}
                fontFamily="Poppins"
              >
                Current
              </Text>

              <Text
                fontSize="20px"
                lineHeight="20px"
                fontWeight="700"
                color={green}
                fontFamily="Poppins"
              >
                0 A
              </Text>
            </VStack>
          </Flex>
        </Box>
      </Grid>
    </CommonCard>
  );
};

export default PowerQualitySummary;