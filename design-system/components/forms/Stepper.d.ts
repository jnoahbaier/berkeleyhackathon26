import * as React from "react";

/** Big numeric stepper for guild hyperparameters (player count, pages/night). */
export interface StepperProps {
  value?: number;
  /** @default 2 */
  min?: number;
  /** @default 4 */
  max?: number;
  onChange?: (value: number) => void;
  /** Unit shown after the number, e.g. "players" / "pages". */
  suffix?: string;
  style?: React.CSSProperties;
}

export function Stepper(props: StepperProps): JSX.Element;
