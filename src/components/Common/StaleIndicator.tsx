import { Text, Tooltip, Box, } from "@chakra-ui/react";

interface Props {
  ts?: number | null;
  minutes?: number;
  hasData?: boolean;
  value?: number | string | null;
}

export const StaleIndicator = ({
  ts,
  minutes = 2,
  hasData = true,
  value,
}: Props) => {

  const isValueMissing =
    value === null ||
    value === undefined;

  const isTsMissing =
    ts === null ||
    ts === undefined ||
    ts === 0;

  const isOld =
  !isTsMissing &&
  new Date().getMinutes() - new Date(ts).getUTCMinutes() > minutes;

  // blink only when:
  // 1. ts older than 2 min
  // 2. value null/undefined
  const shouldBlink =
    isOld || isValueMissing;

  if (!hasData || !shouldBlink)
    return null;

  let tooltipText = "";

  // value null / undefined
  if (isValueMissing) {

    tooltipText =
      "Data unavailable";

  }

  // ts old
  else if (isOld && ts) {

    const diffMs =
      Date.now() - ts;

    const diffMin =
      Math.floor(diffMs / 60000);

    tooltipText =
  // `${diffMin} min old`;
  `Value not updating`;

  }

  return (
    <>
      <style>{`
        @keyframes blinkDanger {
          0% { opacity: 1; }
          50% { opacity: 0.2; }
          100% { opacity: 1; }
        }
      `}</style>

      <Tooltip
        label={tooltipText}
        hasArrow
        placement="top"
        openDelay={100}
      >
        <Box
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          cursor="help"
          flexShrink={0}
          minW="18px"
          minH="18px"
          position="relative"
          zIndex={9999}
        >
          <Text
            color="yellow.400"
            fontSize="16px"
            animation="blinkDanger 1s infinite"
            lineHeight="1"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            w="18px"
            h="18px"
            flexShrink={0}
            pointerEvents="none"
          >
            ⚠
          </Text>
        </Box>
      </Tooltip>
    </>
  );
};

export default StaleIndicator;