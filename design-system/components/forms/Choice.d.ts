import * as React from "react";

/**
 * An in-story decision option — serif voice on the night reader.
 *
 * @startingPoint section="Forms" subtitle="In-story choice option (night reader)" viewport="700x180"
 */
export interface ChoiceProps {
  /** Option letter/badge, e.g. "A". */
  letter?: string;
  selected?: boolean;
  /** "betrayal" tints the accent danger-red. @default "default" */
  flavor?: "default" | "betrayal";
  /** Mono caption under the option, e.g. "2 of 4 chose this". */
  meta?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Choice(props: ChoiceProps): JSX.Element;
