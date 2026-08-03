import { Box, Text, Grid, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString()?.replace(/\/$/, "") || "";

const DEVICE_ID = "plant_1_block_1_inverter_inverter_1"; // replace with actual device ID for group captive performance

const GroupCaptivePerformance = () => {

  const cardBg = useColorModeValue("white", "#0b2239");
  const titleColor = "black";
  const labelColor = useColorModeValue("gray.500", "whiteAlpha.600");
  const percentColor = useColorModeValue("#0b2239", "white");
  const amountColor = useColorModeValue("#0b2239", "white");

  const [vals,setVals] = useState({
    ppaTill:0,
    ppaToday:0,
    estTill:0,
    actToday:0
  });

  /*  SAFE KEY READER (space safe) */
  const getVal = (deviceObj:any,key:string) => {

    const realKey = Object.keys(deviceObj)
      .find(k => k.trim() === key);

    if(!realKey) return 0;

    return Number(deviceObj[realKey]?.value ?? 0);
  };

  const loadData = () => {

    fetch(
      `${API_BASE}/api/lastest-direct-data/multiple-latest-devices`,
      {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          device_ids: DEVICE_ID
        })
      }
    )
    .then(r=>r.json())
    .then(j=>{

      if(!j.success) return;

      const d = j.data?.[DEVICE_ID];
      if(!d) return;

      setVals({
        ppaTill: getVal(d,"Alarm_2"),
        ppaToday: getVal(d,"Alarm_2"),
        estTill: getVal(d,"BCU_2_Rack_voltage"),
        actToday: getVal(d,"Battery_cabin_humidity_3")
      });

    });

  };

  useEffect(() => {

  let mounted = true;

  const run = async () => {

    try {

      const res = await fetch(
        `${API_BASE}/api/lastest-direct-data/multiple-latest-devices`,
        {
          method:"POST",
          headers:{ "Content-Type":"application/json" },
          body: JSON.stringify({
            device_ids: DEVICE_ID
          })
        }
      );

      const j = await res.json();

      if(!mounted) return;

      if(!j.success) return;

      const d = j.data?.[DEVICE_ID];
      if(!d) return;

      setVals({
        ppaTill: getVal(d,"Alarm_2"),
        ppaToday: getVal(d,"Alarm_2"),
        estTill: getVal(d,"BCU_2_Rack_voltage"),
        actToday: getVal(d,"Battery_cabin_humidity_3")
      });

    } catch(e){
      console.error(e);
    }

  };

  run();

  const interval = setInterval(run,60000);

  return () => {
    mounted = false;
    clearInterval(interval);
  };

},[]);

  return (
    <Box
      bg={cardBg}
      borderRadius="lg"
      p={3}
      shadow="lg"
      width="340px"
      height={250}
    >

      <Text fontSize="md" color={titleColor} mb={3} fontWeight="bold">
        GROUP CAPTIVE PPA PERFORMANCE
      </Text>

      <Grid templateColumns="repeat(2,1fr)" gap={4}>

        <Box>
          <Text fontSize="xs" color={labelColor}>
            PPA Performance Till Date
          </Text>

          <Text fontSize="20px" fontWeight="bold" color={percentColor}>
            {vals.ppaTill}%
          </Text>

          <Text fontSize="sm" mt={0.5} color={amountColor}>
            ₹{vals.ppaTill}
          </Text>
        </Box>

        <Box>
          <Text fontSize="xs" color={labelColor}>
            PPA Performance Today
          </Text>

          <Text fontSize="20px" fontWeight="bold" color={percentColor}>
            {vals.ppaToday}%
          </Text>

          <Text fontSize="sm" mt={0.5} color={amountColor}>
            ₹{vals.ppaToday}
          </Text>
        </Box>

        <Box>
          <Text fontSize="xs" color={labelColor}>
            Estimated Revenue Till Date
          </Text>

          <Text fontSize="20px" fontWeight="bold" color={percentColor}>
            {vals.estTill}%
          </Text>

          <Text fontSize="sm" mt={0.5} color={amountColor}>
            ₹{vals.estTill}
          </Text>
        </Box>

        <Box>
          <Text fontSize="xs" color={labelColor}>
            Actual Revenue Today
          </Text>

          <Text fontSize="20px" fontWeight="bold" color={percentColor}>
            {vals.actToday}%
          </Text>

          <Text fontSize="sm" mt={0.5} color={amountColor}>
            ₹{vals.actToday}
          </Text>
        </Box>

      </Grid>

    </Box>
  );
};

export default GroupCaptivePerformance;