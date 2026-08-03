import {
    Box,
    VStack,
    HStack,
    Text,
    Circle,
    useColorModeValue,
} from "@chakra-ui/react";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import { useDevices } from "../hooks/useDevices";

import useTimeseriesData from "../hooks/useTimeseriesData";

import OutgoingTopCards from "../components/DashboardComponents/MeterComponents/DetailComponents/OutgoingTopCards.tsx";
import OutgoingPowerTrend from "../components/DashboardComponents/MeterComponents/DetailComponents/OutgoingPowerTrend.tsx";
import PowerQualitySummary from "../components/DashboardComponents/MeterComponents/DetailComponents/PowerQualitySummary.tsx";
import RealTimeParameters from "../components/DashboardComponents/MeterComponents/DetailComponents/RealTimeParameters.tsx";
import WaveformChart from "../components/DashboardComponents/MeterComponents/DetailComponents/WaveformChart.tsx";
import HarmonicsVoltage from "../components/DashboardComponents/MeterComponents/DetailComponents/HarmonicsVoltage.tsx";
import HarmonicsCurrent from "../components/DashboardComponents/MeterComponents/DetailComponents/HarmonicsCurrent.tsx";
import TodaySummary from "../components/DashboardComponents/MeterComponents/DetailComponents/TodaySummary.tsx";
import StatusAlarms from "../components/DashboardComponents/MeterComponents/DetailComponents/StatusAlarms.tsx";
import MeterInformation from "../components/DashboardComponents/MeterComponents/DetailComponents/MeterInformation.tsx";
import ElectricalParametersDashboard from "../components/DashboardComponents/MeterComponents/ElectricParameter/ElectricalParametersDashboard.tsx";
import PhasorDiagramDashboard from "../components/DashboardComponents/MeterComponents/PhasorDiagram/PhasorDiagramDashboard";
import EnergyDashboard from "../components/DashboardComponents/MeterComponents/EnergyComponent/EnergyDashboard";

type Props = {};

const tabs = [
    "Overview",
    "Electrical Parameters",
    "Power Quality",
    "Phasor Diagram",
    "Energy",
    "Events & Alarms",
];

