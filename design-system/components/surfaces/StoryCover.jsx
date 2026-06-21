import React from "react";

/**
 * StoryCover — a gradient-and-type book cover for the Shelf.
 * A deliberate placeholder treatment until commissioned art lands
 * (pass `src` to use a real cover image).
 */
const COVER_GRADIENTS = {
  medieval: "linear-gradient(160deg,#3d4a3a 0%,#6b6b3f 55%,#c79a4e 120%)",
  scifi: "linear-gradient(160deg,#16203a 0%,#2a3f6e 55%,#6db5c9 130%)",
  noir: "linear-gradient(160deg,#1a1822 0%,#3a3550 60%,#8a7fa6 130%)",
  cosy: "linear-gradient(160deg,#7a4a3a 0%,#c98a5e 55%,#f2cda0 130%)",
  horror: "linear-gradient(160deg,#1c1414 0%,#3f2526 60%,#a04f3f 130%)",
  myth: "linear-gradient(160deg,#2a2350 0%,#5a3f6e 55%,#e89b3c 130%)",
};

export function StoryCover({
  title = "Untitled",
  author = "",
  genre = "myth",
  src = null,
  size = "md",
  selected = false,
  onClick,
  style = {},
  ...rest
}) {
  const dims = {
    sm: { w: 116, h: 168, title: 17, pad: 12 },
    md: { w: 156, h: 224, title: 21, pad: 15 },
    lg: { w: 208, h: 300, title: 27, pad: 19 },
  };
  const d = dims[size] || dims.md;
  const bg = src
    ? `center/cover no-repeat url(${src})`
    : COVER_GRADIENTS[genre] || COVER_GRADIENTS.myth;
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: d.w,
        height: d.h,
        borderRadius: "var(--radius-md)",
        background: bg,
        position: "relative",
        overflow: "hidden",
        flex: "none",
        cursor: onClick ? "pointer" : "default",
        boxShadow: selected
          ? "0 0 0 3px var(--candle-500), var(--shadow-lg)"
          : hover
          ? "var(--shadow-lg)"
          : "var(--shadow-md)",
        transform: hover ? "translateY(-4px)" : "none",
        transition: "transform var(--dur-base) var(--ease-soft), box-shadow var(--dur-base) var(--ease-soft)",
        ...style,
      }}
      {...rest}
    >
      {/* legibility scrim */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0.05) 0%,rgba(0,0,0,0) 35%,rgba(0,0,0,0.45) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, padding: d.pad, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.82)" }}>{genre}</span>
        <div>
          <div style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: d.title, lineHeight: 1.1, color: "#fff", letterSpacing: "-0.01em", textWrap: "balance" }}>{title}</div>
          {author && <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "rgba(255,255,255,0.78)", marginTop: 5 }}>{author}</div>}
        </div>
      </div>
    </div>
  );
}
