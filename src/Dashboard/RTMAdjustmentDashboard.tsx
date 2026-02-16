import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardBody,
  Button,
  Select,
  Input,
  VStack,
  HStack,
  Text,
  Grid,
  Alert,
  AlertIcon,
  Badge,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { ChevronRightIcon, LockIcon, TimeIcon, WarningIcon, CheckCircleIcon, NotAllowedIcon, ViewIcon } from "@chakra-ui/icons";
import { useMarketBids } from "../hooks/useMarketBids";

// Generate blocks from 1 to 96 (typical day-ahead market blocks)
const blocks = Array.from({ length: 96 }, (_, i) => i + 1);

const pcsList = ["PCS-1", "PCS-2", "PCS-3"];

export default function RTMAdjustmentDashboard() {
  /* GLOBAL STATE  */
  const [selectedBlock, setSelectedBlock] = useState(45);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [countdown, setCountdown] = useState(45);
  const [forceMajeure, setForceMajeure] = useState(false);

  /*  API HOOK */
  const { marketBids, loading: loadingBids, error: apiError } = useMarketBids(selectedDate);

  /*  DERIVED VALUES  */

  const availableBlocks = [...new Set(marketBids.map(bid => bid.block_no))].sort((a, b) => a - b);

  /* DAM STATE */
  const [damApproved, setDamApproved] = useState(false);

  /*  RTM STATE  */
  const [rtmDelta, setRtmDelta] = useState(0.0);
  const [ackStatus, setAckStatus] = useState<"IDLE" | "ACK" | "FAIL">("IDLE");

  /*  ASSET STATE  */
  const [soc] = useState(58);
  const [cycleBudget] = useState({ used: 0.7, limit: 1.0 });
  const [actualMW] = useState(0.95);

  /*  SLDC STATE  */
  const [sldcOverride, setSldcOverride] = useState(false);

  /*  AUDIT STATE  */
  const [auditLog, setAuditLog] = useState<string[]>([]);

  /*  PCS STATE  */
  const [pcsAllocation, setPcsAllocation] = useState({
    "PCS-1": 0.3,
    "PCS-2": 0.35,
    "PCS-3": 0.35,
  });

  /*  DERIVED VALUES  */

  const damMW = marketBids.reduce(
    (sum, bid) => sum + Number(bid.quantity_mw || 0),
    0
  );

  const maxPositiveDelta = 0.6;
  const maxNegativeDelta = -0.6;

  const deltaInvalid = rtmDelta > maxPositiveDelta || rtmDelta < maxNegativeDelta;
  const netSchedule = damMW + rtmDelta;
  const deviation = actualMW - netSchedule;

  const tradingLocked = forceMajeure || countdown === 0 || sldcOverride;

  /*  STYLES  */

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.900", "white");

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "RTM Adjustment" },
  ];

  /*  TIMER  */

  useEffect(() => {
    const timer = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 60000);
    return () => clearInterval(timer);
  }, []);

  /* Update selected block if not available */
  useEffect(() => {
    if (availableBlocks.length > 0 && !availableBlocks.includes(selectedBlock)) {
      setSelectedBlock(availableBlocks[0]);
    }
  }, [availableBlocks]);

  /*  ACTIONS  */

  const submitRTMBid = () => {
    setAuditLog((l) => [...l, `RTM bid submitted for Block ${selectedBlock}`]);
    setTimeout(() => {
      const ok = Math.random() > 0.25;
      setAckStatus(ok ? "ACK" : "FAIL");
      setAuditLog((l) => [...l, ok ? "Exchange ACK received" : "Exchange ACK failed"]);
    }, 1200);
  };

  const approveDAM = () => {
    setDamApproved(true);
    setAuditLog((l) => [...l, `DAM schedule approved for Block ${selectedBlock}`]);
  };

  return (
    <Box p={4} bg={bgColor} color={textColor} w="full">
      {/* Header */}
      <VStack align="start" spacing={2} mb={4}>
        <Breadcrumb
          spacing="3px"
          fontSize="10px"
          separator={<ChevronRightIcon boxSize={4} />}
        >
          {breadcrumbs.map((bc, idx) => (
            <BreadcrumbItem key={idx} isCurrentPage={!bc.href}>
              {bc.href ? (
                <BreadcrumbLink href={bc.href}>{bc.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbLink fontWeight="600">{bc.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          ))}
        </Breadcrumb>

        <HStack justify="space-between" w="full">
          <VStack align="start" spacing={1}>
            <Text fontSize="2xl" fontWeight="semibold">
              RTM Adjustment Configuration
            </Text>
            <Text fontSize="sm" color="gray.500">
              Real-time market bid adjustments and optimization
            </Text>
          </VStack>
          <Badge colorScheme="blue">Active</Badge>
        </HStack>
      </VStack>

      {/* API Error */}
      {apiError && (
        <Alert status="error" mb={4} borderRadius="lg">
          <AlertIcon />
          {apiError}
        </Alert>
      )}

      {/* Force Majeure */}
      {forceMajeure && (
        <Alert status="error" borderRadius="lg" mb={4}>
          <AlertIcon />
          Force Majeure Active — Trading Suspended
        </Alert>
      )}

      {/* Header Controls */}
      <HStack spacing={3} mb={4} wrap="wrap">
        <VStack align="start" spacing={1}>
          <Text fontSize="xs" fontWeight="medium">Block</Text>
          <Select
            size="sm"
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(Number(e.target.value))}
            maxW="100px"
          >
            {availableBlocks.map((block) => (
              <option key={block} value={block}>
                Block {block}
              </option>
            ))}
          </Select>
        </VStack>

        <VStack align="start" spacing={1}>
          <Text fontSize="xs" fontWeight="medium">Trade Date</Text>
          <Input
            size="sm"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            maxW="150px"
          />
        </VStack>

        <HStack spacing={2}>
          <TimeIcon />
          <Text fontSize="sm">RTM Gate: {countdown} min</Text>
        </HStack>

        <Button size="sm" variant="outline" onClick={() => setForceMajeure((v) => !v)}>
          Toggle Force Majeure
        </Button>

        <Button size="sm" variant="outline" onClick={() => setSldcOverride((v) => !v)}>
          Toggle SLDC Override
        </Button>
      </HStack>

      {/* DAM + RTM */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4} mb={4}>
        <Card shadow="md" borderRadius="lg">
          <CardBody p={4}>
            <VStack align="start" spacing={3}>
              <HStack justify="space-between" w="full">
                <Text fontSize="lg" fontWeight="semibold">DAM Schedule</Text>
                <LockIcon />
              </HStack>

              {loadingBids ? (
                <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                  Loading...
                </Text>
              ) : (
                <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                  {damMW.toFixed(2)} MW
                </Text>
              )}

              <Text fontSize="xs" color="gray.500">
                {marketBids.length} bids for {selectedDate}
              </Text>

              {!damApproved ? (
                <Button size="sm" onClick={approveDAM} borderRadius="lg" colorScheme="blue">
                  Approve DAM
                </Button>
              ) : (
                <HStack spacing={2}>
                  <CheckCircleIcon color="green.500" />
                  <Text color="green.500" fontSize="sm">DAM Approved</Text>
                </HStack>
              )}
            </VStack>
          </CardBody>
        </Card>

        <Card shadow="md" borderRadius="lg">
          <CardBody p={4}>
            <VStack align="start" spacing={3}>
              <Text fontSize="lg" fontWeight="semibold">RTM Adjustment (Δ)</Text>
              <Input
                size="sm"
                type="number"
                step="0.05"
                isDisabled={tradingLocked || !damApproved}
                value={rtmDelta}
                onChange={(e) => setRtmDelta(parseFloat(e.target.value))}
                borderRadius="lg"
              />
              <Text fontSize="xs" color="gray.500">Allowed: {maxNegativeDelta} to +{maxPositiveDelta} MW</Text>
              {deltaInvalid && (
                <HStack spacing={2}>
                  <WarningIcon color="red.500" />
                  <Text color="red.500" fontSize="sm">Delta exceeds limit</Text>
                </HStack>
              )}
              {ackStatus === "ACK" && (
                <HStack spacing={2}>
                  <CheckCircleIcon color="green.500" />
                  <Text color="green.500" fontSize="sm">ACK Received</Text>
                </HStack>
              )}
              {ackStatus === "FAIL" && (
                <HStack spacing={2}>
                  <NotAllowedIcon color="red.500" />
                  <Text color="red.500" fontSize="sm">ACK Failed — Market Disabled</Text>
                </HStack>
              )}
              <Button
                size="sm"
                isDisabled={deltaInvalid || tradingLocked || !damApproved}
                onClick={submitRTMBid}
                borderRadius="lg"
                w="full"
                colorScheme="blue"
              >
                Submit RTM
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Grid>

      {/* DSM & Asset */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} mb={4}>
        <Card>
          <CardBody p={3}>
            <HStack spacing={2}>
              <ViewIcon />
              <Text fontSize="sm">Deviation: {deviation.toFixed(2)} MW</Text>
            </HStack>
          </CardBody>
        </Card>
        <Card>
          <CardBody p={3}>
            <Text fontSize="sm">SoC: {soc}% | Cycles: {cycleBudget.used}/{cycleBudget.limit}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody p={3}>
            <Text fontSize="sm">SLDC Override: {sldcOverride ? "ACTIVE" : "NONE"}</Text>
          </CardBody>
        </Card>
      </Grid>

      {/* PCS Allocation */}
      <Card mb={4}>
        <CardBody p={3}>
          <VStack align="start" spacing={3}>
            <Text fontSize="sm" fontWeight="semibold">PCS Allocation</Text>
            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={3}>
              {pcsList.map((pcs) => (
                <VStack key={pcs} border="1px" borderColor="gray.200" borderRadius="lg" p={2} align="start">
                  <Text fontSize="xs" fontWeight="medium">{pcs}</Text>
                  <Input
                    size="sm"
                    type="number"
                    step="0.05"
                    isDisabled={tradingLocked}
                    value={pcsAllocation[pcs as keyof typeof pcsAllocation]}
                    onChange={(e) => setPcsAllocation({ ...pcsAllocation, [pcs]: parseFloat(e.target.value) })}
                    borderRadius="lg"
                  />
                </VStack>
              ))}
            </Grid>
          </VStack>
        </CardBody>
      </Card>

      {/* Audit Log */}
      <Card>
        <CardBody p={3}>
          <VStack align="start" spacing={2}>
            <HStack spacing={2}>
              <Text fontSize="sm" fontWeight="semibold">Audit Log</Text>
            </HStack>
            <VStack align="start" spacing={1} mt={2}>
              {auditLog.map((l, i) => <Text key={i} fontSize="xs">• {l}</Text>)}
            </VStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Market Bids */}
      <Card mt={4}>
        <CardBody p={3}>
          <VStack align="start" spacing={3}>
            <Text fontSize="sm" fontWeight="semibold">
              Market Bids ({marketBids.length})
            </Text>

            {marketBids.length > 0 ? (
              <VStack align="start" spacing={2} w="full">
                {marketBids.map((bid) => (
                  <HStack
                    key={bid.id}
                    justify="space-between"
                    w="full"
                    p={2}
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    fontSize="sm"
                  >
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="medium">
                        Block {bid.block_no} ({bid.start_time} - {bid.end_time})
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {bid.market} • {bid.direction} • {bid.entity}
                      </Text>
                    </VStack>

                    <VStack align="end" spacing={1}>
                      <Text fontWeight="bold">
                        {bid.quantity_mw} MW @ ₹{bid.price_rs_per_kwh}
                      </Text>
                      <Badge
                        colorScheme={
                          bid.status === "PLANNED" ? "blue" :
                          bid.status === "APPROVED" ? "green" : "gray"
                        }
                        fontSize="xs"
                      >
                        {bid.status}
                      </Badge>
                    </VStack>
                  </HStack>
                ))}
              </VStack>
            ) : (
              <Text fontSize="sm" color="gray.500">
                No market bids found for {selectedDate}
              </Text>
            )}
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
