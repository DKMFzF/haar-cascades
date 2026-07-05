export const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
export const wsDetectUrl = `${apiUrl.replace(/^http/i, "ws")}/ws/detect`;
