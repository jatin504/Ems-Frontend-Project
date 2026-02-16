import {
  Box,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

import SwitchGearTabs from "../components/DashboardComponents/SwitchGearDashboard/SwitchGearTabs";

export default function SwitchGearDashboard() {
  const bg = useColorModeValue("#F4F6F6", "#0E1111");

  // Standard colors 
  const titleColor = useColorModeValue(
    "rgba(0,0,0,0.85)",
    "rgba(255,255,255,0.9)"
  );

  const mutedColor = useColorModeValue(
    "rgba(0,0,0,0.6)",
    "rgba(255,255,255,0.6)"
  );

  const iconColor = useColorModeValue(
    "rgba(0,0,0,0.4)",
    "rgba(255,255,255,0.5)"
  );

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Dashboards", href: "/dashboards" },
    { label: "Switch Gear" },
  ];

  return (
    <Box bg={bg} minH="100vh" p="20px">
      {/* STANDARD BREADCRUMB */}
      <Breadcrumb
        spacing="6px"
        separator={<ChevronRightIcon boxSize="14px" color={iconColor} />}
        mb="12px"
      >
        {breadcrumbs.map((bc, idx) => (
          <BreadcrumbItem key={idx} isCurrentPage={!bc.href}>
            {bc.href ? (
              <BreadcrumbLink
                href={bc.href}
                fontSize="12px"
                fontWeight="400"
                color={mutedColor}
                _hover={{ textDecoration: "none" }}
              >
                {bc.label}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbLink
                fontSize="12px"
                fontWeight="600"
                color={titleColor}
                _hover={{ textDecoration: "none" }}
              >
                {bc.label}
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>

      {/* CONTENT */}
      <SwitchGearTabs />
    </Box>
  );
}
