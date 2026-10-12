import React, { useEffect, useState } from "react";

import {

  Box,

  Button,

  Flex,

  Text,

  Badge,

  SimpleGrid,

  VStack,

  HStack,

  Icon,

  Collapse,

  Input,

  useColorModeValue,

} from "@chakra-ui/react";

import {

  FiAlertTriangle,

FiActivity,

  FiChevronDown,

  FiChevronUp,

  FiClock,

  FiInfo,

} from "react-icons/fi";

/* =========================================================

   TYPES

\\========================================================= */

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

  event_id?: string;

  [key: string]: any;

}

interface EMSRecommendationProps {

  scheduleData?: Schedule[];

}

interface EMSApiResult {
  bess_event_decision: { active_peak_energy_mwh:number; battery_energy_mwh:number; charge_kw:number; co_relation_percent:number; decision:string; description:string; discharge_kw:number; event_id?:string; grid_charge_kw:number; grid_import_kw:number; grid_import_limit_kw:number; grid_limit_violation_kw:number; load_kw:number; load_state:string; net_load_kw:number; pv_kw:number; required_reserve_mwh:number; risk_reserve_mwh:number; soc_percent:number; tariff_per_kw:number; throughput_cycles:number; time_stamp:string; upcoming_peak_required_kw:number; upcoming_peak_timestamp:string|null; violation_energy_mwh:number; };
  description:string; event_id?:string; fault:string|null; is_pass:boolean;
  strategy_result?: Array<{ battery_energy_mwh:number; decision:string; discharge_kw:number; soc:number; timestamp:string; grid_power_kw?:number; remaining_excess_kw?:number; status?:string; target_battery_energy_mwh?:number; target_soc_percent?:number; }>;
}
interface EMSApiResponse { count:number; results:EMSApiResult[]; success:boolean; }

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

\\========================================================= */

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

  const datePart = timestamp.includes("T") ? timestamp.split("T")[0] : timestamp.split(" ")[0];

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

  const timePart = timestamp.includes("T") ? timestamp.split("T")[1] || "" : timestamp.split(" ")[1] || "";

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

   DETAIL BOX

\\========================================================= */

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

\\========================================================= */

