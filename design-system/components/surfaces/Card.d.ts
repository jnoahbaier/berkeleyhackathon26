import * as React from "react";

/**
 * Talegate's soft rounded surface — the base container for content.
 *
 * @startingPoint section="Surfaces" subtitle="Soft rounded card with warm elevation" viewport="700x220"
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Shadow depth. @default "md" */
  elevation?: "flat" | "sm" | "md" | "lg";
  /** Padding in px. @default 20 */
  pad?: number;
  /** Dark night-surface styling. @default false */
  onNight?: boolean;
  /** Lift + cursor on hover. @default false */
  interactive?: boolean;
  children?: React.ReactNode;
}

export function Card(props: CardProps): JSX.Element;
