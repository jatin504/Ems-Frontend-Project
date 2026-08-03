import {
  Box,
  Flex,
  Text,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Circle,
  Button,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

import {
  useEffect,
  useMemo,
} from "react";

import useTimeseriesData from "../../../hooks/useTimeseriesData";

const AuxiliaryMeters = () => {

  const {
    isOpen,
    onOpen,
    onClose,
  } = useDisclosure();

  /* ================= API ================= */

  const {
    data,
    fetchData,
  } = useTimeseriesData();

  useEffect(() => {

    fetchData({

      devices: {

        patterns: [
          "_auxilary_meter_",
        ],

        ids: [],

      },

      keys: [

        {
          key:
            "total_active_power",

          alias:
            "Power",

          keyType:
            "common",
        },

        {
          key:
            "daily_active_energy_export",

          alias:
            "Energy",

          keyType:
            "common",
        },

      ],

      aggregation: {
        func: "none",
        interval: 1,
        intervalType:
          "minute",
      },

      timeRange: {
        type: "last",
        interval: 1,
        intervalType:
          "hour",
      },

      orderBy:
        "DESC",

    } as any);

  }, []);

  /* ================= MAP DATA ================= */

  const rows =
    useMemo(() => {

      if (
        !data ||
        typeof data !==
          "object"
      ) {

        return [];

      }

      return Object.entries(
        data
      ).map(
        (
          [
            deviceId,
            deviceData,
          ]: any,
          index
        ) => {

          const power =
            Number(
              deviceData?.Power?.[0]
                ?.value || 0
            );

          const energy =
            Number(
              deviceData
                ?.Energy?.[0]
                ?.value || 0
            );

          const ts =
            deviceData?.Power?.[0]
              ?.ts || 0;

          const now =
            Date.now();

          let status =
            "STOP";

          let statusColor =
            "#EF4444";

          /* ================= STATUS LOGIC ================= */

          if (
            !ts ||
            now - ts >
              4 *
                60 *
                1000
          ) {

            status =
              "NON-COMM";

            statusColor =
              "#F59E0B";

          } else if (
            power !== 0
          ) {

            status =
              "ONLINE";

            statusColor =
              "#22C55E";

          } else {

            status =
              "STOP";

            statusColor =
              "#EF4444";

          }

          return {

            meterName:
  `Meter-${index + 1}`,

location:
  String(deviceId)
    .replace("plant_1_ht_", "")
    .replaceAll("_", "-"),

            power:
              power.toFixed(
                2
              ),

            energy:
              energy.toFixed(
                2
              ),

            status,

            statusColor,

          };

        }
      );

    }, [data]);

  /* ================= TOTAL ================= */

  const totals =
    useMemo(() => {

      let totalPower =
        0;

      let totalEnergy =
        0;

      rows.forEach(
        (r: any) => {

          totalPower +=
            Number(
              r.power
            );

          totalEnergy +=
            Number(
              r.energy
            );

        }
      );

      return {

        power:
          totalPower.toFixed(
            2
          ),

        energy:
          totalEnergy.toFixed(
            2
          ),

      };

    }, [rows]);

  /* ================= COLORS ================= */

  const cardBg =
    useColorModeValue(
      "linear-gradient(180deg,#ffffff,#f8fbff)",
      "primary.dark"
    );

  const borderClr =
    useColorModeValue(
      "#dbe7f3",
      "#16365f"
    );

  const titleColor =
    useColorModeValue(
      "#1A202C",
      "#d9e6ff"
    );

  const tdMuted =
    useColorModeValue(
      "#475569",
      "#c4d5ec"
    );

  /* ================= TABLE ================= */

  const renderTable = (omitTotals?: boolean) => (

    <Table
  size="sm"
  tableLayout="fixed"
  width="100%"
>

      <Thead>

        <Tr>

          <Th
            width="22%"
            color={useColorModeValue("#334155", "#8fb6e8")}
          >
            Meter Name
          </Th>

          <Th
            width="26%"
            color={useColorModeValue("#334155", "#8fb6e8")}
          >
            Location
          </Th>

          <Th
            width="16%"
            color={useColorModeValue("#334155", "#8fb6e8")}
          >
            Power
          </Th>

          <Th
            width="18%"
            color={useColorModeValue("#334155", "#8fb6e8")}
          >
            Energy
          </Th>

          <Th
            width="18%"
            color={useColorModeValue("#334155", "#8fb6e8")}
          >
            Status
          </Th>

        </Tr>

      </Thead>

      <Tbody>

        {rows.map((row: any, i) => {

          // show only last segment of location id
          const shortLocation = String(row.location || row.location === 0 ? row.location : "").split("_").pop() || row.location;

          return (

            <Tr key={i}>

                <Td width="22%" color={useColorModeValue("#1A202C", "white")}>
                  {row.meterName}
                </Td>

                <Td width="26%" color={tdMuted}>{shortLocation}</Td>

                <Td width="16%" color={useColorModeValue("#1A202C", "white")}>{row.power}</Td>

                <Td width="18%" color={useColorModeValue("#1A202C", "white")}>{row.energy}</Td>

                <Td width="18%">

                <Flex align="center" gap="8px">

                  <Circle size="10px" bg={row.statusColor} />

                  <Text fontSize="12px" color={row.statusColor} fontWeight="600">
                    {row.status}
                  </Text>

                </Flex>

              </Td>

            </Tr>

          );

        })}

        {!omitTotals && (
          <Tr>

            <Td color={useColorModeValue("#1A202C", "white")} fontWeight="700">
              Total
            </Td>

            <Td />

            <Td color={useColorModeValue("#1A202C", "white")} fontWeight="700">
              {totals.power}
            </Td>

            <Td color={useColorModeValue("#1A202C", "white")} fontWeight="700">
              {totals.energy}
            </Td>

            <Td />

          </Tr>
        )}

      </Tbody>

    </Table>

  );

  /* ================= RENDER ================= */

  return (

    <>

      <Box
        bg={cardBg}
        border={`1px solid ${borderClr}`}
        borderRadius="10px"
        p="10px"
        h="280px"
        display="flex"
        flexDirection="column"
      >

        <Flex
          justify="space-between"
          align="center"
          mb="10px"
          flex="0 0 auto"
        >

          <Text
            color={titleColor}
            fontWeight="700"
            fontSize="15px"
          >
            Auxiliary Meters
          </Text>

          <Button
            size="xs"
            onClick={onOpen}
            bg={useColorModeValue(
              "#eef5ff",
              "primary.dark"
            )}

            color={useColorModeValue(
              "#1A202C",
              "white"
            )}

            _hover={{
              bg:
                useColorModeValue(
                  "#e6f0ff",
                  "primary.dark"
                ),
            }}
          >
            View All
          </Button>

        </Flex>

        <Box flex="1 1 auto" overflowY="auto">
          {renderTable(true)}
        </Box>

        <Box mt="8px" flex="0 0 auto">

          <Table
            size="sm"
            tableLayout="fixed"
            width="100%"
          >

            <Tbody>

              <Tr>

                <Td
                  width="22%"
                  color={useColorModeValue(
                    "#1A202C",
                    "white"
                  )}
                  fontWeight="700"
                >
                  Total
                </Td>

                <Td width="26%" />

                <Td
                  width="16%"
                  color={useColorModeValue(
                    "#1A202C",
                    "white"
                  )}
                  fontWeight="700"
                >
                  {totals.power}
                </Td>

                <Td
                  width="18%"
                  color={useColorModeValue(
                    "#1A202C",
                    "white"
                  )}
                  fontWeight="700"
                >
                  {totals.energy}
                </Td>

                <Td width="18%" />

              </Tr>

            </Tbody>

          </Table>

        </Box>

      </Box>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="full"
      >

        <ModalOverlay />

        <ModalContent
          bg={cardBg}
        >

          <ModalHeader>
            AUXILIARY
            METERS
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>

            {renderTable()}

          </ModalBody>

        </ModalContent>

      </Modal>

    </>

  );

};

export default AuxiliaryMeters;