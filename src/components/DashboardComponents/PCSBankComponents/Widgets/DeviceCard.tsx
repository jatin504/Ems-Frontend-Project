import React from "react";
import {
  Box,
  Grid,
  GridItem,
  Text,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { useDevices } from "../../../../hooks/useDevices";

const KV: React.FC<{
  k: string;
  v: string | number;
}> = ({ k, v }) => (
  <>
    <GridItem>
      <Text
        color="gray.400"
        fontSize="12px"
      >
        {k}
      </Text>
    </GridItem>

    <GridItem>
      <Text
        fontWeight="semibold"
        textAlign="right"
        fontSize="13px"
      >
        {v}
      </Text>
    </GridItem>
  </>
);

type Props = {
  bankId?: string;
};

const DeviceCard: React.FC<Props> = ({
  bankId,
}) => {
  const cardBg = useColorModeValue(
    "#ffffff",
    "#161B1B"
  );

  const cardBorder = useColorModeValue(
    "#e5e7eb",
    "#1c2635"
  );

  const headingColor = useColorModeValue(
    "#000000",
    "gray.300"
  );

  const { devices } = useDevices();

  const selectedDevice =
    React.useMemo(() => {
      if (!devices || !bankId)
        return null;

      const match =
        bankId.match(
          /pcs_(\d+)_bank_(\d+)/
        );

      if (!match) return null;

      const pcsNo = match[1];
      const bankNo = match[2];

      const actualBankId =
        `plant_1_pcs_${pcsNo}_bank_bank_${bankNo}`;

      return devices.find(
        (d: any) =>
          d.device_id === actualBankId
      );
    }, [devices, bankId]);

  return (
    <Box
      w="280px"
      h="304px"
      flex="0 0 auto"
    >
      <Box
        bg={cardBg}
        borderRadius="lg"
        p={3}
        border={`1px solid ${cardBorder}`}
        h="100%"
      >
        <Heading
          as="h3"
          size="sm"
          color={headingColor}
          mb={2}
        >
          Device
        </Heading>

        <Grid
          templateColumns="1fr auto"
          rowGap="8px"
          columnGap="12px"
          alignItems="center"
        >
          <KV
            k="Manufacturer"
            v={
              selectedDevice?.make ||
              "--"
            }
          />

          <KV
            k="Model"
            v={
              selectedDevice?.model ||
              "--"
            }
          />

          <KV
            k="PCS"
            v={
              selectedDevice?.pcs ||
              "--"
            }
          />

          <KV
            k="Plant"
            v={
              selectedDevice?.plant ||
              "--"
            }
          />

          <KV
            k="Slave ID"
            v={
              selectedDevice?.slave_id ||
              "--"
            }
          />

          <KV
            k="Server IP"
            v={
              selectedDevice?.server_ip ||
              "--"
            }
          />

          <KV
            k="Server Port"
            v={
              selectedDevice?.server_port ||
              "--"
            }
          />
        </Grid>
      </Box>
    </Box>
  );
};

export default DeviceCard;