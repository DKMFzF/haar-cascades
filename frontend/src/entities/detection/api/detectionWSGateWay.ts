import type { DetectionResponse } from "../model/types";

type DetectionSocketHandlers = {
  onOpen: () => void;
  onMessage: (data: DetectionResponse) => void;
  onError: () => void;
  onClose: () => void;
};

export const createDetectionSocket = (
  url: string,
  handlers: DetectionSocketHandlers,
): WebSocket => {
  const socket = new WebSocket(url);
  socket.binaryType = "arraybuffer";

  socket.onopen = handlers.onOpen;
  socket.onerror = handlers.onError;
  socket.onclose = handlers.onClose;
  socket.onmessage = (event: MessageEvent<string>) => {
    try {
      handlers.onMessage(JSON.parse(event.data) as DetectionResponse);
    } catch {
      // Ignore malformed payloads to keep detection loop alive.
    }
  };

  return socket;
};
