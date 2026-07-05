import type { ComponentPropsWithoutRef, JSX } from "react";

type TextProps = ComponentPropsWithoutRef<"p">;

export function Text(props: TextProps): JSX.Element {
  return <p {...props} />;
}
