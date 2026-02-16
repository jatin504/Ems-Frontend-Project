// components/MiniBar.jsx
import React from "react";
import { Box } from "@chakra-ui/react";

export default function MiniBar({
  value = 0,
  max = 1,
  height = "8px",
}) {
  // string ya "162.86 kW" jaise value se number nikaalne ke liye
  const toNum = (v) => {
    if (typeof v === "number") return v;
    if (v === null || v === undefined) return 0;
    const match = String(v).match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  };

  const numVal = toNum(value);
  const numMax = toNum(max);

  const pct =
    numMax > 0
      ? Math.max(0, Math.min(1, numVal / numMax))
      : 0;

  return (
    <Box
      bg="gray.100"
      w="100%"
      h={height}
      borderRadius="6px"
      overflow="hidden"
    >
      <Box
        bg="#6bbf59"
        h="100%"
        w={`${pct * 100}%`}
      />
    </Box>
  );
}