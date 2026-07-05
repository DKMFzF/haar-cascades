import type { CSSProperties, JSX, PropsWithChildren } from "react";

const centerStackStyle: CSSProperties = {
  display: "grid",
  justifyItems: "center",
  gap: 12,
  padding: 24,
};

export function CenterStack({ children }: PropsWithChildren): JSX.Element {
  return <main style={centerStackStyle}>{children}</main>;
}