const LTMeterDashboard = ({ }: Props) => {

    const {
        devices,
        loading,
    } = useDevices();

    const [
        selectedMeter,
        setSelectedMeter,
    ] = useState("");

    const [activeTab, setActiveTab] = useState("Overview");

    /* ================= STATUS API ================= */

    const {
        data: statusData,
        fetchData: fetchStatusData,
    } = useTimeseriesData();

    const meterOptions =
        useMemo(() => {

            if (!devices)
                return [];

            return devices
                .filter((d: any) =>
                    d.device_id
                        ?.toLowerCase()
                        .includes("lt_meter")
                )
                .map((d: any) => {

                    return {

                        id:
                            d.device_id,

                        label:
                            d.device_id
                                ?.split("plant_1_ht")
                                ?.pop()
                                ?.replace(/^_/, "") ||
                            d.device_id,

                    };

                });

        }, [devices]);

    useEffect(() => {

        if (
            !selectedMeter &&
            meterOptions.length > 0
        ) {

            setSelectedMeter(
                meterOptions[0].id
            );

        }

    }, [
        meterOptions,
        selectedMeter,
    ]);

    /* ================= STATUS FETCH ================= */

    useEffect(() => {

        if (!selectedMeter)
            return;

        const fetchMeterStatus =
            () => {

                fetchStatusData({

                    devices: {
                        patterns: [],
                        ids: [
                            selectedMeter,
                        ],
                    },

                    keys: [

                        {
                            key:
                                "total_active_power",

                            alias:
                                "total_active_power",

                            keyType:
                                "timeseries",
                        },

                    ],

                    aggregation: {
                        func: "none",
                        interval: 1,
                        intervalType:
                            "minute",
                    },

                    timeRange: {
                        type:
                            "relative",

                        relativeType:
                            "currentDaySoFar",
                    },

                    orderBy:
                        "ASC",

                } as any);

            };

        fetchMeterStatus();

        const interval =
            setInterval(() => {

                fetchMeterStatus();

            }, 60000);

        return () =>
            clearInterval(
                interval
            );

    }, [selectedMeter]);

    /* ================= STATUS MAPPING ================= */

    const meterDeviceData =
        (statusData as any)?.[
        selectedMeter
        ];

    const meterMappedData =
        useMemo(() => {

            if (
                !meterDeviceData
            ) {

                return {

                    activePower: 0,

                    lastTs: 0,

                };

            }

            const powerArr =
                meterDeviceData[
                "total_active_power"
                ];

            const latestPoint =
                powerArr &&
                    powerArr.length > 0
                    ? powerArr[
                    powerArr.length - 1
                    ]
                    : null;

            const latestValue =
                latestPoint?.value;

            const activePower =
                latestValue === null ||
                latestValue === undefined ||
                latestValue === ""
                    ? null
                    : Number(latestValue);

            const lastTs =
                latestPoint
                    ? latestPoint.ts
                    : 0;

            return {

                activePower,

                lastTs,

            };

        }, [
            meterDeviceData,
        ]);

    /* ================= STATUS LOGIC ================= */

    const now = Date.now();

    let meterStatus =
        "STOP";

    let statusColor =
        "#EF4444";

    if (
        !meterMappedData.lastTs ||
        now -
        meterMappedData.lastTs >
        4 * 60 * 1000 ||
        meterMappedData.activePower === null
    ) {

        meterStatus =
            "NON-COMM";

        statusColor =
            "#F59E0B";

    } else if (
        meterMappedData.activePower >
        0
    ) {

        meterStatus =
            "ONLINE";

        statusColor =
            "#22C55E";

    } else {

        meterStatus =
            "STOP";

        statusColor =
            "#EF4444";

    }

    /* ================= COLORS ================= */

    const selectTextColor =
        useColorModeValue(
            "#1A202C",
            "#d7e4ff"
        );

    const selectBorderColor =
        useColorModeValue(
            "#16365f",
            "#16365f"
        );

    const bg =
        useColorModeValue(
            "#f3f7fb",
            "primary.dark"
        );

    const cardBg =
        useColorModeValue(
            "#ffffff",
            "primary.dark"
        );

    const borderColor =
        useColorModeValue(
            "#d9e2f0",
            "#16365f"
        );

    const textColor =
        useColorModeValue(
            "#1A202C",
            "#d7e4ff"
        );


    return (

        <Box
            w="100%"
            minH="100vh"
            bg={bg}
        >

            <VStack
                spacing="12px"
                align="stretch"
            >

                {/* HEADER */}

                <Box
                    bg={cardBg}
                    border={`1px solid ${borderColor}`}
                    borderRadius="10px"
                    p="12px 16px"
                >

                    <HStack
                        justify="space-between"
                        align="center"
                    >

                        <VStack
                            align="start"
                            spacing="2px"
                        >

                            <HStack spacing="10px">

                                <Text
                                    fontSize="26px"
                                    fontWeight="700"
                                    color={textColor}
                                >
                                    {selectedMeter
                                        ?.split("plant_1_ht_")
                                        ?.pop()
                                        ?.replaceAll("_", "-")}
                                </Text>
                                <HStack
                                    bg={
                                        meterStatus === "ONLINE"
                                            ? useColorModeValue(
                                                "#ecfdf3",
                                                "rgba(0,208,132,0.15)"
                                            )
                                            : meterStatus === "NON-COMM"
                                                ? useColorModeValue(
                                                    "#fff7ed",
                                                    "rgba(245,158,11,0.15)"
                                                )
                                                : useColorModeValue(
                                                    "#fef2f2",
                                                    "rgba(239,68,68,0.15)"
                                                )
                                    }
                                    px="10px"
                                    py="2px"
                                    borderRadius="4px"
                                >

                                    <Circle size="8px" bg={statusColor} />

                                    <Text fontSize="12px" color={statusColor} fontWeight="600">
                                        {meterStatus}
                                    </Text>

                                </HStack>

                            </HStack>

                        </VStack>

                        <HStack
                            spacing="8px"
                        >



                            {meterOptions.length >
                                0 && (

                                    <HStack
                                        spacing="10px"
                                    >

                                        <Text
                                            fontSize="13px"
                                            fontWeight="600"
                                            color={useColorModeValue(
                                                "#1A202C",
                                                "#d7e4ff"
                                            )}
                                        >
                                            Select Meter
                                        </Text>

                                        <select
                                            style={{
                                                width: 220,
                                                height: 34,
                                                borderRadius: 6,
                                                padding:
                                                    "0 10px",
                                                fontSize: 13,
                                                background:
                                                    "transparent",
                                                color:
                                                    selectTextColor,
                                                border:
                                                    `1px solid ${selectBorderColor}`,
                                            }}

                                            value={
                                                selectedMeter
                                            }

                                            disabled={
                                                loading
                                            }

                                            onChange={(
                                                e
                                            ) =>
                                                setSelectedMeter(
                                                    e.target
                                                        .value
                                                )
                                            }
                                        >

                                            {meterOptions.map(
                                                (
                                                    opt: any
                                                ) => (

                                                    <option
                                                        key={opt.id}
                                                        value={opt.id}
                                                    >
                                                        {opt.label}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </HStack>

                                )}

                        </HStack>

                    </HStack>

                </Box>

                {/* TOP CARDS */}

                <OutgoingTopCards
                    selectedMeter={
                        selectedMeter
                    }
                />

                {/* TABS */}

                <HStack
                    spacing="0"
                    bg={cardBg}
                    border={`1px solid ${borderColor}`}
                    borderRadius="8px"
                    overflow="hidden"
                >

                    {tabs.map(
                        (
                            tab,
                            index
                        ) => (

                            <Box
                                key={index}
                                px="18px"
                                py="10px"
                                cursor="pointer"
                                onClick={() => setActiveTab(tab)}
                                borderRight={
                                    index !==
                                        tabs.length -
                                        1
                                        ? `1px solid ${borderColor}`
                                        : "none"
                                }

                                bg={
                                    activeTab === tab
                                        ? useColorModeValue("#edf2f7", "#102a43")
                                        : "transparent"
                                }
                            >

                                <Text
                                    fontSize="13px"
                                    fontWeight={
                                        activeTab === tab
                                            ? "600"
                                            : "500"
                                    }
                                    color={
                                        textColor
                                    }
                                >
                                    {tab}
                                </Text>

                            </Box>

                        )
                    )}

                </HStack>

                {activeTab === "Overview" && (
                    <>
                        {/* ROW 1 */}

                        <HStack
                            spacing="12px"
                            align="stretch"
                            w="100%"
                        >

                            <Box w="30%">
                                <RealTimeParameters
                                    selectedMeter={
                                        selectedMeter
                                    }
                                />
                            </Box>

                            <Box w="37%" mt="-16px">
                                <OutgoingPowerTrend
                                    selectedMeter={
                                        selectedMeter
                                    }
                                />
                            </Box>

                            <Box w="33%">
                                <PowerQualitySummary />
                            </Box>

                        </HStack>

                        {/* ROW 2 */}

                        <HStack
                            spacing="12px"
                            align="stretch"
                            w="100%"
                        >

                            <Box w="33.33%"
                            mt="-20px">
                                <WaveformChart selectedMeter={selectedMeter} />
                            </Box>

                            <Box
                                w="33.33%"
                                mt="-20px"
                            >
                                <HarmonicsVoltage
                                    selectedMeter={
                                        selectedMeter
                                    }
                                />
                            </Box>

                            <Box
                                w="33.33%"
                                mt="-20px"
                            >
                                <HarmonicsCurrent
                                    selectedMeter={
                                        selectedMeter
                                    }
                                />
                            </Box>

                        </HStack>

                        {/* ROW 3 */}

                        <HStack
                            spacing="12px"
                            align="stretch"
                            w="100%"
                        >

                            <Box w="35%">
                                <TodaySummary
                                    selectedMeter={
                                        selectedMeter
                                    }
                                />
                            </Box>

                            <Box w="33.33%">
                                <StatusAlarms />
                            </Box>

                            <Box w="33.33%">
                                <MeterInformation selectedMeter={selectedMeter} />
                            </Box>

                        </HStack>
                    </>
                )}

                {activeTab === "Electrical Parameters" && (
                    <Box w="100%">
                        <ElectricalParametersDashboard selectedMeter={selectedMeter} />
                    </Box>
                )}

                {activeTab === "Phasor Diagram" && (
                    <Box w="100%">
                        <PhasorDiagramDashboard />
                    </Box>
                )}

                {activeTab === "Energy" && (
                    <Box w="100%">
                        <EnergyDashboard selectedMeter={selectedMeter} />
                    </Box>
                )}

            </VStack>

        </Box>

    );

};

export default LTMeterDashboard;
