import { useEffect } from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Progress,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useBatteryBank from "../../../hooks/PlantView/useBatteryBank";
import WidgetTitle from "../../Common/WidgetTitle";

interface BankData {
  device_id: string;
  soc: number;
  active_device: number;
  non_active_device: number;
  amps: string;
  voltage: string;
  latest_temp: number;
  max_temp: number;
  dod?: number;
  soh?: number;
}

const MetricCard = ({
  title,
  value,
  sub,
  bg,
  width,
}: {
  title: string;
  value: string | number;
  sub?: string;
  bg: string;
  width: string;
}) => {
  return (
    <Box
      w={width}
      h="52px"
      bg={bg}
      bgGradient={useColorModeValue("linear(to-br, rgba(255,255,255,0.9), rgba(255,255,255,0.55))", "linear(to-br, rgba(255,255,255,0.08), rgba(255,255,255,0.04))")}
      borderRadius="16px"
      px={2}
      py={1}
      border="1px solid rgba(255,255,255,0.45)"
      boxShadow={useColorModeValue("0 10px 30px rgba(0,0,0,0.08)", "0 10px 30px rgba(0,0,0,0.25)")}
      transition="transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease"
      _hover={{ transform: "translateY(-4px) scale(1.07) rotateX(2deg)", boxShadow: "0 24px 50px rgba(0,0,0,0.22)" }}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      sx={{
        "@keyframes floatMetric": {
          "0%,100%": { transform: "translateY(0)" },
          "25%": { transform: "translateY(-1px) rotateZ(0.3deg)" },
          "50%": { transform: "translateY(-3px) rotateZ(-0.3deg)" },
          "75%": { transform: "translateY(-1px) rotateZ(0.2deg)" },
        },
        animation: "floatMetric 5.5s ease-in-out infinite",
      }}
    >
      <Text
        fontSize="9px"
        color="#555"
        lineHeight="11px"
      >
        {title}
      </Text>

      <Box>
        <Text
          fontWeight="700"
          fontSize="14px"
          lineHeight="16px"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {value}
          {sub && (
            <Text as="span" fontWeight="500" fontSize="11px" color="#4A5568" ml="4px">
              | {sub}
            </Text>
          )}
        </Text>
      </Box>
    </Box>
  );
};

const BankSummary = () => {
  const border = useColorModeValue("#E5E7EB", "#4A5568");
  const { fetchData, data: banks } = useBatteryBank();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData("plant_1");
  }, []);

  return (
    <Box
      bg={useColorModeValue("white", "#1E1E1E")}
      borderRadius="16px"
      border="1px solid"
      borderColor={useColorModeValue("gray.200", "whiteAlpha.200")}
      boxShadow="sm"
      pt={2}
      px={6}
      pb={5}
      h="680px"
      overflowY="auto"
      w="100%"
    >
      <Box mt={0} mb={2}>
        <WidgetTitle>Banks Summary</WidgetTitle>
      </Box>

      <VStack
        spacing={3}
        align="stretch"
      >
        {banks?.map((bank: BankData, index: number) => (
          <Box
            key={index}
            bgGradient={useColorModeValue("linear(to-br, #ffffff, #f8fafc)", "linear(to-br, #2c3144, #1f2937)")}
            borderRadius="20px"
            border="1px solid"
            borderColor={border}
            px={4}
            py={2}
            boxShadow={useColorModeValue("0 10px 28px rgba(15, 23, 42, 0.1)", "0 14px 40px rgba(0, 0, 0, 0.28)")}
            transition="transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease"
            _hover={{
              transform: "perspective(1000px) translateY(-10px) rotateX(5deg) rotateY(-2deg) scale(1.015)",
              boxShadow: useColorModeValue("0 28px 60px rgba(15, 23, 42, 0.16)", "0 32px 72px rgba(0, 0, 0, 0.34)"),
              borderColor: useColorModeValue("rgba(49, 130, 206, 0.35)", "rgba(96, 165, 250, 0.35)"),
            }}
            sx={{
              "@keyframes floatCard": {
                "0%,100%": { transform: "perspective(1000px) translateZ(0) translateY(0)" },
                "25%": { transform: "perspective(1000px) translateZ(0) translateY(-2px) rotateZ(0.2deg)" },
                "50%": { transform: "perspective(1000px) translateZ(0) translateY(-5px) rotateZ(-0.2deg)" },
                "75%": { transform: "perspective(1000px) translateZ(0) translateY(-2px) rotateZ(0.2deg)" },
              },
              animation: "floatCard 8s ease-in-out infinite",
            }}
          >
            <HStack
              align="center"
              spacing={2}
            >
              {/* Left */}
              <Box w="210px">
                <Text
                  fontSize="14px"
                  fontWeight="700"
                  mb={2}
                  cursor="pointer"
                  textTransform="capitalize"
                  onClick={() =>
                    navigate("/batterybankk", {
                      state: {
                        currentBank: bank.device_id,
                        breadcrumbSource: "bess",
                      },
                      replace: true,
                    })
                  }
                >
                  {bank.device_id
                    .replace(/^plant_\d+_/, "")
                    .replace("bank_bank", "bank")
                    .replace(/_/g, " ")
                    .replace("pcs", "PCS")}
                </Text>

                <VStack
                  spacing={0.5}
                  align="stretch"
                >
                  <HStack spacing={2}>
                    <Text w="28px" fontSize="10px">
                      SoC
                    </Text>

                    <Progress
                      value={bank.soc}
                      flex="1"
                      h="4px"
                      colorScheme="teal"
                      borderRadius="full"
                    />

                    <Text
                      w="30px"
                      fontSize="10px"
                    >
                      {bank.soc}%
                    </Text>
                  </HStack>

                  <HStack spacing={2}>
                    <Text w="28px" fontSize="10px">
                      DoD
                    </Text>

                    <Progress
                      value={bank.dod ?? 60}
                      flex="1"
                      h="4px"
                      colorScheme="orange"
                      borderRadius="full"
                    />

                    <Text
                      w="30px"
                      fontSize="10px"
                    >
                      {bank.dod ?? 60}%
                    </Text>
                  </HStack>

                  <HStack spacing={2}>
                    <Text w="28px" fontSize="10px">
                      SoH
                    </Text>

                    <Progress
                      value={bank.soh ?? 90}
                      flex="1"
                      h="4px"
                      colorScheme="blue"
                      borderRadius="full"
                    />

                    <Text
                      w="30px"
                      fontSize="10px"
                    >
                      {bank.soh ?? 90}%
                    </Text>
                  </HStack>
                </VStack>
              </Box>

                            <HStack spacing={3} align="stretch">
                <MetricCard
                  title="Connected"
                  value={bank.active_device}
                  bg="#BFF4E3"
                  width="76px"
                />

                <MetricCard
                  title="Disabled"
                  value={bank.non_active_device}
                  bg="#F3F4F6"
                  width="76px"
                />

                <MetricCard
                  title="Strings"
                  value={`${bank.voltage} V`}
                  sub={`${bank.amps} A`}
                  bg="#E9EEFF"
                  width="120px"
                />

                <MetricCard
                  title="Module Temps"
                  value={`${bank.latest_temp} °C`}
                  sub={`${bank.max_temp} °C`}
                  bg="#FFEAEA"
                  width="125px"
                />
              </HStack>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default BankSummary;