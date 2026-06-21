import * as React from "react";

/** Bottom sheet surface — big top radius, grab handle, optional title. */
export interface SheetProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  onClose?: () => void;
  onNight?: boolean;
  children?: React.ReactNode;
}

export function Sheet(props: SheetProps): JSX.Element;