const OptimizationSchedule: React.FC<EMSRecommendationProps> = () => {

  const [expandedIndex, setExpandedIndex] =

    useState<number | null>(0);

  const [editingScheduleKey, setEditingScheduleKey] =

    useState<string | null>(null);

  const [bankInputs, setBankInputs] =

    useState<BankInputValues>(createEmptyBankInputs);

  const [savedBankInputs, setSavedBankInputs] =

    useState<Record<string, BankInputValues>>({});

  const cardBg = useColorModeValue(

    "#FFFFFF",

    "#1A202C"

  );

  const borderColor = useColorModeValue(

    "#E2E8F0",

    "#2D3748"

  );
  const textColor = useColorModeValue("#172033", "gray.100");

  /* =======================================================

     DUMMY FAILED SCHEDULES

  ======================================================= */

  const [scheduleData, setScheduleData] = useState<Schedule[]>([]);
  const [apiFailedCount, setApiFailedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEMSRecommendation = async () => {
      try {
        setApiError(null);
        const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/ems-recommendation`, { method: "GET", headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error(`EMS Recommendation API failed: ${response.status} ${response.statusText}`);
        const data: EMSApiResponse = await response.json();
        if (!data.success || !Array.isArray(data.results)) throw new Error("Invalid EMS Recommendation API response");
        setApiFailedCount(data.count);
        const mappedSchedules: Schedule[] = data.results.map((result) => {
          const d = result.bess_event_decision;
          return { time_stamp:d.time_stamp, load_kw:d.load_kw, pv_kw:d.pv_kw, net_load_kw:d.net_load_kw, grid_import_limit_kw:d.grid_import_limit_kw, tariff_per_kw:d.tariff_per_kw, co_relation_percent:d.co_relation_percent, load_state:d.load_state, decision:d.decision, charge_kw:d.charge_kw, grid_charge_kw:d.grid_charge_kw, discharge_kw:d.discharge_kw, grid_import_kw:d.grid_import_kw, grid_limit_violation_kw:d.grid_limit_violation_kw, soc_percent:d.soc_percent, battery_energy_mwh:d.battery_energy_mwh, throughput_cycles:d.throughput_cycles, upcoming_peak_timestamp:d.upcoming_peak_timestamp, upcoming_peak_required_kw:d.upcoming_peak_required_kw, active_peak_energy_mwh:d.active_peak_energy_mwh, violation_energy_mwh:d.violation_energy_mwh, risk_reserve_mwh:d.risk_reserve_mwh, required_reserve_mwh:d.required_reserve_mwh, description:result.description || d.description || "--", is_pass:result.is_pass, fault:result.fault, ems_recommendations:result.description || d.description ? [result.description || d.description] : [], event_id:result.event_id || d.event_id || "", strategy_result:result.strategy_result || [] };
        });
        setScheduleData(mappedSchedules);
      } catch (error) {
        console.error("EMS Recommendation API Error:", error);
        setApiError(error instanceof Error ? error.message : "Failed to fetch EMS recommendation");
        setScheduleData([]);
      } finally { setLoading(false); }
    };
    fetchEMSRecommendation();
    const interval = setInterval(fetchEMSRecommendation, 15_000);
    return () => clearInterval(interval);
  }, []);

  const failedSchedules = scheduleData;
  const failedCount = apiFailedCount;

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

  if (loading) {
    return (
      <Box
        w="100%"
        h="400px"
        minH="400px"
        bg={cardBg}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="10px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="14px" fontWeight="700" color={textColor}>
          Loading EMS Recommendation...
        </Text>
      </Box>
    );
  }

  if (apiError) {
    return (<Box w="100%" h="400px" minH="400px" bg={cardBg} border="1px solid" borderColor={borderColor} borderRadius="10px" display="flex" alignItems="center" justifyContent="center" px={4}><VStack spacing={2}><Icon as={FiAlertTriangle} boxSize="22px" color="#DC2626" /><Text fontSize="13px" fontWeight="700" color="#B91C1C" textAlign="center">Failed to load EMS Recommendation</Text><Text fontSize="10px" color="#64748B" textAlign="center">{apiError}</Text></VStack></Box>);
  }

  if (failedCount === 0) {
    return (
      <Box
        w="100%"
        h="400px"
        minH="400px"
        minW={0}
        bg={cardBg}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="10px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        px={4}
        boxShadow="0 2px 8px rgba(15,23,42,0.06)"
      >
        <Icon as={FiActivity} boxSize="28px" color="#94A3B8" mb={3} />

        <Text
          fontSize="14px"
          fontWeight="700"
          color={useColorModeValue("#172033", "gray.100")}
        >
          No Failed Schedules
        </Text>

        <Text
          fontSize="11px"
          color={useColorModeValue("#64748B", "gray.400")}
          mt={1}
        >
          All schedules are passing or no failed schedules are available.
        </Text>
      </Box>
    );
  }



  return (

    <Box

      w="100%"

      h="400px"
      minW={0}
      position="relative"
      display="flex"
      flexDirection="column"
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
        flexShrink={0}
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

        flex="1"
        minH={0}
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

                {/* <Button
                  alignSelf="flex-start"
                  size="xs"
                  colorScheme="blue"

                  variant={savedBankInputs[scheduleKey] ? "solid" : "outline"}

                  onClick={() => openBankInputs(scheduleKey)}

                >

                  {savedBankInputs[scheduleKey]

                    ? "Edit Bank Inputs"
                    : "Enter Bank Inputs"}
                </Button> */}

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

                    <Text
                      fontSize="8px"
                      fontWeight="700"
                      color="#64748B"
                      mb="3px"
                      whiteSpace="nowrap"
                    >
                      {item.event_id || "--"}
                    </Text>
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

                      FAULT

                  ======================================= */}

                  <Box

                    w="20%"

                    minW="160px"

                    maxW="20%"

                    flex="0 0 20%"

                    order={3}

                    px="10px"

                    py="10px"

                    overflow="hidden"

                    borderLeft="1px solid"

                    borderColor="#E2E8F0"

                    bg="#FCFDFE"

                  >

                    <Text fontSize="12px" fontWeight="700" color="#9A3412" mb="6px">

                      Fault

                    </Text>

                    <Box
                      bg="#FFF7ED"
                      border="1px solid"
                      borderColor="#FED7AA"

                      borderRadius="6px"

                      px="10px"

                      py="9px"

                    >

                      <Text fontSize="10px" color="#C2410C" lineHeight="14px">

                        {item.fault || getFaultTitle(item)}
                      </Text>
                    </Box>
                    <Box mt="12px">
                      <Text
                        fontSize="10px"
                        fontWeight="700"
                        color="#172033"
                        mb="4px"
                      >
                        Description
                      </Text>
                      <Text
                        fontSize="10px"
                        color="#475569"
                        lineHeight="15px"
                        noOfLines={4}
                      >
                        {item.description || "--"}
                      </Text>
                    </Box>
                  </Box>



                  {/* =======================================

                      CENTER RECOMMENDATION

                  ======================================= */}

                  <Box

                    flex="1"

                    minW={0}

                    w="auto"

                    maxW="none"

                    order={2}

                    bg="#FFFFFF"

                    borderRight="1px solid"

                    borderColor="#E2E8F0"

                    px="14px"

                    py="12px"

                    overflow="hidden"

                    display="flex"

                    flexDirection="column"

                  >

                    <Box

                      bg="#EFF6FF"

                      borderRadius="9px"

                      px="8px"

                      py="4px"

                      mb="5px"

                      border="1px solid"

                      borderColor="#DBEAFE"

                    >

                      <HStack spacing="6px" align="flex-start">

                        <Flex

                          w="15px"

                          h="15px"

                          minW="15px"

                          borderRadius="50%"

                          bg="#2563EB"

                          align="center"

                          justify="center"

                        >

                          <Icon as={FiInfo} color="white" boxSize="8px" />

                        </Flex>

                        <VStack align="flex-start" spacing="1px" minW={0}>

                          <Text

                            fontSize="14px"

                            fontWeight="800"

                            color="#1D4ED8"

                            whiteSpace="nowrap"

                            overflow="hidden"

                            textOverflow="ellipsis"

                            maxW="220px"

                          >

                            EMS Recommendation

                          </Text>

                          <Text fontSize="9px" color="#475569" lineHeight="12px">

                            Recommended actions for this schedule

                          </Text>

                        </VStack>

                      </HStack>

                    </Box>

                    <Text

                      fontSize="11px"

                      fontWeight="700"

                      color="#172033"

                      mb="6px"

                    >

                      Recommendations

                    </Text>

                    <VStack

                      align="stretch"

                      spacing="7px"

                      maxH="175px"

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

                              px="10px"

                              py="9px"

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

                              <Text

                                fontSize="10px"

                                color="#334155"

                                lineHeight="14px"

                                noOfLines={3}

                              >

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

                  </Box>

                </Flex>

                <Flex
                  justify="flex-end"
                  px="9px"
                  py="3px"
                  borderTop="1px solid"
                  borderColor="#E2E8F0"
                >
                  <Button
                    size="xs"
                    variant="ghost"
                    color="#2563EB"
                    rightIcon={
                      <Icon
                        as={isExpanded ? FiChevronUp : FiChevronDown}
                      />
                    }
                    aria-expanded={isExpanded}
                    aria-controls={`schedule-details-${index}`}
                    onClick={() =>
                      setExpandedIndex((current) =>
                        current === index ? null : index
                      )
                    }
                  >
                    {isExpanded ? "Hide details" : "Show details"}
                  </Button>
                </Flex>

                {/* =========================================

                    EXPANDED DETAILS

                ========================================= */}

                <Collapse

                  in={isExpanded}

                  animateOpacity

                >

                  <Box
                    id={`schedule-details-${index}`}

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