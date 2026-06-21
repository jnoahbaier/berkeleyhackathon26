import * as React from "react";

/** Circular, glassy icon-only control — Talegate's signature "key-cap" button. */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** @default "md" (36 / 44 / 54 px) */
  size?: "sm" | "md" | "lg";
  /** @default "glass" */
  variant?: "glass" | "solid" | "brand" | "plain";
  /** Accessible label (also the tooltip) — required for icon-only buttons. */
  label?: string;
  /** Adapt glass/plain styling for dark night surfaces. @default false */
  onNight?: boolean;
  disabled?: boolean;
  /** The icon node (e.g. a Lucide SVG). */
  children?: React.ReactNode;
}

export function IconButton(props: IconButtonProps): JSX.Element;
