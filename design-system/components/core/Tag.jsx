import React from "react";

/** A selectable taste/genre chip — favourite books, genres, hobbies. */
export function Tag({ children, selected = false, onClick, icon = null, style = {}, ...rest }) {
  const interactive = !!onClick;
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        height: 38,
        padding: "0 16px",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-sm)",
        fontWeight: 500,
        borderRadius: "var(--radius-pill)",
        cursor: interactive ? "pointer" : "default",
        transition: "all var(--dur-fast) var(--ease-soft)",
        background: selected ? "var(--ink-900)" : hover && interactive ? "var(--parchment-deep)" : "var(--surface-card)",
        color: selected ? "#fff" : "var(--ink-700)",
        border: `1px solid ${selected ? "var(--ink-900)" : "var(--border-strong)"}`,
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
      {...rest}
    >
      {icon && <span style={{ display: "inline-flex" }}>{icon}</span>}
      {children}
    </button>
  );
}
