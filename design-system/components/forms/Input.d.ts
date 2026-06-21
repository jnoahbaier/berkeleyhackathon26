import * as React from "react";

/** Text input with a sunken well and soft indigo focus ring. */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  type?: string;
  /** Optional leading icon node. */
  icon?: React.ReactNode;
  onNight?: boolean;
}

export function Input(props: InputProps): JSX.Element;
