export const PROCESS_INTERVAL_MS = 80;
export const IMAGE_QUALITY = .5;

export const DETECTION_STATUS = {
  initializing: "Включаем камеру...",
  connected: "Обнаружение лиц запущено",
  active: "Камера активна",
  sendFrameError: "Не удалось отправить кадр по WebSocket",
  wsError: "Ошибка соединения с backend",
  wsClosed: "Соединение закрыто",
  cameraError: "Не удалось запустить камеру",
} as const;
