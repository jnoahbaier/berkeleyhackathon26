import * as React from "react";

export interface GuildMember {
  name: string;
  seat?: 1 | 2 | 3 | 4;
  src?: string | null;
}

/** Overlapping row of guild avatars with optional "+N" overflow. */
export interface AvatarStackProps {
  members?: GuildMember[];
  /** Pixel diameter of each avatar. @default 36 */
  size?: number;
  /** Max avatars before overflow. @default 4 */
  max?: number;
  style?: React.CSSProperties;
}

export function AvatarStack(props: AvatarStackProps): JSX.Element;
