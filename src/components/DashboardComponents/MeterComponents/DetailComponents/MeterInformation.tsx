import {
  Box,
  Grid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import CommonCard from "./CommonCard";

import { useDevices } from "../../../../hooks/useDevices";

type Props = {
  selectedMeter?: string;
};

const MeterInformation = ({
  selectedMeter,
}: Props) => {

  const {
    devices,
  } = useDevices();

  /* ================= SELECTED DEVICE ================= */

  const selectedDevice =
    devices?.find(
      (d: any) =>
        d.device_id ===
        selectedMeter
    );

  /* ================= COLORS ================= */

  const textColor =
    useColorModeValue(
      "#0f172a",
      "#e8f0ff"
    );

  const labelColor =
    useColorModeValue(
      "#64748b",
      "#8ea6c9"
    );

  const borderColor =
    useColorModeValue(
      "#dbe4f0",
      "#14345d"
    );

  const cardBg =
    useColorModeValue(
      "#ffffff",
      "primary.dark"
    );

  return (

    <CommonCard
      bg={cardBg}
      p="16px"
      borderRadius="12px"
      fontFamily="Poppins"
    >

      {/* TITLE */}

      <Text
        fontSize="13px"
        fontWeight="700"
        color={textColor}
        mb="14px"
        fontFamily="Poppins"
      >
        Meter Information
      </Text>

      {/* BODY */}

      <Box
        borderTop={`1px solid ${borderColor}`}
        pt="14px"
      >

        <Grid
          templateColumns="1fr 1fr 1fr 1fr"
          rowGap="14px"
          columnGap="22px"
        >

          {/* ROW 1 */}

          <Text
            fontSize="11px"
            color={labelColor}
            fontWeight="500"
          >
            Meter Make
          </Text>

          <Text
            fontSize="12px"
            color={textColor}
            fontWeight="700"
          >
            {selectedDevice?.make ||
              "--"}
          </Text>

          <Text
            fontSize="11px"
            color={labelColor}
            fontWeight="500"
          >
            Meter Model
          </Text>

          <Text
            fontSize="12px"
            color={textColor}
            fontWeight="700"
          >
            {selectedDevice?.model ||
              "--"}
          </Text>

          {/* ROW 2 */}

          <Text
            fontSize="11px"
            color={labelColor}
            fontWeight="500"
          >
            Slave ID
          </Text>

          <Text
            fontSize="12px"
            color={textColor}
            fontWeight="700"
          >
            {selectedDevice?.slave_id ||
              "--"}
          </Text>

          <Text
            fontSize="11px"
            color={labelColor}
            fontWeight="500"
          >
            Function
          </Text>

          <Text
            fontSize="12px"
            color={textColor}
            fontWeight="700"
          >
            {selectedDevice?.function ||
              "--"}
          </Text>

          {/* ROW 3 */}

          <Text
            fontSize="11px"
            color={labelColor}
            fontWeight="500"
          >
            Server IP
          </Text>

          <Text
            fontSize="12px"
            color={textColor}
            fontWeight="700"
          >
            {selectedDevice?.server_ip ||
              "--"}
          </Text>

          <Text
            fontSize="11px"
            color={labelColor}
            fontWeight="500"
          >
            Server Port
          </Text>

          <Text
            fontSize="12px"
            color={textColor}
            fontWeight="700"
          >
            {selectedDevice?.server_port ||
              "--"}
          </Text>

          {/* ROW 4 */}

          <Text
            fontSize="11px"
            color={labelColor}
            fontWeight="500"
          >
            Device Type
          </Text>

          <Text
            fontSize="12px"
            color={textColor}
            fontWeight="700"
          >
            {selectedDevice?.deviceType ||
              "--"}
          </Text>

          <Text
            fontSize="11px"
            color={labelColor}
            fontWeight="500"
          >
            Device ID
          </Text>

          <Text
            fontSize="12px"
            color={textColor}
            fontWeight="700"
            wordBreak="break-all"
          >
            {selectedDevice?.device_id ||
              "--"}
          </Text>

        </Grid>

      </Box>

    </CommonCard>

  );

};

export default MeterInformation;