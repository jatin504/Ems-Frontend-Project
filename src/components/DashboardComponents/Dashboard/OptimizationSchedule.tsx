import React, { useEffect, useMemo, useState } from "react";

import {

  Box,
  Button,
  Flex,
  Text,

  Badge,

  SimpleGrid,

  VStack,

  HStack,

  Divider,

  Icon,

  Collapse,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";



import {

  FiAlertTriangle,

  FiChevronDown,

  FiChevronUp,

  FiActivity,

  FiSun,

  FiZap,

  FiBattery,

  FiArrowDown,

  FiArrowUp,

  FiGrid,

  FiDollarSign,

  FiClock,

  FiInfo,

} from "react-icons/fi";



/* =========================================================

   TYPES

\========================================================= */



interface Schedule {

  time_stamp: string;



  load_kw: number;

  pv_kw: number;

  net_load_kw: number;

  grid_import_limit_kw: number;

  tariff_per_kw: number;

  co_relation_percent: number;

  load_state: string;



  decision: string;

  charge_kw: number;

  grid_charge_kw: number;

  discharge_kw: number;

  grid_import_kw: number;

  grid_limit_violation_kw: number;



  soc_percent: number;

  battery_energy_mwh: number;

  throughput_cycles: number;



  upcoming_peak_timestamp: string | null;

  upcoming_peak_required_kw: number;



  active_peak_energy_mwh: number;

  violation_energy_mwh: number;



  risk_reserve_mwh: number;

  required_reserve_mwh: number;



  description: string;



  is_pass: boolean;

  fault: string | null;

  ems_recommendations?: string[];

  [key: string]: any;

}

interface EMSRecommendationProps {
  scheduleData?: Schedule[];
}

interface BankSocInput {
  bank: string;
  soc: string;
}

interface BankInputValues {
  banks: BankSocInput[];
  power: string;
  load: string;
}

const createEmptyBankInputs = (): BankInputValues => ({
  banks: Array.from({ length: 5 }, (_, index) => ({
    bank: `Bank ${index + 1}`,
    soc: "",
  })),
  power: "",
  load: "",
});




/* =========================================================

   DUMMY FAILED SCHEDULES

\========================================================= */



const dummyFailedSchedules: Schedule[] = [

  {

    time_stamp: "2026-09-22 14:00:00",



    load_kw: 4500,

    pv_kw: 1200,

    net_load_kw: 3300,

    grid_import_limit_kw: 3000,

    tariff_per_kw: 7.5,

    co_relation_percent: 15,

    load_state: "peak",



    decision: "discharge",

    charge_kw: 0,

    grid_charge_kw: 0,

    discharge_kw: 3000,

    grid_import_kw: 300,

    grid_limit_violation_kw: 300,



    soc_percent: 18.5,

    battery_energy_mwh: 4.2,

    throughput_cycles: 0.62,



    upcoming_peak_timestamp: "2026-09-22 15:00:00",

    upcoming_peak_required_kw: 3500,



    active_peak_energy_mwh: 4.2,

    violation_energy_mwh: 0.3,



    risk_reserve_mwh: 3.8,

    required_reserve_mwh: 5.2,



    description:

      "PV supplies 1200 kW. BESS discharges 3000 kW. Grid import reaches 300 kW above the configured grid limit.",



    is_pass: false,

    fault: "Grid import limit exceeded",

  },



  {

    time_stamp: "2026-09-22 18:15:00",



    load_kw: 2800,

    pv_kw: 0,

    net_load_kw: 2800,

    grid_import_limit_kw: 2500,

    tariff_per_kw: 6,

    co_relation_percent: 10,

    load_state: "peak",



    decision: "charge",

    charge_kw: 2500,

    grid_charge_kw: 2500,

    discharge_kw: 0,

    grid_import_kw: 2800,

    grid_limit_violation_kw: 300,



    soc_percent: 92.1,

    battery_energy_mwh: 23,

    throughput_cycles: 0.81,



    upcoming_peak_timestamp: "2026-09-22 19:00:00",

    upcoming_peak_required_kw: 0,



    active_peak_energy_mwh: 0,

    violation_energy_mwh: 0,



    risk_reserve_mwh: 5.2,

    required_reserve_mwh: 5.2,



    description:

      "Charging request cannot be safely executed because battery SOC is already above the maximum charging threshold.",



    is_pass: false,

    fault: "SOC limit exceeded",

  },



  {

    time_stamp: "2026-09-22 21:30:00",



    load_kw: 3200,

    pv_kw: 0,

    net_load_kw: 3200,

    grid_import_limit_kw: 3000,

    tariff_per_kw: 4,

    co_relation_percent: 0,

    load_state: "off_peak",



    decision: "discharge",

    charge_kw: 0,

    grid_charge_kw: 0,

    discharge_kw: 2600,

    grid_import_kw: 600,

    grid_limit_violation_kw: 0,



    soc_percent: 12.4,

    battery_energy_mwh: 3.1,

    throughput_cycles: 0.91,



    upcoming_peak_timestamp: "2026-09-23 14:00:00",

    upcoming_peak_required_kw: 4000,



    active_peak_energy_mwh: 3.1,

    violation_energy_mwh: 0,



    risk_reserve_mwh: 3.1,

    required_reserve_mwh: 5.2,



    description:

      "BESS discharge reduces grid demand, but available battery energy is below the required reserve for the upcoming peak.",



    is_pass: false,

    fault: "Required reserve not maintained",

  },

];



/* =========================================================

   HELPERS

\========================================================= */



const formatNumber = (

  value: number | undefined | null,

  digits = 0

) => {

  if (value === undefined || value === null) return "--";



  return Number(value).toLocaleString("en-IN", {

    minimumFractionDigits: digits,

    maximumFractionDigits: digits,

  });

};



const formatDate = (timestamp: string) => {

  if (!timestamp) return "--";



  const datePart = timestamp.split(" ")[0];



  const [year, month, day] = datePart.split("-");



  return `${day} ${new Date(

    Number(year),

    Number(month) - 1,

    Number(day)

  ).toLocaleString("en-US", {

    month: "short",

  })} ${year}`;

};



const formatTime = (timestamp: string) => {

  if (!timestamp) return "--";



  const timePart = timestamp.split(" ")[1] || "";



  return timePart.substring(0, 5);

};



const getFaultTitle = (item: Schedule) => {

  if (item.fault) return item.fault;



  if ((item.grid_limit_violation_kw || 0) > 0) {

    return "Grid import limit exceeded";

  }



  if (

    item.required_reserve_mwh &&

    item.risk_reserve_mwh < item.required_reserve_mwh

  ) {

    return "Required reserve not maintained";

  }



  if ((item.soc_percent || 0) > 90) {

    return "SOC limit exceeded";

  }



  return "Schedule constraint violation";

};



/* =========================================================

   COMPACT METRIC

\========================================================= */



interface MetricItemProps {

  icon: React.ElementType;

  label: string;

  value: string;

  valueColor?: string;

}



const MetricItem = ({

  icon,

  label,

  value,

  valueColor,

}: MetricItemProps) => {

  return (

    <Flex

      minW={0}

      w="100%"

      align="center"

      gap="4px"

      overflow="hidden"

    >

      <Icon

        as={icon}

        flexShrink={0}

        boxSize="12px"

        color={valueColor || "#64748B"}

      />



      <Box

        minW={0}

        overflow="hidden"

      >

        <Text

          fontSize="8px"

          color="#64748B"

          lineHeight="10px"

          whiteSpace="nowrap"

          overflow="hidden"

          textOverflow="ellipsis"

        >

          {label}

        </Text>



        <Text

          fontSize="10px"

          fontWeight="700"

          color={valueColor || "#172033"}

          lineHeight="13px"

          whiteSpace="nowrap"

          overflow="hidden"

          textOverflow="ellipsis"

        >

          {value}

        </Text>

      </Box>

    </Flex>

  );

};



/* =========================================================

   DETAIL BOX

\========================================================= */



interface DetailBoxProps {

  label: string;

  value: string;

}



const DetailBox = ({

  label,

  value,

}: DetailBoxProps) => {

  return (

    <Box

      bg="#FFFFFF"

      border="1px solid"

      borderColor="#E2E8F0"

      borderRadius="6px"

      px="7px"

      py="5px"

      minW={0}

    >

      <Text

        fontSize="8px"

        color="#64748B"

        mb="1px"

        whiteSpace="nowrap"

        overflow="hidden"

        textOverflow="ellipsis"

      >

        {label}

      </Text>



      <Text

        fontSize="10px"

        fontWeight="700"

        color="#172033"

        whiteSpace="nowrap"

        overflow="hidden"

        textOverflow="ellipsis"

      >

        {value}

      </Text>

    </Box>

  );

};



/* =========================================================

   MAIN COMPONENT

\========================================================= */



const EMS_RECOMMENDATION_API =
  (() => {
    const url = new URL(import.meta.env.VITE_API_BASE);
    url.port = import.meta.env.VITE_API_PORT;
    url.pathname = "/api/ems-recommendation";
    return url.toString();
  })();

const OptimizationSchedule: React.FC<EMSRecommendationProps> = () => {
  const [expandedIndex, setExpandedIndex] =
    useState<number | null>(0);

  const [editingScheduleKey, setEditingScheduleKey] =
    useState<string | null>(null);

  const [bankInputs, setBankInputs] =
    useState<BankInputValues>(createEmptyBankInputs);

  const [savedBankInputs, setSavedBankInputs] =
    useState<Record<string, BankInputValues>>({});

  const [apiSchedules, setApiSchedules] =
    useState<Schedule[]>([]);

  const [loading, setLoading] = useState(true);

  const [apiError, setApiError] = useState<string | null>(null);

  const cardBg = useColorModeValue(
    "#FFFFFF",
    "#1A202C"
  );

  const borderColor = useColorModeValue(
    "#E2E8F0",
    "#2D3748"
  );

  /* =======================================================
     FETCH EMS RECOMMENDATION FROM BACKEND API
  ======================================================= */

  useEffect(() => {
    let isMounted = true;

    const fetchEMSRecommendation = async () => {
      try {
        setLoading(true);
        setApiError(null);

        const response = await fetch(
          EMS_RECOMMENDATION_API,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `EMS Recommendation API failed: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();

        if (!result?.success) {
          throw new Error(
            result?.message ||
              "EMS Recommendation API returned an error"
          );
        }

        const schedules = Array.isArray(result?.schedule)
          ? result.schedule
          : [];

        if (isMounted) {
          setApiSchedules(schedules);
        }
      } catch (error) {
        console.error(
          "EMS Recommendation API Error:",
          error
        );

        if (isMounted) {
          setApiSchedules([]);
          setApiError(
            error instanceof Error
              ? error.message
              : "Failed to fetch EMS recommendations"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEMSRecommendation();

    return () => {
      isMounted = false;
    };
  }, []);

  /* =======================================================
     ONLY FAILED SCHEDULES FROM API
  ======================================================= */

  const failedSchedules = useMemo(() => {
    return apiSchedules.filter(
      (item) => item?.is_pass === false
    );
  }, [apiSchedules]);

  const failedCount = failedSchedules.length;

  const openBankInputs = (scheduleKey: string) => {
    const saved = savedBankInputs[scheduleKey];
    setBankInputs(
      saved
        ? {
            banks: saved.banks.map((bank) => ({ ...bank })),
            power: saved.power,
            load: saved.load,
          }
        : createEmptyBankInputs()
    );
    setEditingScheduleKey(scheduleKey);
  };

  const updateBankSoc = (bankIndex: number, value: string) => {
    setBankInputs((current) => ({
      ...current,
      banks: current.banks.map((bank, index) =>
        index === bankIndex ? { ...bank, soc: value } : bank
      ),
    }));
  };

  const saveBankInputs = () => {
    if (!editingScheduleKey) return;

    setSavedBankInputs((current) => ({
      ...current,
      [editingScheduleKey]: {
        banks: bankInputs.banks.map((bank) => ({ ...bank })),
        power: bankInputs.power,
        load: bankInputs.load,
      },
    }));
    setEditingScheduleKey(null);
  };

/* =======================================================

     EMPTY STATE

  ======================================================= */



  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {
    return (
      <Box
        w="100%"
        h="320px"
        bg={cardBg}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="10px"
        overflow="hidden"
        boxShadow="0 2px 8px rgba(15,23,42,0.06)"
      >
        <Flex
          h="100%"
          align="center"
          justify="center"
          direction="column"
          gap="8px"
        >
          <Icon
            as={FiActivity}
            boxSize="28px"
            color="#2563EB"
          />

          <Text
            fontSize="14px"
            fontWeight="700"
            color="#172033"
          >
            Loading EMS Recommendation
          </Text>

          <Text
            fontSize="10px"
            color="#64748B"
          >
            Fetching failed schedules from EMS backend...
          </Text>
        </Flex>
      </Box>
    );
  }

  /* =======================================================
     API ERROR STATE
  ======================================================= */

  if (apiError) {
    return (
      <Box
        w="100%"
        h="320px"
        bg={cardBg}
        border="1px solid"
        borderColor="#FECACA"
        borderRadius="10px"
        overflow="hidden"
        boxShadow="0 2px 8px rgba(15,23,42,0.06)"
      >
        <Flex
          h="100%"
          align="center"
          justify="center"
          direction="column"
          gap="6px"
          px="20px"
          textAlign="center"
        >
          <Icon
            as={FiAlertTriangle}
            boxSize="28px"
            color="#DC2626"
          />

          <Text
            fontSize="14px"
            fontWeight="700"
            color="#B91C1C"
          >
            EMS Recommendation Unavailable
          </Text>

          <Text
            fontSize="10px"
            color="#64748B"
            maxW="500px"
          >
            {apiError}
          </Text>
        </Flex>
      </Box>
    );
  }

  if (failedCount === 0) {

    return (

      <Box

        w="100%"

        h="320px"

        bg={cardBg}

        border="1px solid"

        borderColor={borderColor}

        borderRadius="10px"

        overflow="hidden"

        boxShadow="0 2px 8px rgba(15,23,42,0.06)"

      >

        <Flex

          h="100%"

          align="center"

          justify="center"

          direction="column"

          gap="5px"

        >

          <Icon

            as={FiInfo}

            boxSize="28px"

            color="#16A34A"

          />



          <Text

            fontSize="14px"

            fontWeight="700"

            color="#172033"

          >

            All Schedules Passed

          </Text>



          <Text

            fontSize="10px"

            color="#64748B"

          >

            No EMS recommendation is required.

          </Text>

        </Flex>

      </Box>

    );

  }



  return (

    <Box

      w="100%"

      h="320px"

      minW={0}

      position="relative"

      bg={cardBg}

      border="1px solid"

      borderColor={borderColor}

      borderRadius="10px"

      overflow="hidden"

      boxShadow="0 2px 8px rgba(15,23,42,0.06)"

    >

      {/* ===================================================

          HEADER

      =================================================== */}



      <Flex

        h="66px"

        px="12px"

        align="center"

        justify="space-between"

        borderBottom="1px solid"

        borderColor="#E2E8F0"

        minW={0}

      >

        <HStack

          spacing="10px"

          minW={0}

        >

          <Flex

            w="38px"

            h="38px"

            minW="38px"

            borderRadius="9px"

            bg="#FFF1F2"

            align="center"

            justify="center"

          >

            <Icon

              as={FiActivity}

              boxSize="19px"

              color="#DC2626"

            />

          </Flex>



          <VStack

            align="flex-start"

            spacing={0}

            minW={0}

          >

            <Text

              fontSize="15px"

              fontWeight="700"

              color="#172033"

              lineHeight="19px"

              whiteSpace="nowrap"

            >

              EMS Recommendation

            </Text>



            <Text

              fontSize="9px"

              color="#64748B"

              lineHeight="13px"

              whiteSpace="nowrap"

            >

              Schedules which did not pass the constraints

            </Text>

          </VStack>

        </HStack>



        <Badge

          flexShrink={0}

          px="9px"

          py="6px"

          borderRadius="7px"

          bg="#FFF1F2"

          color="#DC2626"

          fontSize="9px"

          fontWeight="700"

          display="flex"

          alignItems="center"

          gap="4px"

        >

          <Icon

            as={FiAlertTriangle}

            boxSize="11px"

          />



          {failedCount} FAILED SCHEDULE

          {failedCount !== 1 ? "S" : ""}

        </Badge>

      </Flex>



      {/* ===================================================

          SCROLL AREA

      =================================================== */}



      <Box

        h="254px"

        overflowY="auto"

        overflowX="hidden"

        px="9px"

        py="8px"

        minW={0}

        sx={{

          "&::-webkit-scrollbar": {

            width: "4px",

          },

          "&::-webkit-scrollbar-track": {

            background: "#F8FAFC",

          },

          "&::-webkit-scrollbar-thumb": {

            background: "#CBD5E1",

            borderRadius: "10px",

          },

        }}

      >

        <VStack

          spacing="7px"

          align="stretch"

          minW={0}

        >

          {failedSchedules.map((item, index) => {

            const isExpanded =

              expandedIndex === index;



            const violation =

              Number(

                item.grid_limit_violation_kw || 0

              ) > 0;



            const reserveViolation =

              Number(item.risk_reserve_mwh || 0) <

              Number(

                item.required_reserve_mwh || 0

              );



            const socViolation =

              Number(item.soc_percent || 0) > 90;



            const scheduleKey = `${item.time_stamp}-${index}`;

            return (
              <React.Fragment key={scheduleKey}>
                <Button
                  alignSelf="flex-start"
                  size="xs"
                  colorScheme="blue"
                  variant={savedBankInputs[scheduleKey] ? "solid" : "outline"}
                  onClick={() => openBankInputs(scheduleKey)}
                >
                  {savedBankInputs[scheduleKey]
                    ? "Edit Bank Inputs"
                    : "Enter Bank Inputs"}
                </Button>

                <Box
                  w="100%"
                  minW={0}
                  border="1px solid"
                  borderColor="#E2E8F0"
                  borderRadius="8px"
                  bg="#FFFFFF"
                  overflow="hidden"
                >

                {/* =========================================

                    MAIN CONTENT

                ========================================= */}



                <Flex

                  w="100%"

                  minW={0}

                  minH="120px"

                  align="stretch"

                >

                  {/* =======================================

                      TIME

                  ======================================= */}



                  <Flex

                    w="110px"

                    minW="110px"

                    bg="#FFF5F5"

                    direction="column"

                    align="center"

                    justify="center"

                    borderRight="1px solid"

                    borderColor="#FEE2E2"

                    px="5px"

                  >

                    <Icon

                      as={FiAlertTriangle}

                      boxSize="17px"

                      color="#DC2626"

                      mb="3px"

                    />



                    <Text

                      fontSize="7px"

                      fontWeight="700"

                      color="#DC2626"

                      textTransform="uppercase"

                      whiteSpace="nowrap"

                    >

                      SCHEDULE NOT PASSED

                    </Text>



                    <Text

                      fontSize="25px"

                      fontWeight="800"

                      color="#B91C1C"

                      lineHeight="28px"

                      mt="2px"

                    >

                      {formatTime(

                        item.time_stamp

                      )}

                    </Text>



                    <Text

                      fontSize="8px"

                      color="#64748B"

                      mt="2px"

                      whiteSpace="nowrap"

                    >

                      {formatDate(

                        item.time_stamp

                      )}

                    </Text>

                  </Flex>



                  {/* =======================================

                      CENTER

                  ======================================= */}



                  <Box

                    flex="1"

                    minW={0}

                    px="9px"

                    py="9px"

                    overflow="hidden"

                  >

                    {/* TOP METRICS */}



                    <SimpleGrid

                      columns={3}

                      spacingX="9px"

                      spacingY="8px"

                      minW={0}

                    >

                      <MetricItem

                        icon={FiActivity}

                        label="Load"

                        value={`${formatNumber(

                          item.load_kw

                        )} kW`}

                      />



                      <MetricItem

                        icon={FiSun}

                        label="PV"

                        value={`${formatNumber(

                          item.pv_kw

                        )} kW`}

                        valueColor="#15803D"

                      />



                      <MetricItem

                        icon={FiZap}

                        label="Net Load"

                        value={`${formatNumber(

                          item.net_load_kw

                        )} kW`}

                      />



                      <MetricItem

                        icon={FiGrid}

                        label="Grid Limit"

                        value={`${formatNumber(

                          item.grid_import_limit_kw

                        )} kW`}

                        valueColor="#2563EB"

                      />



                      <MetricItem

                        icon={FiDollarSign}

                        label="Tariff"

                        value={`₹${formatNumber(

                          item.tariff_per_kw,

                          1

                        )}/kW`}

                        valueColor="#D97706"

                      />



                      <VStack

                        spacing={0}

                        align="flex-start"

                        minW={0}

                      >

                        <Text

                          fontSize="8px"

                          color="#64748B"

                          lineHeight="10px"

                        >

                          Load State

                        </Text>



                        <Badge

                          mt="2px"

                          px="7px"

                          py="3px"

                          borderRadius="5px"

                          fontSize="7px"

                          bg={

                            item.load_state ===

                            "peak"

                              ? "#FFE4E6"

                              : "#E0F2FE"

                          }

                          color={

                            item.load_state ===

                            "peak"

                              ? "#DC2626"

                              : "#0369A1"

                          }

                        >

                          {item.load_state ||

                            "--"}

                        </Badge>

                      </VStack>

                    </SimpleGrid>



                    <Divider

                      borderColor="#EDF2F7"

                      my="8px"

                    />



                    {/* BOTTOM METRICS */}



                    <SimpleGrid

                      columns={3}

                      spacingX="9px"

                      spacingY="7px"

                      minW={0}

                    >

                      <VStack

                        spacing={1}

                        align="flex-start"

                        minW={0}

                      >

                        <Text

                          fontSize="8px"

                          color="#64748B"

                          lineHeight="10px"

                        >

                          Decision

                        </Text>



                        <Badge

                          px="7px"

                          py="3px"

                          borderRadius="5px"

                          fontSize="7px"

                          bg={

                            item.decision ===

                            "charge"

                              ? "#E0F2FE"

                              : "#FFE4E6"

                          }

                          color={

                            item.decision ===

                            "charge"

                              ? "#2563EB"

                              : "#DC2626"

                          }

                        >

                          {item.decision ||

                            "--"}

                        </Badge>

                      </VStack>



                      <MetricItem

                        icon={FiArrowDown}

                        label="Charge"

                        value={`${formatNumber(

                          item.charge_kw

                        )} kW`}

                        valueColor="#16A34A"

                      />



                      <MetricItem

                        icon={FiArrowUp}

                        label="Discharge"

                        value={`${formatNumber(

                          item.discharge_kw

                        )} kW`}

                        valueColor="#EA580C"

                      />



                      <MetricItem

                        icon={FiGrid}

                        label="Grid Import"

                        value={`${formatNumber(

                          item.grid_import_kw

                        )} kW`}

                        valueColor="#7C3AED"

                      />



                      <MetricItem

                        icon={FiBattery}

                        label="SOC"

                        value={`${formatNumber(

                          item.soc_percent,

                          1

                        )}%`}

                        valueColor={

                          socViolation

                            ? "#DC2626"

                            : "#15803D"

                        }

                      />



                      <MetricItem

                        icon={FiBattery}

                        label="Battery"

                        value={`${formatNumber(

                          item.battery_energy_mwh,

                          1

                        )} MWh`}

                        valueColor="#475569"

                      />

                    </SimpleGrid>

                    </Box>



                  {/* =======================================
                      RIGHT RECOMMENDATION
                  ======================================= */}

                  <Box
                    w="235px"
                    minW="235px"
                    maxW="235px"
                    bg="#FFFFFF"
                    borderLeft="1px solid"
                    borderColor="#E2E8F0"
                    px="9px"
                    py="9px"
                    overflow="hidden"
                  >
                    <Box
                      bg="#EFF6FF"
                      borderRadius="7px"
                      px="8px"
                      py="7px"
                      mb="7px"
                    >
                      <HStack spacing="6px" align="flex-start">
                        <Flex
                          w="19px"
                          h="19px"
                          minW="19px"
                          borderRadius="50%"
                          bg="#2563EB"
                          align="center"
                          justify="center"
                        >
                          <Icon as={FiInfo} color="white" boxSize="10px" />
                        </Flex>

                        <VStack align="flex-start" spacing="1px" minW={0}>
                          <Text
                            fontSize="9px"
                            fontWeight="800"
                            color="#1D4ED8"
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            maxW="175px"
                          >
                            EMS Recommendation
                          </Text>
                          <Text fontSize="8px" color="#475569" lineHeight="11px">
                            Recommended actions for this schedule
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>

                    <Text fontSize="8px" fontWeight="700" color="#172033" mb="5px">
                      Recommendations
                    </Text>

                    <VStack
                      align="stretch"
                      spacing="5px"
                      maxH="145px"
                      overflowY="auto"
                      sx={{
                        "&::-webkit-scrollbar": { width: "3px" },
                        "&::-webkit-scrollbar-track": { background: "#F8FAFC" },
                        "&::-webkit-scrollbar-thumb": {
                          background: "#CBD5E1",
                          borderRadius: "10px",
                        },
                      }}
                    >
                      {Array.isArray(item.ems_recommendations) &&
                      item.ems_recommendations.length > 0 ? (
                        item.ems_recommendations.map(
                          (recommendation, recommendationIndex) => (
                            <Flex
                              key={`${item.time_stamp}-recommendation-${recommendationIndex}`}
                              align="flex-start"
                              gap="6px"
                              bg="#F8FAFC"
                              border="1px solid"
                              borderColor="#E2E8F0"
                              borderRadius="6px"
                              px="7px"
                              py="6px"
                            >
                              <Flex
                                w="17px"
                                h="17px"
                                minW="17px"
                                borderRadius="50%"
                                bg="#DBEAFE"
                                align="center"
                                justify="center"
                                mt="1px"
                              >
                                <Text fontSize="8px" fontWeight="800" color="#2563EB">
                                  {recommendationIndex + 1}
                                </Text>
                              </Flex>
                              <Text fontSize="8px" color="#334155" lineHeight="11px" noOfLines={3}>
                                {recommendation}
                              </Text>
                            </Flex>
                          )
                        )
                      ) : (
                        <Box
                          bg="#F8FAFC"
                          border="1px solid"
                          borderColor="#E2E8F0"
                          borderRadius="6px"
                          px="7px"
                          py="8px"
                        >
                          <Text fontSize="8px" color="#64748B" lineHeight="11px">
                            No EMS recommendation available.
                          </Text>
                        </Box>
                      )}
                    </VStack>

                    {item.fault && (
                      <Box mt="8px">
                        <Text fontSize="8px" fontWeight="700" color="#172033" mb="3px">
                          Reason
                        </Text>
                        <Box
                          bg="#FFF7ED"
                          border="1px solid"
                          borderColor="#FED7AA"
                          borderRadius="6px"
                          px="7px"
                          py="6px"
                        >
                          <Text fontSize="8px" color="#C2410C" lineHeight="11px" noOfLines={2}>
                            {item.fault}
                          </Text>
                        </Box>
                      </Box>
                    )}

                    <Box mt="8px">
                      <Text fontSize="8px" fontWeight="700" color="#172033" mb="2px">
                        Description
                      </Text>
                      <Text fontSize="8px" color="#64748B" lineHeight="11px" noOfLines={3}>
                        {item.description || "--"}
                      </Text>
                    </Box>
                  </Box>
                </Flex>

                {/* =========================================

                    EXPANDED DETAILS

                ========================================= */}



                <Collapse

                  in={isExpanded}

                  animateOpacity

                >

                  <Box

                    px="9px"

                    py="9px"

                    bg="#F8FAFC"

                    borderTop="1px solid"

                    borderColor="#E2E8F0"

                  >

                    <SimpleGrid

                      columns={{

                        base: 2,

                        md: 4,

                      }}

                      spacing="7px"

                    >

                      <DetailBox

                        label="Net Load"

                        value={`${formatNumber(

                          item.net_load_kw

                        )} kW`}

                      />



                      <DetailBox

                        label="Grid Import"

                        value={`${formatNumber(

                          item.grid_import_kw

                        )} kW`}

                      />



                      <DetailBox

                        label="Grid Violation"

                        value={`${formatNumber(

                          item.grid_limit_violation_kw

                        )} kW`}

                      />



                      <DetailBox

                        label="Grid Charge"

                        value={`${formatNumber(

                          item.grid_charge_kw

                        )} kW`}

                      />



                      <DetailBox

                        label="SOC"

                        value={`${formatNumber(

                          item.soc_percent,

                          2

                        )}%`}

                      />



                      <DetailBox

                        label="Battery Energy"

                        value={`${formatNumber(

                          item.battery_energy_mwh,

                          3

                        )} MWh`}

                      />



                      <DetailBox

                        label="Risk Reserve"

                        value={`${formatNumber(

                          item.risk_reserve_mwh,

                          2

                        )} MWh`}

                      />



                      <DetailBox

                        label="Required Reserve"

                        value={`${formatNumber(

                          item.required_reserve_mwh,

                          2

                        )} MWh`}

                      />



                      <DetailBox

                        label="Active Peak Energy"

                        value={`${formatNumber(

                          item.active_peak_energy_mwh,

                          2

                        )} MWh`}

                      />



                      <DetailBox

                        label="Violation Energy"

                        value={`${formatNumber(

                          item.violation_energy_mwh,

                          2

                        )} MWh`}

                      />



                      <DetailBox

                        label="Throughput Cycles"

                        value={formatNumber(

                          item.throughput_cycles,

                          4

                        )}

                      />



                      <DetailBox

                        label="Correlation"

                        value={`${formatNumber(

                          item.co_relation_percent,

                          1

                        )}%`}

                      />

                    </SimpleGrid>



                    <Flex

                      mt="8px"

                      align="flex-start"

                      gap="6px"

                    >

                      <Icon

                        as={FiClock}

                        color="#64748B"

                        boxSize="11px"

                        mt="1px"

                        flexShrink={0}

                      />



                      <Text

                        fontSize="8px"

                        color="#475569"

                        lineHeight="12px"

                      >

                        Upcoming Peak:{" "}

                        <b>

                          {item.upcoming_peak_timestamp ||

                            "No upcoming peak"}

                        </b>

                        {" | "}

                        Required Power:{" "}

                        <b>

                          {formatNumber(

                            item.upcoming_peak_required_kw

                          )}{" "}

                          kW

                        </b>

                      </Text>

                    </Flex>

                  </Box>

                </Collapse>
              </Box>
              </React.Fragment>
            );

          })}

        </VStack>

      </Box>

      {editingScheduleKey && (
        <Flex
          position="absolute"
          inset={0}
          zIndex={10}
          align="center"
          justify="center"
          bg="blackAlpha.500"
          p={3}
        >
          <Box
            w="100%"
            maxH="100%"
            overflowY="auto"
            bg={cardBg}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="10px"
            p={3}
            boxShadow="lg"
          >
            <Flex justify="space-between" align="center" mb={3}>
              <Text fontSize="sm" fontWeight="700" color="#172033">
                BESS Bank Inputs
              </Text>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => setEditingScheduleKey(null)}
                aria-label="Close bank inputs"
              >
                Close
              </Button>
            </Flex>

            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2} mb={3}>
              <Input
                size="sm"
                type="number"
                placeholder="BESS Power (kW)"
                aria-label="BESS power"
                value={bankInputs.power}
                onChange={(event) =>
                  setBankInputs((current) => ({
                    ...current,
                    power: event.target.value,
                  }))
                }
              />
              <Input
                size="sm"
                type="number"
                placeholder="Load (kW)"
                aria-label="Load"
                value={bankInputs.load}
                onChange={(event) =>
                  setBankInputs((current) => ({
                    ...current,
                    load: event.target.value,
                  }))
                }
              />
            </SimpleGrid>

            <VStack align="stretch" spacing={2}>
              {bankInputs.banks.map((bank, bankIndex) => (
                <SimpleGrid
                  key={bank.bank}
                  columns={{ base: 1, sm: 2 }}
                  spacing={2}
                  alignItems="center"
                  p={2}
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="md"
                >
                  <Text fontSize="xs" fontWeight="700">
                    {bank.bank}
                  </Text>
                  <Input
                    size="sm"
                    type="number"
                    min={0}
                    max={100}
                    placeholder="SOC (%)"
                    aria-label={`${bank.bank} SOC`}
                    value={bank.soc}
                    onChange={(event) =>
                      updateBankSoc(bankIndex, event.target.value)
                    }
                  />
                </SimpleGrid>
              ))}
            </VStack>

            <Flex justify="flex-end" mt={3}>
              <Button size="sm" colorScheme="blue" onClick={saveBankInputs}>
                Save
              </Button>
            </Flex>
          </Box>
        </Flex>
      )}

    </Box>

  );

};



export default OptimizationSchedule;