import React from "react";

/** Text input — sunken well, soft focus ring. */
export function Input({
  value,
  onChange,
  placeholder = "",
  label = "",
  type = "text",
  icon = null,
  onNight = false,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{ display: "block", ...style }}>
      {label && (
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            color: onNight ? "var(--night-soft)" : "var(--text-secondary)",
            marginBottom: 8,
          }}
        >
          {label}
        </span>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          height: 50,
          padding: "0 16px",
          background: onNight ? "var(--night-700)" : "var(--surface-sunk)",
          border: `1.5px solid ${focus ? "var(--focus-ring)" : onNight ? "var(--night-600)" : "transparent"}`,
          borderRadius: "var(--radius-md)",
          boxShadow: focus ? "0 0 0 4px rgba(91,80,201,0.16)" : "none",
          transition: "border var(--dur-fast) var(--ease-soft), box-shadow var(--dur-fast) var(--ease-soft)",
        }}
      >
        {icon && <span style={{ display: "inline-flex", color: "var(--ink-400)" }}>{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-base)",
            color: onNight ? "var(--night-text)" : "var(--text-strong)",
          }}
          {...rest}
        />
      </div>
    </label>
  );
}
