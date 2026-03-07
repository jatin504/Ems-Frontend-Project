import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Text,
  useColorModeValue,
  useDisclosure,
  Portal,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  Button,
} from '@chakra-ui/react';
// import { IconType } from 'react-icons';
// import { TimeWindow } from '../../../Services/TimeWindow';
import { GoClock } from "react-icons/go";
import { BsFillInfoCircleFill } from 'react-icons/bs';
// import InfoSymbol from '../InfoSymbolLayout';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { FaAngleDown } from 'react-icons/fa';
import { EnlargeHeight, EnlargeWidth } from '../../../../Services/EnlargeWidget';
import { SqeezIcon, ExpandIcon } from '../../../../assets/Icons';
import { TimeWindow } from '../../../../Services/TimeWindow';
import type { ExportFunctions } from '../../../../types/graphExport/export';

interface GraphLayoutProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  titleLengthSVG?: number;
  titleLengthLongSVG?: number;
  initTimeTitle?: string;
  bg?: string;
  boxShadow?: string;
  border?: string;
  fullScreen?: boolean | false;
  width: string[] | number[];
  height: string | string[];
  mt?: string | any[];
  px?: string;
  overflow?: string;
  infoSymbol?: boolean;
  timeWindow?: boolean;
  onTimeWindowChange?: (config: {
    aggregation: {
      func: string;
      interval: number;
      intervalType: string;
    };
    timeRange: {
      type: "absolute" | "relative" | "last";
      startTs?: number | undefined;
      endTs?: number | undefined;
      relativeType?: string | undefined;
      interval?: number | undefined;
      intervalType?: string | undefined;
    };
    orderBy: "ASC" | "DESC";
  }) => void;
  onReset?: (Reset: boolean) => void;
  WidgetProps?: any;
  contentProps?: any;
  onExport?: ExportFunctions | null; // Optional since it might not be passed initially
  downloadOption?: boolean;
  inProgress?: boolean;
  preDefineTimeInvterval?: boolean;
  setCurrentWidgetInterval?: (interval: "daily" | "month" | "year") => void;
  forcePortalToBody?: boolean;
}

const GraphLayout: React.FC<GraphLayoutProps> = ({
  children,
  title,
  initTimeTitle,
  bg,
  border,
  fullScreen,
  width,
  height,
  mt,
  px,
  overflow,
  infoSymbol = false,
  timeWindow,
  onTimeWindowChange,
  onReset,
  WidgetProps,
  contentProps,
  onExport,
  downloadOption = true,
  inProgress = false,
  preDefineTimeInvterval = false,
  setCurrentWidgetInterval,
  forcePortalToBody = false,
}) => {
  const iconColor = useColorModeValue('#004F86', 'white');
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Full Screen Logic
  const GraphLayoutRef = useRef<HTMLElement>(null) as React.RefObject<HTMLElement>;
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullScreen = () => {
    if (GraphLayoutRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullscreen(false);
      } else {
        GraphLayoutRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    }
  };

  // Handle exit fullscreen via ESC key or other methods
  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      setIsFullscreen(false); // Exited fullscreen
    }
  };

  // Add event listener for fullscreen change
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Interval Selection
  const [currentInterval, setCurrentInterval] =
    useState<"daily" | "month" | "year">("daily");

  function handleSelectInterval(interval: "daily" | "month" | "year"): void {
    setCurrentInterval(interval);
    if (setCurrentWidgetInterval && preDefineTimeInvterval) {
      setCurrentWidgetInterval(interval);
    }
  }

  const currentColor = useColorModeValue("secondaryText.light", "secondaryText.dark");

  return (
    <Box
      ref={GraphLayoutRef}
      w={isFullscreen ? '1920px' : width}
      h={isFullscreen ? '100vh' : height}
      borderRadius="8px"
      border={border}
      bgColor={useColorModeValue('white', '#131512')}
      p={3}
      px={px}
      mt={5}
      overflow={'hidden'}
      bg={bg}
      {...WidgetProps}
    >
      <Flex justifyContent={'space-between'} alignItems="center">
        <HStack>
          <Box
            fontSize={isFullscreen ? "18px" : "18px"}
            fontWeight={600}
            color={useColorModeValue('rgba(0, 0, 0, 1)', 'white')}
            pl={2}
          >
            {title}
          </Box>
        </HStack>

        <Flex align={'center'} gap={1}>
          {infoSymbol && <Box mr={2} cursor={"pointer"} />}

          {inProgress && <Badge fontWeight={300}>In Progress</Badge>}

          {initTimeTitle &&
            <Text color={"#9BABBD"} fontSize={"10px"} mr={2}>
              {initTimeTitle}
            </Text>
          }

          {fullScreen && (
            <IconButton
              aria-label="Fullscreen"
              icon={isFullscreen ? <SqeezIcon /> : <ExpandIcon />}
              onClick={handleFullScreen}
              variant="ghost"
              size={"xs"}
              _hover={{ bg: 'transparent', color: 'gray.500' }}
              mr={1}
            />
          )}

          {timeWindow && (
            <TimeWindow
              inFullScreen={isFullscreen}
              isOpen={isOpen}
              onClose={onClose}
              onReset={onReset || (() => { })}
              onSave={onTimeWindowChange || (() => { })}
              containerRef={undefined}
            >
              <GoClock color={currentColor} cursor={"pointer"} size={20} />
            </TimeWindow>
          )}

          {preDefineTimeInvterval && (
            <Menu placement="bottom-end">
              <MenuButton
                as={Button}
                rounded={"none"}
                size={"xs"}
                px={"10px"}
                py={"6px"}
                fontSize={"10px"}
                fontWeight={500}
                bg={"#F5F7F8"}
                rightIcon={<FaAngleDown />}
              >
                <Text textTransform={"capitalize"}>{currentInterval}</Text>
              </MenuButton>

              <Portal containerRef={GraphLayoutRef}>
                <MenuList fontSize={"10px"} fontWeight={400} color={currentColor}>
                  <MenuItem onClick={() => handleSelectInterval("daily")}>Daily</MenuItem>
                  <MenuItem onClick={() => handleSelectInterval("month")}>Month</MenuItem>
                  <MenuItem onClick={() => handleSelectInterval("year")}>Year</MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          )}

          {/* Download Menu */}
          {downloadOption && (
            <Menu placement='bottom-start' strategy="fixed">
              <MenuButton
                as={IconButton}
                aria-label='Options'
                icon={<HiOutlineDotsVertical size={isFullscreen ? EnlargeWidth(20) : 20} />}
                variant='ghost'
                size={"xs"}
                _hover={{ bg: 'transparent', color: 'gray.500' }}
              />
              <MenuList>
                <MenuItem onClick={() => onExport?.exportPNG()}>
                  Download PNG
                </MenuItem>

                <MenuItem onClick={() => onExport?.exportCSV()}>
                  Download CSV
                </MenuItem>

              </MenuList>
            </Menu>
          )}
        </Flex>
      </Flex>

      <Box
        as="main"
        pb={6}
        height={'100%'}
        width={'100%'}
        mt={mt || 5}
        overflow="visible"
        {...contentProps}
      >
        {React.isValidElement(children) &&
          React.cloneElement(children as React.ReactElement<any>, {
            isFullscreen,
          })}
      </Box>
    </Box>
  );
};

export default GraphLayout;
