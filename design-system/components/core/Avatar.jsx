import React from "react";

const SEAT_COLORS = {
  1: { bg: "var(--guild-1)", soft: "var(--guild-1-soft)" },
  2: { bg: "var(--guild-2)", soft: "var(--guild-2-soft)" },
  3: { bg: "var(--guild-3)", soft: "var(--guild-3-soft)" },
  4: { bg: "var(--guild-4)", soft: "var(--guild-4-soft)" },
};

/** A guild member's avatar — colored by seat, initials or image. */
export function Avatar({ name = "", seat = 1, src = null, size = 40, ring = false, style = {}, ...rest }) {
  const seatc = SEAT_COLORS[seat] || SEAT_COLORS[1];
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "var(--radius-circle)",
        background: src ? `center/cover no-repeat url(${src})` : seatc.bg,
        color: "#fff",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-sans)",
        fontWeight: 700,
        fontSize: size * 0.38,
        letterSpacing: "-0.01em",
        flex: "none",
        boxShadow: ring ? "0 0 0 2px var(--parchment), 0 0 0 4px " + seatc.bg : "none",
        ...style,
      }}
      title={name}
      {...rest}
    >
      {!src && initials}
    </div>
  );
}
