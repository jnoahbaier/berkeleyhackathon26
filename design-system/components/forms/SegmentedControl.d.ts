import * as React from "react";

export type SegmentOption = string | { value: string; label: string };

/** Soft pill segmented control for 2–4 mutually-exclusive options. */
export interface SegmentedControlProps {
  options: SegmentOption[];
  value?: string;
  onChange?: (value: string) => void;
  onNight?: boolean;
  style?: React.CSSProperties;
}

export function SegmentedControl(props: SegmentedControlProps): JSX.Element;
