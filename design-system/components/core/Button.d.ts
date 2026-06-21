import * as React from "react";

/**
 * Talegate's primary action button — pill-shaped, soft press, calm easing.
 *
 * @startingPoint section="Core" subtitle="Primary / accent / secondary / ghost button" viewport="700x150"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. @default "primary" */
  variant?: "primary" | "accent" | "secondary" | "ghost";
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Stretch to container width. @default false */
  full?: boolean;
  disabled?: boolean;
  /** Icon node rendered before the label. */
  iconLeft?: React.ReactNode;
  /** Icon node rendered after the label. */
  iconRight?: React.ReactNode;
  /** Adapt secondary/ghost styling for dark night surfaces. @default false */
  onNight?: boolean;
  children?: React.ReactNode;
}

export function Button(props: ButtonProps): JSX.Element;
