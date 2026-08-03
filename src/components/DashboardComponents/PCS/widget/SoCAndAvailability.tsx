import React, { useState } from "react";
import { HStack, Button, Box } from "@chakra-ui/react";
import GraphLayout from "../../../../layouts/GraphLayout";

import PCSSoCGraph from "../PCSSoCGraph";
import AvailabilityChart from "./AvailabilityChart";

const SoCAndAvailability: React.FC = () => {
  const [tab, setTab] = useState<"soc" | "availability">("soc");

  const titleNode = (
    <Box
      display="flex"
      alignItems="center"
      w="100%"
      border="none"
      borderBottom="none"
      boxShadow="none"
      pb="0"
      mb="0"
    >
      <HStack spacing={2}>
        <Button
          size="sm"
          onClick={() => setTab("soc")}
          colorScheme={tab === "soc" ? "blue" : undefined}
        >
          SoC
        </Button>

        <Button
          size="sm"
          onClick={() => setTab("availability")}
          colorScheme={tab === "availability" ? "green" : undefined}
        >
          Availability
        </Button>
      </HStack>
    </Box>
  );

  return (
    <div
      style={{
        marginTop: "-22px",
        border: "none",
      }}
    >
      <GraphLayout
        title={titleNode as any}
        width={["100%"]}
        height={"100%"}
        fullScreen
        timeWindow={false}
        hideTitleLine={true}
      >
        {tab === "soc" ? (
          <PCSSoCGraph hideWrapper />
        ) : (
          <AvailabilityChart hideWrapper />
        )}
      </GraphLayout>
    </div>
  );
};

export default SoCAndAvailability;