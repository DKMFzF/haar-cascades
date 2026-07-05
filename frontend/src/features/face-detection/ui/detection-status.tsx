"use client";

import type { JSX } from "react";

import { Text } from "@/shared/ui";

import { useDetectionStore } from "../model/store";

export function DetectionStatus(): JSX.Element {
  const status = useDetectionStore((state) => state.status);
  const error = useDetectionStore((state) => state.error);

  return <Text>{error ?? status}</Text>;
}
