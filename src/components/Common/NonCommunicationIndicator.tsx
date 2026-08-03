import React from "react";
import {
  Box,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";

interface Props {
  status: boolean;
  message: string;
}

const NonCommunicationIndicator: React.FC<Props> = ({
  status,
  message,
}) => {

  const color = useColorModeValue(
    "#E53E3E",
    "#FC8181"
  );

  if (!status) {
    return null;
  }

  return (
    <>
      <style>
        {`
          @keyframes nonCommBlink {
            0% { opacity: 1; }
            50% { opacity: 0.2; }
            100% { opacity: 1; }
          }
        `}
      </style>

      <Tooltip
        label={message}
        hasArrow
        placement="top"
        whiteSpace="pre-line"
      >
        <Box
          ml={2}
          as="span"
          cursor="pointer"
          color={color}
          fontSize="16px"
          fontWeight="bold"
          animation="nonCommBlink 1s infinite"
        >
          ⚠
        </Box>
      </Tooltip>
    </>
  );
};

export default NonCommunicationIndicator;