import { Box, Text, VStack, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString()?.replace(/\/$/, "") || "";

const DynamicBlockOverlay = () => {

  const [blocksData, setBlocksData] = useState<any[]>([]);
  const [index, setIndex] = useState(0);

  /* ---------- FETCH MULTIPLE LATEST ---------- */

  useEffect(() => {

    fetch(
      `${API_BASE}/api/lastest-direct-data/multiple-latest-devices`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          device_id_patterns: ["_bank_bank_"]
        })
      }
    )
      .then(r => r.json())
      .then(j => {

        if (!j.success) return;

        const mapped = Object.keys(j.data)
          .sort((a, b) => {
            const numA = Number((a.match(/bank_(\d+)/i) || [])[1]);
            const numB = Number((b.match(/bank_(\d+)/i) || [])[1]);
            return numA - numB;
          })
          .map((deviceId: any) => {

            const d = j.data[deviceId];

            const bankMatch = deviceId.match(/bank_(\d+)/i);

            let name = deviceId;

            if (bankMatch) {
              name = `Block ${bankMatch[1]} Details`;
            }

            const pr =
              d?.Energy_charged_today?.value ??
              d?.BCU_1_SOC?.value ??
              d?.soc?.value ??
              0;

            return {
              name,
              pr: Number(pr).toFixed(1),
              deviation: (Math.random() * -10).toFixed(1),
              curtailment: Math.floor(Math.random() * 20),
              faults: Math.floor(Math.random() * 3),
              cause: "Normal Operation"
            };

          });

        setBlocksData(mapped);

      })
      .catch(console.error);

  }, []);

  /* ---------- AUTO ROTATION ---------- */

  useEffect(() => {

    if (!blocksData.length) return;

    const interval = setInterval(() => {
      setIndex((p) => (p + 1) % blocksData.length);
    }, 5000);

    return () => clearInterval(interval);

  }, [blocksData]);

  const block = blocksData[index] || {
    name: "Loading...",
    pr: 0,
    deviation: 0,
    curtailment: 0,
    faults: 0,
    cause: "-"
  };

  return (
    <Box
      w="250px"
      p="12px"
      borderRadius="14px"
      backdropFilter="blur(18px)"
      bg="rgba(18,22,38,0.55)"
      border="1px solid rgba(255,255,255,0.12)"
      boxShadow="0 25px 60px rgba(0,0,0,0.65)"
      color="white"
      transition=".4s"
    >
      {/* HEADER */}
      <HStack justify="space-between" mb="10px">
        <Text fontSize="13px" fontWeight="600" opacity={0.9}>
          {block.name}
        </Text>

        <HStack spacing="3px">
          <Box w="4px" h="4px" bg="whiteAlpha.700" borderRadius="full" />
          <Box w="4px" h="4px" bg="whiteAlpha.700" borderRadius="full" />
          <Box w="4px" h="4px" bg="whiteAlpha.700" borderRadius="full" />
        </HStack>
      </HStack>

      {/* INNER PANEL */}
      <Box
        borderRadius="12px"
        p="12px"
        bg="linear-gradient(180deg, rgba(255,80,80,0.12), rgba(0,0,0,0.25))"
        border="1px solid rgba(255,255,255,0.08)"
      >
        <VStack align="start" spacing="0" w="100%">

          {/* PR */}
          <Box w="100%" pb="8px" borderBottom="1px solid rgba(255,255,255,0.08)">
            <HStack spacing="6px">
              <Text fontSize="13px" opacity={0.8}>PR:</Text>

              <Text
                fontSize="18px"
                fontWeight="700"
                color="#ff5b5b"
                letterSpacing="0.5px"
              >
                {block.pr}%
              </Text>

              <Text color="#ff5b5b" fontSize="16px">▼</Text>
            </HStack>
          </Box>

          {/* Deviation */}
          <Box w="100%" py="8px" borderBottom="1px solid rgba(255,255,255,0.08)">
            <Text fontSize="12px" opacity={0.9}>
              Deviation:{" "}
              <Text as="span" color="#ff5b5b" fontWeight="600">
                {block.deviation}%
              </Text>{" "}
              vs Avg
            </Text>
          </Box>

          {/* Curtailment */}
          <Box w="100%" py="8px" borderBottom="1px solid rgba(255,255,255,0.08)">
            <Text fontSize="12px" opacity={0.9}>
              Curtailment:{" "}
              <Text as="span" color="#f6ad55" fontWeight="600">
                {block.curtailment}%
              </Text>{" "}
              SLDC Limit
            </Text>
          </Box>

          {/* Faults */}
          <Box w="100%" py="8px" borderBottom="1px solid rgba(255,255,255,0.08)">
            <Text fontSize="12px" opacity={0.9}>
              Faults:{" "}
              <Text as="span" fontWeight="700">
                {block.faults}
              </Text>{" "}
              Active issues
            </Text>
          </Box>

          {/* Cause */}
          <Box w="100%" pt="8px">
            <Text fontSize="12px" opacity={0.9}>
              Likely Cause:{" "}
              <Text as="span" color="#38d39f" fontWeight="600">
                {block.cause}
              </Text>
            </Text>
          </Box>

        </VStack>
      </Box>
    </Box>
  );
};

export default DynamicBlockOverlay;