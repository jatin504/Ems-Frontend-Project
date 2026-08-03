import { Box, Text, VStack, HStack, useColorModeValue } from "@chakra-ui/react";
import { AlertTriangle, AlertCircle } from "lucide-react";
import { useMemo } from "react";
import { useLatestPOIData } from "../../../hooks/poi_meter/useLatestPOIData";
import { useAlarmLatest } from "../../../hooks/useAlarmLatest";
import { useNavigate } from "react-router-dom"; // <-- Add this import

const MeterCard = () => {
  /* ---------- Meter keys ---------- */
  const keys = useMemo(
    () => ["voltage", "power_kw", "frequency_hz", "amps", "daily_energy_kwh"],
    []
  );

  /* ---------- Meter data ---------- */
  const { data } = useLatestPOIData(keys);

  /* ---------- Alarm data (IMPORTANT FIX) ---------- */
  const { alarmCount, warningCount } = useAlarmLatest();
  const navigate = useNavigate(); // <-- Add this line

  /* ---------- Meter calculations ---------- */
  const sumVoltage = data
    ? data.reduce((s, i) => s + parseFloat(i.voltage), 0)
    : 0;

  const sumPower = data
    ? data.reduce((s, i) => s + parseFloat(i.power_kw), 0)
    : 0;

  const sumFrequency = data
    ? data.reduce((s, i) => s + parseFloat(i.frequency_hz), 0)
    : 0;

  const sumAmps = data
    ? data.reduce((s, i) => s + parseFloat(i.amps), 0)
    : 0;

  const sumEnergy = data
    ? data.reduce((s, i) => s + parseFloat(i.daily_energy_kwh), 0)
    : 0;

  const avgVoltage = data?.length ? sumVoltage / data.length : 0;
  const avgPower = data?.length ? sumPower / data.length : 0;
  const avgFrequency = data?.length ? sumFrequency / data.length : 0;
  const avgAmps = data?.length ? sumAmps / data.length : 0;

  /* ---------- Theme ---------- */
  const primaryBg = useColorModeValue("primary.light", "primary.dark");
  const primaryColor = useColorModeValue(
    "primaryText.light",
    "primaryText.dark"
  );
  const secondaryColor = useColorModeValue(
    "secondaryText.light",
    "secondaryText.dark"
  );

  return (
    <Box
      width="100%"
      h="300px"
      p="16px"
      rounded="12px"
      bg={primaryBg}
      fontSize="14px"
      color={primaryColor}
    >
      {/* ---------- Title ---------- */}
      <Text fontSize="16px" fontWeight="600" mb={4}>
        Meter
      </Text>

      {/* ---------- Meter Values ---------- */}
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between">
          <Text color={secondaryColor}>Instant Power:</Text>
          <Text fontWeight="600">{avgPower.toFixed(2)} kW</Text>
        </HStack>

        <HStack justify="space-between">
          <Text color={secondaryColor}>Daily Energy:</Text>
          <Text fontWeight="600">{sumEnergy.toFixed(2)} kWh</Text>
        </HStack>

        <HStack justify="space-between">
          <Text color={secondaryColor}>Frequency:</Text>
          <Text fontWeight="600">{avgFrequency.toFixed(2)} Hz</Text>
        </HStack>

        <HStack justify="space-between">
          <Text color={secondaryColor}>Voltage:</Text>
          <Text fontWeight="600">{avgVoltage.toFixed(2)} kV</Text>
        </HStack>

        <HStack justify="space-between">
          <Text color={secondaryColor}>Current:</Text>
          <Text fontWeight="600">{avgAmps.toFixed(2)} A</Text>
        </HStack>
      </VStack>

      {/* ---------- Alarms Section ---------- */}
      <HStack mt={4} justify="space-between">
        <VStack
          align="flex-start"
          bg={useColorModeValue("#FFF8F8", "rgba(255,161,161,0.14)")}
          p="10px"
          rounded="8px"
          w="144px"
          _hover={{ cursor: "pointer", boxShadow: "md" }}
          onClick={() => navigate("/alarms/latest")}
        >
          <AlertCircle color="red" size={20} />
          <Text fontWeight="500">{alarmCount} ALARMS</Text>
        </VStack>

        <VStack
          align="flex-start"
          bg={useColorModeValue(
            "rgba(255,250,239,1)",
            "rgba(255,222,151,0.17)"
          )}
          p="10px"
          rounded="8px"
          w="144px"
          _hover={{ cursor: "pointer", boxShadow: "md" }}
          onClick={() => navigate("/alarms/latest")}
        >
          <AlertTriangle color="orange" size={20} />
          <Text fontWeight="500">{warningCount} WARNINGS</Text>
        </VStack>
      </HStack>
    </Box>
  );
};

export default MeterCard;
