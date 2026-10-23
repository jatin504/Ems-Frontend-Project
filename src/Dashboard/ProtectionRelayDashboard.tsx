import {
  Box,
  Grid,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Input,
  HStack,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import RelayDashboard from "./RelayDashboardBox";
import { useState } from "react";

export default function ProtectionRelayDashboard() {
  const bg = useColorModeValue("#FFFFFF", "#0E1111");
  const crumbColor = useColorModeValue("#4A5568", "#CBD5E0");
  const crumbActiveColor = useColorModeValue("#1A202C", "#F1F5F9");

  //  UNIQUE RELAY NAMES (search friendly)
  const [relays] = useState([
    { id: "REF615-1", name: "REF615 Relay-1" },
    { id: "REF615-2", name: "REF615 Relay-2" },
    { id: "REF615-3", name: "REF615 Relay-3" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Protection Relay" },
  ];

  //  SEARCH WORKS PROPERLY NOW
  const filteredRelays = relays.filter((relay) =>
    relay.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box w="100%" minH="100vh" bg={bg} p="20px">
      {/* ===== HEADER ===== */}
      <HStack justify="space-between" mb="20px">
        <Breadcrumb
          spacing="6px"
          separator={
            <ChevronRightIcon
              boxSize="4"
              color={useColorModeValue(
                "rgba(0,0,0,0.35)",
                "rgba(255,255,255,0.4)"
              )}
            />
          }
        >
          {breadcrumbs.map((bc, idx) => (
            <BreadcrumbItem key={idx} isCurrentPage={!bc.href}>
              {bc.href ? (
                <BreadcrumbLink
                  href={bc.href}
                  fontSize="12px"
                  fontWeight={500}
                  color={crumbColor}
                >
                  {bc.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbLink
                  fontSize="12px"
                  fontWeight={600}
                  color={crumbActiveColor}
                  cursor="default"
                >
                  {bc.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          ))}
        </Breadcrumb>

        {/* ===== SEARCH ===== */}
        <Input
          placeholder="Search relays..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          width="220px"
          fontSize="12px"
        />
      </HStack>

      {/* ===== RELAY DASHBOARDS ===== */}
      <Grid templateColumns="repeat(2, 1fr)" gap="20px">
        {filteredRelays.map((relay) => (
          <RelayDashboard
            key={relay.id}
            relayId={relay.id}
            relayName={relay.name}
          />
        ))}
      </Grid>
    </Box>
  );
}
