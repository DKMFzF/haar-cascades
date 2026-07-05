"use client";

import type { JSX } from "react";

import { CenterStack } from "@/shared/ui";

import { useDetectionSession } from "../model/use-detection-session";
import { DetectionCanvas } from "./detection-canvas";
// import { DetectionStatus } from "./detection-status";
import { HiddenVideo } from "./hidden-video";

export function DetectionSession(): JSX.Element {
  const { videoRef, canvasRef } = useDetectionSession();

  return (
    <CenterStack>
      {/* <DetectionStatus /> */}
      <HiddenVideo ref={videoRef} />
      <DetectionCanvas ref={canvasRef} />
    </CenterStack>
  );
}
