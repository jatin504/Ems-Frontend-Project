import React from "react";
import { Box, Text } from "@chakra-ui/react";

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Error in component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <Box
            p={4}
            bg="red.50"
            color="red.600"
            rounded="md"
            textAlign="center"
          >
            <Text fontWeight="bold">⚠️ Something went wrong</Text>
          </Box>
        )
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
