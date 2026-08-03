import {
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  Text,
  Badge,
  Image,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";

import { CheckCircleIcon } from "@chakra-ui/icons";
import moduleRackDark from "../../../assets/ChatGPT Image Jul 23, 2026, 04_50_11 PM.png";
import moduleRackLight from "../../../assets/ChatGPT Image Jul 23, 2026, 05_13_44 PM.png";

interface Props {
  moduleId: string;
}

function ModuleInfoCard({
  moduleId,
}: Props) {
  const bg = useColorModeValue(
    "linear-gradient(180deg,#F8FAFC 0%,#EAF4FF 100%)",
    "linear-gradient(180deg,#102537 0%,#0C1C2A 100%)"
  );

  const border = useColorModeValue("#D1E3F5", "#183448");
  const title = useColorModeValue("#0F172A", "#F8FAFC");
  const label = useColorModeValue("#64748B", "#AAB7C5");
  const value = useColorModeValue("#0F172A", "#FFFFFF");

  const moduleRackImage = useColorModeValue(
    moduleRackLight,
    moduleRackDark
  );

  return (
    <Box
      w="360px"
      h="300px"
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="12px"
      overflow="hidden"
      p="16px"
      boxShadow="0 6px 16px rgba(0,0,0,0.08)"
    >
      {/* Header */}

      <Flex
        justify="space-between"
        align="center"
        mb="12px"
      >
        <Text
          color={title}
          fontSize="16px"
          fontWeight="700"
        >
          Module-{moduleId} Details
        </Text>

        <Badge
          bg={useColorModeValue("#EAF4FF", "#173D20")}
          color={useColorModeValue("#0B4D87", "#77DD55")}
          px="8px"
          py="4px"
          borderRadius="6px"
          fontSize="11px"
          textTransform="none"
          display="flex"
          alignItems="center"
          gap="6px"
        >
          <Icon
            as={CheckCircleIcon}
            boxSize={3}
          />
          Normal
        </Badge>
      </Flex>

      {/* Body */}

      <HStack
        align="start"
        spacing="20px"
      >
        {/* Battery Image */}

        <Box
          w="120px"
          h="280px"
          mt="-10px"
          display="flex"
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          <Image
            src={moduleRackImage}
            h="250px"
            w="auto"
            objectFit="contain"
          />
        </Box>

        {/* Details */}

        <Grid
          flex="1"
          templateColumns="100px 1fr"
          rowGap="8px"
          columnGap="10px"
          alignItems="center"
        >
          <GridItem>
            <Text
              color={label}
              fontSize="12px"
            >
              Module ID
            </Text>
          </GridItem>

          <GridItem>
            <Text
              color={value}
              fontSize="13px"
              fontWeight="700"
              textAlign="right"
            >
              03
            </Text>
          </GridItem>

          <GridItem>
            <Text
              color={label}
              fontSize="12px"
            >
              Module Name
            </Text>
          </GridItem>

          <GridItem>
            <Text
              color={value}
              fontSize="13px"
              fontWeight="700"
              textAlign="right"
            >
              Module-03
            </Text>
          </GridItem>

          <GridItem>
            <Text
              color={label}
              fontSize="12px"
            >
              BMU ID
            </Text>
          </GridItem>

          <GridItem>
            <Text
              color={value}
              fontSize="13px"
              fontWeight="700"
              textAlign="right"
            >
              BMU-03
            </Text>
          </GridItem>

          <GridItem>
            <Text
              color={label}
              fontSize="12px"
            >
              BCU ID
            </Text>
          </GridItem>

          <GridItem>
            <Text
              color={value}
              fontSize="13px"
              fontWeight="700"
              textAlign="right"
            >
              BCU-01
            </Text>
          </GridItem>
                    <GridItem>
            <Text
              color={label}
              fontSize="12px"
            >
              Module Type
            </Text>
          </GridItem>

          <GridItem>
            <Text
              color={value}
              fontSize="13px"
              fontWeight="700"
              textAlign="right"
            >
              LFP-280Ah
            </Text>
          </GridItem>

          <GridItem>
            <Text
              color={label}
              fontSize="12px"
            >
              Nominal Voltage
            </Text>
          </GridItem>

          <GridItem>
            <Text
              color={value}
              fontSize="13px"
              fontWeight="700"
              textAlign="right"
            >
              76.80 V
            </Text>
          </GridItem>

          <GridItem>
            <Text
              color={label}
              fontSize="12px"
            >
              Nominal Capacity
            </Text>
          </GridItem>

          <GridItem>
            <Text
              color={value}
              fontSize="13px"
              fontWeight="700"
              textAlign="right"
            >
              280.0 Ah
            </Text>
          </GridItem>

          <GridItem>
            <Text
              color={label}
              fontSize="12px"
            >
              Rated Energy
            </Text>
          </GridItem>

          <GridItem>
            <Text
              color={value}
              fontSize="13px"
              fontWeight="700"
              textAlign="right"
            >
              21.50 kWh
            </Text>
          </GridItem>
        </Grid>
      </HStack>
    </Box>
  );
}

export default ModuleInfoCard;