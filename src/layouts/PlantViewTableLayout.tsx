import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Portal,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
// import { TimeWindow } from '../../../Services/TimeWindow';
import { RxCounterClockwiseClock } from 'react-icons/rx';
import { MdFullscreen } from 'react-icons/md';
import { ExpandIcon, SqeezIcon } from '../assets/Icons';
// import { EnlargeWidth } from '../../../Services/EnlargeWidget';
import { GoClock } from 'react-icons/go';

interface PlantViewTableLayoutProps {
  children: React.ReactNode;
  title: string;
  initTimeTitle? : string;
  bg? : string;
  width: string[];
  height: string | string[];
  px? : string;
  fullscreen? : boolean;
  paginationLimitProps? : number;

  timeWindow? : boolean;
  onTimeWindowChange?: (from: string, to: string, aggregate: string, interval : number) => void;
  onReset? : (Reset : boolean) => void;
}

const PlantViewTableLayout: React.FC<PlantViewTableLayoutProps> = ({ children, title, initTimeTitle, bg, width, height, px, timeWindow, fullscreen, paginationLimitProps=8, onTimeWindowChange, onReset }) => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
  const chartLayoutRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [paginationLimit, setPaginationLimit] = useState<number>(paginationLimitProps)
  // console.log(typeof children, React.isValidElement(children))

  const handleFullScreen = () => {
    if (tableRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullscreen(false);
      } else {
        (tableRef.current as HTMLElement)?.requestFullscreen();
        setPaginationLimit(20); // Increase pagination limit in fullscreen mode
        setIsFullscreen(true);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setPaginationLimit(paginationLimitProps);
        setIsFullscreen(false); // Exited fullscreen
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [paginationLimitProps]);

  const currentColor = useColorModeValue("#062D59", "#fff");
  const currentBG = useColorModeValue("#fff","#131512");
  return (
    <Box
      ref={tableRef}
      w={width}
      h={height}
      // borderRadius="5px"
      bgColor={useColorModeValue('white', '#131512')}
      // p={3}
      px={px}
      mt={5}
      // boxShadow="md"
      // overflow={"auto"}
      bg = {bg}
    >
      <HStack height={"56px"} justifyContent={"space-between"} spacing={5} px={"20px"} >
        <Box>
          <Text 
            fontSize={"18px"}
            fontWeight={600} 
            color={useColorModeValue('#062D59', 'white')}
          //  mt ={-5}
            >{title}</Text>
            {initTimeTitle && 
              <Text color={"#999"} fontSize={8} mt={-4} ml={-3}>{initTimeTitle}</Text>
            }
        </Box>
        <Flex align={"center"} gap={1}>
          {/* Fullscreen Icon */}
          {fullscreen && (
            <IconButton
              aria-label="Fullscreen"
              icon={isFullscreen ? <SqeezIcon/> : <ExpandIcon />}
              onClick={handleFullScreen}
              variant="ghost"
              size={"xs"}
              _hover={{ bg: 'transparent', color: 'gray.500' }}
            />
          )}
          {/* {timeWindow && (
            <TimeWindow
              inFullScreen={isFullscreen}
              isOpen={isOpen}
              onClose={onClose}
              onReset={onReset || (() => {})}
              onSave={onTimeWindowChange || (() => {})}
            >
              <GoClock color={currentColor} size={isFullscreen ? EnlargeWidth(20) : 20} />
            </TimeWindow>
          )} */}
          {/* Use Portal to render the modal within the fullscreen container */}
        {/* <Portal containerRef={chartLayoutRef}>
            <TimeWindow 
                isOpen={isOpen} 
                onClose={onClose} 
                onSave={onTimeWindowChange || (()=>{})} 
                onReset={onReset || (() => {})}
            />
        </Portal> */}

        </Flex>
      </HStack>
      <Box as='main' pb={6} height={"full"} width={"full"} _dark={{color : "white"}} ref={chartLayoutRef}>
        {/* Pass the isFullscreen state to children */}
          {React.isValidElement(children) &&
            React.cloneElement(children as React.ReactElement<any>, {
            isFullscreen,
          })}
          {/* {fullscreen && <Icon 
          as={MdFullscreen}
          boxSize={5} 
          float={"right"} 
          pos={"relative"} 
          bottom={"42px"} 
          onClick={handleFullScreen}
          _fullScreen={{
            bottom : "45px"
          }}
          cursor={"pointer"}
          />} */}
      </Box>
    </Box>
  );
};

export default PlantViewTableLayout;
