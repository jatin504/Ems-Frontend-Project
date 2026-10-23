import React, { useEffect, useState } from "react";
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
  breadcrumbs?: { label: string; href?: string; state?: unknown; onClick?: () => void }[];
  children: React.ReactNode;
};


// Helper to get a unique key for each dashboard route
function getDashboardStorageKey() {
  return window.location.pathname + window.location.search;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  breadcrumbs = [{ label: "Home", href: "/" }, { label: "Dashboard" }],
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

  // Resizing Logic
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const baseWidth = 1920;
      const currentWidth = window.innerWidth;
      const availableWidth = currentWidth - 82;
      const widthScale = availableWidth / baseWidth;
      // Recalculate on browser zoom too; never enlarge the dashboard beyond its design size.
      setScale(Math.min(1, Math.max(0.1, widthScale * 1.05)));
    };

    updateScale(); // Run once on mount
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <Box
      w="100%"
      pl={{ base: 0, md: "82px" }}
      boxSizing="border-box"
      bg={useColorModeValue("#F4F6F6", "#0E1111")}
      overflowX="hidden"
      sx={{ zoom: scale }}
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
            <BreadcrumbItem key={idx} isCurrentPage={idx === breadcrumbs.length - 1}>
              {bc.onClick ? (
                <BreadcrumbLink as="button" type="button" onClick={bc.onClick}>
                  {bc.label}
                </BreadcrumbLink>
              ) : bc.href ? (
                <BreadcrumbLink
                  as={RouterLink}
                  to={bc.href}
                  state={bc.state}
                >
                  {bc.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbLink as="span" fontWeight={idx === breadcrumbs.length - 1 ? "600" : "400"}>
                  {bc.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
      </Container>

      {/* DASHBOARD CONTENT */}
      <Container
        maxW="none"
        width="100%"
        px="8px"
        pb="16px"
        mx="0"
        ml="0"
        boxSizing="border-box"
      >
        <Flex direction="column" w="100%">
          {children}
        </Flex>
      </Container>
    </Box>
  );
};

export default DashboardLayout;
