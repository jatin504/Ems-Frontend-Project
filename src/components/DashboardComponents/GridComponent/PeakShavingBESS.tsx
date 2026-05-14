import { useState } from "react";
import {
  Box,
  Text,
  HStack,
  Switch,
  Button,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

/* ----------- TIME SLOT GROUP ----------- */
const TimeSlotGroup = ({ title }: { title: string }) => {
  const [open, setOpen] = useState(true);
  const [slots, setSlots] = useState<any[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [value, setValue] = useState("10");

  const addSlot = () => {
    if (!start || !end) return;

    setSlots([...slots, {
      start: Number(start),
      end: Number(end),
      value
    }]);

    setModalOpen(false);
    setStart("");
    setEnd("");
  };

  const removeSlot = (index: number) => {
    const updated = [...slots];
    updated.splice(index, 1);
    setSlots(updated);
  };

    return (
    <Box borderTop="1px solid #eee">

      {/* HEADER */}
      <HStack px={3} py={2} justify="space-between" cursor="pointer" onClick={() => setOpen(!open)} bg={useColorModeValue("#f5f5f5", "#071226")}>
        <Text fontSize="12px" color={useColorModeValue("#172554", "#cbd5e1")}>
          {title}
        </Text>
        <Icon as={open ? ChevronUpIcon : ChevronDownIcon} />
      </HStack>

      {/* BODY */}
      {open && (
        <Box px={4} py={4} bg={useColorModeValue("linear-gradient(145deg, #f8fbff, #e9eef5)", "rgba(255,255,255,0.02)")}>

          {/*  TIMELINE SCALE (UPDATED) */}
          <Box
            position="relative"
            h="80px"
            mb={4}
            borderRadius="18px"
            bg="linear-gradient(135deg, #ffffff 0%, #edf3f9 100%)"
            boxShadow={`
              0 12px 28px rgba(15,23,42,0.08),
              inset 0 1px 0 rgba(255,255,255,0.95)
            `}
          >

            {/* SCALE LINE */}
            <Box position="absolute" top="38px" left="0" right="0" h="2px" bg={useColorModeValue("#ccc", "#2d3748")} />

            {/*  COLORED BARS (THICK & ABOVE LINE) */}
            {slots.map((s, i) => {
              const left = (s.start / 24) * 100;
              const width = ((s.end - s.start) / 24) * 100;

              return (
                <Box
                  key={i}
                  position="absolute"
                  top="28px"
                  left={`${left}%`}
                  width={`${width}%`}
                  height="22px"
                  bg={
                    i % 2 === 0
                      ? "linear-gradient(145deg, #00d9b8, #00b89c)"
                      : "linear-gradient(145deg, #ffd84d, #f2b600)"
                  }
                  borderRadius="12px"
                  boxShadow={`
                    0 6px 16px rgba(15,23,42,0.12),
                    inset 0 1px 0 rgba(255,255,255,0.95)
                  `}
                  zIndex={1}
                />
              );
            })}

            {/*  TICKS + LABELS (BOTTOM) */}
            {[...Array(25)].map((_, i) => (
              <Box
                key={i}
                position="absolute"
                left={`${(i / 24) * 100}%`}
                top="58px"
                transform="translateX(-50%)"
                textAlign="center"
                zIndex={2}
              >
                {/* tick line */}
                <Box w="1px" h="10px" bg="#666" mx="auto" />

                {/* label */}
                {i % 3 === 0 && (
                  <Text fontSize="10px" mt="2px" color={useColorModeValue("#555", "#9ca3af")}>
                    {i}h
                  </Text>
                )}
              </Box>
            ))}

          </Box>

          {/* EMPTY */}
          {slots.length === 0 && (
            <Text fontSize="11px" color={useColorModeValue("gray.500", "gray.400")} mb={2}>
              Please configure at least one time slot.
            </Text>
          )}

          {/* LIST */}
          {slots.map((s, i) => (
            <HStack key={i} justify="space-between" p={4} mb={3} borderRadius="16px" bg={useColorModeValue("linear-gradient(135deg, #ffffff 0%, #f4f7fb 100%)", "rgba(255,255,255,0.02)")} boxShadow={useColorModeValue(`0 10px 24px rgba(15,23,42,0.08)`, `0 8px 18px rgba(2,6,23,0.6)`)}>
              <Text fontSize="12px" color={useColorModeValue("#172554", "#cbd5e1")}>
                {s.start}:00 - {s.end}:00
              </Text>

              <HStack>
                <Text fontSize="12px" color={useColorModeValue("#172554", "#cbd5e1")}>{s.value} kW</Text>
                <Text cursor="pointer" onClick={() => removeSlot(i)} style={{ color: useColorModeValue("#ef4444", "#fda4af") }}>✕</Text>
              </HStack>
            </HStack>
          ))}

          {/* ADD BUTTON */}
          <Button
            size="md"
            h="52px"
            w="100%"
            borderRadius="18px"
            position="relative"
            overflow="hidden"
            bg={useColorModeValue("linear-gradient(135deg, #14b8a6 0%, #0f9f93 100%)", "linear-gradient(135deg,#064e46,#063f3a)")}
            color="white"
            fontWeight="800"
            letterSpacing="0.4px"
            boxShadow={`
              0 16px 32px rgba(20,184,166,0.28)
            `}
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: "-120%",
              width: "70%",
              height: "100%",
              bg: "rgba(255,255,255,0.28)",
              transform: "skewX(-20deg)",
              transition: "0.7s",
            }}
            sx={{
              "&:hover::before": {
                left: "140%",
              },
            }}
            _hover={{
              transform: "translateY(-2px)",
            }}
            onClick={() => setModalOpen(true)}
          >
            + ADD TIME SLOT
          </Button>

        </Box>
      )}

      {/*  MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalOverlay />
        <ModalContent
          borderRadius="28px"
          overflow="hidden"
          bg={useColorModeValue("linear-gradient(135deg, rgba(255,255,255,0.92), rgba(241,245,249,0.94))", "linear-gradient(135deg, rgba(6,10,18,0.6), rgba(10,14,26,0.6))")}
          boxShadow={`
            18px 18px 35px rgba(0,0,0,0.18),
            -10px -10px 28px rgba(255,255,255,0.8)
          `}
        >
          <ModalHeader>Add a time slot</ModalHeader>

          <ModalBody>
            <Box mb={3}>
              <Text fontSize="12px" color={useColorModeValue("#172554", "#cbd5e1")}>Start hour :</Text>
              <Input size="sm" border="none" bg={useColorModeValue("white", "#071226")} borderRadius="14px" boxShadow={`0 6px 16px rgba(15,23,42,0.06)`} value={start} onChange={(e) => setStart(e.target.value)} />
            </Box>

            <Box mb={3}>
              <Text fontSize="12px" color={useColorModeValue("#172554", "#cbd5e1")}>End hour :</Text>
              <Input size="sm" border="none" bg={useColorModeValue("white", "#071226")} borderRadius="14px" boxShadow={`0 6px 16px rgba(15,23,42,0.06)`} value={end} onChange={(e) => setEnd(e.target.value)} />
            </Box>

            <Box>
              <Text fontSize="12px" color={useColorModeValue("#172554", "#cbd5e1")}>Setting to apply :</Text>
              <Input size="sm" border="none" bg={useColorModeValue("white", "#071226")} borderRadius="14px" boxShadow={`0 6px 16px rgba(15,23,42,0.06)`} value={value} onChange={(e) => setValue(e.target.value)} />
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={() => setModalOpen(false)}>
              Cancel
            </Button>

            <Button h="50px" px={8} borderRadius="18px" bg={useColorModeValue("linear-gradient(135deg, #ffd84d 0%, #f2b600 100%)", "linear-gradient(135deg,#7c5a00,#5a3f00)")} color="#1f2937" fontWeight="800" letterSpacing="0.5px" boxShadow={`0 16px 32px rgba(242,182,0,0.28)`} _hover={{ transform: "translateY(-2px)" }} onClick={addSlot}>SAVE SLOT</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
};

/* ----------- SOC RESERVE SECTION (NEW) ----------- */
const SocReserveSection = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <Box borderTop="1px solid #eee">

      {/* HEADER */}
      <Box px={4} py={2}>
        <HStack justify="space-between">
          <Box>
            <Text fontSize="12px" fontWeight="500">
              Activate SoC Reserve
            </Text>
            <Text fontSize="11px" color="gray.600">
              SOC will not go under this value except for peak shaving.
            </Text>
          </Box>

          <Switch
            size="sm"
            isChecked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
        </HStack>
      </Box>

      {/*  EXPAND */}
      {enabled && (
        <Box px={4} pb={3}>

          {/* LEGEND */}
          <HStack spacing={4} mb={2}>
            <HStack>
              <Box w="10px" h="10px" bg="#00c2a8" borderRadius="50%" />
              <Text fontSize="11px">3 %</Text>
            </HStack>

            <HStack>
              <Box w="10px" h="10px" bg="#f2b600" borderRadius="50%" />
              <Text fontSize="11px">2 %</Text>
            </HStack>
          </HStack>

          {/*  SAME TIMELINE USE */}
          <TimeSlotGroup title="Monday , Tuesday , Wednesday and Thursday" />
          <TimeSlotGroup title="Friday , Saturday and Sunday" />

        </Box>
      )}
    </Box>
  );
};

/* ----------- MAIN ----------- */
const PeakShavingBESS = () => {
  const [enabled, setEnabled] = useState(false);
  const [backup, setBackup] = useState(true);

  const containerBg = useColorModeValue("linear-gradient(135deg, #eaf0f7 0%, #dce6f2 100%)", "linear-gradient(135deg,#071226 0%,#041025 100%)");
  const containerBorder = useColorModeValue("1px solid rgba(255,255,255,0.75)", "1px solid rgba(255,255,255,0.04)");
  const containerShadow = useColorModeValue(`0 25px 55px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.95)`, `0 18px 40px rgba(2,6,23,0.6)`);
  const panelBg = useColorModeValue("rgba(255,255,255,0.52)", "rgba(255,255,255,0.04)");
  const textMain = useColorModeValue("#4a5568", "#cbd5e1");

  return (
    <Box
      position="relative"
      overflow="hidden"
      borderRadius="34px"
      bg={containerBg}
      border={containerBorder}
      boxShadow={containerShadow}
    >

      {/* TOP RIGHT GLOW */}
      <Box
        position="absolute"
        top="-120px"
        right="-120px"
        w="320px"
        h="320px"
        borderRadius="full"
        bg="rgba(0,255,200,0.10)"
        filter="blur(90px)"
        pointerEvents="none"
      />

      {/* BOTTOM LEFT GLOW */}
      <Box
        position="absolute"
        bottom="-120px"
        left="-120px"
        w="300px"
        h="300px"
        borderRadius="full"
        bg="rgba(59,130,246,0.10)"
        filter="blur(90px)"
        pointerEvents="none"
      />

      {/* HEADER (redesigned) */}
      <Box
        position="relative"
        overflow="hidden"
        px={8}
        py={7}
        bg={useColorModeValue("linear-gradient(90deg, #0f172a 0%, #1e3a5f 55%, #0b1220 100%)", "linear-gradient(90deg, #0f172a 0%, #1e3a5f 55%, #0b1220 100%)")}
      >
        <Box position="absolute" top="0" left="0" w="100%" h="3px" bg="linear-gradient(90deg, #00d9b8, #3b82f6, #8b5cf6)" />

        <Text
          fontSize="18px"
          fontWeight="800"
          color="white"
          letterSpacing="0.6px"
          textTransform="uppercase"
        >
          Peak Shaving Control
        </Text>

        <Text
          fontSize="11px"
          bg={panelBg}
          mt={1}
        >
          Intelligent BESS peak demand optimization system
        </Text>
      </Box>

      {/* DESCRIPTION */}
      <Box px={6} py={5} borderTop={`1px solid ${useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.06)")}`} bg={useColorModeValue("rgba(255,255,255,0.52)", "rgba(255,255,255,0.02)")} backdropFilter="blur(16px)">
        <Text fontSize="12px" color={textMain} lineHeight="22px">
          Import from the grid can increase because of plant events (Load peak or drop of PV production).
          Peak shaving feature allows to limit this increase to a specified value by compensating with other units.
        </Text>
      </Box>

      {/* BESS TOGGLE */}
      <Box px={6} py={5} borderTop={`1px solid ${useColorModeValue("rgba(255,255,255,0.5)", "rgba(255,255,255,0.03)")}`} bg={panelBg} backdropFilter="blur(16px)" border={useColorModeValue("1px solid rgba(255,255,255,0.7)", "1px solid rgba(255,255,255,0.04)") }>
        <HStack justify="space-between">
          <Box>
            <Text fontSize="12px" fontWeight="700" color={useColorModeValue("#172554", "#cbd5e1")}>
              Activate peak shaving with BESS
            </Text>
            <Text fontSize="11px" color={useColorModeValue("gray.600", "gray.300")}>
              Enable discharging the BESS to limit the active power import from the grid.
            </Text>
          </Box>

          <Switch
            size="sm"
            isChecked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
        </HStack>
      </Box>

      {/* GENSET DISABLED */}
      <Box px={6} py={5} borderTop={`1px solid ${useColorModeValue("rgba(255,255,255,0.5)", "rgba(255,255,255,0.03)")}`} bg={panelBg} backdropFilter="blur(16px)" border={useColorModeValue("1px solid rgba(255,255,255,0.7)", "1px solid rgba(255,255,255,0.04)")} opacity={0.5}>
        <HStack justify="space-between">
          <Box>
            <Text fontSize="12px" fontWeight="700" color={useColorModeValue("#172554", "#cbd5e1")}>
              Activate peak shaving with genset
            </Text>
            <Text fontSize="11px" color={useColorModeValue("gray.600", "gray.300")}>Enable increasing genset production to limit the active power import from the grid.</Text>
          </Box>
          <Switch size="sm" isDisabled />
        </HStack>
      </Box>

      {/*  EXPANDED CONTENT (REPLACED) */}
      {enabled && (
        <Box p={6}>

          {/* TOP GRID */}
          <Box
            display="grid"
            gridTemplateColumns={{ base: "1fr", xl: "1.1fr 0.9fr" }}
            gap={5}
            mb={5}
          >

            {/* LEFT PANEL */}
            <Box borderRadius="28px" overflow="hidden" bg={panelBg} backdropFilter="blur(18px)" border={useColorModeValue("1px solid rgba(255,255,255,0.7)", "1px solid rgba(255,255,255,0.04)")} boxShadow={useColorModeValue("0 18px 35px rgba(15,23,42,0.08)", "0 12px 28px rgba(2,6,23,0.6)") }>
              {/* HEADER */}
              <Box px={6} py={4} bg={useColorModeValue("linear-gradient(90deg, #0f172a, #1e293b)", "linear-gradient(90deg,#0f172a,#1e293b)") }>
                <Text fontSize="13px" fontWeight="700" color="white" letterSpacing="0.4px">PEAK SHAVING TARGET</Text>
              </Box>

              {/* BODY */}
              <Box p={5}>
                <Text fontSize="11px" color={useColorModeValue("gray.600", "gray.300")} mb={4}>Define the limit for active power import from the grid for various timeslots.</Text>

                <TimeSlotGroup title="Monday , Tuesday , Wednesday and Thursday" />
                <TimeSlotGroup title="Friday , Saturday and Sunday" />
              </Box>
            </Box>

            {/* RIGHT PANEL */}
            <Box display="flex" flexDirection="column" gap={5}>

              {/* WARNING */}
              <Box borderRadius="26px" p={5} bg={useColorModeValue("linear-gradient(135deg, #fff4f4 0%, #ffe8e8 100%)", "linear-gradient(135deg,#3a0f0f,#4b1212)")} border={useColorModeValue("1px solid rgba(255,180,180,0.4)", "1px solid rgba(255,120,120,0.08)")} boxShadow={useColorModeValue("0 12px 25px rgba(239,68,68,0.08)", "0 8px 20px rgba(55,11,11,0.25)") }>
                <Text fontSize="12px" fontWeight="700" color={useColorModeValue("#991b1b", "#ffb4b4")} mb={2}>WARNING</Text>

                <Text fontSize="11px" color={useColorModeValue("#7f1d1d", "#ffb4b4")} lineHeight="20px">Peak shaving with BESS requires the activation of BESS control.</Text>
              </Box>

              {/* SENSING */}
              <Box borderRadius="26px" overflow="hidden" bg={panelBg} backdropFilter="blur(18px)" border={useColorModeValue("1px solid rgba(255,255,255,0.7)", "1px solid rgba(255,255,255,0.04)")} boxShadow={useColorModeValue("0 18px 35px rgba(15,23,42,0.08)", "0 12px 28px rgba(2,6,23,0.6)") }>
                <Box px={5} py={4} borderBottom={`1px solid ${useColorModeValue("rgba(255,255,255,0.5)", "rgba(255,255,255,0.03)")}`}>
                  <Text fontSize="12px" fontWeight="700" color={useColorModeValue("#172554", "#cbd5e1")}>Grid Meter Sensing</Text>
                </Box>

                <Box p={5}>
                  <Text fontSize="11px" color={useColorModeValue("gray.600", "gray.300")} mb={4}>Determines how to calculate the active power reference for the peak shaving function.</Text>

                  <Select size="sm" borderRadius="14px" bg={useColorModeValue("white", "#071226")}>
                    <option>Sum of all phases</option>
                    <option>3x lowest phase</option>
                  </Select>
                </Box>
              </Box>

              {/* BACKUP */}
              <Box borderRadius="26px" overflow="hidden" bg={panelBg} backdropFilter="blur(18px)" border={useColorModeValue("1px solid rgba(255,255,255,0.7)", "1px solid rgba(255,255,255,0.04)")} boxShadow={useColorModeValue("0 18px 35px rgba(15,23,42,0.08)", "0 12px 28px rgba(2,6,23,0.6)") }>
                <Box p={5}>
                  <HStack justify="space-between">
                    <Box>
                      <Text fontSize="12px" fontWeight="700" color={useColorModeValue("#172554", "#cbd5e1")}>Genset Backup</Text>

                      <Text fontSize="11px" color={useColorModeValue("gray.600", "gray.300")} mt={1}>Allow gensets to support peak shaving when SOC drops.</Text>
                    </Box>

                    <Switch size="sm" isChecked={backup} onChange={(e) => setBackup(e.target.checked)} />
                  </HStack>
                </Box>
              </Box>

            </Box>
          </Box>

          {/* BOTTOM WARNING */}
          <Box borderRadius="26px" p={5} mb={5} bg={useColorModeValue("linear-gradient(135deg, #fff8eb 0%, #fff1cc 100%)", "linear-gradient(135deg,#3a2a0e,#2b1b07)")} border={useColorModeValue("1px solid rgba(255,210,100,0.4)", "1px solid rgba(255,180,80,0.06)")} boxShadow={useColorModeValue("0 12px 25px rgba(245,158,11,0.10)", "0 10px 22px rgba(90,60,10,0.12)") }>
            <Text fontSize="12px" fontWeight="700" color={useColorModeValue("#92400e", "#ffdba3")} mb={2}>SYSTEM NOTE</Text>

            <Text fontSize="11px" color={useColorModeValue("#78350f", "#ffdba3")} lineHeight="20px">Peak shaving with BESS and genset backup requires automatic genset start/stop control activation.</Text>
          </Box>

          {/* SOC SECTION */}
          <Box borderRadius="30px" overflow="hidden" bg={panelBg} backdropFilter="blur(18px)" border={useColorModeValue("1px solid rgba(255,255,255,0.7)", "1px solid rgba(255,255,255,0.04)")} boxShadow={useColorModeValue("0 18px 35px rgba(15,23,42,0.08)", "0 12px 28px rgba(2,6,23,0.6)") }>
            <SocReserveSection />
          </Box>

        </Box>
      )}

    </Box>
  );
};

export default PeakShavingBESS;