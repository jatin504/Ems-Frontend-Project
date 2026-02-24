import React, { useEffect, useState } from "react";
import { Box, HStack, Text, useColorModeValue } from "@chakra-ui/react";

/* ================= CONFIG ================= */

const MAIN_DEVICE_ID = "plant_1_pcs_2_bank_bank_1"; // main device
const POWER_DEVICE_ID = "plant_1_pcs_2_bank_bank_2"; // power device

const METRICS = [
  { label: "Net Export", deviceId: MAIN_DEVICE_ID, key: "Reactive_power", unit: "MWh" },
  { label: "Export Lifetime", deviceId: MAIN_DEVICE_ID, key: "Alarm_1", unit: "GWh" },
  { label: "Net Export (Inverters)", deviceId: POWER_DEVICE_ID, key: "Alarm_2", unit: "MWh" },
  { label: "Tilt Irradiation with peak & time", deviceId: MAIN_DEVICE_ID, key: "BCU_1_Charge_Discharge_power", unit: "kW" },
  { label: "Tilt Insolation", deviceId: MAIN_DEVICE_ID, key: "BCU_1_DOD", unit: "%" },
  { label: "Hor. Irradiation", deviceId: MAIN_DEVICE_ID, key: "BCU_1_Dischargeable_capacity", unit: "kWh" },
  { label: "Hor. Insolation", deviceId: MAIN_DEVICE_ID, key: "BCU_1_Energy_charged_this_month", unit: "kWh" },
  { label: "PR", deviceId: MAIN_DEVICE_ID, key: "Energy_charged_today", unit: "%" },
  { label: "Live Power with Peak & time", deviceId: MAIN_DEVICE_ID, key: "Power_factor", unit: "kW" },
  { label: "Plant Start/Stop Time", deviceId: null, key: null, dummy: "08:00 / 18:00", unit: "" },
  { label: "Last Plant trip time", deviceId: null, key: null, dummy: "2026-02-10 14:23", unit: "" },
  { label: "Revenue", deviceId: null, key: null, dummy: "₹0.00", unit: "" },
  { label: "CO2 offset", deviceId: null, key: null, dummy: "0 t", unit: "" },
  { label: "Trees Planted", deviceId: null, key: null, dummy: "0", unit: "" },
];

/* ================= COMPONENT ================= */

const MarqueeNewsHeadline: React.FC = () => {
  const bgColor = useColorModeValue("#F4F6F6", "#0E1111");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const tagColor = useColorModeValue("blue.600", "cyan.300");

  const initialValues = METRICS.reduce((acc: any, m) => {
    acc[m.label] = "--";
    return acc;
  }, {});

  const [values, setValues] = useState<Record<string, any>>(initialValues);

  useEffect(() => {
    const deviceIds = Array.from(new Set(METRICS.map((m) => m.deviceId).filter(Boolean)));

    fetch("http://75.119.146.115:5179/api/lastest-direct-data/multiple-latest-devices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ device_ids: deviceIds.join(",") }),
    })
      .then((r) => r.json())
      .then((j) => {
        if (!j?.success) return;

        const newVals: Record<string, any> = { ...initialValues };

        METRICS.forEach((m) => {
          if (!m.deviceId) {
            newVals[m.label] = m.dummy ?? "--";
            return;
          }
          const dev = j.data?.[m.deviceId];
          const raw = dev?.[m.key];

let v = "--";

if (raw && typeof raw === "object") {
  v = raw.value ?? raw.v ?? "--";   
} else if (raw !== undefined && raw !== null) {
  v = raw;
}

newVals[m.label] = v;

        });

        setValues(newVals);
      })
      .catch((e) => {
        console.error("Failed to load marquee metrics:", e);
      });
  }, []);

  /* ================= RENDER ================= */

  return (
    <Box
      bg={bgColor}
      overflow="hidden"
      width="100%"
      py={2}
      whiteSpace="nowrap"
      borderBottom="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.700")}
    >
      <Box
        display="inline-flex"
        whiteSpace="nowrap"
        sx={{
          animation: "marquee 60s linear infinite",
          "@keyframes marquee": {
            "0%": { transform: "translateX(100%)" },
            "100%": { transform: "translateX(-100%)" },
          },
        }}
      >
        <HStack spacing={8} mx={6}>
          {METRICS.map((m) => (
            <Metric
              key={m.label}
              label={m.label}
              value={values[m.label] ?? "--"}
              unit={m.unit || ""}
              color={tagColor}
              textColor={textColor}
            />
          ))}
        </HStack>
      </Box>
    </Box>
  );
};

/* ================= SMALL HELPER ================= */

const Metric = ({
  label,
  value,
  unit,
  color,
  textColor,
}: {
  label: string;
  value: number | string;
  unit: string;
  color: string;
  textColor: string;
}) => (
  <HStack spacing={2}>
    <Text fontWeight="bold" fontSize="sm" color={color}>
      {label}:
    </Text>
    <Text fontSize="sm" color={textColor}>
      {value} {unit}
    </Text>
  </HStack>
);

export default MarqueeNewsHeadline;
