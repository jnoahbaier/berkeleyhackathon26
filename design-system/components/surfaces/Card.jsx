import React from "react";

/** Soft rounded surface — the base container for everything in Talegate. */
export function Card({
  children,
  elevation = "md",
  pad = 20,
  onNight = false,
  interactive = false,
  style = {},
  ...rest
}) {
  const shadows = {
    flat: "none",
    sm: "var(--shadow-sm)",
    md: "var(--shadow-md)",
    lg: "var(--shadow-lg)",
  };
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => interactive && setHover(true)}
      onMouseLeave={() => interactive && setHover(false)}
      style={{
        background: onNight ? "var(--night-700)" : "var(--surface-card)",
        border: onNight ? "1px solid var(--night-600)" : "1px solid transparent",
        borderRadius: "var(--radius-lg)",
        boxShadow: hover ? "var(--shadow-lg)" : shadows[elevation] || shadows.md,
        padding: pad,
        transition: "box-shadow var(--dur-base) var(--ease-soft), transform var(--dur-base) var(--ease-soft)",
        transform: hover ? "translateY(-3px)" : "none",
        cursor: interactive ? "pointer" : "default",
        color: onNight ? "var(--night-text)" : "var(--text-body)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
