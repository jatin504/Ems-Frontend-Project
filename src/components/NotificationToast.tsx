import { use, useEffect, useState } from "react";
import {
  Box,
  CloseButton,
  Text,
  Button,
  HStack,
  VStack,
  Center,
  Wrap,
  WrapItem,
  useColorModeValue,
  useInterval,
} from "@chakra-ui/react";
import { AiOutlineRobot } from "react-icons/ai";
import CloudConfigModal from "./DashboardComponents/BessControlComponents/Widgets/CloudConfigModal";

const NotificationToast = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<any>(null);
  const [timer, setTimer] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchData = async () => {
      try {
        const res = await fetch("http://75.119.146.115:5179/api/cloud/recommendation");
        const result = await res.json();
        ("API Result:", result, "Timer:", timer, "Visible:", visible);
        if (
          result.success &&
          result.user_approved === null &&
          timer <= 0 &&
          visible === false
        ) {
          const stageName = result.stage.replace(/_/g, " ");
          const message = `${stageName} alert: Incoming cloud transient expected to reduce solar generation by approximately ${Math.round(result.delta_power_kw / 1000)} megawatts. Select BESS discharge setpoint to maintain scheduled power within ${result.timer} seconds.`;
          speakNotification(message);

          setData({
            stage: result.stage,
            user_approved: result.user_approved,
            remaining_time: result.timer,
            recommendations: result.recommendations,
            delta_power_kw: result.delta_power_kw,
          });
          setVisible(true);
          setTimer(result.timer);
        }
      } catch (err) {
        console.error("API Error:", err);
      }
    };
  useInterval(() => {
    if (timer === 0) {
      fetchData();
    }
  }, 5000);

  // DARK + LIGHT MODE
  const bg = useColorModeValue("white", "#1e1f23");
  const borderColor = useColorModeValue("gray.200", "#2a2b30");
  const textColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.500", "gray.400");
  const buttonBg = useColorModeValue("gray.100", "#2a2b30");
  const buttonHover = useColorModeValue("gray.200", "#3a3b40");
  const avatarBg = useColorModeValue("#0f766e", "#064e3b");

  const speakNotification = (message: string) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(message);

      speech.lang = 'en-US'; // Hindi chahiye to 'hi-IN'
      speech.rate = 0.95;   // thoda smooth
      speech.pitch = 1;

      window.speechSynthesis.cancel(); // overlap avoid
      window.speechSynthesis.speak(speech);
    }
  };

  useEffect(() => {
    

    fetchData();


  }, []);


  useEffect(() => {
    if (timer === 0 && data && data.user_approved === null) {
      handleSelect(data.recommendations[0], "AUTO");
    }
    else if (timer > 0 && data && data.user_approved === null) {
      setData((prev: any) => ({ ...prev, remaining_time: timer }));
    }
    else if (data && data.user_approved !== null) {
      setTimer(0);
    }

    if (timer > 0 && visible) {
      setTimeout(() => {
        setTimer((prev) => (prev > 0 ? prev - 1: 0));
      }, 1000);
    }


  }, [timer]);

 


  const handleSelect = async (val: number, action = "YES") => {
    try {
      await fetch("http://75.119.146.115:5179/api/cloud/select", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedValue: val,
          action: action
        }),
      });

      setVisible(false);
      setData(null);
      setTimer(0);
    } catch (err) {
      console.error("Select API Error:", err);
    }
  };

  if (!visible || !data) return null;

  return (
    <>
      <Box
        position="fixed"
        bottom="20px"
        right="20px"
        zIndex={99999}
        w="400px"
        bg={bg}
        border="1px solid"
        borderColor={borderColor}
        boxShadow="0 0 20px rgba(0,0,0,0.5)"
        borderRadius="lg"
        p={4}
      >
        <Center
          w="48px"
          h="48px"
          bg={avatarBg}
          borderRadius="full"
          color="white"
          position="absolute"
          top="-12px"
          left="-12px"
          boxShadow="0 0 0 1px rgba(255,255,255,0.08)"
        >
          <AiOutlineRobot size={24} color="white" />
        </Center>

        {/* HEADER */}
        <HStack justify="space-between" align="start" mb={3}>
          <HStack spacing={3}>
            <VStack align="start" spacing={0} pl={6}>
              <Text
                fontSize="xs"
                color="#00ff88"
                fontWeight="bold"
                sx={{
                  textShadow: "0 0 8px rgba(0,255,136,0.6)",
                  fontFamily: `"Courier New", monospace`,
                }}
              >
                ARKA AI
              </Text>

              <Text fontWeight="bold" fontSize="sm" color={textColor}>
                Cloud Alert ({data.stage})
              </Text>

              <Text fontSize="xs" color="red.400">
                Auto select in: {timer}s
              </Text>
            </VStack>
          </HStack>

          <CloseButton size="sm" onClick={() => setVisible(false)} />
        </HStack>

        {/* TITLE */}
        <Text fontSize="xs" color={subTextColor} mb={2}>
          Recommended Dispatch Setpoints:
        </Text>

        {/* RECOMMENDATIONS */}
        <Wrap spacing={2} mb={3}>
          {data.recommendations?.map((v: number, i: number) => (
            <WrapItem key={i}>
              <Button
                size="sm"
                bg={buttonBg}
                color={textColor}
                _hover={{ bg: buttonHover }}
                onClick={() => handleSelect(v, "YES")}
              >
                {v.toFixed(0)} kW
              </Button>
            </WrapItem>
          ))}
        </Wrap>

        {/* ACTIONS */}
        <HStack justify="space-between">
          <HStack>
            <Button
              size="sm"
              colorScheme="green"
              onClick={() => handleSelect(data.recommendations[0], "YES")}
            >
              Yes
            </Button>

            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              onClick={() => handleSelect(0, "NO")}
            >
              No
            </Button>
          </HStack>

          <Button
            size="sm"
            variant="ghost"
            color="blue.300"
            onClick={() => setIsModalOpen(true)}
          >
            More Info
          </Button>
        </HStack>
      </Box>

      <CloudConfigModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cloudModule={data}
        onSave={() => {}}
      />
    </>
  );
};

export default NotificationToast;