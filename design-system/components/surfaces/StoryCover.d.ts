import * as React from "react";

/**
 * A book cover for the Shelf. Renders a gradient-and-type placeholder
 * cover keyed by genre, or a real image when `src` is given.
 *
 * @startingPoint section="Surfaces" subtitle="Gradient-and-type story cover for the Shelf" viewport="700x340"
 */
export interface StoryCoverProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  author?: string;
  /** Genre keys the placeholder gradient. @default "myth" */
  genre?: "medieval" | "scifi" | "noir" | "cosy" | "horror" | "myth";
  /** Real cover image URL; overrides the gradient. */
  src?: string | null;
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Candle-amber selection ring. @default false */
  selected?: boolean;
  onClick?: () => void;
}

export function StoryCover(props: StoryCoverProps): JSX.Element;
