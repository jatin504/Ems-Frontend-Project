import { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Select,
  Radio,
  RadioGroup,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useColorModeValue,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

const constraints = [
  "Maintain Critical Load",
  "Max Reduction Limit: 2.0 MW",
  "Comfort & Safety Constraints",
  "Equipment Minimum Run Time",
];

export function DSMControlMode() {
  const bg = useColorModeValue("#FFFFFF", "#071826");
  const border = useColorModeValue("#D8E2EC", "#18344B");

  const title = useColorModeValue("#0F172A", "#F8FAFC");
  const text = useColorModeValue("#475569", "#A9BED1");

  const selectBg = useColorModeValue("#FFFFFF", "#0C1E30");

  const [mode, setMode] = useState("Cost Optimization");
  const [aggressiveness, setAggressiveness] = useState(70);

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="12px"
      p={2}
      h="100%"
    >
      <Text
        fontSize="13px"
        fontWeight="600"
        color={title}
        mb={3}
      >
        DSM Control Mode
      </Text>

      {/* Mode */}
      <VStack spacing={2} align="stretch">

        <HStack justify="space-between" align="center">
          <Text
            color={title}
            fontSize="11px"
            w="52px"
          >
            Mode
          </Text>

          <Select
            size="sm"
            bg={selectBg}
            borderColor={border}
            value="Automatic (AI Optimized)"
          >
            <option>Automatic (AI Optimized)</option>
            <option>Manual</option>
            <option>Disabled</option>
          </Select>
        </HStack>

        <Box>

          <Text
            color={title}
            fontSize="11px"
            mb={1}
          >
            Target
          </Text>

          <RadioGroup
            value={mode}
            onChange={setMode}
          >
            <VStack align="start" spacing={1}>
              <Radio value="Cost Optimization" colorScheme="blue">
                <Text color={text} fontSize="11px">
                  Cost Optimization
                </Text>
              </Radio>

              <Radio value="Peak Shaving">
                <Text color={text} fontSize="11px">
                  Peak Shaving
                </Text>
              </Radio>

              <Radio value="Energy Arbitrage">
                <Text color={text} fontSize="11px">
                  Energy Arbitrage
                </Text>
              </Radio>

              <Radio value="Demand Charge Reduction">
                <Text color={text} fontSize="11px">
                  Demand Charge Reduction
                </Text>
              </Radio>
            </VStack>
          </RadioGroup>

        </Box>

        <Box>

          <HStack
            justify="space-between"
            mb={1}
          >
            <Text
              fontSize="11px"
              fontWeight="600"
              color={title}
            >
              Aggressiveness
            </Text>

            <Text
              color={title}
              fontWeight="600"
              fontSize="11px"
            >
              {aggressiveness}%
            </Text>
          </HStack>

          <Slider
            value={aggressiveness}
            onChange={setAggressiveness}
            min={0}
            max={100}
          >
            <SliderTrack bg={useColorModeValue("#E2E8F0", "#22384B")}>
              <SliderFilledTrack bg="#3B82F6" />
            </SliderTrack>

            <SliderThumb
              boxSize={4}
              bg="#3B82F6"
            />
          </Slider>

          <HStack
            justify="space-between"
            mt={1}
          >
            {["0%", "25%", "50%", "75%", "100%"].map((v) => (
              <Text
                key={v}
                fontSize="9px"
                color={text}
              >
                {v}
              </Text>
            ))}
          </HStack>

        </Box>
                <Box
          border="1px solid"
          borderColor={border}
          borderRadius="8px"
          p={3}
        >
          <Text
            fontSize="13px"
            fontWeight="600"
            color={title}
            mb={3}
          >
            Constraints
          </Text>

          <VStack
            align="stretch"
            spacing={2}
          >
            {constraints.map((item) => (
              <HStack
                key={item}
                spacing={2}
              >
                <CheckCircleIcon
                  color="#22C55E"
                  boxSize={3}
                />

                <Text
                  fontSize="10px"
                  color={text}
                >
                  {item}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>

      </VStack>
    </Box>
  );
}