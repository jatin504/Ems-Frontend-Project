import {
  Box,
  Text,
  Flex,
  VStack,
  HStack,
  Input,
  Select,
  Badge,
  Radio,
  RadioGroup,
  Textarea,
  Button,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useInsertStrategy } from "../hooks/energy_strategy/useInsertStrategy";
import { useFetchSchedules } from "../hooks/energy_strategy/useFetchSchedules";
import { FaCalendarDays } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

const statusColorMap: Record<string, string> = {
  Scheduled: "teal",
  Waiting: "yellow",
  Skipped: "red",
  Executing: "blue",
};

export default function ScheduledCommandPanel() {
  const toast = useToast();
  const insertStrategy = useInsertStrategy();
  const fetchSchedules = useFetchSchedules();
  const [scheduleFilter, setScheduleFilter] = useState<'today' | 'all'>('today');
  const [priority, setPriority] = useState("medium");

  const [scheduleList, setScheduleList] = useState([
    { time: "", command: "", power: "", duration: "", status: "" },
  ]);


useEffect(() => {
  fetchSchedules(scheduleFilter).then((data) => {
    setScheduleList(
      data.map((item : any) => ({
        time: `${new Date(item.start_ts).toLocaleString()}`,
        command: item.type,
        power: item.power ? `${item.power} kW` : "Auto",
        duration: `${item.duration} min`,
        status: "Scheduled", // Replace with real status if stored in DB
      }))
    );
  });
}, [scheduleFilter]);

  const [form, setForm] = useState({
    from: "",
    to: "",
    command: "Charge",
    power: "",
    duration: "",
    socMin: "",
    socMax: "",
    tariff: "",
    remarks: "",
  });

  const handleAddSchedule = async () => {
    const errors: string[] = [];

    if (!form.from || !form.to) {
      errors.push("Start and End times are required.");
    } else if (new Date(form.from) >= new Date(form.to)) {
      errors.push("Start time must be before End time.");
    }

    if (!form.command) {
      errors.push("Command type is required.");
    }

    if (form.power && isNaN(Number(form.power))) {
      errors.push("Power must be a number.");
    }

    if (form.duration && !form.tariff) {
      errors.push("Tarrif's count must be match with the Duration's count.");
    }

    if (form.socMin && isNaN(Number(form.socMin))) {
      errors.push("Min SoC must be a number.");
    }

    if (form.socMax && isNaN(Number(form.socMax))) {
      errors.push("Max SoC must be a number.");
    }

    if (
      form.socMin &&
      form.socMax &&
      Number(form.socMin) > Number(form.socMax)
    ) {
      errors.push("Min SoC cannot be greater than Max SoC.");
    }

    if (form.tariff && !form.duration) {
      errors.push("Duration's count must be a match with the Tariff's count.");
    }

    if (form.tariff && form.duration) {
      const tariff_len = form.tariff.split(",").length;
      const duration_len = form.duration.split(",").length;
      if(tariff_len !== duration_len) {
        errors.push("Tariff and Duration count must be equal.");
      }
    }

    if (!priority) {
      errors.push("Priority is required.");
    }

    if (errors.length > 0) {

      return toast({
        title: "Validation Error",
        description: errors.join(" "),
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      });
    }

    // Proceed with submission
    // console.log("Schedule Added", { ...form, priority });
    const insertedId = await insertStrategy(form, priority);

    if (insertedId) {
      setForm({
        from: "",
        to: "",
        command: "Charge",
        power: "",
        duration: "",
        socMin: "",
        socMax: "",
        tariff: "",
        remarks: "",
      });

      // Refresh the list with the current filter
    const updated = await fetchSchedules(scheduleFilter);
    setScheduleList(
      updated.map((item: any) => ({
        time: `${new Date(item.start_ts).toLocaleString()}`,
        command: item.type,
        power: item.power ? `${item.power} kW` : "Auto",
        duration: `${item.duration} min`,
        status: "Scheduled", // Replace with real status if needed
      }))
    );
      // Optional: reset form or update schedule list
      // console.log("Inserted row ID:", insertedId);
    }
  };


  const navigate = useNavigate();

  return (
    <Box
      w="100%"
      height="100%"
      bg="gray.900"
      borderRadius="md"
      p={4}
      boxShadow="md"
      overflowY="auto"
    >
      <Flex gap={4} align="flex-start" direction="row" height="100%">
        {/* Left Table Panel */}
        <Box width="50%">
          <HStack justifyContent={'space-between'} align={"flex-start"}>
            <Text fontWeight="bold" fontSize="md" mb={4}>Scheduled Commands</Text>
            <HStack>
              <Button colorScheme='teal' variant={scheduleFilter == 'today' ? 'solid' : 'outline'} onClick={() => setScheduleFilter('today')} size={'sm'}>
                Today
              </Button>
              <Button colorScheme='teal' variant={scheduleFilter == 'all' ? 'solid' : 'outline'} onClick={() => setScheduleFilter('all')} size={'sm'}>
                All
              </Button>
              <IconButton aria-label="Calender" icon={<FaCalendarDays />} title="Calendar" colorScheme='teal' variant={'outline'}size={'sm'} onClick={() => navigate('/calendar')} />
                
            </HStack>
          </HStack>

          <HStack fontWeight="semibold" fontSize="sm" borderBottom="1px" borderColor="gray.600" pb={2}>
            <Box flex="1">Start Time</Box>
            <Box flex="1">Command</Box>
            <Box flex="1">Power (kW)</Box>
            <Box flex="1">Duration</Box>
            <Box flex="1">Status</Box>
          </HStack>

          <VStack align="stretch" spacing={3} mt={2}>
            {scheduleList.map((item, i) => (
              <HStack
                key={i}
                fontSize="sm"
                borderBottom="1px"
                borderColor="gray.700"
                pb={2}
                bg={i % 2 === 0 ? "gray.800" : "gray.700"}
                _hover={{ bg: "gray.600" }}
              >
                <Box flex="1">{item.time}</Box>
                <Box flex="1">{item.command}</Box>
                <Box flex="1">{item.power}</Box>
                <Box flex="1">{item.duration}</Box>
                <Box flex="1">
                  <Badge colorScheme={statusColorMap[item.status]}>{item.status}</Badge>
                </Box>
              </HStack>
            ))}
          </VStack>
        </Box>

        {/* Right Form Panel */}
        <Box width="50%">
          <Text fontWeight="bold" fontSize="md" mb={4}>+ New Schedule Command</Text>

          <Text fontSize="sm" mb={1}>Time Window</Text>
          <HStack mb={3}>
            <Input
              type="datetime-local"
              size="sm"
              value={form.from}
              onChange={(e) => setForm({ ...form, from: e.target.value })}
              bg="gray.700"
              borderColor="gray.600"
            />
            <Input
              type="datetime-local"
              size="sm"
              value={form.to}
              onChange={(e) => setForm({ ...form, to: e.target.value })}
              bg="gray.700"
              borderColor="gray.600"
            />
          </HStack>

          <Text fontSize="sm" mb={1}>Command Type</Text>
          <Select
            size="sm"
            mb={3}
            value={form.command}
            onChange={(e) => setForm({ ...form, command: e.target.value })}
            bg="gray.700"
            borderColor="gray.600"
          >
            <option style={{ background: "#2d2d2d" }} >Charge</option>
            <option style={{ background: "#2d2d2d" }} >Discharge</option>
            <option style={{ background: "#2d2d2d" }} >Idle</option>
            <option style={{ background: "#2d2d2d" }} >Grid Support</option>
          </Select>

          <HStack mb={3} width={"100%"}>
            {/* <VStack align={"flex-start"} width={"100%"}>
              <Text fontSize="sm" mb={1}>Set Power (optional)</Text>
              <Input
                placeholder="kW"
                size="sm"
                value={form.power}
                onChange={(e) => setForm({ ...form, power: e.target.value })}
                bg="gray.700"
                borderColor="gray.600"
              />
            </VStack> */}
            <VStack align={"flex-start"} width={"100%"}>
              <Text fontSize="sm" mb={1}>Duration (min)</Text>
              <Input
                placeholder="60,60"
                size="sm"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                bg="gray.700"
                borderColor="gray.600"
              />
            </VStack>
            <VStack align={"flex-start"} width={"100%"}>
              <Text fontSize="sm" mb={1}>Tariff (₹)</Text>
              <Input
                placeholder="4.5,3.5"
                size="sm"
                value={form.tariff}
                onChange={(e) => setForm({ ...form, tariff: e.target.value })}
                bg="gray.700"
                borderColor="gray.600"
              />
            </VStack>
          </HStack>

          <HStack mb={3} width={"100%"}>
            <VStack align={"flex-start"} width={"100%"}>
              <Text fontSize="sm" mb={1}>SoC Threshold</Text>
              <HStack width={"100%"}>
                <Input
                  placeholder="Min"
                  size="sm"
                  value={form.socMin}
                  onChange={(e) => setForm({ ...form, socMin: e.target.value })}
                  w="55px"
                  bg="gray.700"
                  borderColor="gray.600"
                />
                <Text fontSize="sm">/</Text>
                <Input
                  placeholder="Max"
                  size="sm"
                  value={form.socMax}
                  onChange={(e) => setForm({ ...form, socMax: e.target.value })}
                  w="55px"
                  bg="gray.700"
                  borderColor="gray.600"
                />
              </HStack>
            </VStack>
            {/* <VStack align={"flex-start"} width={"100%"}>
              <Text fontSize="sm" mb={1}>Tariff ₹ (optional)</Text>
              <Input
                placeholder="Rs."
                size="sm"
                value={form.tariff}
                onChange={(e) => setForm({ ...form, tariff: e.target.value })}
                bg="gray.700"
                borderColor="gray.600"
              />
            </VStack> */}
          </HStack>

          <Text fontSize="sm" mb={1}>Priority Level</Text>
          <RadioGroup onChange={(val) => setPriority(val)} value={priority}>
            <HStack spacing={6} mb={3}>
              <Radio value="low" size="sm">Low</Radio>
              <Radio value="medium" size="sm">Medium</Radio>
              <Radio value="high" size="sm">High</Radio>
            </HStack>
          </RadioGroup>

          <Text fontSize="sm" mb={1}>Remarks</Text>
          <Textarea
            placeholder="Comment to this schedule."
            size="sm"
            value={form.remarks}
            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            bg="gray.700"
            borderColor="gray.600"
            h="60px"
            mb={4}
          />

          <Button colorScheme="teal" size="sm" onClick={handleAddSchedule}>
            Add Command
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}
