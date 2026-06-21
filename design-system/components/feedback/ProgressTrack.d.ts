import * as React from "react";

/** Slim progress bar for the month-long tale (Night X of 30). */
export interface ProgressTrackProps {
  value?: number;
  /** @default 30 */
  total?: number;
  /** Mono caption, e.g. "Tale progress". */
  label?: string;
  onNight?: boolean;
  style?: React.CSSProperties;
}

export function ProgressTrack(props: ProgressTrackProps): JSX.Element;
