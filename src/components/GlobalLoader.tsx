import { Box, Flex, Spinner } from "@chakra-ui/react";

const GlobalLoader = () => {
  return (
    <Box as={Flex} height={"100vh"} maxW="1176px" justify={"center"} align={"center"}>
          <Spinner
              thickness='3px'
              speed='0.65s'
              emptyColor='gray.200'
              color='#062D59'
              size='md'
          />
    </Box>
  );
};

export default GlobalLoader;