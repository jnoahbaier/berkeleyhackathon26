import React from "react";
import { Avatar } from "./Avatar.jsx";

/** Overlapping row of guild avatars, with optional "+N" overflow. */
export function AvatarStack({ members = [], size = 36, max = 4, style = {}, ...rest }) {
  const shown = members.slice(0, max);
  const extra = members.length - shown.length;
  const overlap = Math.round(size * 0.32);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", ...style }} {...rest}>
      {shown.map((m, i) => (
        <div key={i} style={{ marginLeft: i === 0 ? 0 : -overlap, position: "relative", zIndex: i }}>
          <Avatar name={m.name} seat={m.seat || i + 1} src={m.src} size={size} ring />
        </div>
      ))}
      {extra > 0 && (
        <div
          style={{
            marginLeft: -overlap,
            width: size,
            height: size,
            borderRadius: "var(--radius-circle)",
            background: "var(--paper-sunk)",
            color: "var(--ink-500)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: size * 0.34,
            boxShadow: "0 0 0 2px var(--parchment)",
          }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}
