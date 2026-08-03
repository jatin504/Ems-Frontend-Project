import React, { useState, useRef, useEffect } from "react";
import {
  ChakraProvider,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Box,
  VStack,
  Text,
  Input,
  HStack,
  Button,
  extendTheme,
  useDisclosure,
  ModalHeader,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import { AiOutlineRobot } from "react-icons/ai";
import { keyframes } from "@emotion/react";

/* ===== Constants ===== */
const API_BASE_URL = (import.meta as any).env?.VITE_AI_API_BASE?.toString(); 
const API_URL = API_BASE_URL + "/bess_query";
const SESSION_STORAGE_KEY = "session_id";
const TOKEN_STORAGE_KEY = "token";

const overlayFadeIn = keyframes`
  from { opacity: 0; backdrop-filter: blur(0px) saturate(70%); }
  to { opacity: 1; backdrop-filter: blur(3px) saturate(100%); }
`;
const overlayFadeOut = keyframes`
  from { opacity: 1; backdrop-filter: blur(3px) saturate(100%); }
  to { opacity: 0; backdrop-filter: blur(0px) saturate(70%); }
`;

const contentOpen = keyframes`
  0% { opacity: 0; transform: perspective(900px) translateY(18px) rotateX(10deg) rotateY(-8deg) scale(0.96); filter: drop-shadow(0 6px 34px rgba(0,0,0,0.6)); }
  45% { opacity: 1; transform: perspective(900px) translateY(-8px) rotateX(-4deg) rotateY(6deg) scale(1.02); }
  100% { opacity: 1; transform: perspective(900px) translateY(0) rotateX(0) rotateY(0) scale(1); filter: drop-shadow(0 10px 40px rgba(0,0,0,0.6)); }
`;

const contentClose = keyframes`
  0% { opacity: 1; transform: perspective(900px) translateY(0) rotateX(0) rotateY(0) scale(1); filter: drop-shadow(0 10px 40px rgba(0,0,0,0.6)); }
  100% { opacity: 0; transform: perspective(900px) translateY(18px) rotateX(10deg) rotateY(-8deg) scale(0.96); filter: blur(1px) drop-shadow(0 2px 14px rgba(0,0,0,0.4)); }
`;

const neonPulse = keyframes`
  0% { text-shadow: 0 0 8px rgba(0,255,136,0.6); }
  50% { text-shadow: 0 0 18px rgba(0,255,170,0.9), 0 0 36px rgba(0,255,170,0.35); }
  100% { text-shadow: 0 0 8px rgba(0,255,136,0.6); }
`;

const scanline = keyframes`
  0% { transform: translateY(-120%); opacity: 0.06; }
  100% { transform: translateY(120%); opacity: 0.06; }
`;

const blink = keyframes`
  0%,100% { opacity: 1; }
  50% { opacity: 0; }
`;

const flicker = keyframes`
  0% { opacity: 0.98; }
  30% { opacity: 1; }
  60% { opacity: 0.96; }
  100% { opacity: 0.99; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
`;

/* CRT base style */
const crtBase = {
  position: "relative" as const,
  background:
    "radial-gradient(ellipse at top, rgba(255,255,255,0.02), transparent 30%), linear-gradient(#0f1111, #08090a 60%, #060606 100%)",
  boxShadow: "inset 0 0 80px rgba(0,0,0,0.6)",
  border: "1px solid rgba(255,255,255,0.03)",
  overflow: "hidden" as const,
  animation: `${flicker} 5s infinite ease-in-out`,
};

type Props = {
  title?: string;
};

/* ===== Sounds: open beep + close click (Web Audio API) ===== */
function playOpenBeep() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(720, ctx.currentTime);
    g.gain.setValueAtTime(0.045, ctx.currentTime);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.frequency.exponentialRampToValueAtTime(950, ctx.currentTime + 0.12);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.16);
    o.stop(ctx.currentTime + 0.17);
  } catch (e) {
    // ignore if audio blocked
  }
}

function playCloseClick() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(360, ctx.currentTime);
    g.gain.setValueAtTime(0.03, ctx.currentTime);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.14);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
    o.stop(ctx.currentTime + 0.19);
  } catch (e) {}
}

