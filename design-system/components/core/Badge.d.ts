import * as React from "react";

/** Small uppercase status pill — mono label, tonal background. */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "neutral" */
  tone?: "neutral" | "brand" | "lit" | "success" | "danger" | "night";
  /** Show a leading status dot. @default false */
  dot?: boolean;
  children?: React.ReactNode;
}

export function Badge(props: BadgeProps): JSX.Element;
