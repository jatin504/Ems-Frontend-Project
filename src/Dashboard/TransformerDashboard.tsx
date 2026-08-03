import {
  Box,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Image,
  useColorModeValue,
  Link,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Link as ReactRouterLink } from "react-router-dom";
import transformerImg from "../assets/transformer.webp";
import { useTimeHandle } from "../Services/TimeWindowSetting";
import useTimeseriesData from "../hooks/useTimeseriesData";
import { useEffect } from "react";
import StaleIndicator from "../components/Common/StaleIndicator";

/* ================= DATA ================= */
export default function TransformerDashboard() {
  const bgMain = useColorModeValue("white", "#1A202C");
  const bgCard = useColorModeValue("white", "#2D3748");
  
  const titleColor = useColorModeValue(
    "rgba(0,0,0,0.85)",
    "rgba(255,255,255,0.9)"
  );
  
  const breadcrumbMutedColor = useColorModeValue(
    "rgba(0,0,0,0.6)",
    "rgba(255,255,255,0.6)"
  );
  
  const breadcrumbIconColor = useColorModeValue(
    "rgba(0,0,0,0.4)",
    "rgba(255,255,255,0.4)"
  );
  
  const titleTextStyle = {
    fontSize: "12px",
    fontWeight: 600,
    color: titleColor,
  };
  
  const {
      config: timeWindow
    } = useTimeHandle(
      12,
      "hour",
      "none",
      [1, "minute"],
      60000,
      {
        timeRange: {
          type: "last",
          
          interval: 1,
          intervalType: "minute",
        },
      }
    );
  const buildDataSource = () => ({
    devices: { patterns: ["_transformer_transformer_"], ids: [] },
    keys: [
      {
        key: "oti",
        alias: "oti",
        keyType: "common"
      },
      {
        key: "wti",
        alias: "wti",
        keyType: "common"
      },
    ],
    aggregation: timeWindow.aggregation,
    timeRange: timeWindow.timeRange,
    orderBy: "DESC"
  });
  
  const { data, fetchData } = useTimeseriesData();

  console.log("TransformerDashboard data", data);
  
  useEffect(()=>{
      fetchData(buildDataSource() as any);
      const interval = setInterval(() => {
        fetchData(buildDataSource() as any);
      }, 60000);
    },[timeWindow]);
  
  const transformers = Object.entries(data || {}).map(
    ([deviceId, deviceData]: any, index) => ({
      id: deviceId,
      sr: index + 1,

      name: `Transformer-${index + 1}`,

      oti:
        deviceData?.oti?.length > 0
          ? deviceData.oti[0].value
          : null,

      otiTs:
        deviceData?.oti?.length > 0
          ? deviceData.oti[0].ts
          : null,

      wti:
        deviceData?.wti?.length > 0
          ? deviceData.wti[0].value
          : null,

      wtiTs:
        deviceData?.wti?.length > 0
          ? deviceData.wti[0].ts
          : null,

      image: transformerImg,
    })
  );

// console.log("TRANSFORMERS: ", transformers);
  
  return (
    <Box p={6} bg={bgMain} minH="100vh">
      {/* ================= Breadcrumb ================= */}
      {/* <Breadcrumb
        spacing="6px"
        separator={<ChevronRightIcon boxSize="14px" color={breadcrumbIconColor} />}
        mb="8px"
      >
        <BreadcrumbItem>
          <BreadcrumbLink
            as={ReactRouterLink}
            to="/"
            fontSize="12px"
            color={breadcrumbMutedColor}
            _hover={{ textDecoration: "none" }}
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink
            as={ReactRouterLink}
            to="/dashboards"
            fontSize="12px"
            color={breadcrumbMutedColor}
            _hover={{ textDecoration: "none" }}
          >
            Dashboards
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink {...titleTextStyle} _hover={{ textDecoration: "none" }}>
            Transformers
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb> */}

      {/* ================= Page Title ================= */}
      {/* <HStack mb={2}>
        <Text {...titleTextStyle}>ALL TRANSFORMER STATUS</Text>
      </HStack> */}

      {/* ================= Cards Grid ================= */}
      <SimpleGrid
        columns={{
          base: 1,
          md: 3,
          lg: 5,   //  5 transformers per row
        }}
        spacing={4}
      >
        {transformers.map((t) => {
          const isWTIAlarm = t.wti !== null && t.wti > 90;
          const isOTIAlarm = t.oti !== null && t.oti > 90;

          return (
            <Link
              key={t.id}
              as={ReactRouterLink}
              to={`/devices/transformer/${t.id}?id=${t.id}&name=${t.name}&serial=${t.sr}`}
              _hover={{ textDecoration: "none" }}
            >
              <Box
                bg={bgCard}
                borderRadius="md"
                p={3}
                boxShadow="md"
                cursor="pointer"
                _hover={{ boxShadow: "lg" }}
              >
                <Text {...titleTextStyle} mb={2}>
                  {t.name}
                </Text>

                <HStack spacing={3} align="center">
                  <Image
                    src={t.image}
                    alt="Transformer"
                    boxSize="60px"
                    objectFit="contain"
                  />

                  <VStack align="start" spacing={1} fontSize="sm">
                    <HStack spacing={2} align="center">
                      <Text color={isWTIAlarm ? "red.500" : "green.600"}>
                        TRAFO WTI : {t.wti ?? "XXXX"} °C
                      </Text>
                      <StaleIndicator ts={t.wtiTs} value={t.wti} />
                    </HStack>

                    <HStack spacing={2} align="center">
                      <Text color={isOTIAlarm ? "red.500" : "green.600"}>
                        TRAFO OTI : {t.oti ?? "XXXX"} °C
                      </Text>
                      <StaleIndicator ts={t.otiTs} value={t.oti} />
                    </HStack>
                  </VStack>
                </HStack>
              </Box>
            </Link>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}