/* ===== ASCII Generator =====
   - Full A-Z 5x5 font mapping
   - generateAsciiHeader(text, scale, gap)
     scale: >1 makes letters thicker (vertical/horizontal), but increases lines to 5*scale
     gap: number of spaces between letters
*/
const ascii5x5: Record<string, string[]> = {
  A: ["01110", "10001", "11111", "10001", "10001"],
  B: ["11110", "10001", "11110", "10001", "11110"],
  C: ["01111", "10000", "10000", "10000", "01111"],
  D: ["11110", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "11110", "10000", "11111"],
  F: ["11111", "10000", "11110", "10000", "10000"],
  G: ["01111", "10000", "10111", "10001", "01111"],
  H: ["10001", "10001", "11111", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "11111"],
  J: ["00111", "00010", "00010", "10010", "01100"],
  K: ["10001", "10010", "11100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001"],
  O: ["01110", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "11110", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10011", "01111"],
  R: ["11110", "10001", "11110", "10010", "10001"],
  S: ["01111", "10000", "01110", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10101", "11011", "10001"],
  X: ["10001", "01010", "00100", "01010", "10001"],
  Y: ["10001", "01010", "00100", "00100", "00100"],
  Z: ["11111", "00010", "00100", "01000", "11111"],
  " ": ["00000", "00000", "00000", "00000", "00000"],
};

function generateAsciiHeader(text: string, scale = 1, gap = 2): string[] {
  const chars = text.toUpperCase().split("");
  const baseRows = 5;
  const out: string[] = Array.from({ length: baseRows * scale }, () => "");

  for (let ci = 0; ci < chars.length; ci++) {
    const ch = chars[ci];
    const pattern = ascii5x5[ch] ?? ascii5x5[" "];

    for (let r = 0; r < baseRows; r++) {
      // build horizontally scaled row for this character row
      let rowPixels = "";
      for (let c = 0; c < pattern[r].length; c++) {
        const bit = pattern[r][c];
        const fillChar = bit === "1" ? ch : " ";
        for (let sx = 0; sx < scale; sx++) rowPixels += fillChar;
      }

      // append the horizontally scaled row to the vertically scaled output rows
      for (let sy = 0; sy < scale; sy++) {
        out[r * scale + sy] += rowPixels + (ci < chars.length - 1 ? " ".repeat(gap) : "");
      }
    }
  }

  // trim trailing spaces for neatness
  return out.map((ln) => ln.replace(/\s+$/g, ""));
}

// function generateAsciiHeader(text: string, scale = 1, gap = 2): string[] {
//   const chars = text.toUpperCase().split("");
//   const baseRows = 5;
//   const out: string[] = Array.from({ length: baseRows * scale }, () => "");

//   for (let ci = 0; ci < chars.length; ci++) {
//     const ch = chars[ci];
//     const pattern = ascii5x5[ch] ?? ascii5x5[" "];
//     if (!pattern) continue;

//     for (let r = 0; r < baseRows; r++) {
//       let rowPixels = "";
//       for (let c = 0; c < pattern[r].length; c++) {
//         const bit = pattern[r][c];
//         const fillChar = bit === "1" ? "█" : " ";
//         rowPixels += fillChar.repeat(scale);
//       }

//       for (let sy = 0; sy < scale; sy++) {
//         out[r * scale + sy] += rowPixels + (ci < chars.length - 1 ? " ".repeat(gap) : "");
//       }
//     }
//   }

//   return out;
// }

/* ===== TerminalContent component (now receives messages and send function) ===== */
function TerminalContent({
  messages,
  onSend,
  inputValue,
  setInputValue,
  isSending,
  sessionId,
  softActions,
  hardActions,
  onSoftActionClicked,
  onHardActionClicked,
  onClear,
}: {
  messages: { type: string; text: string }[];
  onSend: (text: string) => Promise<void>;
  inputValue: string;
  setInputValue: (v: string) => void;
  isSending: boolean;
  sessionId: string | null;
  softActions: string[];
  hardActions: string[];
  onSoftActionClicked: (text: string) => void;
  onHardActionClicked: (text: string) => void;
  onClear: () => void;
}) {
  // banner text — using static ASCII art header (replaced generated header)
  const asciiHeader = [
    "    AAA      RRRRRRR    KK  KK       AAA            AAA      IIIIII ",
    "   A   A     RR   RR    KK  KK      A   A          A   A       II   ",
    "   AAAAAAA    RRRRRR     KKKKK      AAAAAAA        AAAAAAA      II    ",
    " AA     AA   RR    RR   KK  KK    AA     AA      AA     AA     II   ",
    "AA       AA  RR     RR  KK   KK  AA       AA    AA       AA  IIIIIII",
  ];

  const getColor = (t: string) =>
    t === "ai" ? "#00ff88" : t === "user" ? "#ff6b9d" : t === "info" ? "#cfe8c7" : "transparent";

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // focus input when mounted
    inputRef.current?.focus();
  }, []);

  return (
    <Box
      width="920px"
      maxW="92vw"
      height="620px"
      maxH="86vh"
      borderRadius="10px"
      {...crtBase}
      p="12px"
      boxSizing="border-box"
      animation={`${fadeIn} 0.28s ease-out`}
      _after={{
        content: '""',
        position: "absolute",
        top: "-100%",
        left: 0,
        right: 0,
        height: "200%",
        background:
          "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
        animation: `${scanline} 4.6s linear infinite`,
        pointerEvents: "none",
      }}
    >
      {/* moving scanline overlay (additional) */}
      <Box position="absolute" top={0} left={0} right={0} bottom={0} pointerEvents="none" zIndex={1} />

      <Box
        position="relative"
        zIndex={2}
        height="100%"
        borderRadius="8px"
        bg="#0b0d0e"
        p="14px"
        color="#cfe8c7"
        fontFamily={`"Courier New", Courier, monospace`}
        fontSize="14px"
        letterSpacing="0.6px"
        lineHeight="1.45"
        display="flex"
        flexDirection="column"
      >
        <Text fontSize="13px" color="#c9e6c3" mb="8px">
          Welcome to
        </Text>

        <Box display="flex" justifyContent="center" mb="14px">
          <Box
            as="pre"
            m="0"
            whiteSpace="pre"
            fontFamily={`"Courier New", Courier, monospace`}
            fontSize="16px"
            lineHeight="1"
            color="#00ff88"
            textAlign="center"
            sx={{ animation: `${neonPulse} 2.6s infinite ease-in-out` }}
          >
            {asciiHeader.join("\n")}
          </Box>
        </Box>

        {/* description */}
        <Box as="pre" m="0" whiteSpace="pre-wrap" color="#cfe8c7" mb="12px" opacity={0.95}>
          {"ARKA is your smart energy management assistant.\nIt helps analyze data, schedule optimization tasks, and control devices.\nPowered by advanced AI intelligence — 2025 Edition."}
        </Box>

        {/* messages area */}
        <Box
          flex="1"
          bg="transparent"
          borderRadius="4px"
          p="8px"
          overflowY="auto"
          css={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.08) transparent",
          }}
        >
          <VStack align="flex-start" spacing="4" m="0" whiteSpace="pre-wrap">
            {messages.map((m, i) => (
              <Text
                key={i}
                m="0"
                fontSize="15px"
                color={getColor(m.type)}
                fontFamily={`"Courier New", Courier, monospace`}
                whiteSpace="pre-wrap"
                lineHeight="1.45"
              >
                {m.text}
              </Text>
            ))}
            {(softActions.length > 0 || hardActions.length > 0) && (
                <Box mt="10px" display="flex" gap="8px" flexWrap="wrap">

                  {softActions.map((a) => (
                    <Button
                      key={a}
                      size="xs"
                      colorScheme="teal"
                      onClick={() => onSoftActionClicked(a)}
                    >
                      {a}
                    </Button>
                  ))}

                  {hardActions.map((a) => (
                    <Button
                      key={a}
                      size="xs"
                      colorScheme="orange"
                      onClick={() => onHardActionClicked(a)}
                    >
                      {a}
                    </Button>
                  ))}

                </Box>
              )}
          </VStack>
        </Box>

        {/* input row */}
        <Box mt="10px" display="flex" gap="8px" alignItems="center">
          <Text as="span" color="#ff6b9d" minW="48px">
            YOU:
          </Text>
          <HStack spacing={2} flex="1">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const v = inputValue.trim();
                  if (v && !isSending) {
                    onSend(v);
                  }
                }
              }}
              placeholder="Type your message and press Enter..."
              size="sm"
              bg="#07100b"
              color="#dff1d8"
              _placeholder={{ color: "#5a6a5a" }}
            />
            <Button
              size="sm"
              onClick={() => {
                const v = inputValue.trim();
                if (v && !isSending) {
                  onSend(v);
                }
              }}
              isLoading={isSending}
              colorScheme="teal"
            >
              Send
            </Button>
            <Button
              size="sm"
              onClick={() => 
                onClear()
              }
              isDisabled={isSending}
              colorScheme="red"
            >
              Clear
            </Button>
          </HStack>
        </Box>

        {/* small session id display */}
        <Box mt="8px" color="#8fbf9a" fontSize="12px" opacity={0.85}>
          {sessionId ? `session: ${sessionId}` : "session: (none)"}
        </Box>
      </Box>
    </Box>
  );
}

