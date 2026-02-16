import React from "react";
import { Box } from "@chakra-ui/react";
import FloatingEMSAIAgent from "../components/FloatingAIAgentButton";
import { useLocation } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  const location = useLocation();
  const pathname = location?.pathname ?? (typeof window !== "undefined" ? window.location.pathname : "");

  // hide when route matches or contains common auth/login paths
  const authPaths = ["/login", "/signin", "/auth/login"];
  const shouldHide =
    authPaths.some((p) => pathname === p || pathname.startsWith(p)) ||
    pathname.includes("/login") ||
    pathname.includes("/signin") ||
    pathname === "/"; // remove this if root (/) is not a login page

  return (
    <Box position="relative" minH="100vh">
      {children}
      {!shouldHide && <FloatingEMSAIAgent title="EMS AI Agent" />}
    </Box>
  );
}