import {
  Box,
  VStack,
  HStack,
  Text,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  useColorModeValue,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";

export default function ManualOverride() {
  const cardBg = useColorModeValue("#ffffff", "#161B1B");
  const cardBorder = useColorModeValue("#e5e7eb", "#202525");
  const softBg = useColorModeValue("#f3f4f6", "#1C2121");
  const textPrimary = useColorModeValue("#00000080", "#E8ECEC");

  const [manualMode, setManualMode] = useState<"Charge" | "Discharge">("Charge");
  const [manualValue, setManualValue] = useState("");
  const [rampMode, setRampMode] = useState<"Charge" | "Discharge">("Charge");
  const [rampValue, setRampValue] = useState("");

  const field = {
    bg: softBg,
    border: "1px solid",
    borderColor: cardBorder,
    h: "37px",
    borderRadius: "8px",
    w: "263px",
    pt: "8px",
    pb: "8px",
    pl: "10px",
  } as const;

  const RightUnit = ({ unit, w }: { unit: string; w: string }) => (
    <InputRightElement pointerEvents="none" pr="10px" h="full">
      <Box color={textPrimary} fontWeight={600} fontSize="14px" w={w}>
        {unit}
      </Box>
    </InputRightElement>
  );

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius="12px"
      w="578px"
      h="214px"
      p="16px"
    >
      <VStack spacing="20px" align="stretch">
        {/* ROW 1 */}
        <HStack spacing="16px">
          <VStack spacing="10px" align="stretch" w="263px">
            <Text fontWeight={700}>Manual Override</Text>
            <HStack spacing="8px">
              <Select
                value={manualMode}
                onChange={e => setManualMode(e.target.value as "Charge" | "Discharge")}
                bg={softBg}
                border="1px solid"
                borderColor={cardBorder}
                h="37px"
                borderRadius="8px"
                w="110px"
                fontWeight={600}
                color={textPrimary}
                fontSize="11px"
                sx={{
                  option: {
                    fontSize: "11px",
                  },
                }}
              >
                <option value="Charge">Charge</option>
                <option value="Discharge">Discharge</option>
              </Select>
              <InputGroup w="145px">
                <Input
                  {...field}
                  value={manualValue}
                  onChange={e => setManualValue(e.target.value)}
                  placeholder="Enter value"
                  color={textPrimary}
                  pr="40px"
                />
                <RightUnit unit="kW" w="23px" />
              </InputGroup>
            </HStack>
          </VStack>

          <VStack spacing="10px" align="stretch" w="263px">
            <Text fontWeight={700}>Max SOC Limit</Text>
            <Input
              bg={softBg}
              border="1px solid"
              borderColor={cardBorder}
              h="36px"
              borderRadius="10px"
            />
          </VStack>
        </HStack>

        {/* ROW 2 */}
        <HStack spacing="16px" align="end">
          <VStack spacing="10px" align="stretch" w="263px">
            <Text fontWeight={700}>Ramp</Text>
            <HStack spacing="8px">
              <Select
                value={rampMode}
                onChange={e => setRampMode(e.target.value as "Charge" | "Discharge")}
                bg={softBg}
                border="1px solid"
                borderColor={cardBorder}
                h="37px"
                borderRadius="8px"
                w="110px"
                fontWeight={600}
                color={textPrimary}
                fontSize="11px"
                sx={{
                  option: {
                    fontSize: "11px",
                  },
                }}
              >
                <option value="Charge">Charge</option>
                <option value="Discharge">Discharge</option>
              </Select>
              <InputGroup w="145px">
                <Input
                  {...field}
                  value={rampValue}
                  onChange={e => setRampValue(e.target.value)}
                  placeholder="Enter value"
                  color={textPrimary}
                  pr="60px"
                />
                <RightUnit unit="MW/min" w="62px" />
              </InputGroup>
            </HStack>
          </VStack>

          <Box w="263px" display="flex" justifyContent="flex-end">
            <Button
              w="224px"
              h="31px"
              borderRadius="6px"
              bg="#33D2D2"
              color={useColorModeValue("#FFFFFF", "#000000")}
              fontWeight="700"
            >
              Force {manualMode}
            </Button>
          </Box>
        </HStack>
      </VStack>
    </Box>
  );
}