/* ===== Main floating component with API integration + animated open/close ===== */
export default function FloatingEMSAIAgentSuperAnimated(_: Props) {
  // fetch token from localStorage (change key if needed)
  const token = sessionStorage.getItem(TOKEN_STORAGE_KEY) || "";

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  // Action buttons
  const [softActions, setSoftActions] = useState<string[]>([]);
  const [hardActions, setHardActions] = useState<string[]>([]);
  const [metadataAction, setMetadataAction] = useState<any | null>(null);
  const [resultJson, setResultJson] = useState<any>(null);

  // Preview Modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  // chat state
  const [messages, setMessages] = useState<{ type: string; text: string }[]>([
    // initial sample (optional)
    { type: "ai", text: "ARKA: Hello! How can I assist your energy system today?" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  // session id state (persisted to localStorage)
  const [sessionId, setSessionId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(SESSION_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const safeAppendMessage = (m: { type: string; text: string }) => {
    setMessages((prev) => [...prev, m]);
  };

  const onClearMessage = () => {
    setMessages([
      { type: "ai", text: "ARKA: Hello! How can I assist your energy system today?" },
    ]);
    setSoftActions([]);
    setHardActions([]);
    setMetadataAction([]);
    setResultJson(null);
  };

  const handleSoftAction = (action: string) => {

    if (!resultJson) return;

    if (action === "preview") {
      ("Preview schedule");
      safeAppendMessage({
        type: "ai",
        text: "ARKA: Opening schedule preview..."
      });

      // you can open modal or table here
      // console.table(resultJson.records);
      onOpen();
    }

    if (action === "download") {

      const records = resultJson.records || [];

      const headers = Object.keys(records[0] || {});
      const csvRows = [
        headers.join(","),
        ...records.map((r: any) => headers.map(h => r[h]).join(","))
      ];

      const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "schedule.csv";
      a.click();

      safeAppendMessage({
        type: "info",
        text: "Schedule downloaded as CSV."
      });
    }
  };

  const handleHardAction = async (action: string) => {

    if (action === "create") {

      safeAppendMessage({
        type: "ai",
        text: "ARKA: Creating dispatch schedule..."
      });

      const res = await fetch(API_BASE_URL + metadataAction.create.url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({ session_id: sessionId, result_json: resultJson.records })
      });

      if (!res.ok) {
        const textBody = await res.text();
        safeAppendMessage({ type: "ai", text: `ARKA: (error) ${res.status} ${res.statusText}` });
        safeAppendMessage({ type: "info", text: textBody || "" });
        return;
      }

      safeAppendMessage({
        type: "ai",
        text: "ARKA: Dispatch schedule created successfully."
      });
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setClosing(false);
    playOpenBeep();
  };

  const handleClose = () => {
    setClosing(true);
    playCloseClick();
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 360);
  };

  /* send function: builds payload { query, session_id }, adds token header,
     expects response { Response, Session_id } and stores Session_id
     UPDATED: read JWT from response headers and persist to localStorage */
  const sendQuery = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // append user immediately
    safeAppendMessage({ type: "user", text: `YOU: ${trimmed}` });
    setInputValue("");
    setIsSending(true);

    try {
      // prepare payload
      const payload: { query: string; session_id?: string } = { query: trimmed };
      if (sessionId) payload.session_id = sessionId;

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      // read JWT from response headers (if backend returns it)
      const authHeader =
        res.headers.get("authorization") ??
        res.headers.get("Authorization") ??
        res.headers.get("x-access-token") ??
        res.headers.get("x-access") ??
        null;

      if (authHeader) {
        const rawToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
        try {
          localStorage.setItem(TOKEN_STORAGE_KEY, rawToken);
        } catch {}
      }

      if (!res.ok) {
        const textBody = await res.text();
        safeAppendMessage({ type: "ai", text: `ARKA: (error) ${res.status} ${res.statusText}` });
        safeAppendMessage({ type: "info", text: textBody || "" });
        return;
      }

      const data = await res.json();

      // Expect { Response, Session_id } as per your spec
      const aiResp = data.Response ?? data.response ?? data.message ?? "";
      const newSession = data.Session_id ?? data.session_id ?? data.session ?? null;
      if (data.result_json) {
        setResultJson(data.result_json);
      }

      if (data.soft_actions) {
        setSoftActions(data.soft_actions);
      } else {
        setSoftActions([]);
      }

      if (data.hard_action) {
        setHardActions(data.hard_action);
        setMetadataAction(data.metadata_action);
      } else {
        setHardActions([]);
        setMetadataAction([]);
      }

      if (newSession) {
        try {
          localStorage.setItem(SESSION_STORAGE_KEY, newSession);
        } catch {}
        setSessionId(newSession);
      }

      if (aiResp) {
        safeAppendMessage({ type: "ai", text: `ARKA: ${aiResp}` });
      } else {
        safeAppendMessage({ type: "ai", text: `ARKA: (no response)` });
      }
    } catch (err: any) {
      console.error("sendQuery error:", err);
      safeAppendMessage({ type: "ai", text: `ARKA: (network error) ${err?.message ?? err}` });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <IconButton
        aria-label="Open ARKA AI Agent"
        icon={<AiOutlineRobot size={20} />}
        position="fixed"
        right="24px"
        bottom="24px"
        zIndex={1400}
        borderRadius="full"
        boxShadow="lg"
        colorScheme="teal"
        opacity={0.3}
        _hover={{ opacity: 0.5 }}
        onClick={handleOpen}
      />

      <Modal
        isOpen={open}
        onClose={handleClose}
        isCentered
        size="xl"
        closeOnEsc={true}
        closeOnOverlayClick={true}
      >
        <ModalOverlay
          bg="rgba(8,10,12,0.62)"
          css={{
            animation: closing ? `${overlayFadeOut} 260ms ease forwards` : `${overlayFadeIn} 260ms ease forwards`,
            backdropFilter: closing ? "blur(0px) saturate(70%)" : "blur(3px) saturate(100%)",
          }}
        />

        <ModalContent
          bg="transparent"
          boxShadow="none"
          maxW="94vw"
          maxH="92vh"
          p="0"
          overflow="visible"
          css={{
            transformOrigin: "center center",
            animation: closing
              ? `${contentClose} 320ms cubic-bezier(.2,.9,.2,1) forwards`
              : `${contentOpen} 420ms cubic-bezier(.2,.9,.2,1) forwards`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* absolute close button so no header/title */}
          <Box position="relative" width="100%">
            <ModalCloseButton onClick={handleClose} position="absolute" top="10px" right="12px" color="#cfe8c7" zIndex={50} />
          </Box>

          <ModalBody pt="6px" px="18px" pb="18px">
            <VStack spacing={4}>
              <TerminalContent
                messages={messages}
                onSend={sendQuery}
                inputValue={inputValue}
                setInputValue={setInputValue}
                isSending={isSending}
                sessionId={sessionId}
                softActions={softActions}
                hardActions={hardActions}
                onSoftActionClicked={handleSoftAction}
                onHardActionClicked={handleHardAction}
                onClear={onClearMessage}
              />
              <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
                <ModalOverlay />

                <ModalContent>
                  <ModalHeader>Schedule Preview</ModalHeader>
                  <ModalCloseButton />

                  <ModalBody>

                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          {Object.keys(resultJson?.records?.[0] || {}).map((header) => (
                            <Th key={header}>{header}</Th>
                          ))}
                        </Tr>
                      </Thead>

                      <Tbody>
                        {resultJson?.records?.map((row: any, i: number) => (
                          <Tr key={i}>
                            {Object.keys(row).map((key) => (
                              <Td key={key}>{row[key]}</Td>
                            ))}
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>

                  </ModalBody>
                </ModalContent>
              </Modal>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

/* Example app for quick testing */
export function ExampleApp() {
  const theme = extendTheme({
    styles: {
      global: {
        body: {
          bg: "#0a0b0c",
        },
      },
    },
  });

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" p="8" color="#cfe8c7">
        <Text fontFamily={`"Courier New", monospace`} mb="6">
          Click the robot button (bottom-right) to open the super-animated ARKA modal.
        </Text>
        <FloatingEMSAIAgentSuperAnimated />
      </Box>
    </ChakraProvider>
  );
}
