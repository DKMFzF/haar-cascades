import { forwardRef } from "react";

export const HiddenVideo = forwardRef<HTMLVideoElement>(function HiddenVideo(_, ref) {
  return <video ref={ref} playsInline muted style={{ display: "none" }} />;
});
