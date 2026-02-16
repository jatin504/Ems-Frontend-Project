import {
  Box,
  Card,
  CardBody,
  Button,
  Switch,
  Input,
  Select,
  HStack,
  Text,
  Grid,
  Divider,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

export default function BidTriggerConfig() {
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.900", "white");

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "RTM" },
  ];

  return (
    <Box p={4} bg={bgColor} color={textColor} w="full">
      <Breadcrumb
        color={useColorModeValue("primaryText.light", "primaryText.dark")}
        spacing="3px"
        fontSize={"10px"}
        separator={
          <ChevronRightIcon
            height={"12px"}
            width={"12px"}
            boxSize={"4"}
            color={useColorModeValue(
              "rgba(0, 0, 0, 0.4)",
              "rgba(255, 255, 255, 0.5)"
            )}
          />
        }
      >
        {breadcrumbs.map((bc, idx) => (
          <BreadcrumbItem key={idx} isCurrentPage={!bc.href}>
            {bc.href ? (
              <BreadcrumbLink href={bc.href}>{bc.label}</BreadcrumbLink>
            ) : (
              <BreadcrumbLink fontWeight={"600"}>{bc.label}</BreadcrumbLink>
            )}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
      <Text fontSize="2xl" fontWeight="semibold" mb={4}>
        RTM Bid Trigger Configuration
      </Text>

      <Card shadow="md" borderRadius="lg" mb={4}>
        <CardBody p={4}>
          <Text fontSize="lg" fontWeight="semibold" mb={3}>
            Time-Based Triggers
          </Text>
          <Grid templateColumns="repeat(3, 1fr)" gap={3} alignItems="center" mb={3}>
            <Text fontSize="sm">Enable Session Bidding</Text>
            <Switch size="sm" />
            <Select size="sm" placeholder="Every 30 minutes">
              <option value="5">Every 5 minutes</option>
              <option value="15">Every 15 minutes</option>
              <option value="30">Every 30 minutes</option>
            </Select>
          </Grid>

          <Grid templateColumns="repeat(3, 1fr)" gap={3} alignItems="center">
            <Text fontSize="sm">Final Gate Closure Bid</Text>
            <Switch size="sm" />
            <Input size="sm" placeholder="T-5 min" />
          </Grid>
        </CardBody>
      </Card>

      <Card shadow="md" borderRadius="lg" mb={4}>
        <CardBody p={4}>
          <Text fontSize="lg" fontWeight="semibold" mb={3}>
            Market Signal Triggers
          </Text>
          <Grid templateColumns="repeat(3, 1fr)" gap={3} alignItems="center" mb={3}>
            <Text fontSize="sm">Price Spike Trigger</Text>
            <Switch size="sm" />
            <Input size="sm" placeholder=">  8 / kWh" />
          </Grid>

          <Grid templateColumns="repeat(3, 1fr)" gap={3} alignItems="center">
            <Text fontSize="sm">Volume Imbalance Trigger</Text>
            <Switch size="sm" />
            <Input size="sm" placeholder="> 10% Change" />
          </Grid>
        </CardBody>
      </Card>

      <Card shadow="md" borderRadius="lg" mb={4}>
        <CardBody p={4}>
          <Text fontSize="lg" fontWeight="semibold" mb={3}>
            Forecast & Asset Based Triggers
          </Text>
          <Grid templateColumns="repeat(3, 1fr)" gap={3} alignItems="center" mb={3}>
            <Text fontSize="sm">Renewable Forecast Adjustment</Text>
            <Switch size="sm" />
            <Input size="sm" placeholder="> 5% Forecast Change" />
          </Grid>

          <Grid templateColumns="repeat(3, 1fr)" gap={3} alignItems="center" mb={3}>
            <Text fontSize="sm">BESS SOC Threshold</Text>
            <Switch size="sm" />
            <Input size="sm" placeholder="< 20% / > 80%" />
          </Grid>

          <Grid templateColumns="repeat(3, 1fr)" gap={3} alignItems="center">
            <Text fontSize="sm">Asset Fault / Derating Event</Text>
            <Switch size="sm" />
            <Select size="sm" placeholder="Auto-Reduce Capacity">
              <option value="withdraw">Withdraw Bid</option>
              <option value="reduce">Reduce Volume</option>
            </Select>
          </Grid>
        </CardBody>
      </Card>

      <Divider my={3} />

      <HStack justify="end" gap={3}>
        <Button size="sm" variant="outline">Cancel</Button>
        <Button size="sm" colorScheme="blue">Save Configuration</Button>
      </HStack>
    </Box>
  );
}
