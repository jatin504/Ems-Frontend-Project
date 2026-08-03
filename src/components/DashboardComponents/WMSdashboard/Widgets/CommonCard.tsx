import {
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

const CommonCard = ({
  children,
  p = "14px",
  ...rest
}: any) => {
  const bg = useColorModeValue(
    "#ffffff",
    "linear-gradient(180deg,#0d2b4f,#081f3c)"
  );

  const border = useColorModeValue(
    "#dbe4f0",
    "#16365f"
  );

  return (
    <Box
      bg={bg}
      border={`1px solid ${border}`}
      borderRadius="10px"
      p={p}
      w="100%"
      {...rest}
    >
      {children}
    </Box>
  );
};

export default CommonCard;