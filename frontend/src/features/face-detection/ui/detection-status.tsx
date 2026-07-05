"use client";

import type { JSX } from "react";

import { Text } from "@/shared/ui";

import { useDetectionStore } from "../model/store";

export function DetectionStatus(): JSX.Element {
  const status = useDetectionStore((state) => state.status);
  const error = useDetectionStore((state) => state.error);

  return <Text style={{
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    color: "green",
  }}>{error ?? status}</Text>;
}
