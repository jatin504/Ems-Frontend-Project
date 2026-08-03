import {
  Box,
  Text,
  VStack,
  HStack,
  Grid,
  Badge,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";

/* =========================
   LED BAR (UNCHANGED)
   ========================= */
export const Led = ({
  label,
  color = "gray",
}: {
  label: string;
  color?: "green" | "red" | "gray";
}) => {

  const bg =
    color === "green"
      ? "#3CB371"
      : color === "red"
      ? "#FF4D4F"
      : "#D1D5DB";

  const border =
    color === "green"
      ? "#2F855A"
      : color === "red"
      ? "#C53030"
      : "#A0AEC0";

  return (
    <HStack spacing={3} align="center">
      <Box
        width="42px"
        height="14px"
        bg={bg}
        borderRadius="3px"
        border={`1px solid ${border}`}
      />

      <Text
        fontSize="12px"
        lineHeight="1"
      >
        {label}
      </Text>
    </HStack>
  );
};

/* =========================
   PANEL SECTION (BOX ONLY)
   ========================= */
export const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const primaryBg = useColorModeValue("primary.light", "primary.dark");
  const primaryColor = useColorModeValue(
    "primaryText.light",
    "primaryText.dark"
  );

  return (
    <Box
      bg={primaryBg}
      rounded="12px"     //  box style
      p="16px"           //  box padding
      minW="220px"
      height="250px"
      display="flex"
      flexDirection="column"
    >
      {/* TITLE  */}
      <Text
        fontSize="12px"
        fontWeight="bold"
        textTransform="uppercase"
        textAlign="left"
        mb={1}
        color={primaryColor}
      >
        {title}
      </Text>

      {/* CONTENT  */}
      <Flex flex="1" align="center" justify="center">
        <VStack align="start" spacing={1}>
          {children}
        </VStack>
      </Flex>
    </Box>
  );
};

/* =========================
   METER ROW (UNCHANGED)
   ========================= */
export const MeterRow = ({
  label,
  r,
  y,
  b,
}: {
  label: string;
  r: string;
  y: string;
  b: string;
}) => (
  <Grid templateColumns="1fr 1fr 1fr 1fr" fontSize="sm">
    <Text>{label}</Text>
    <Badge>{r}</Badge>
    <Badge>{y}</Badge>
    <Badge>{b}</Badge>
  </Grid>
);