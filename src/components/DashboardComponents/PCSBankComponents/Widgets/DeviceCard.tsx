import React from "react";
import { Box, Grid, GridItem, Text, Heading, useColorModeValue } from "@chakra-ui/react";

// Replaces the old <Card />: a styled container with a title row.
// Usage:
// <Box bg="#121821" border="1px solid #1c2635" borderRadius="lg" p={4}>
//   <Heading as="h3" size="sm" color="gray.300" mb={3} display="flex" alignItems="center" justifyContent="space-between">
//     <span>Title</span>
//   </Heading>
//   {/* children */}
// </Box>

const KV: React.FC<{ k: string; v: string | number }> = ({ k, v }) => (
  <>
    <GridItem>
      <Text color="gray.400" fontSize="sm">{k}</Text>
    </GridItem>
    <GridItem>
      <Text fontWeight="semibold" textAlign="right">{v}</Text>
    </GridItem>
  </>
);

const DeviceCard: React.FC = () => {
  const cardBg = useColorModeValue("#ffffff", "#161B1B");
  const cardBorder = useColorModeValue("#e5e7eb", "#1c2635");
  const headingColor = useColorModeValue("#000000", "gray.300");

  return (
    <Box w="280px" h="304px" flex="0 0 auto">
      <Box bg={cardBg} borderRadius="lg" p={4} border={`1px solid ${cardBorder}`} h="100%">
        <Heading as="h3" size="sm" color={headingColor} mb={3} display="flex" alignItems="center" justifyContent="space-between">
          <span>Device</span>
        </Heading>
        <Grid
          templateColumns="1fr auto"
          rowGap="16px"
          columnGap="24px"
          alignItems="center"
        >
          <KV k="Manufacturer" v="CD" />
          <KV k="Model" v="Demo" />
          <KV k="Version" v="10.0" />
          <KV k="Options" v="Demo" />
          <KV k="Serial No." v="00" />
          <KV k="Device address" v="0" />
        </Grid>
      </Box>
    </Box>
  );
};

export default DeviceCard;
