import * as React from "react";

/** A guild member's avatar — coloured by seat (1–4), with initials or image. */
export interface AvatarProps {
  name?: string;
  /** Guild seat 1–4 → clay / sage / periwinkle / gold. @default 1 */
  seat?: 1 | 2 | 3 | 4;
  /** Image URL; falls back to initials. */
  src?: string | null;
  /** Pixel diameter. @default 40 */
  size?: number;
  /** Parchment ring + seat-colour halo. @default false */
  ring?: boolean;
  style?: React.CSSProperties;
}

export function Avatar(props: AvatarProps): JSX.Element;
