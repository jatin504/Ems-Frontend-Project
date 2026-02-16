import React, { useState } from "react";
import {
  Box,
  Heading,
  Table,
  Tbody,
  Tr,
  Td,
  Text,
  useColorModeValue,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import SplineGraph from "../../../../components/Graphs/RevampCharts/SplineGraph";
import GraphLayout from "../../../../components/Layouts/WidgetsLayout/GraphsLayout/GraphLayout";

type ModuleRow = {
  id: string;
  maxTemp: string;
  maxVolt: string;
  current: string;
  volt: string;
};

const rows: ModuleRow[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `S02.M${String(i + 1).padStart(2, "0")}`,
  maxTemp: `${(28 + Math.random() * 2.5).toFixed(2)} °C  Max.`,
  maxVolt: `${(3.75 + Math.random() * 0.15).toFixed(2)} V  Max.`,
  current: `${(15 + Math.random() * 25).toFixed(2)} Current`,
  volt: `${(400 + Math.random() * 50).toFixed(2)} Volt`,
}));

export default function ModulesTable() {
  const cardBg = useColorModeValue("#ffffff", "#161B1B");
  const cardBorder = useColorModeValue("#e5e7eb", "#1c2635");
  const headingColor = useColorModeValue("#0f172a", "gray.300");
  const textColor = useColorModeValue("#0f172a", "gray.300");
  const zebra = useColorModeValue("#f8fafc", "#FFFFFF0F");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");

  const openChartModal = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    onOpen();
  };

  // Generate dummy chart data
  const getChartSeriesData = () => {
    const now = Date.now();
    const data: any[] = [];

    // Generate 24 hours of dummy data
    for (let i = 0; i < 24; i++) {
      const timestamp = now - (23 - i) * 3600000;
      data.push({
        timestamp,
        currentValue: 15 + Math.random() * 25,
        voltValue: 400 + Math.random() * 50,
      });
    }

    return [
      {
        name: "Current",
        data: data.map((d) => [d.timestamp, d.currentValue]),
        color: "#3182ce",
      },
      {
        name: "Volt",
        data: data.map((d) => [d.timestamp, d.voltValue]),
        color: "#ed8936",
      },
    ];
  };

  return (
    <Box
      bg={cardBg}
      borderRadius="12px"
      p={4}
      border={`1px solid ${cardBorder}`}
      w="1220px"
      h="534px"
      opacity={1}
    >
      <Heading as="h3" size="sm" color={headingColor} mb={3}>
        Modules
      </Heading>

      <Box
        overflowX="auto"
        maxWidth="100%"
        maxHeight="470px"
        overflowY="auto"
        sx={{
          scrollbarWidth: "thin",
          scrollbarColor: `${cardBorder} #e5e7eb`,
          '&::-webkit-scrollbar': {
            height: '8px',
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: cardBorder,
            borderRadius: '4px',
          },
        }}
      >
        <Table size="sm" variant="simple" minWidth="900px" style={{maxWidth: '100%'}} sx={{
          "td:not(:last-child), th:not(:last-child)": {
            borderRight: `1px solid ${cardBorder}`,
          },
        }}>
          <Tbody color={textColor}>
            {rows.map((m, idx) => (
              <Tr key={m.id} bg={idx % 2 === 0 ? zebra : undefined}>
                <Td fontWeight="semibold" color={textColor}>
                  {m.id}
                </Td>
                <Td color={textColor}>{m.maxTemp}</Td>
                <Td color={textColor}>{m.maxVolt}</Td>
                <Td color={textColor}>{m.current}</Td>
                <Td color={textColor}>{m.volt}</Td>
                <Td>
                  <IconButton
                    aria-label="View chart"
                    icon={<BsThreeDots />}
                    size="sm"
                    variant="ghost"
                    onClick={() => openChartModal(m.id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Modal for viewing chart */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent bg={cardBg} maxW="90vw" _hover={{ bg: cardBg }}>
          <ModalHeader color={textColor} _hover={{ color: textColor }}>
            Parameters Chart - {selectedModuleId}
          </ModalHeader>
          <ModalCloseButton color={textColor} _hover={{ color: textColor }} />
          <ModalBody pb={6}>
            <GraphLayout
              title={`Chart - ${selectedModuleId}`}
              width="100%"
              height="600px"
              bg={cardBg}
              fullScreen={true}
              downloadOption={true}
              timeWindow={false}
            >
              <SplineGraph
                apiData={getChartSeriesData()}
                height={450}
                bg={cardBg}
                legendHeight={60}
                props={{
                  legend: {
                    align: 'center',
                    verticalAlign: 'bottom',
                    floating: false,
                    layout: 'horizontal',
                    useHTML: true,
                    itemStyle: { fontSize: '13px', fontWeight: '500' },
                    symbolPadding: 8,
                    x: 0,
                    y: 0,
                  },
                  plotOptions: {
                    series: {
                      marker: {
                        enabled: true,
                        radius: 4,
                        lineWidth: 0,
                        fillOpacity: 1,
                      },
                      states: {
                        hover: {
                          enabled: true,
                          marker: {
                            enabled: true,
                            radius: 4,
                            lineWidth: 0,
                            fillOpacity: 1,
                          },
                          lineWidth: 2,
                          lineWidthPlus: 0,
                          halo: { size: 0 },
                        },
                        inactive: {
                          opacity: 0.2,
                        },
                      },
                    },
                    spline: {
                      states: {
                        hover: {
                          lineWidth: 2,
                          lineWidthPlus: 0,
                          shadow: false,
                        },
                      },
                    },
                  },
                }}
              />
            </GraphLayout>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
