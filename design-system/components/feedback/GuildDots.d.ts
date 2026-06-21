import * as React from "react";

export interface GuildDotMember {
  name: string;
  seat?: 1 | 2 | 3 | 4;
  /** Caught up / has chosen tonight. */
  done?: boolean;
}

/**
 * The guild alignment indicator — who has read / chosen tonight.
 * Filled seat-colour dot = done, hollow = still reading.
 */
export interface GuildDotsProps {
  members?: GuildDotMember[];
  /** Override the default "N of M ready" caption. */
  label?: string;
  /** Dot diameter px. @default 26 */
  size?: number;
  onNight?: boolean;
  style?: React.CSSProperties;
}

export function GuildDots(props: GuildDotsProps): JSX.Element;
