import React from "react";
import { Box, Grid, Text, Flex, Heading, useColorModeValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDevices } from "../../../../hooks/useDevices";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";

/** Circular badge with the exact icon look */
const LinkBadge: React.FC<{ ok: boolean }> = ({ ok }) => {
  const circle = ok ? "#22c55e" : "#ef4444";
  const frame = "#06b6d4";

  if (!ok) {
    return (
      <Box
        w="22px"
        h="22px"
        borderRadius="full"
        display="grid"
        placeItems="center"
        bg={circle}
        flex="0 0 auto"
      >
        <Box as="svg" viewBox="0 0 24 24" w="14px" h="14px" fill="none">
          <path d="M15.5 8.5L8.5 15.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M9.4 6.3L7.8 4.7C6.1 3 3.3 3 1.6 4.7C-0.1 6.4 -0.1 9.2 1.6 10.9L3.2 12.5"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M14.6 17.7L16.2 19.3C17.9 21 20.7 21 22.4 19.3C24.1 17.6 24.1 14.8 22.4 13.1L20.8 11.5"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      w="22px"
      h="22px"
      borderRadius="full"
      display="grid"
      placeItems="center"
      bg={circle}
      flex="0 0 auto"
    >
      <Box as="svg" viewBox="0 0 16 16" w="16px" h="16px">
        <rect x="1.5" y="3.25" width="13" height="9.5" rx="3.25" fill="none" stroke={frame} strokeWidth="1.7" />
        <rect x="3.2" y="6.2" width="9.6" height="3.6" rx="1.8" fill="#ffffff" />
        <rect x="6.4" y="7.35" width="3.2" height="1.3" rx="0.65" fill={circle} />
      </Box>
    </Box>
  );
};

/** Status chip */
const StatusChip: React.FC<{ status: "Connected" | "Disconnected" }> = ({ status }) => {
  const ok = status === "Connected";
  const chipBg = useColorModeValue("#f1f5f9", "#1a242f");

  return ok ? (
    <Flex align="center" gap="8px">
      <LinkBadge ok />
      <Text fontSize="sm" fontWeight="semibold" color="#22c55e">
        Connected
      </Text>
    </Flex>
  ) : (
    <Flex align="center" gap="4px" w="115px" h="24px" borderRadius="40px" p="2px 6px 2px 2px" bg={chipBg}>
      <LinkBadge ok={false} />
      <Text fontSize="sm" fontWeight="semibold" color="#ef4444">
        Disconnected
      </Text>
    </Flex>
  );
};

/** One small card */
const SmallBox: React.FC<{
  label: string;
  status: "Connected" | "Disconnected";
  amps: number;
  voltage: number;
  temperature: number;
  rackId: string;
}> = ({ label, status, amps, voltage, temperature, rackId }) => {
  const tileBg = useColorModeValue("#f1f5f9", "#242929");
  const tileBorder = useColorModeValue("#e2e8f0", "#263346");
  const innerBg = useColorModeValue("#e9eef3", "#363A3A");
  const innerBorder = useColorModeValue("#e5e7eb", "#2f3c4f");
  const labelColor = useColorModeValue("#0f172a", "gray.200");

  const navigate = useNavigate();

  return (
    <Box w="203px" h="108px" bg={tileBg} border={`1px solid ${tileBorder}`} borderRadius="8px" p="10px" display="flex" flexDir="column" gap="4px">
      <Flex align="center" justify="space-between">
        <Text
          fontWeight="bold"
          fontSize="sm"
          color={labelColor}
          cursor="pointer"
          onClick={() =>
            navigate("/batteryrackk", { state: { currentBank: rackId } })
          }
        >
          {label}
        </Text>
        <StatusChip status={status} />
      </Flex>

      {/* Show three tags: Amps, Voltage, Temperature */}
      <Box
        flex="1"
        borderRadius="6px"
        bg={innerBg}
        border={`1px solid ${innerBorder}`}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="row"
        gap="10px"
      >
          <Box textAlign="center">
            <Text fontSize="xs" color="gray.500">Amps</Text>
            <Flex align="baseline" gap="2px" justify="center">
              <Text fontSize="xs" fontWeight="bold">
                {status === "Connected" ? amps.toFixed(2) : "--"}
              </Text>
              <Text fontSize="xs" color="gray.600">A</Text>
            </Flex>
          </Box>
        <Box textAlign="center">
          <Text fontSize="xs" color="gray.500">Voltage</Text>
          <Flex align="baseline" gap="2px" justify="center">
            <Text fontSize="xs" fontWeight="bold">
              {status === "Connected" ? voltage.toFixed(2) : "--"}
            </Text>
            <Text fontSize="xs" color="gray.600">V</Text>
          </Flex>
        </Box>
        <Box textAlign="center">
          <Text fontSize="xs" color="gray.500">Temperature</Text>
          <Flex align="baseline" gap="2px" justify="center">
            <Text fontSize="xs" fontWeight="bold">
              {status === "Connected" ? temperature.toFixed(2) : "--"}
            </Text>
            <Text fontSize="xs" color="gray.600">°C</Text>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

type Props = {
  bankId?: string;
};

const StringConnectedLayout: React.FC<Props> = ({ bankId }) => {
  const cardBg = useColorModeValue("#ffffff", "#161B1B");
  const cardBorder = useColorModeValue("#e5e7eb", "#1c2635");
  const headingColor = useColorModeValue("#0f172a", "gray.300");

  const { devices } = useDevices();

  const { data, fetchData } = useTimeseriesData();

  const rackDevices = React.useMemo(() => {
    if (!devices || !bankId) return [];

    const match =
      bankId.match(/pcs_(\d+)_bank_(\d+)/);

    if (!match) return [];

    const pcsNo = match[1];
    const bankNo = match[2];

    const bankPrefix =
      `plant_1_pcs_${pcsNo}_bank_bank_${bankNo}_rack_rack_`;

    return devices.filter((d: any) =>
      d.device_id?.startsWith(bankPrefix)
    );
  }, [devices, bankId]);

  React.useEffect(() => {
    if (!rackDevices.length) return;

    fetchData({
      devices: {
        ids: rackDevices.map((d: any) => d.device_id),
        patterns: [],
      },

      keys: [
        {
          key: "voltage",
          alias: "voltage",
          keyType: "common",
        },
        {
          key: "current",
          alias: "current",
          keyType: "common",
        },
        {
          key: "avg_cell_temperature",
          alias: "temperature",
          keyType: "common",
        },
      ],

      aggregation: {
        func: "none",
        interval: 1,
        intervalType: "minute",
      },

      timeRange: {
        type: "last",
        interval: 1,
        intervalType: "minute",
      },

      orderBy: "ASC",
    } as any);
  }, [rackDevices]);

  const cards = React.useMemo(() => {
    return rackDevices.map((rack: any, index: number) => {
      const rackTs = (data as any)?.[rack.device_id] || {};

      const voltage =
        rackTs?.voltage?.[rackTs.voltage.length - 1]?.value ?? 0;

      const current =
        rackTs?.current?.[rackTs.current.length - 1]?.value ?? 0;

      const temperature =
        rackTs?.temperature?.[rackTs.temperature.length - 1]?.value ?? 0;

      return {
        label: `BK${index + 1}. S${String(index + 1).padStart(2, "0")}`,

        status: Number(voltage) > 0 ? "Connected" : "Disconnected",

        voltage,
        amps: current,
        temperature,

        rackId: rack.device_id,
      };
    });
  }, [rackDevices, data]);

  return (
    <Box w="454px" h="304px">
      <Box bg={cardBg} borderRadius="lg" p="16px" border={`1px solid ${cardBorder}`} h="100%" display="flex" flexDirection="column">
        <Heading size="sm" color={headingColor} mb="12px">
          String Connected Layout
        </Heading>

        <Box flex="1" overflowY="auto">
          <Grid templateColumns="203px 203px" autoRows="108px" gap="10px">
            {cards.map((c) => (
              <SmallBox
                key={c.rackId}
                label={c.label}
                status={c.status as any}
                amps={c.amps}
                voltage={c.voltage}
                temperature={c.temperature}
                rackId={c.rackId}
              />
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default StringConnectedLayout;
