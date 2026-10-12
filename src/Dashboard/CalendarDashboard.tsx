import {
  Box,
  Flex,
  useColorModeValue,
  HStack,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useState, useRef, useMemo, useEffect } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer, type View } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  isSameWeek,
} from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFetchSchedules } from "../hooks/energy_strategy/useFetchSchedules";
import FloatingAIAgentButton from "../components/FloatingAIAgentButton";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarPage = () => {
  const fetchSchedules = useFetchSchedules();
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [highlightedDate, setHighlightedDate] = useState<Date | null>(new Date());
  const [view, setView] = useState<View>("week");
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();

  const calendarRef = useRef<any>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStart, setNewStart] = useState<Date | null>(new Date());
  const [newEnd, setNewEnd] = useState<Date | null>(new Date());

  // Fetch schedules from backend once
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await fetchSchedules("all"); // fetch all schedules
        const mapped = data.map((item: any) => {
          const start = new Date(item.start_ts);
          const end = item.end_ts
            ? new Date(item.end_ts)
            : new Date(start.getTime() + (item.duration || 60) * 60000);

          return {
            title: `${(item.type ?? item.command) ?? "Schedule"} (${item.power ? item.power + " kW" : "Auto"})`,
            start,
            end,
            allDay: false, // ensure time-grid rendering even for multi-day events
            description: `${item.duration || "N/A"} min - ${item.status || "Scheduled"}`,
          };
        });
        setEvents(mapped);
      } catch (err) {
        console.error("Failed to fetch schedules:", err);
      }
    };

    fetchEvents();
  }, [fetchSchedules]);

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
    onOpen();
  };

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
    setHighlightedDate(start);
  };

  const handleMiniCalendarChange = (newDate: Date | null) => {
    if (!newDate) return;
    setDate(newDate);
    setSelectedDate(newDate);
    setHighlightedDate(newDate);
    calendarRef.current?.navigate?.(newDate);
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
    setSelectedDate(newDate);
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  const handleAddEvent = () => {
    if (!newTitle || !newStart || !newEnd) return;
    const newEvent = {
      title: newTitle,
      start: newStart,
      end: newEnd,
      allDay: false,
      description: newDescription,
    };
    setEvents([...events, newEvent]);
    onAddClose();
    setNewTitle("");
    setNewDescription("");
    setNewStart(new Date());
    setNewEnd(new Date());
  };

  const sidebarEvents = useMemo(() => {
    if (view === "week") {
      return events.filter((event) =>
        isSameWeek(event.start, date, { weekStartsOn: 1 })
      );
    } else {
      return events.filter(
        (event) =>
          new Date(event.start).toDateString() ===
          new Date(selectedDate).toDateString()
      );
    }
  }, [events, view, date, selectedDate]);

  const bgColor = useColorModeValue("#F4F6F6", "#091e1eff");
  const textColor = useColorModeValue("black", "white");

  return (
    <>
      <Box
        bg={bgColor} minH="100vh" color={textColor} px={5}
      >
        <Flex width={"100%"}>
          {/* Left Sidebar */}
          <Box w="250px" bg={bgColor} p={4} borderRight="1px solid #4A5568" color={textColor}>
            <Text fontSize="lg" mb={4} fontWeight="bold">
              Calendar
            </Text>

            <Box
              bg={bgColor}
              borderRadius="md"
              mb={6}
              display="flex"
              justifyContent="center"
              sx={{
                ".react-datepicker": {
                  background: bgColor,
                  border: "none",
                  boxShadow: "none",
                },
                ".react-datepicker__month-container": {
                  background: bgColor,
                },
                ".react-datepicker__header": {
                  background: bgColor,
                  border: "none",
                  color: textColor,
                },
                ".react-datepicker__current-month": {
                  color: textColor,
                },
                ".react-datepicker__day-name, .react-datepicker__day": {
                  color: textColor,
                },
                ".react-datepicker__day--selected": {
                  background: "#3182CE",
                  color: "white",
                },
              }}
            >
              <DatePicker selected={date} onChange={handleMiniCalendarChange} inline />
            </Box>

            <Text fontSize="sm" color="gray.400">My calendars</Text>
            <Text fontSize="sm" color="gray.200" mt={2}>Calendar</Text>
            <Button mt={4} size="sm" variant="link" colorScheme="blue">
              Show all
            </Button>
          </Box>

          {/* Main Calendar */}
          <Box flex="1" p={6} bg={bgColor} color={textColor}>
            <HStack justify="space-between" mb={4}>
              <Text fontSize="md" fontWeight="semibold">
                {format(date, "dd MMMM yyyy")}
              </Text>
              <Button size="sm" colorScheme="blue" onClick={onAddOpen}>
                New event
              </Button>
            </HStack>

            <Box bg={bgColor} borderRadius="md" p={4} color={textColor} minH="600px">
              <BigCalendar
                selectable
                ref={calendarRef}
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                date={date}
                onNavigate={handleNavigate}
                onView={handleViewChange}
                view={view}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                showMultiDayTimes // ✨ multi-day events in time grid (not all-day row)
                scrollToTime={new Date(1970, 0, 1, 9, 0, 0)} // optional initial scroll
                dayPropGetter={(dayDate: any) => {
                  if (
                    highlightedDate &&
                    dayDate.toDateString() === highlightedDate.toDateString()
                  ) {
                    return {
                      style: {
                        backgroundColor: "#90CDF4",
                        color: "black",
                        borderRadius: "6px",
                      },
                    };
                  }
                  return {};
                }}
              />
            </Box>
          </Box>

          {/* Right Sidebar */}
          {(view === "week" || view === "month" || view === "day") && (
            <Box w="300px" bg={bgColor} color={textColor} p={4} borderLeft="1px solid #4A5568">
              <Text fontSize="lg" mb={4} fontWeight="bold">
                {view === "week"
                  ? "Events This Week"
                  : "Events on " + format(selectedDate, "dd MMM yyyy")}
              </Text>
              {sidebarEvents.length === 0 ? (
                <Text fontSize="sm" color={useColorModeValue("gray.400", "gray.400")}>No events to show.</Text>
              ) : (
                sidebarEvents.map((ev, i) => (
                  <Box key={i} mb={4} p={3} borderRadius="md" bg={useColorModeValue("gray.100", "gray.700")} color={textColor}>
                    <Text fontWeight="bold" mb={1}>{ev.title}</Text>
                    <Text fontSize="sm" mb={1}>
                      {format(ev.start, "dd MMM, hh:mm a")} – {format(ev.end, "hh:mm a")}
                    </Text>
                    <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.300")}>{ev.description || "No description"}</Text>
                  </Box>
                ))
              )}
            </Box>
          )}

          {/* View Event Modal */}
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent bg="gray.800" color="white">
              <ModalHeader>{selectedEvent?.title}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text fontSize="sm" mb={2}>Start: {selectedEvent?.start?.toLocaleString()}</Text>
                <Text fontSize="sm" mb={2}>End: {selectedEvent?.end?.toLocaleString()}</Text>
                <Text fontSize="sm">Description: {selectedEvent?.description || "No description"}</Text>
              </ModalBody>
            </ModalContent>
          </Modal>

          {/* Add Event Modal */}
          <Modal isOpen={isAddOpen} onClose={onAddClose} isCentered>
            <ModalOverlay />
            <ModalContent bg="gray.800" color="white">
              <ModalHeader>Add New Event</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4} mt={2}>
                  <Input
                    placeholder="Title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                  <Input
                    placeholder="Description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                  <Box>
                    <Text fontSize="sm" mb={1}>Start Date</Text>
                    <DatePicker
                      selected={newStart}
                      onChange={(date) => setNewStart(date)}
                      showTimeSelect
                      dateFormat="Pp"
                    />
                  </Box>
                  <Box>
                    <Text fontSize="sm" mb={1}>End Date</Text>
                    <DatePicker
                      selected={newEnd}
                      onChange={(date) => setNewEnd(date)}
                      showTimeSelect
                      dateFormat="Pp"
                    />
                  </Box>
                  <Button colorScheme="blue" onClick={handleAddEvent}>
                    Save Event
                  </Button>
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>

        </Flex>
      </Box>

      {/* add floating button - adjust imageSrc to your asset path */}
      {/* cast props to any to satisfy the component's Props typing when prop names differ */}
      <FloatingAIAgentButton {...({ imageSrc: "/assets/ems-ai-ui.png", title: "EMS AI Agent" } as any)} />
    </>
  );
};

export default CalendarPage;
