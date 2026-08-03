import {
  Box,
  Flex,
  Text,
  VStack,
  Circle,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

type MeterStatusProps = {
  normal?: number;
  alarm?: number;
  offline?: number;
};

const MeterStatusSummary = ({ normal = 1, alarm = 0, offline = 0 }: MeterStatusProps) => {
  const cardBg = useColorModeValue("linear-gradient(180deg,#ffffff,#f8fbff)", "primary.dark");

  const borderClr = useColorModeValue("#dbe7f3", "#16365f");

  const titleColor = useColorModeValue("#1A202C", "#d9e6ff");
  const labelColor = useColorModeValue("#475569", "#d6e4ff");
  const numberColor = useColorModeValue("#1A202C", "white");
  const iconNormalColor = useColorModeValue("#7CFC00", "#7CFC00");
  const iconAlarmColor = useColorModeValue("#ff4d4f", "#ff4d4f");
  const iconOfflineColor = useColorModeValue("#9d9d9d", "#9d9d9d");

  const pulse = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.12); }
    100% { transform: scale(1); }
  `;

  const shake = keyframes`
    0% { transform: translateX(0); }
    25% { transform: translateX(-3px); }
    50% { transform: translateX(3px); }
    75% { transform: translateX(-3px); }
    100% { transform: translateX(0); }
  `;

  const fade = keyframes`
    0% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.65; transform: scale(0.98); }
    100% { opacity: 1; transform: scale(1); }
  `;

  return (
    <Box bg={cardBg} border={`1px solid ${borderClr}`} borderRadius="10px" p="18px">
      <Text color={titleColor} fontWeight="700" mb="20px">
        Meter Status Summary
      </Text>

      <Flex justify="space-around">
        <VStack>
          <Circle size="56px" border={`2px solid ${iconNormalColor}`}>
            <Icon
              viewBox="0 0 24 24"
              color={iconNormalColor}
              boxSize="24px"
              aria-label="normal"
              animation={`${pulse} 1.6s ease-in-out infinite`}
            >
              <path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19l12-12-1.4-1.4z" />
            </Icon>
          </Circle>

          <Text color={labelColor}>Normal</Text>

          <Text color={numberColor} fontSize="42px" fontWeight="700">{normal}</Text>
        </VStack>

        <VStack>
          <Circle size="56px" border={`2px solid ${iconAlarmColor}`}>
            <Icon
              viewBox="0 0 24 24"
              color={iconAlarmColor}
              boxSize="24px"
              aria-label="alarm"
              animation={`${shake} 0.9s linear infinite`}
            >
              <path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
            </Icon>
          </Circle>

          <Text color={labelColor}>Alarm</Text>

          <Text color={numberColor} fontSize="42px" fontWeight="700">{alarm}</Text>
        </VStack>

        <VStack>
          <Circle size="56px" border={`2px solid ${iconOfflineColor}`}>
            <Icon
              viewBox="0 0 24 24"
              color={iconOfflineColor}
              boxSize="24px"
              aria-label="offline"
              animation={`${fade} 2.8s ease-in-out infinite`}
            >
              <path fill="currentColor" d="M13 3h-2v10h2V3zm4.83 2.17l-1.41 1.41A7.95 7.95 0 0 1 20 12a8 8 0 1 1-8-8c1.86 0 3.58.63 4.95 1.67l1.41-1.5A9.97 9.97 0 0 0 12 2 10 10 0 1 0 22 12c0-2.76-1.12-5.26-2.92-7.03z" />
            </Icon>
          </Circle>

          <Text color={labelColor}>Offline</Text>

          <Text color={numberColor} fontSize="42px" fontWeight="700">{offline}</Text>
        </VStack>
      </Flex>
    </Box>
  );
};

export default MeterStatusSummary;