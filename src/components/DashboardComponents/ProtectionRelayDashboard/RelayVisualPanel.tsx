import { Box, Image, Text, useColorModeValue } from "@chakra-ui/react";
import relayImg from "../../../assets/protection relay.jpg";

export default function RelayVisualPanel({
  relayName,
}: {
  relayName: string;
}) {
  const bg = useColorModeValue("#FFFFFF", "#0B1220");
  const border = useColorModeValue(
    "rgba(0,0,0,0.06)",
    "rgba(255,255,255,0.08)"
  );
  const titleColor = useColorModeValue("#1A202C", "#E2E8F0");

  return (
    <Box
      bg={bg}
      border={`1px solid ${border}`}
      borderRadius="14px"
      p="12px"
      h="320px"
      w="100%"
      boxShadow={useColorModeValue(
        "0 8px 22px rgba(0,0,0,0.06)",
        "0 10px 30px rgba(0,0,0,0.45)"
      )}
    >
      {/* TITLE */}
      <Text fontSize="13px" fontWeight="600" color={titleColor} mb="8px">
        {relayName}
      </Text>

      {/* IMAGE */}
      <Box
        h="calc(100% - 32px)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={useColorModeValue("#F8FAFC", "#0F172A")}
        borderRadius="10px"
      >
        <Image
          src={relayImg}
          alt={relayName}
          maxH="100%"
          maxW="100%"
          objectFit="contain"
          draggable={false}
        />
      </Box>
    </Box>
  );
}
