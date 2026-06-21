import * as React from "react";

/** A pill chip for taste/genre selection (favourite books, genres, hobbies). */
export interface TagProps {
  /** Selected (filled ink) state. @default false */
  selected?: boolean;
  /** Makes the tag interactive when provided. */
  onClick?: () => void;
  /** Optional leading icon node. */
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Tag(props: TagProps): JSX.Element;
