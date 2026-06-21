import React from "react";

/**
 * Talegate IconButton — the glassy circular key-cap from the brand
 * (à la the inspiration's ?, profile, scan controls). Icon-only.
 */
export function IconButton({
  children,
  size = "md",
  variant = "glass",
  label,
  onNight = false,
  disabled = false,
  style = {},
  ...rest
}) {
  const sizes = { sm: 36, md: 44, lg: 54 };
  const dim = sizes[size] || sizes.md;

  const variants = {
    glass: {
      background: onNight ? "var(--glass-fill-night)" : "var(--glass-fill)",
      color: onNight ? "var(--night-text)" : "var(--ink-900)",
      border: `1px solid ${onNight ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.7)"}`,
      boxShadow: "var(--shadow-glass)",
      backdropFilter: "var(--blur-glass)",
      WebkitBackdropFilter: "var(--blur-glass)",
    },
    solid: {
      background: "var(--ink-900)",
      color: "#fff",
      border: "1px solid transparent",
      boxShadow: "var(--shadow-md)",
    },
    brand: {
      background: "var(--brand)",
      color: "#fff",
      border: "1px solid transparent",
      boxShadow: "var(--shadow-sm)",
    },
    plain: {
      background: onNight ? "var(--night-700)" : "var(--surface-card)",
      color: onNight ? "var(--night-text)" : "var(--ink-700)",
      border: `1px solid ${onNight ? "var(--night-600)" : "var(--border-hairline)"}`,
      boxShadow: "none",
    },
  };
  const v = variants[variant] || variants.glass;
  const [press, setPress] = React.useState(false);

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      onMouseLeave={() => setPress(false)}
      style={{
        width: dim,
        height: dim,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "var(--radius-circle)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "transform var(--dur-fast) var(--ease-soft), background var(--dur-base) var(--ease-soft)",
        transform: press && !disabled ? "scale(0.92)" : "scale(1)",
        WebkitTapHighlightColor: "transparent",
        padding: 0,
        ...v,
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
