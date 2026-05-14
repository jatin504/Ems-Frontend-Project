// FILE: NotificationBell.tsx

import { useState } from "react";
import {
  Box, Tooltip, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  Table, Thead, Tbody, Tr, Th, Td,
} from "@chakra-ui/react";
import { FiBell } from "react-icons/fi";
import { useNotifications } from "../hooks/useNotifications";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  // ✅ ADDED sorting state
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const {
    notifications,
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
    search,
    setSearch,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    fetchNotifications,
    handleAck,
    unacknowledgedCount,
  } = useNotifications();

  return (
    <>
      <Tooltip label="Notifications" hasArrow>
        <Box position="relative">
          <IconButton aria-label="Notifications" icon={<FiBell />} size="sm" variant="ghost" onClick={() => setIsOpen(true)} />
          {unacknowledgedCount > 0 && (
            <Box
              position="absolute"
              top="-5px"
              right="-5px"
              bg="red.500"
              color="white"
              borderRadius="full"
              fontSize="10px"
              px="5px"
            >
              {unacknowledgedCount}
            </Box>
          )}
        </Box>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="6xl" isCentered>
        <ModalOverlay />
        <ModalContent
          maxW="95vw"
          h="90vh"
          borderRadius="10px"
          display="flex"
          flexDirection="column"
          overflow="hidden"
        >
          <ModalHeader fontSize="18px" fontWeight="600">
            Notification Log
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody px={6} pb={6} flex="1" overflow="hidden" display="flex" flexDirection="column">

            <Box display="flex" gap={3} mb={4}>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search (type / message / entity)" style={{ flex: 1, height: "38px", border: "1px solid #ccc", borderRadius: "8px", padding: "0 12px", fontSize: "14px" }} />
              <input value={fromDate} onChange={(e) => setFromDate(e.target.value)} type="date" style={{ height: "38px", border: "1px solid #ccc", borderRadius: "8px", padding: "0 10px" }} />
              <input value={toDate} onChange={(e) => setToDate(e.target.value)} type="date" style={{ height: "38px", border: "1px solid #ccc", borderRadius: "8px", padding: "0 10px" }} />

              {/* ✅ UPDATED */}
              <button onClick={() => {
                setPage(1);
                fetchNotifications({
                  sortBy: "event_time",
                  sortOrder: sortOrder
                });
              }} style={{ background: "#3182ce", color: "white", border: "none", borderRadius: "8px", padding: "0 16px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
                Search
              </button>

              {/* ✅ UPDATED */}
              <button onClick={() => {
                setSearch("");
                setFromDate("");
                setToDate("");
                setPage(1);
                setTimeout(() => {
                  fetchNotifications({
                    sortBy: "event_time",
                    sortOrder: sortOrder
                  });
                }, 0);
              }} style={{ background: "#a0aec0", color: "white", border: "none", borderRadius: "8px", padding: "0 16px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
                Reset
              </button>
            </Box>

            <Box flex="1" overflow="auto" border="1px solid #e2e8f0" borderRadius="10px" boxShadow="md">
              <Table size="sm" variant="simple" minW="1200px">
                <Thead bg="#f5f7fa" position="sticky" top={0} zIndex={2}>
                  <Tr textAlign="center">

                    {/* ✅ UPDATED HEADER */}
                    <Th
                      textAlign="center"
                      cursor="pointer"
                      onClick={() => {
                        const newOrder = sortOrder === "asc" ? "desc" : "asc";
                        setSortOrder(newOrder);
                        setPage(1);
                        setTimeout(() => {
                          fetchNotifications({
                            sortBy: "event_time",
                            sortOrder: newOrder
                          });
                        }, 0);
                      }}
                    >
                      EVENT TIME {sortOrder === "asc" ? "▲" : "▼"}
                    </Th>

                    <Th textAlign="center">TITLE</Th>
                    <Th textAlign="center">TYPE</Th>
                    <Th textAlign="center">SEVERITY</Th>
                    <Th textAlign="center">STATUS</Th>
                    <Th textAlign="center">SOURCE</Th>
                    <Th textAlign="center">CLEAR TIME</Th>
                    <Th textAlign="center">MESSAGE</Th>
                    <Th textAlign="center"></Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {(notifications.length === 0
                    ? [{
                      id: -1, event_time: "", title: "", event_type: "", severity: "", status: "",
                      source: "", acknowledged: false, cleared_time: "", message: ""
                    }]
                    : notifications).map((n) =>
                      n.id === -1 ? (
                        <Tr key="empty">
                          <Td colSpan={9} textAlign="center" py={6}>
                            No notifications
                          </Td>
                        </Tr>
                      ) : (
                        <Tr key={n.id} _hover={{ bg: "#f7fafc" }}>
                          <Td textAlign="center" fontSize="12px">{new Date(n.event_time).toLocaleString()}</Td>
                          <Td textAlign="center" fontSize="12px">{n.title || "-"}</Td>
                          <Td textAlign="center" fontSize="12px">
                            <Box bg="#3182ce" color="white" px="6px" borderRadius="5px" fontSize="11px">
                              {n.event_type}
                            </Box>
                          </Td>
                          <Td textAlign="center" fontSize="12px">
                            <Box bg={n.severity === "warning" ? "#ed8936" : n.severity === "critical" ? "#e53e3e" : "#38a169"} color="white" px="6px" borderRadius="5px" fontSize="11px">
                              {n.severity}
                            </Box>
                          </Td>
                          <Td textAlign="center" fontSize="12px">
                            <Box bg={n.status === "active" ? "#38a169" : "#a0aec0"} color="white" px="6px" borderRadius="5px" fontSize="11px">
                              {n.status}
                            </Box>
                          </Td>
                          <Td textAlign="center" fontSize="12px">{n.source || "-"}</Td>
                          <Td textAlign="center" fontSize="12px">
                            {n.cleared_time ? new Date(n.cleared_time).toLocaleString() : "-"}
                          </Td>
                          <Td textAlign="center" fontSize="12px">{n.message}</Td>

                          <Td
                            textAlign="center"
                            onClick={() => {
                              if (!n.acknowledged) handleAck(n.id);
                            }}
                            style={{ cursor: n.acknowledged ? "default" : "pointer" }}
                          >
                            <Tooltip
                              label={!n.acknowledged ? "Mark as read" : ""}
                              isDisabled={n.acknowledged}
                              hasArrow
                            >
                              <Box
                                display="inline-flex"
                                alignItems="center"
                                justifyContent="center"
                                w="18px"
                                h="18px"
                                borderRadius="3px"
                                border="1px solid #cbd5e0"
                                bg={n.acknowledged ? "#48bb78" : "#edf2f7"}
                              >
                                <span style={{ color: "white", fontSize: "12px" }}>
                                  ✓
                                </span>
                              </Box>
                            </Tooltip>
                          </Td>

                        </Tr>
                      )
                    )}
                </Tbody>
              </Table>
            </Box>

            {/* ✅ ONLY ADDED THIS BLOCK */}
            <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                Rows per page:
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  style={{ marginLeft: "8px" }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </Box>

              <Box>
                {Math.min((page - 1) * pageSize + 1, total)}–
                {Math.min(page * pageSize, total)} of {total}
              </Box>

              <Box mt={4} display="flex" justifyContent="center" alignItems="center" gap={4}>
  
  <button
    disabled={page === 1}
    onClick={() => setPage(page - 1)}
    style={{
      width: "28px",
      height: "28px",
      borderRadius: "6px",
      border: "1px solid #e2e8f0",
      background: page === 1 ? "#edf2f7" : "#f7fafc",
      cursor: page === 1 ? "not-allowed" : "pointer",
      fontSize: "14px"
    }}
  >
    ◀
  </button>

  <Box fontSize="14px" fontWeight="500">
    Page {total === 0 ? 0 : page} of {Math.max(1, Math.ceil(total / pageSize))}
  </Box>

  <button
    disabled={page * pageSize >= total}
    onClick={() => setPage(page + 1)}
    style={{
      width: "28px",
      height: "28px",
      borderRadius: "6px",
      border: "1px solid #e2e8f0",
      background: page * pageSize >= total ? "#edf2f7" : "#f7fafc",
      cursor: page * pageSize >= total ? "not-allowed" : "pointer",
      fontSize: "14px"
    }}
  >
    ▶
  </button>

</Box>
            </Box>

          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}