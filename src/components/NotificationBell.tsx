import { useState } from "react";
import {
  Box, Tooltip, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  Table, Thead, Tbody, Tr, Th, Td,
} from "@chakra-ui/react";
import { FiBell } from "react-icons/fi";
import { useNotifications } from "../hooks/useNotifications";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
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

          <ModalBody
            px={6}
            pb={6}
            flex="1"
            overflow="hidden"
            display="flex"
            flexDirection="column"
          >
            <Box display="flex" gap={3} mb={4}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search (type / message / entity)"
                style={{
                  flex: 1,
                  height: "38px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "0 12px",
                  fontSize: "14px",
                }}
              />

              <input
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                type="date"
                style={{
                  height: "38px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "0 10px",
                }}
              />

              <input
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                type="date"
                style={{
                  height: "38px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "0 10px",
                }}
              />

              <button
                onClick={() => {
                  setPage(1);
                  fetchNotifications();
                }}
                style={{
                  background: "#3182ce",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0 16px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Search
              </button>

              <button
                onClick={() => {
                  setSearch("");
                  setFromDate("");
                  setToDate("");
                  setPage(1);
                  // Fetch with cleared filters
                  setTimeout(() => {
                    fetchNotifications();
                  }, 0);
                }}
                style={{
                  background: "#a0aec0",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0 16px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Reset
              </button>
            </Box>

            <Box
              flex="1"
              overflow="auto"
              border="1px solid #e2e8f0"
              borderRadius="10px"
              boxShadow="md"
            >
              <Table size="sm" variant="simple" minW="1200px">
                <Thead bg="#f5f7fa" position="sticky" top={0} zIndex={2}>
                  <Tr textAlign="center">
                    <Th textAlign="center">EVENT TIME</Th>
                    <Th textAlign="center">TITLE</Th>
                    <Th textAlign="center">TYPE</Th>
                    <Th textAlign="center">SEVERITY</Th>
                    <Th textAlign="center">STATUS</Th>
                    <Th textAlign="center">SOURCE</Th>
                    <Th textAlign="center">ACK</Th>
                    <Th textAlign="center">CLEAR TIME</Th>
                    <Th textAlign="center">MESSAGE</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {(notifications.length === 0 ? [{ id: -1, event_time: "", title: "", event_type: "", severity: "", status: "", source: "", entity_type: "", entity_id: "", acknowledged: false, acknowledged_by: "", acknowledged_time: "", cleared_time: "", message: "", metadata: null }] : notifications).map((n) =>
                    n.id === -1 ? (
                      <Tr key="empty">
                        <Td colSpan={9} textAlign="center" py={6}>
                          No notifications
                        </Td>
                      </Tr>
                    ) : (
                      <Tr key={n.id} _hover={{ bg: "#f7fafc" }}>
                        <Td textAlign="center" fontSize="12px" fontFamily="monospace" color="#2d3748">
                          {new Date(n.event_time).toLocaleString()}
                        </Td>
                        <Td textAlign="center" fontSize="12px">{n.title || "-"}</Td>
                        <Td textAlign="center" fontSize="12px">
                          <Box
                            bg="#3182ce"
                            color="white"
                            px="6px"
                            borderRadius="5px"
                            fontSize="11px"
                          >
                            {n.event_type}
                          </Box>
                        </Td>
                        <Td textAlign="center" fontSize="12px">
                          <Box
                            bg={n.severity === "warning" ? "#ed8936" : n.severity === "critical" ? "#e53e3e" : "#38a169"}
                            color="white"
                            px="6px"
                            borderRadius="5px"
                            fontSize="11px"
                          >
                            {n.severity}
                          </Box>
                        </Td>
                        <Td textAlign="center" fontSize="12px">
                          <Box
                            bg={n.status === "active" ? "#38a169" : "#a0aec0"}
                            color="white"
                            px="6px"
                            borderRadius="5px"
                            fontSize="11px"
                          >
                            {n.status}
                          </Box>
                        </Td>
                        <Td textAlign="center" fontSize="12px">{n.source || "-"}</Td>
                        <Td textAlign="center" fontSize="12px">
                          {n.acknowledged ? (
                            <span title="Mark as read">✅</span>
                          ) : (
                            <button
                              onClick={() => handleAck(n.id)}
                              style={{
                                background: "#3182ce",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                padding: "3px 8px",
                                cursor: "pointer",
                                fontSize: "11px",
                              }}
                            >
                              ACK
                            </button>
                          )}
                        </Td>
                        <Td textAlign="center" fontSize="12px">{n.cleared_time ? new Date(n.cleared_time).toLocaleString() : "-"}</Td>
                        <Td textAlign="center" fontSize="12px" maxW="400px" whiteSpace="normal" overflow="hidden" textOverflow="ellipsis" title={n.message}>
                          {n.message}
                        </Td>
                      </Tr>
                    )
                  )}
                </Tbody>
              </Table>
            </Box>

            <Box
              mt={4}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              {/* LEFT */}
              <Box display="flex" alignItems="center" gap={2} fontSize="13px">
                Rows per page:
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    padding: "4px 6px",
                    fontSize: "13px",
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </Box>

              {/* CENTER */}
              <Box fontSize="13px">
                {Math.min((page - 1) * pageSize + 1, total)}–
                {Math.min(page * pageSize, total)} of {total}
              </Box>

              {/* RIGHT */}
              <Box display="flex" gap={2}>
                <button
                  disabled={page === 1}
                  onClick={() => setPage(1)}
                  style={{
                    background: page === 1 ? "#e2e8f0" : "#3182ce",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                    fontSize: "12px",
                  }}
                >
                  ⏮
                </button>
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  style={{
                    background: page === 1 ? "#e2e8f0" : "#3182ce",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                    fontSize: "12px",
                  }}
                >
                  ◀
                </button>
                <button
                  disabled={page * pageSize >= total}
                  onClick={() => setPage((p) => p + 1)}
                  style={{
                    background: page * pageSize >= total ? "#e2e8f0" : "#3182ce",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: page * pageSize >= total ? "not-allowed" : "pointer",
                    fontSize: "12px",
                  }}
                >
                  ▶
                </button>
                <button
                  disabled={page * pageSize >= total}
                  onClick={() => setPage(Math.ceil(total / pageSize))}
                  style={{
                    background: page * pageSize >= total ? "#e2e8f0" : "#3182ce",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: page * pageSize >= total ? "not-allowed" : "pointer",
                    fontSize: "12px",
                  }}
                >
                  ⏭
                </button>
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
