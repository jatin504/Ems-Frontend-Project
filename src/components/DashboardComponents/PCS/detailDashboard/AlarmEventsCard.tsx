// AlarmEventsCard.tsx

import {
  useMemo,
  useState,
} from "react";

import {
  useColorMode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import {
  MdNotificationsActive,
} from "react-icons/md";

import {
  FiChevronRight,
} from "react-icons/fi";

import {
  useAlarmLatest,
} from "../../../../hooks/useAlarmLatest";
import WidgetTitle from "../../../Common/WidgetTitle";

const AlarmEventsCard = ({
  deviceId,
}: any) => {

  const { colorMode } =
    useColorMode();

  const isDark =
    colorMode === "dark";

  const [activeTab, setActiveTab] =
    useState("alarm");

  const [isOpen, setIsOpen] =
    useState(false);

  const {
    rows,
  } = useAlarmLatest();

  /* ================= SELECTED DEVICE ROWS (ALARMS + EVENTS) ================= */

  const normalizedDeviceId = String(deviceId || "").trim().toLowerCase();

  const selectedDeviceRows = useMemo(() => {
    return rows.filter((row: any) => {
      const rowDeviceId = String(
        row.deviceId || row.device_id || row.device || ""
      )
        .trim()
        .toLowerCase();

      return rowDeviceId === normalizedDeviceId && row.status === "Latest Alarm";
    });
  }, [rows, normalizedDeviceId]);

  const selectedDeviceEventRows = useMemo(() => {
    return rows.filter((row: any) => {
      const rowDeviceId = String(
        row.deviceId || row.device_id || row.device || ""
      )
        .trim()
        .toLowerCase();

      return rowDeviceId === normalizedDeviceId && row.status !== "Latest Alarm";
    });
  }, [rows, normalizedDeviceId]);

  return (

    <div
      style={{
        background: isDark
          ? "linear-gradient(180deg,#071B33 0%, #051423 100%)"
          : "linear-gradient(180deg,#ffffff 0%, #f8fbff 100%)",

        border: isDark
          ? "1px solid rgba(81,119,161,0.25)"
          : "1px solid #dbe7f3",

        borderRadius: "10px",

        padding: "14px",

        height: "310px",
        width: "430px",

        overflow: "hidden",

        boxShadow: isDark
          ? "0 4px 18px rgba(0,0,0,0.20)"
          : "0 2px 10px rgba(15,23,42,0.05)",
      }}
    >

      {/* ================= HEADER ================= */}

      <div
        style={{
          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",

          marginBottom:
            "14px",
        }}
      >

        <div
          style={{
            display: "flex",

            alignItems:
              "center",

            gap: "10px",
          }}
        >

          <MdNotificationsActive
            size={18}
            color="#ef4444"
          />

          <WidgetTitle
            color={isDark ? "#ffffff" : "#0f172a"}
            fontSize="15px"
            
            letterSpacing="0.3px"
          >
            Inverter Alarms & Events
          </WidgetTitle>

        </div>

        <button
          onClick={() =>
            setIsOpen(true)
          }
          style={{
            display: "flex",

            alignItems:
              "center",

            gap: "4px",

            background: isDark
              ? "rgba(18,45,73,0.9)"
              : "#edf5ff",

            border: isDark
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid #dbe7f3",

            color: isDark
              ? "#dbeafe"
              : "#334155",

            padding:
              "5px 12px",

            borderRadius:
              "6px",

            cursor: "pointer",

            fontSize:
              "12px",

            fontWeight:
              600,
          }}
        >
          View All

          <FiChevronRight
            size={14}
          />
        </button>

      </div>

      {/* ================= TABS ================= */}

      <div
        style={{
          display: "flex",

          gap: "10px",

          marginBottom:
            "16px",
        }}
      >

        <button
          onClick={() =>
            setActiveTab(
              "alarm"
            )
          }
          style={{
            background:
              activeTab ===
              "alarm"
                ? "linear-gradient(180deg,#0E4C88 0%, #0A3761 100%)"
                : "transparent",

            color:
              activeTab ===
              "alarm"
                ? "#ffffff"
                : "#8BA6C3",

            border:
              activeTab ===
              "alarm"
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(255,255,255,0.05)",

            padding:
              "6px 18px",

            borderRadius:
              "6px",

            fontSize:
              "12px",

            fontWeight:
              700,

            cursor:
              "pointer",

            textTransform:
              "uppercase",
          }}
        >
          Alarm
        </button>

        <button
          onClick={() =>
            setActiveTab(
              "event"
            )
          }
          style={{
            background:
              activeTab ===
              "event"
                ? "linear-gradient(180deg,#0E4C88 0%, #0A3761 100%)"
                : "transparent",

            color:
              activeTab ===
              "event"
                ? "#ffffff"
                : "#8BA6C3",

            border:
              activeTab ===
              "event"
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(255,255,255,0.05)",

            padding:
              "6px 18px",

            borderRadius:
              "6px",

            fontSize:
              "12px",

            fontWeight:
              700,

            cursor:
              "pointer",

            textTransform:
              "uppercase",
          }}
        >
          Event
        </button>

      </div>

      {/* ================= TABLE HEADER ================= */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "1.5fr 1fr 2fr 1fr 1fr",

          padding:
            "0 10px 10px 10px",

          borderBottom:
            isDark
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(15,23,42,0.08)",

          color:
            isDark
              ? "#9FB6D1"
              : "#64748b",

          fontSize:
            "12px",

          fontWeight:
            600,
        }}
      >

        <div>Time</div>

        <div>Inverter ID</div>

        <div>Alarm</div>

        <div>Severity</div>

        <div>Status</div>

      </div>

      {/* ================= BODY ================= */}

      <div
        style={{
          marginTop: "6px",

          display: "flex",

          flexDirection:
            "column",

          gap: "2px",
        }}
      >

        {activeTab ===
        "event" ? (

          <div
            style={{
              height: "160px",

              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              color:
                "#7c93ad",

              fontSize:
                "13px",

              fontWeight:
                500,
            }}
          >
            No Events Available
          </div>

        ) : selectedDeviceRows
            ?.length === 0 ? (

          <div
            style={{
              height: "160px",

              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              color:
                "#7c93ad",

              fontSize:
                "13px",

              fontWeight:
                500,
            }}
          >
            No Active Alarms
          </div>

        ) : (

          selectedDeviceRows
            .slice(0, 5)
            .map(
              (
                item: any,
                index: number
              ) => {

                /* ================= SEVERITY ================= */

                const severity =
                  String(
                    item.severity || ""
                  ).toLowerCase();

                let severityBg =
                  "linear-gradient(180deg,#3B82F6 0%, #2563EB 100%)";

                if (
                  severity ===
                  "critical"
                ) {

                  severityBg =
                    "linear-gradient(180deg,#EF4444 0%, #DC2626 100%)";

                } else if (
                  severity ===
                  "normal"
                ) {

                  severityBg =
                    "linear-gradient(180deg,#10B981 0%, #059669 100%)";

                } else if (
                  severity ===
                  "info"
                ) {

                  severityBg =
                    "linear-gradient(180deg,#6366F1 0%, #4F46E5 100%)";

                }

                return (

                  <div
                    key={index}
                    style={{
                      display: "grid",

                      gridTemplateColumns:
                        "1.5fr 1fr 2fr 1fr 1fr",

                      alignItems:
                        "center",

                      padding:
                        "10px",

                      borderBottom:
                        isDark
                          ? "1px solid rgba(255,255,255,0.05)"
                          : "1px solid rgba(15,23,42,0.05)",

                      fontSize:
                        "12px",
                    }}
                  >

                    {/* TIME */}

                    {/* TIME */}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",

                        color:
                          isDark
                            ? "#D6E3F3"
                            : "#334155",

                        fontWeight:
                          500,
                      }}
                    >

                      <div
                        style={{
                          width: "22px",
                          height: "22px",

                          borderRadius: "50%",

                          background:
                            "rgba(239,68,68,0.12)",

                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",

                          flexShrink: 0,
                        }}
                      >

                        <MdNotificationsActive
                          size={14}
                          color="#ef4444"
                        />

                      </div>

                      <span>
                        {item.time || "--"}
                      </span>

                    </div>

                    {/* DEVICE */}

                    <div
                      style={{
                        color:
                          isDark
                            ? "#ffffff"
                            : "#0f172a",

                        fontWeight:
                          700,
                      }}
                    >
                      {item.device || "--"}
                    </div>

                    {/* TAG */}

                    <div
                      style={{
                        color:
                          isDark
                            ? "#E2ECF8"
                            : "#334155",

                        fontWeight:
                          500,
                      }}
                    >
                      {item.type || "--"}
                    </div>

                    {/* SEVERITY */}

                    <div>

                      <div
                        style={{
                          background:
                            severityBg,

                          color:
                            "#ffffff",

                          width:
                            "72px",

                          textAlign:
                            "center",

                          padding:
                            "5px 0",

                          borderRadius:
                            "4px",

                          fontSize:
                            "11px",

                          fontWeight:
                            700,

                          textTransform:
                            "capitalize",
                        }}
                      >
                        {item.severity}
                      </div>

                    </div>

                    {/* STATUS */}

                    <div>

                      <div
                        style={{
                          background:
                            "linear-gradient(180deg,#B74A2D 0%, #8F311B 100%)",

                          color:
                            "#ffffff",

                          width:
                            "62px",

                          textAlign:
                            "center",

                          padding:
                            "5px 0",

                          borderRadius:
                            "4px",

                          fontSize:
                            "11px",

                          fontWeight:
                            700,
                        }}
                      >
                        ACTIVE
                      </div>

                    </div>

                  </div>

                );

              }
            )

        )}

      </div>

      <Modal
        isOpen={isOpen}
        onClose={() =>
          setIsOpen(false)
        }
        size="full"
      >

        <ModalOverlay />

        <ModalContent
          bg={
            isDark
              ? "#06172d"
              : "#f8fbff"
          }
        >

          <ModalHeader
            color={
              isDark
                ? "#fff"
                : "#0f172a"
            }
          >
            Inverter Alarms
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                maxHeight: "calc(100vh - 200px)",
                overflow: "auto",
                paddingRight: "8px",
              }}
            >

              {/* TABLE HEADER */}
              {/* TABS (in fullscreen modal) */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() => setActiveTab("alarm")}
                  style={{
                    background:
                      activeTab === "alarm"
                        ? "linear-gradient(180deg,#0E4C88 0%, #0A3761 100%)"
                        : "transparent",
                    color: activeTab === "alarm" ? "#ffffff" : "#8BA6C3",
                    border: activeTab === "alarm" ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.05)",
                    padding: "6px 18px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    textTransform: "uppercase",
                  }}
                >
                  Alarm
                </button>

                <button
                  onClick={() => setActiveTab("event")}
                  style={{
                    background:
                      activeTab === "event"
                        ? "linear-gradient(180deg,#0E4C88 0%, #0A3761 100%)"
                        : "transparent",
                    color: activeTab === "event" ? "#ffffff" : "#8BA6C3",
                    border: activeTab === "event" ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.05)",
                    padding: "6px 18px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    textTransform: "uppercase",
                  }}
                >
                  Event
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1.5fr 1fr 2fr 1fr 1fr",
                  padding: "0 10px 10px 10px",
                  borderBottom: isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(15,23,42,0.08)",
                  color: isDark ? "#9FB6D1" : "#64748b",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                <div>Time</div>
                <div>Inverter ID</div>
                <div>Alarm</div>
                <div>Severity</div>
                <div>Status</div>
              </div>

              {/* ROWS */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "6px" }}>

                {(activeTab === "alarm" && selectedDeviceRows.length === 0) && (
                  <div
                    style={{
                      height: "160px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#7c93ad",
                      fontSize: "13px",
                      fontWeight: 500,
                    }}
                  >
                    No Active Alarms
                  </div>
                )}

                {(activeTab === "event" && selectedDeviceEventRows.length === 0) && (
                  <div
                    style={{
                      height: "160px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#7c93ad",
                      fontSize: "13px",
                      fontWeight: 500,
                    }}
                  >
                    No Events Available
                  </div>
                )}

                {(activeTab === "alarm" ? selectedDeviceRows : selectedDeviceEventRows).map((item: any, index: number) => {

                  const severity = String(item.severity || "").toLowerCase();

                  let severityBg = "linear-gradient(180deg,#3B82F6 0%, #2563EB 100%)";

                  if (severity === "critical") {
                    severityBg = "linear-gradient(180deg,#EF4444 0%, #DC2626 100%)";
                  } else if (severity === "normal") {
                    severityBg = "linear-gradient(180deg,#10B981 0%, #059669 100%)";
                  } else if (severity === "info") {
                    severityBg = "linear-gradient(180deg,#6366F1 0%, #4F46E5 100%)";
                  }

                  return (

                    <div
                      key={index}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1.5fr 1fr 2fr 1fr 1fr",
                        alignItems: "center",
                        padding: "10px",
                        borderBottom: isDark
                          ? "1px solid rgba(255,255,255,0.05)"
                          : "1px solid rgba(15,23,42,0.05)",
                        fontSize: "12px",
                      }}
                    >

                      {/* TIME */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", color: isDark ? "#D6E3F3" : "#334155", fontWeight: 500 }}>
                        <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <MdNotificationsActive size={14} color="#ef4444" />
                        </div>
                        <span>{item.time || "--"}</span>
                      </div>

                      {/* DEVICE */}
                      <div style={{ color: isDark ? "#ffffff" : "#0f172a", fontWeight: 700 }}>{item.device || "--"}</div>

                      {/* TAG */}
                      <div style={{ color: isDark ? "#E2ECF8" : "#334155", fontWeight: 500 }}>{item.type || "--"}</div>

                      {/* SEVERITY */}
                      <div>
                        <div style={{ background: severityBg, color: "#ffffff", width: "72px", textAlign: "center", padding: "5px 0", borderRadius: "4px", fontSize: "11px", fontWeight: 700, textTransform: "capitalize" }}>{item.severity}</div>
                      </div>

                      {/* STATUS */}
                      <div>
                        <div style={{ background: "linear-gradient(180deg,#B74A2D 0%, #8F311B 100%)", color: "#ffffff", width: "62px", textAlign: "center", padding: "5px 0", borderRadius: "4px", fontSize: "11px", fontWeight: 700 }}>{"ACTIVE"}</div>
                      </div>

                    </div>

                  );

                })}

              </div>

            </div>

          </ModalBody>

        </ModalContent>

      </Modal>

    </div>

  );
};

export default AlarmEventsCard;