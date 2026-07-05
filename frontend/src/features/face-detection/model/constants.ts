export const PROCESS_INTERVAL_MS = 150;
export const IMAGE_QUALITY = 0.8;

export const DETECTION_STATUS = {
  initializing: "Инициализация камеры...",
  connected: "WebSocket подключен, обнаружение лиц запущено",
  active: "Камера активна",
  sendFrameError: "Не удалось отправить кадр по WebSocket",
  wsError: "WebSocket ошибка соединения с backend",
  wsClosed: "WebSocket соединение закрыто",
  cameraError: "Не удалось запустить камеру",
} as const;
