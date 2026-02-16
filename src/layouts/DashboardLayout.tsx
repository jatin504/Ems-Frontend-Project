import React, { useEffect } from "react";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";

type DashboardLayoutProps = {
  breadcrumbs?: { label: string; href?: string }[];
  children: React.ReactNode;
};


// Helper to get a unique key for each dashboard route
function getDashboardStorageKey() {
  return window.location.pathname + window.location.search;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  breadcrumbs = [{ label: "Home", href: "/plantview" }, { label: "Dashboard" }],
  children,
}) => {
  // Save dashboard data to localStorage on unmount or navigation
  useEffect(() => {
    // Try to find dashboard data in children (if possible)
    // This assumes children is a React element with props.data or similar
    // You may need to adjust this logic based on your dashboard data structure
    const saveData = () => {
      try {
        // Try to extract data from children if possible
        let dashboardData = null;
        if (
          children &&
          typeof children === "object" &&
          "props" in children &&
          (children as React.ReactElement<any, any>).props.data
        ) {
          dashboardData = (children as React.ReactElement<any, any>).props.data;
        }
        if (dashboardData) {
          localStorage.setItem(getDashboardStorageKey(), JSON.stringify(dashboardData));
        }
      } catch (e) {}
    };
    window.addEventListener("beforeunload", saveData);
    return () => {
      saveData();
      window.removeEventListener("beforeunload", saveData);
    };
    // eslint-disable-next-line
  }, [children]);

  // Restore dashboard data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(getDashboardStorageKey());
      if (
        saved &&
        React.isValidElement(children) &&
        typeof (children as any).props.onRestoreData === "function"
      ) {
        (children as any).props.onRestoreData(JSON.parse(saved));
      }
    } catch (e) {}
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      w="100%"
      bg={useColorModeValue("#F4F6F6", "#0E1111")}
      overflowX="hidden"
      sx={{ zoom: 0.80 }}
    >
      {/* Breadcrumb */}
      <Container
        maxW="1920px"
        px="20px"
        pt="20px"
        mb="10px"
        fontSize="13px"
        mx="0"
        ml="0"
      >
        <Breadcrumb
          spacing="5px"
          separator={
            <ChevronRightIcon
              boxSize="4"
              color={useColorModeValue(
                "rgba(0,0,0,0.4)",
                "rgba(255,255,255,0.5)"
              )}
            />
          }
        >
          {breadcrumbs.map((bc, idx) => (
            <BreadcrumbItem key={idx} isCurrentPage={!bc.href}>
              {bc.href ? (
                <BreadcrumbLink
                  as={RouterLink}
                  to={bc.href}
                >
                  {bc.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbLink fontWeight="600">
                  {bc.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
      </Container>

      {/* DASHBOARD CONTENT */}
      <Container
        maxW="1920px"
        px="16px"
        pb="16px"
        mx="0"
        ml="0"
      >
        <Flex direction="column" w="100%">
          {children}
        </Flex>
      </Container>
    </Box>
  );
};

export default DashboardLayout;
