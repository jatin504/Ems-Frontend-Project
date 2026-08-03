import {
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

const CommonCard = ({
  children,
  p = "12px",
}: any) => {

  const bg = useColorModeValue(
    "#ffffff",
    "primary.dark"
  );

  const border = useColorModeValue(
    "#d9e2f0",
    "#16365f"
  );

  return (
    <Box
      bg={bg}
      border={`1px solid ${border}`}
      borderRadius="10px"
      p={p}
      h="100%"
      minW={0}
      overflow="hidden"
    >
      {children}
    </Box>
  );
};

export default CommonCard;