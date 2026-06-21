import React from "react";

/**
 * Talegate Button — the primary action primitive.
 * Pill by default; soft press (scale 0.97) and calm easing.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  full = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  onNight = false,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { height: 36, padding: "0 16px", font: "var(--text-sm)", radius: "var(--radius-pill)", gap: 7 },
    md: { height: 46, padding: "0 22px", font: "var(--text-base)", radius: "var(--radius-pill)", gap: 8 },
    lg: { height: 56, padding: "0 28px", font: "var(--text-lg)", radius: "var(--radius-pill)", gap: 10 },
  };
  const s = sizes[size] || sizes.md;

  const variants = {
    primary: {
      background: "var(--brand)",
      color: "var(--text-on-brand)",
      border: "1px solid transparent",
      boxShadow: "var(--shadow-sm)",
    },
    accent: {
      background: "var(--accent)",
      color: "#3b2a10",
      border: "1px solid transparent",
      boxShadow: "var(--shadow-sm)",
    },
    secondary: {
      background: onNight ? "var(--night-700)" : "var(--surface-card)",
      color: onNight ? "var(--night-text)" : "var(--text-strong)",
      border: `1px solid ${onNight ? "var(--night-600)" : "var(--border-strong)"}`,
      boxShadow: onNight ? "none" : "var(--shadow-xs)",
    },
    ghost: {
      background: "transparent",
      color: onNight ? "var(--night-text)" : "var(--brand)",
      border: "1px solid transparent",
      boxShadow: "none",
    },
  };
  const v = variants[variant] || variants.primary;

  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);

  const hoverFx =
    !disabled && hover
      ? variant === "primary"
        ? { background: "var(--brand-hover)" }
        : variant === "accent"
        ? { background: "var(--accent-hover)" }
        : variant === "ghost"
        ? { background: onNight ? "rgba(255,255,255,0.06)" : "var(--brand-tint)" }
        : { boxShadow: "var(--shadow-sm)", transform: "translateY(-1px)" }
      : {};

  return (
    <button
      type="button"
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        height: s.height,
        padding: s.padding,
        width: full ? "100%" : "auto",
        fontFamily: "var(--font-sans)",
        fontSize: s.font,
        fontWeight: "var(--weight-semibold)",
        letterSpacing: "-0.005em",
        borderRadius: s.radius,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "background var(--dur-fast) var(--ease-soft), transform var(--dur-fast) var(--ease-soft), box-shadow var(--dur-base) var(--ease-soft)",
        transform: press && !disabled ? "scale(0.97)" : "scale(1)",
        WebkitTapHighlightColor: "transparent",
        ...v,
        ...hoverFx,
        ...style,
      }}
      {...rest}
    >
      {iconLeft && <span style={{ display: "inline-flex" }}>{iconLeft}</span>}
      {children}
      {iconRight && <span style={{ display: "inline-flex" }}>{iconRight}</span>}
    </button>
  );
}
