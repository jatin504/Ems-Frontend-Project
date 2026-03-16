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

/* ================= DATA ================= */
const transformers = [
  { id: 1, name: "IR-1 TRANSFORMER", wti: null, oti: null, image: transformerImg },
  { id: 2, name: "IR-2 TRANSFORMER", wti: 57, oti: 51, image: transformerImg },
  { id: 3, name: "IR-3 TRANSFORMER", wti: 60, oti: 54, image: transformerImg },
  { id: 4, name: "IR-4 TRANSFORMER", wti: 63, oti: 55, image: transformerImg },
  { id: 5, name: "IR-5 TRANSFORMER", wti: 97, oti: 0, image: transformerImg },
  { id: 6, name: "IR-6 TRANSFORMER", wti: 60, oti: 54, image: transformerImg },
  { id: 7, name: "IR-7 TRANSFORMER", wti: 96, oti: 0, image: transformerImg },
  { id: 8, name: "IR-8 TRANSFORMER", wti: 59, oti: 51, image: transformerImg },
  { id: 9, name: "IR-9 TRANSFORMER", wti: 65, oti: 53, image: transformerImg },
  { id: 10, name: "IR-10 TRANSFORMER", wti: 57, oti: 51, image: transformerImg },
  { id: 11, name: "IR-11 TRANSFORMER", wti: 56, oti: 52, image: transformerImg },
  { id: 12, name: "IR-12 TRANSFORMER", wti: 60, oti: 200, image: transformerImg },
];

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

  return (
    <Box p={6} bg={bgMain} minH="100vh">
      {/* ================= Breadcrumb ================= */}
      <Breadcrumb
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
      </Breadcrumb>

      {/* ================= Page Title ================= */}
      <HStack mb={2}>
        <Text {...titleTextStyle}>ALL TRANSFORMER STATUS</Text>
      </HStack>

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
              to={`/devices/transformer/${t.id}`}
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
                    <Text color={isWTIAlarm ? "red.500" : "green.600"}>
                      TRAFO WTI : {t.wti ?? "XXXX"} °C
                    </Text>
                    <Text color={isOTIAlarm ? "red.500" : "green.600"}>
                      TRAFO OTI : {t.oti ?? "XXXX"} °C
                    </Text>
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
