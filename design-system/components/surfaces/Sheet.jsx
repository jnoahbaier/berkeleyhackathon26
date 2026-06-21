import React from "react";

/** Bottom sheet — big top corners, grab handle. The app's modal surface. */
export function Sheet({ children, title = "", onClose, onNight = false, style = {}, ...rest }) {
  return (
    <div
      style={{
        background: onNight ? "var(--night-800)" : "var(--surface-card)",
        borderTopLeftRadius: "var(--radius-2xl)",
        borderTopRightRadius: "var(--radius-2xl)",
        boxShadow: "var(--shadow-xl)",
        padding: "14px 22px 24px",
        color: onNight ? "var(--night-text)" : "var(--text-body)",
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          width: 40,
          height: 5,
          borderRadius: 999,
          background: onNight ? "var(--night-600)" : "var(--line-strong)",
          margin: "0 auto 16px",
        }}
      />
      {title && (
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: "var(--text-h3)",
            letterSpacing: "-0.01em",
            color: onNight ? "var(--night-text)" : "var(--text-strong)",
            marginBottom: 14,
          }}
        >
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
