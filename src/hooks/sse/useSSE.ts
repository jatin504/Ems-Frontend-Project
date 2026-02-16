import { useEffect, useState } from "react";

interface SSEOptions {
  url: string; // e.g., "http://localhost:5179/stream?topics=topic1,topic2,..."
  paused? : boolean;
  onMessage: (data: { topic: string; message: any }) => void;
  onError?: (error: Event) => void;
}

export const useSSE = ({ url, paused=false, onMessage, onError }: SSEOptions) => {
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  useEffect(() => {
    if (paused) return;

    const source = new EventSource(url);

    source.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        onMessage(parsedData); // { topic: "block_1_inverter_inverter_1", message: {...} }
      } catch (error) {
        console.error("Failed to parse SSE message:", error);
      }
    };

    source.onerror = (error) => {
      console.error("SSE error:", error);
      if (onError) onError(error);
    };

    setEventSource(source);

    return () => {
      source.close();
    };
  }, [url, paused]);

  return eventSource;
};