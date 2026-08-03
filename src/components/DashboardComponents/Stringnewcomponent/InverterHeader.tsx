import React from "react";

import {
  Flex,
  Box,
} from "@chakra-ui/react";

import InverterInfoSection from "./InverterInfoSection";
import InverterPowerSection from "./InverterPowerSection";

const InverterHeader = ({
  selectedDevice,
}: any) => {

  return (
    <Flex
      mb={4}
      w="100%"
      align="stretch"
      gap="10px"
    >

      {/* LEFT */}
      <Box w="40%" pl={3}>

        <InverterInfoSection
          selectedDevice={selectedDevice}
        />

      </Box>

      {/* RIGHT */}
      <Box w="60%">

        <InverterPowerSection
          selectedDevice={selectedDevice}
        />

      </Box>

    </Flex>
  );
};

export default InverterHeader;