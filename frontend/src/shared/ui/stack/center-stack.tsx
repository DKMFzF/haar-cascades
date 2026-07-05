import type { CSSProperties, JSX, PropsWithChildren } from "react";


export function CenterStack({ children }: PropsWithChildren): JSX.Element {
  return <main style={{
    display: "flex",
    flexDirection: "column",
    width: "100vw",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
  }}>{children}</main>;
}
