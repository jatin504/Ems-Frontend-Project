import React from "react";

import {
  HStack,
  Button,
  Box,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { Select as ChakraSelect } from "chakra-react-select";

type Props = {
  inverterOptions: any[];
  selectedDevice: any;
  setSelectedDevice: any;
  loading?: boolean;
  
  viewMode: "string" | "overview";
  setViewMode: any;
};

const InverterNavbar = ({
  inverterOptions,
  selectedDevice,
  setSelectedDevice,
  loading,
  viewMode,
  setViewMode,
}: Props) => {

  return (
    <HStack spacing={3} mb={3}>

      {/* BUTTON */}
      <Button
        h="32px"
        px={2}
        bg={
          viewMode === "overview"
            ? useColorModeValue("#12365B", "#12365B")
            : useColorModeValue("#F0F6FA", "#0B2340")
        }
        border={`1px solid ${useColorModeValue("#214A73", "#214A73")}`}
        color={viewMode === "overview" ? "white" : useColorModeValue("#12365B", "white")}
        fontWeight="500"
        fontSize="15px"
        borderRadius="8px"
        _hover={{
          bg: viewMode === "overview" ? "#17426D" : useColorModeValue("#EAF2F8", "#0D2B4A"),
        }}
        onClick={() =>
          setViewMode("overview")
        }
      >
       Plant Overview
      </Button>

      {/* DROPDOWN */}
      <Box>
          <ChakraSelect
          options={inverterOptions}
          size="sm"
          value={selectedDevice}
          isDisabled={loading}
          onChange={(val) => {

            setSelectedDevice(val);

            setViewMode("string");

          }}
          chakraStyles={{
            control: (base) => ({
              ...base,
              // width: 170,
              // minHeight: 42,
              background: useColorModeValue("#F0F6FA", "#0B2340"),
              border: `1px solid ${useColorModeValue("#214A73", "#214A73")}`,
              borderRadius: 8,
              paddingLeft: 12,
            }),
            valueContainer: (base) => ({
              ...base,
              paddingLeft: 0,
              paddingTop: 0,
              textAlign: "center"
            }),

            indicatorSeparator: () => ({
              display: "none",
            }),

            dropdownIndicator: (base) => ({
              ...base,
              color: "gray.400",
            }),

            singleValue: (base) => ({
              ...base,
              fontSize: 15,
              fontWeight: 600,
              marginTop: "2px",
            }),
          }}
        />
      </Box>

      

    </HStack>
  );
};

export default InverterNavbar;