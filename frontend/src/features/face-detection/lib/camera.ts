export const startCamera = async (): Promise<MediaStream> => {
  return navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
};

export const stopStream = (stream: MediaStream | null): void => {
  if (!stream) {
    return;
  }

  stream.getTracks().forEach((track) => track.stop());
};
