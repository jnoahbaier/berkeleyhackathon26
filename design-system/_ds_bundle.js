/* @ds-bundle: {"format":3,"namespace":"BabelDesignSystem_2e9b76","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"AvatarStack","sourcePath":"components/core/AvatarStack.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"GuildDots","sourcePath":"components/feedback/GuildDots.jsx"},{"name":"ProgressTrack","sourcePath":"components/feedback/ProgressTrack.jsx"},{"name":"Choice","sourcePath":"components/forms/Choice.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"SegmentedControl","sourcePath":"components/forms/SegmentedControl.jsx"},{"name":"Stepper","sourcePath":"components/forms/Stepper.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"Sheet","sourcePath":"components/surfaces/Sheet.jsx"},{"name":"StoryCover","sourcePath":"components/surfaces/StoryCover.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"819e3714f542","components/core/AvatarStack.jsx":"c429622d8e54","components/core/Badge.jsx":"c19d4a310a17","components/core/Button.jsx":"cfd283e72114","components/core/IconButton.jsx":"85a1bd92a26d","components/core/Tag.jsx":"ebea180644e0","components/feedback/GuildDots.jsx":"80a489b2f11c","components/feedback/ProgressTrack.jsx":"bb83ccc69223","components/forms/Choice.jsx":"70f95f05b7ac","components/forms/Input.jsx":"6e7ab2691039","components/forms/SegmentedControl.jsx":"0e32e550a43f","components/forms/Stepper.jsx":"a1e94a53b5be","components/surfaces/Card.jsx":"b46e0f2a329e","components/surfaces/Sheet.jsx":"401c3a27e247","components/surfaces/StoryCover.jsx":"0e34c25ce296","ui_kits/babel-app/app.jsx":"e42d0900acc3","ui_kits/babel-app/frame.jsx":"1c59d0e1110e","ui_kits/babel-app/home.jsx":"7c7991b3385c","ui_kits/babel-app/reader.jsx":"705f27f75016","ui_kits/babel-app/setup.jsx":"5deb07279ef2","ui_kits/babel-app/shelf.jsx":"cfa2d08fcad9"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.BabelDesignSystem_2e9b76 = window.BabelDesignSystem_2e9b76 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SEAT_COLORS = {
  1: {
    bg: "var(--guild-1)",
    soft: "var(--guild-1-soft)"
  },
  2: {
    bg: "var(--guild-2)",
    soft: "var(--guild-2-soft)"
  },
  3: {
    bg: "var(--guild-3)",
    soft: "var(--guild-3-soft)"
  },
  4: {
    bg: "var(--guild-4)",
    soft: "var(--guild-4-soft)"
  }
};

/** A guild member's avatar — colored by seat, initials or image. */
function Avatar({
  name = "",
  seat = 1,
  src = null,
  size = 40,
  ring = false,
  style = {},
  ...rest
}) {
  const seatc = SEAT_COLORS[seat] || SEAT_COLORS[1];
  const initials = name.split(" ").map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
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
      ...style
    },
    title: name
  }, rest), !src && initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/AvatarStack.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Overlapping row of guild avatars, with optional "+N" overflow. */
function AvatarStack({
  members = [],
  size = 36,
  max = 4,
  style = {},
  ...rest
}) {
  const shown = members.slice(0, max);
  const extra = members.length - shown.length;
  const overlap = Math.round(size * 0.32);
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      ...style
    }
  }, rest), shown.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      marginLeft: i === 0 ? 0 : -overlap,
      position: "relative",
      zIndex: i
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    name: m.name,
    seat: m.seat || i + 1,
    src: m.src,
    size: size,
    ring: true
  }))), extra > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
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
      boxShadow: "0 0 0 2px var(--parchment)"
    }
  }, "+", extra));
}
Object.assign(__ds_scope, { AvatarStack });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/AvatarStack.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Small status pill — e.g. "Lit", "Night 12", "Locked". */
function Badge({
  children,
  tone = "neutral",
  dot = false,
  style = {},
  ...rest
}) {
  const tones = {
    neutral: {
      bg: "var(--paper-sunk)",
      fg: "var(--ink-600,#6b6457)",
      dotc: "var(--ink-400)"
    },
    brand: {
      bg: "var(--indigo-50)",
      fg: "var(--indigo-700)",
      dotc: "var(--indigo-600)"
    },
    lit: {
      bg: "var(--candle-50)",
      fg: "var(--candle-700)",
      dotc: "var(--candle-500)"
    },
    success: {
      bg: "var(--success-50)",
      fg: "var(--success-600)",
      dotc: "var(--success-600)"
    },
    danger: {
      bg: "var(--danger-50)",
      fg: "var(--danger-600)",
      dotc: "var(--danger-600)"
    },
    night: {
      bg: "var(--night-700)",
      fg: "var(--night-text)",
      dotc: "var(--indigo-300)"
    }
  };
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 24,
      padding: "0 10px",
      background: t.bg,
      color: t.fg,
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-label)",
      fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      borderRadius: "var(--radius-pill)",
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: t.dotc
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Talegate Button — the primary action primitive.
 * Pill by default; soft press (scale 0.97) and calm easing.
 */
function Button({
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
    sm: {
      height: 36,
      padding: "0 16px",
      font: "var(--text-sm)",
      radius: "var(--radius-pill)",
      gap: 7
    },
    md: {
      height: 46,
      padding: "0 22px",
      font: "var(--text-base)",
      radius: "var(--radius-pill)",
      gap: 8
    },
    lg: {
      height: 56,
      padding: "0 28px",
      font: "var(--text-lg)",
      radius: "var(--radius-pill)",
      gap: 10
    }
  };
  const s = sizes[size] || sizes.md;
  const variants = {
    primary: {
      background: "var(--brand)",
      color: "var(--text-on-brand)",
      border: "1px solid transparent",
      boxShadow: "var(--shadow-sm)"
    },
    accent: {
      background: "var(--accent)",
      color: "#3b2a10",
      border: "1px solid transparent",
      boxShadow: "var(--shadow-sm)"
    },
    secondary: {
      background: onNight ? "var(--night-700)" : "var(--surface-card)",
      color: onNight ? "var(--night-text)" : "var(--text-strong)",
      border: `1px solid ${onNight ? "var(--night-600)" : "var(--border-strong)"}`,
      boxShadow: onNight ? "none" : "var(--shadow-xs)"
    },
    ghost: {
      background: "transparent",
      color: onNight ? "var(--night-text)" : "var(--brand)",
      border: "1px solid transparent",
      boxShadow: "none"
    }
  };
  const v = variants[variant] || variants.primary;
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const hoverFx = !disabled && hover ? variant === "primary" ? {
    background: "var(--brand-hover)"
  } : variant === "accent" ? {
    background: "var(--accent-hover)"
  } : variant === "ghost" ? {
    background: onNight ? "rgba(255,255,255,0.06)" : "var(--brand-tint)"
  } : {
    boxShadow: "var(--shadow-sm)",
    transform: "translateY(-1px)"
  } : {};
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
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
      ...style
    }
  }, rest), iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex"
    }
  }, iconLeft), children, iconRight && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex"
    }
  }, iconRight));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Talegate IconButton — the glassy circular key-cap from the brand
 * (à la the inspiration's ?, profile, scan controls). Icon-only.
 */
function IconButton({
  children,
  size = "md",
  variant = "glass",
  label,
  onNight = false,
  disabled = false,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: 36,
    md: 44,
    lg: 54
  };
  const dim = sizes[size] || sizes.md;
  const variants = {
    glass: {
      background: onNight ? "var(--glass-fill-night)" : "var(--glass-fill)",
      color: onNight ? "var(--night-text)" : "var(--ink-900)",
      border: `1px solid ${onNight ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.7)"}`,
      boxShadow: "var(--shadow-glass)",
      backdropFilter: "var(--blur-glass)",
      WebkitBackdropFilter: "var(--blur-glass)"
    },
    solid: {
      background: "var(--ink-900)",
      color: "#fff",
      border: "1px solid transparent",
      boxShadow: "var(--shadow-md)"
    },
    brand: {
      background: "var(--brand)",
      color: "#fff",
      border: "1px solid transparent",
      boxShadow: "var(--shadow-sm)"
    },
    plain: {
      background: onNight ? "var(--night-700)" : "var(--surface-card)",
      color: onNight ? "var(--night-text)" : "var(--ink-700)",
      border: `1px solid ${onNight ? "var(--night-600)" : "var(--border-hairline)"}`,
      boxShadow: "none"
    }
  };
  const v = variants[variant] || variants.glass;
  const [press, setPress] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    onMouseLeave: () => setPress(false),
    style: {
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
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** A selectable taste/genre chip — favourite books, genres, hobbies. */
function Tag({
  children,
  selected = false,
  onClick,
  icon = null,
  style = {},
  ...rest
}) {
  const interactive = !!onClick;
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
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
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex"
    }
  }, icon), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/GuildDots.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GuildDots — the alignment indicator. One dot per guild seat showing
 * who's caught up / chosen tonight. Filled = done, hollow = pending.
 */
function GuildDots({
  members = [],
  label = "",
  size = 26,
  onNight = false,
  style = {},
  ...rest
}) {
  const SEAT = {
    1: "var(--guild-1)",
    2: "var(--guild-2)",
    3: "var(--guild-3)",
    4: "var(--guild-4)"
  };
  const doneCount = members.filter(m => m.done).length;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      gap: 7
    }
  }, members.map((m, i) => {
    const c = SEAT[m.seat || i + 1] || SEAT[1];
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      title: `${m.name}${m.done ? " · ready" : " · reading"}`,
      style: {
        width: size,
        height: size,
        borderRadius: "var(--radius-circle)",
        background: m.done ? c : "transparent",
        border: `2px solid ${m.done ? c : onNight ? "var(--night-600)" : "var(--line-strong)"}`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-sans)",
        fontSize: size * 0.4,
        fontWeight: 700,
        color: m.done ? "#fff" : onNight ? "var(--night-muted)" : "var(--ink-300)",
        transition: "all var(--dur-base) var(--ease-soft)"
      }
    }, (m.name || "?")[0].toUpperCase());
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: onNight ? "var(--night-muted)" : "var(--text-muted)"
    }
  }, label || `${doneCount} of ${members.length} ready`));
}
Object.assign(__ds_scope, { GuildDots });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/GuildDots.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressTrack.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** ProgressTrack — the month-long tale progress (Night X of 30). */
function ProgressTrack({
  value = 0,
  total = 30,
  label = "",
  onNight = false,
  style = {},
  ...rest
}) {
  const pct = Math.max(0, Math.min(100, value / total * 100));
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      ...style
    }
  }, rest), (label || total) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: onNight ? "var(--night-muted)" : "var(--text-muted)"
    }
  }, label || "Progress"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: "0.12em",
      color: onNight ? "var(--night-soft)" : "var(--text-secondary)"
    }
  }, value, " / ", total)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      borderRadius: 999,
      background: onNight ? "var(--night-700)" : "var(--surface-sunk)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${pct}%`,
      height: "100%",
      borderRadius: 999,
      background: "linear-gradient(90deg,var(--candle-500),var(--candle-400))",
      transition: "width var(--dur-slow) var(--ease-soft)"
    }
  })));
}
Object.assign(__ds_scope, { ProgressTrack });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressTrack.jsx", error: String((e && e.message) || e) }); }

// components/forms/Choice.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Choice — an in-story decision option. Serif voice, lives on the
 * night reader. Selectable; supports a "betrayal" (danger) flavour.
 */
function Choice({
  children,
  letter = "",
  selected = false,
  flavor = "default",
  meta = "",
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const accent = flavor === "betrayal" ? "var(--danger-600)" : "var(--candle-500)";
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 14,
      width: "100%",
      textAlign: "left",
      padding: "16px 18px",
      background: selected ? "var(--night-700)" : hover ? "var(--night-800)" : "var(--night-800)",
      border: `1.5px solid ${selected ? accent : "var(--night-600)"}`,
      borderRadius: "var(--radius-lg)",
      cursor: "pointer",
      boxShadow: selected ? "0 0 0 4px rgba(232,155,60,0.14)" : "none",
      transition: "all var(--dur-base) var(--ease-soft)",
      transform: hover && !selected ? "translateY(-1px)" : "none",
      WebkitTapHighlightColor: "transparent",
      ...style
    }
  }, rest), letter && /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 30,
      height: 30,
      borderRadius: "var(--radius-circle)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: selected ? accent : "var(--night-700)",
      color: selected ? "#1a130a" : "var(--night-soft)",
      border: `1px solid ${selected ? accent : "var(--night-600)"}`,
      fontFamily: "var(--font-mono)",
      fontSize: 13,
      fontWeight: 600,
      marginTop: 2
    }
  }, letter), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: "var(--font-serif)",
      fontSize: 19,
      lineHeight: 1.4,
      color: "var(--night-text)"
    }
  }, children), meta && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 6,
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: flavor === "betrayal" ? "var(--danger-600)" : "var(--night-muted)"
    }
  }, meta)));
}
Object.assign(__ds_scope, { Choice });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Choice.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Text input — sunken well, soft focus ring. */
function Input({
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
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      fontWeight: 600,
      color: onNight ? "var(--night-soft)" : "var(--text-secondary)",
      marginBottom: 8
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      height: 50,
      padding: "0 16px",
      background: onNight ? "var(--night-700)" : "var(--surface-sunk)",
      border: `1.5px solid ${focus ? "var(--focus-ring)" : onNight ? "var(--night-600)" : "transparent"}`,
      borderRadius: "var(--radius-md)",
      boxShadow: focus ? "0 0 0 4px rgba(91,80,201,0.16)" : "none",
      transition: "border var(--dur-fast) var(--ease-soft), box-shadow var(--dur-fast) var(--ease-soft)"
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      color: "var(--ink-400)"
    }
  }, icon), /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      border: "none",
      outline: "none",
      background: "transparent",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-base)",
      color: onNight ? "var(--night-text)" : "var(--text-strong)"
    }
  }, rest))));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/SegmentedControl.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Segmented control — a soft pill track with a sliding selection. */
function SegmentedControl({
  options = [],
  value,
  onChange,
  onNight = false,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    style: {
      display: "inline-flex",
      padding: 4,
      gap: 2,
      background: onNight ? "var(--night-700)" : "var(--surface-sunk)",
      borderRadius: "var(--radius-pill)",
      ...style
    }
  }, rest), options.map(opt => {
    const key = typeof opt === "string" ? opt : opt.value;
    const label = typeof opt === "string" ? opt : opt.label;
    const active = key === value;
    return /*#__PURE__*/React.createElement("button", {
      key: key,
      type: "button",
      role: "tab",
      "aria-selected": active,
      onClick: () => onChange && onChange(key),
      style: {
        border: "none",
        cursor: "pointer",
        padding: "8px 18px",
        borderRadius: "var(--radius-pill)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-sm)",
        fontWeight: 600,
        transition: "all var(--dur-base) var(--ease-soft)",
        background: active ? onNight ? "var(--night-800)" : "var(--surface-card)" : "transparent",
        color: active ? onNight ? "var(--night-text)" : "var(--text-strong)" : onNight ? "var(--night-muted)" : "var(--text-secondary)",
        boxShadow: active ? "var(--shadow-sm)" : "none",
        WebkitTapHighlightColor: "transparent"
      }
    }, label);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/forms/Stepper.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Stepper — increment/decrement a guild hyperparameter (players, pages/night). */
function Stepper({
  value = 2,
  min = 2,
  max = 4,
  onChange,
  suffix = "",
  style = {},
  ...rest
}) {
  const set = n => onChange && onChange(Math.max(min, Math.min(max, n)));
  const btn = disabled => ({
    width: 40,
    height: 40,
    borderRadius: "var(--radius-circle)",
    border: "1px solid var(--border-strong)",
    background: "var(--surface-card)",
    color: disabled ? "var(--text-placeholder)" : "var(--ink-900)",
    fontSize: 22,
    fontWeight: 500,
    lineHeight: 1,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background var(--dur-fast) var(--ease-soft)"
  });
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 18,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: btn(value <= min),
    disabled: value <= min,
    onClick: () => set(value - 1)
  }, "\u2212"), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 64,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 34,
      fontWeight: 700,
      letterSpacing: "-0.02em",
      color: "var(--text-strong)"
    }
  }, value), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      color: "var(--text-muted)",
      marginLeft: 6
    }
  }, suffix)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: btn(value >= max),
    disabled: value >= max,
    onClick: () => set(value + 1)
  }, "+"));
}
Object.assign(__ds_scope, { Stepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Stepper.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Soft rounded surface — the base container for everything in Talegate. */
function Card({
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
    lg: "var(--shadow-lg)"
  };
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => interactive && setHover(true),
    onMouseLeave: () => interactive && setHover(false),
    style: {
      background: onNight ? "var(--night-700)" : "var(--surface-card)",
      border: onNight ? "1px solid var(--night-600)" : "1px solid transparent",
      borderRadius: "var(--radius-lg)",
      boxShadow: hover ? "var(--shadow-lg)" : shadows[elevation] || shadows.md,
      padding: pad,
      transition: "box-shadow var(--dur-base) var(--ease-soft), transform var(--dur-base) var(--ease-soft)",
      transform: hover ? "translateY(-3px)" : "none",
      cursor: interactive ? "pointer" : "default",
      color: onNight ? "var(--night-text)" : "var(--text-body)",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Sheet.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Bottom sheet — big top corners, grab handle. The app's modal surface. */
function Sheet({
  children,
  title = "",
  onClose,
  onNight = false,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: onNight ? "var(--night-800)" : "var(--surface-card)",
      borderTopLeftRadius: "var(--radius-2xl)",
      borderTopRightRadius: "var(--radius-2xl)",
      boxShadow: "var(--shadow-xl)",
      padding: "14px 22px 24px",
      color: onNight ? "var(--night-text)" : "var(--text-body)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 5,
      borderRadius: 999,
      background: onNight ? "var(--night-600)" : "var(--line-strong)",
      margin: "0 auto 16px"
    }
  }), title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: 700,
      fontSize: "var(--text-h3)",
      letterSpacing: "-0.01em",
      color: onNight ? "var(--night-text)" : "var(--text-strong)",
      marginBottom: 14
    }
  }, title), children);
}
Object.assign(__ds_scope, { Sheet });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Sheet.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/StoryCover.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  myth: "linear-gradient(160deg,#2a2350 0%,#5a3f6e 55%,#e89b3c 130%)"
};
function StoryCover({
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
    sm: {
      w: 116,
      h: 168,
      title: 17,
      pad: 12
    },
    md: {
      w: 156,
      h: 224,
      title: 21,
      pad: 15
    },
    lg: {
      w: 208,
      h: 300,
      title: 27,
      pad: 19
    }
  };
  const d = dims[size] || dims.md;
  const bg = src ? `center/cover no-repeat url(${src})` : COVER_GRADIENTS[genre] || COVER_GRADIENTS.myth;
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: d.w,
      height: d.h,
      borderRadius: "var(--radius-md)",
      background: bg,
      position: "relative",
      overflow: "hidden",
      flex: "none",
      cursor: onClick ? "pointer" : "default",
      boxShadow: selected ? "0 0 0 3px var(--candle-500), var(--shadow-lg)" : hover ? "var(--shadow-lg)" : "var(--shadow-md)",
      transform: hover ? "translateY(-4px)" : "none",
      transition: "transform var(--dur-base) var(--ease-soft), box-shadow var(--dur-base) var(--ease-soft)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg,rgba(0,0,0,0.05) 0%,rgba(0,0,0,0) 35%,rgba(0,0,0,0.45) 100%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      padding: d.pad,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.82)"
    }
  }, genre), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 600,
      fontSize: d.title,
      lineHeight: 1.1,
      color: "#fff",
      letterSpacing: "-0.01em",
      textWrap: "balance"
    }
  }, title), author && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      color: "rgba(255,255,255,0.78)",
      marginTop: 5
    }
  }, author))));
}
Object.assign(__ds_scope, { StoryCover });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/StoryCover.jsx", error: String((e && e.message) || e) }); }

// ui_kits/babel-app/app.jsx
try { (() => {
/* Talegate app — router shell. Mounts the interactive prototype. */
(function () {
  const {
    Phone,
    TabBar
  } = window;
  const {
    TonightScreen,
    GuildScreen
  } = window;
  const {
    ShelfScreen,
    DetailSheet
  } = window;
  const {
    SetupScreen,
    CharacterScreen
  } = window;
  const {
    ReaderScreen
  } = window;
  function App() {
    const [tab, setTab] = React.useState("tonight");
    const [overlay, setOverlay] = React.useState(null); // reader | setup | character
    const [detail, setDetail] = React.useState(null);
    const night = overlay === "reader";
    return /*#__PURE__*/React.createElement(Phone, {
      night: night
    }, overlay === null && /*#__PURE__*/React.createElement(React.Fragment, null, tab === "tonight" && /*#__PURE__*/React.createElement(TonightScreen, {
      onRead: () => setOverlay("reader")
    }), tab === "shelf" && /*#__PURE__*/React.createElement(ShelfScreen, {
      onPick: setDetail
    }), tab === "guild" && /*#__PURE__*/React.createElement(GuildScreen, null), /*#__PURE__*/React.createElement(TabBar, {
      active: tab,
      onChange: t => {
        setTab(t);
        setDetail(null);
      }
    }), /*#__PURE__*/React.createElement(DetailSheet, {
      story: detail,
      onClose: () => setDetail(null),
      onStart: () => {
        setDetail(null);
        setOverlay("setup");
      }
    })), overlay === "setup" && /*#__PURE__*/React.createElement(SetupScreen, {
      onBack: () => setOverlay(null),
      onNext: () => setOverlay("character")
    }), overlay === "character" && /*#__PURE__*/React.createElement(CharacterScreen, {
      onBack: () => setOverlay("setup"),
      onDone: () => {
        setTab("tonight");
        setOverlay("reader");
      }
    }), overlay === "reader" && /*#__PURE__*/React.createElement(ReaderScreen, {
      onExit: () => setOverlay(null)
    }));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/babel-app/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/babel-app/frame.jsx
try { (() => {
/* Talegate UI kit — shared frame, icon helper, and mock data.
   Exposes: window.Icon, window.Phone, window.TabBar, window.BABEL */

(function () {
  // ---- Lucide icon helper ----
  function Icon({
    name,
    size = 22,
    color = "currentColor",
    stroke = 1.9,
    style = {}
  }) {
    const node = window.lucide && lucide.icons[name];
    const svg = React.useMemo(() => {
      if (!node) return "";
      const el = lucide.createElement(node);
      el.setAttribute("width", size);
      el.setAttribute("height", size);
      el.setAttribute("stroke", color);
      el.setAttribute("stroke-width", stroke);
      return el.outerHTML;
    }, [name, size, color, stroke]);
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        ...style
      },
      dangerouslySetInnerHTML: {
        __html: svg
      }
    });
  }

  // ---- Phone device frame (frameless rounded, à la inspiration) ----
  function Phone({
    children,
    night = false,
    bg = null
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: 390,
        height: 844,
        borderRadius: 54,
        background: bg || (night ? "var(--night-900)" : "var(--parchment)"),
        boxShadow: "0 2px 1px rgba(255,255,255,0.6) inset, 0 40px 80px rgba(31,26,16,0.22), 0 8px 24px rgba(31,26,16,0.14)",
        border: night ? "1px solid #2a2742" : "1px solid rgba(255,255,255,0.7)",
        position: "relative",
        overflow: "hidden",
        flex: "none",
        fontFamily: "var(--font-sans)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 54,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        zIndex: 40,
        pointerEvents: "none"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 15,
        fontWeight: 700,
        color: night ? "var(--night-text)" : "var(--ink-900)",
        letterSpacing: "-0.01em"
      }
    }, "9:41"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 7,
        color: night ? "var(--night-text)" : "var(--ink-900)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "signal",
      size: 17,
      stroke: 2.2
    }), /*#__PURE__*/React.createElement(Icon, {
      name: "wifi",
      size: 17,
      stroke: 2.2
    }), /*#__PURE__*/React.createElement(Icon, {
      name: "battery-full",
      size: 19,
      stroke: 2.2
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        top: 13,
        left: "50%",
        transform: "translateX(-50%)",
        width: 116,
        height: 33,
        borderRadius: 999,
        background: "#0c0a12",
        zIndex: 41
      }
    }), children);
  }

  // ---- Bottom tab bar (glass) ----
  function TabBar({
    active,
    onChange,
    night = false
  }) {
    const tabs = [{
      id: "tonight",
      label: "Tonight",
      icon: "moon"
    }, {
      id: "shelf",
      label: "Shelf",
      icon: "library"
    }, {
      id: "guild",
      label: "Guild",
      icon: "users"
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 14,
        height: 68,
        zIndex: 30,
        background: night ? "rgba(28,25,48,0.7)" : "rgba(255,255,255,0.72)",
        backdropFilter: "var(--blur-glass)",
        WebkitBackdropFilter: "var(--blur-glass)",
        borderRadius: 30,
        border: `1px solid ${night ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.8)"}`,
        boxShadow: "var(--shadow-lg)",
        display: "flex",
        alignItems: "center",
        padding: "0 10px"
      }
    }, tabs.map(t => {
      const on = active === t.id;
      const col = on ? "var(--indigo-600)" : night ? "var(--night-muted)" : "var(--ink-400)";
      return /*#__PURE__*/React.createElement("button", {
        key: t.id,
        onClick: () => onChange(t.id),
        style: {
          flex: 1,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          padding: "8px 0",
          WebkitTapHighlightColor: "transparent"
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: t.icon,
        size: 23,
        color: col,
        stroke: on ? 2.2 : 1.8
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          fontWeight: on ? 700 : 500,
          color: col,
          fontFamily: "var(--font-sans)"
        }
      }, t.label));
    }));
  }

  // ---- Shared mock data ----
  const BABEL = {
    guild: {
      name: "The Night Owls",
      members: [{
        name: "Mara Vance",
        seat: 1,
        you: false
      }, {
        name: "You",
        seat: 2,
        you: true
      }, {
        name: "Iris Bell",
        seat: 3,
        you: false
      }, {
        name: "Kai Okafor",
        seat: 4,
        you: false
      }]
    },
    story: {
      title: "The Ember Gate",
      author: "A. Solace",
      genre: "medieval",
      tagline: "A guild of four, one road, and a gate that only opens at a price.",
      night: 12,
      total: 30,
      pages: 8
    },
    shelf: [{
      title: "The Ember Gate",
      author: "A. Solace",
      genre: "medieval"
    }, {
      title: "Signal in the Deep",
      author: "N. Okafor",
      genre: "scifi"
    }, {
      title: "The Quiet Hour",
      author: "L. März",
      genre: "cosy"
    }, {
      title: "Velvet & Ash",
      author: "R. Devi",
      genre: "noir"
    }, {
      title: "What the Wood Keeps",
      author: "S. Holt",
      genre: "horror"
    }, {
      title: "Salt & Starlight",
      author: "M. Reyes",
      genre: "myth"
    }, {
      title: "The Last Cartographer",
      author: "J. Penn",
      genre: "scifi"
    }, {
      title: "A Year of Small Doors",
      author: "E. Fenn",
      genre: "cosy"
    }, {
      title: "The Drowned King",
      author: "T. Marsh",
      genre: "medieval"
    }, {
      title: "Neon Hours",
      author: "C. Vale",
      genre: "noir"
    }],
    chapter: {
      label: "Chapter 12 · Night 12",
      title: "The gate, or the river",
      paras: ["The lantern gutters low, and for a moment the whole company is nothing but breath and the smell of wet stone. Mara stands at the lip of the ravine, her cloak heavy with river-mist, and she will not look at the gate.", "\u201cWe could cross here,\u201d she says. \u201cThe water is loud enough to hide us. But it is cold, and Kai cannot swim.\u201d", "Behind you, the Ember Gate breathes its slow orange light. It will open \u2014 it always opens \u2014 but it asks for something each time, and tonight it has been watching you the way a creditor watches a door.", "Iris touches your sleeve. \u201cIt should be your call,\u201d she says quietly. \u201cYou\u2019ve carried us this far.\u201d", "The night is not patient. Mara waits for your word."],
      choices: [{
        letter: "A",
        text: "Take the river. Cold is a price you can pay tonight.",
        flavor: "default",
        tally: "2 of 4 chose this"
      }, {
        letter: "B",
        text: "Open the gate \u2014 and offer it the lantern, the only warmth you have.",
        flavor: "default",
        tally: "1 of 4 chose this"
      }, {
        letter: "C",
        text: "Cut Kai loose. He has slowed you since the bridge.",
        flavor: "betrayal",
        tally: "Betrayal"
      }]
    },
    hearth: [{
      who: "Mara",
      seat: 1,
      text: "i am NOT letting the gate have the lantern, are you insane"
    }, {
      who: "Kai",
      seat: 4,
      text: "whoever picks C we are no longer friends 😭"
    }, {
      who: "Iris",
      seat: 3,
      text: "river. trust me. (i read ahead. i didn't. but trust me.)"
    }]
  };
  window.Icon = Icon;
  window.Phone = Phone;
  window.TabBar = TabBar;
  window.BABEL = BABEL;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/babel-app/frame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/babel-app/home.jsx
try { (() => {
/* Tonight (home) + Guild screens. Exposes window.TonightScreen, window.GuildScreen */
(function () {
  const DS = window.BabelDesignSystem_2e9b76;
  const {
    Button,
    Badge,
    Card,
    Avatar,
    AvatarStack,
    GuildDots,
    ProgressTrack,
    IconButton
  } = DS;
  const {
    Icon,
    BABEL
  } = window;
  function ScreenScroll({
    children,
    pad = 0
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        overflowY: "auto",
        paddingBottom: 104
      }
    }, children);
  }
  function TonightScreen({
    onRead
  }) {
    const s = BABEL.story;
    const dots = BABEL.guild.members.map((m, i) => ({
      name: m.name,
      seat: m.seat,
      done: i < 2
    }));
    return /*#__PURE__*/React.createElement(ScreenScroll, null, /*#__PURE__*/React.createElement("div", {
      style: {
        background: "var(--gradient-dusk)",
        padding: "70px 24px 30px",
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 26
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      label: "Help",
      variant: "glass",
      size: "sm"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "help-circle",
      size: 19
    })), /*#__PURE__*/React.createElement(IconButton, {
      label: "Profile",
      variant: "glass",
      size: "sm"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "user",
      size: 19
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "rgba(40,32,22,0.65)",
        marginBottom: 10
      }
    }, "Tuesday \xB7 the hour grows late"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-sans)",
        fontWeight: 700,
        fontSize: 38,
        lineHeight: 1.04,
        letterSpacing: "-0.025em",
        color: "var(--ink-900)"
      }
    }, "Good evening.", /*#__PURE__*/React.createElement("br", null), "Your guild is gathering.")), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "20px 18px 0",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        marginTop: -14
      }
    }, /*#__PURE__*/React.createElement(Card, {
      elevation: "lg",
      pad: 20
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "lit",
      dot: true
    }, "Lit \xB7 10:00 PM"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.1em",
        color: "var(--ink-400)"
      }
    }, s.pages, " PAGES")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--candle-600)",
        marginBottom: 6
      }
    }, "Chapter ", s.night, " \xB7 ", s.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-serif)",
        fontSize: 25,
        fontWeight: 600,
        lineHeight: 1.18,
        letterSpacing: "-0.01em",
        color: "var(--ink-900)",
        marginBottom: 6
      }
    }, s.title, "?"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font-serif)",
        fontSize: 16,
        lineHeight: 1.55,
        color: "var(--ink-500)",
        margin: "0 0 18px"
      }
    }, "The bridge held \u2014 barely. Tonight the gate is watching, and Mara won't look at it."), /*#__PURE__*/React.createElement(ProgressTrack, {
      value: s.night,
      total: s.total,
      label: "The Ember Gate"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 18
      }
    }), /*#__PURE__*/React.createElement(Button, {
      variant: "accent",
      full: true,
      size: "lg",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "book-open",
        size: 19,
        stroke: 2
      }),
      onClick: onRead
    }, "Read tonight's chapter")), /*#__PURE__*/React.createElement(Card, {
      elevation: "sm",
      pad: 18
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-sans)",
        fontWeight: 700,
        fontSize: 16,
        color: "var(--ink-900)"
      }
    }, "The Night Owls"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        color: "var(--ink-400)",
        marginTop: 2
      }
    }, "2 reading now")), /*#__PURE__*/React.createElement(AvatarStack, {
      size: 38,
      members: BABEL.guild.members
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 14
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        borderTop: "1px solid var(--line)",
        paddingTop: 14
      }
    }, /*#__PURE__*/React.createElement(GuildDots, {
      members: dots
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Card, {
      elevation: "sm",
      pad: 16,
      style: {
        flex: 1
      },
      interactive: true
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "headphones",
      size: 22,
      color: "var(--indigo-600)"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        fontSize: 14,
        color: "var(--ink-900)",
        marginTop: 10
      }
    }, "Listen instead"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-sans)",
        fontSize: 12.5,
        color: "var(--ink-400)",
        marginTop: 2
      }
    }, "11 min, narrated")), /*#__PURE__*/React.createElement(Card, {
      elevation: "sm",
      pad: 16,
      style: {
        flex: 1
      },
      interactive: true
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "message-circle",
      size: 22,
      color: "var(--guild-1)"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        fontSize: 14,
        color: "var(--ink-900)",
        marginTop: 10
      }
    }, "The Hearth"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-sans)",
        fontSize: 12.5,
        color: "var(--ink-400)",
        marginTop: 2
      }
    }, "3 new from Kai")))));
  }
  function GuildScreen() {
    const s = BABEL.story;
    const chars = [{
      name: "Mara Vance",
      role: "The wary scout",
      seat: 1
    }, {
      name: "You",
      role: "The reluctant leader",
      seat: 2
    }, {
      name: "Iris Bell",
      role: "The keeper of secrets",
      seat: 3
    }, {
      name: "Kai Okafor",
      role: "The one who can't swim",
      seat: 4
    }];
    return /*#__PURE__*/React.createElement(ScreenScroll, null, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "66px 24px 18px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--ink-400)",
        marginBottom: 8
      }
    }, "Your guild"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-sans)",
        fontWeight: 700,
        fontSize: 32,
        letterSpacing: "-0.02em",
        color: "var(--ink-900)"
      }
    }, "The Night Owls"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-sans)",
        fontSize: 14.5,
        color: "var(--ink-500)",
        marginTop: 6
      }
    }, "Reading ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: "var(--ink-700)"
      }
    }, "The Ember Gate"), " \xB7 Night ", s.night, " of ", s.total)), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "0 18px",
        display: "flex",
        flexDirection: "column",
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      elevation: "sm",
      pad: 6
    }, chars.map((c, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 14px",
        borderBottom: i < chars.length - 1 ? "1px solid var(--line)" : "none"
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: c.name === "You" ? "Y" : c.name,
      seat: c.seat,
      size: 46
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-sans)",
        fontWeight: 700,
        fontSize: 16,
        color: "var(--ink-900)"
      }
    }, c.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-serif)",
        fontSize: 14.5,
        fontStyle: "italic",
        color: "var(--ink-500)"
      }
    }, c.role)), c.name === "You" && /*#__PURE__*/React.createElement(Badge, {
      tone: "brand"
    }, "You")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--ink-400)",
        margin: "8px 6px 12px"
      }
    }, "The Hearth"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 12
      }
    }, BABEL.hearth.map((m, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        gap: 10,
        alignItems: "flex-end"
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: m.who,
      seat: m.seat,
      size: 30
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        background: "var(--paper)",
        borderRadius: "18px 18px 18px 6px",
        padding: "10px 14px",
        boxShadow: "var(--shadow-sm)",
        maxWidth: 270
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-sans)",
        fontSize: 11,
        fontWeight: 700,
        color: `var(--guild-${m.seat})`,
        marginBottom: 2
      }
    }, m.who), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-sans)",
        fontSize: 14.5,
        lineHeight: 1.4,
        color: "var(--ink-800,#3b362d)"
      }
    }, m.text))))))));
  }
  window.TonightScreen = TonightScreen;
  window.GuildScreen = GuildScreen;
  window.ScreenScroll = ScreenScroll;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/babel-app/home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/babel-app/reader.jsx
try { (() => {
/* Reader — night reading + the nightly choice. Exposes window.ReaderScreen */
(function () {
  const DS = window.BabelDesignSystem_2e9b76;
  const {
    Button,
    Choice,
    Badge,
    IconButton,
    ProgressTrack,
    GuildDots,
    Avatar
  } = DS;
  const {
    Icon,
    BABEL
  } = window;
  function ReaderScreen({
    onExit
  }) {
    const ch = BABEL.chapter;
    const [phase, setPhase] = React.useState("read"); // read | choose | sealed
    const [pick, setPick] = React.useState(null);
    const scroller = React.useRef(null);
    const dots = BABEL.guild.members.map((m, i) => ({
      name: m.name,
      seat: m.seat,
      done: phase === "sealed" ? i !== 2 : i < 1
    }));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        background: "var(--night-900)",
        color: "var(--night-text)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 320,
        background: "var(--gradient-glow)",
        opacity: 0.5,
        pointerEvents: "none"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        padding: "58px 20px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(180deg, var(--night-900) 55%, rgba(19,17,32,0))"
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      label: "Close",
      variant: "plain",
      size: "sm",
      onNight: true,
      onClick: onExit
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-down",
      size: 20
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--night-muted)"
      }
    }, ch.label), /*#__PURE__*/React.createElement(IconButton, {
      label: "Type size",
      variant: "plain",
      size: "sm",
      onNight: true
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "a-large-small",
      size: 20
    }))), /*#__PURE__*/React.createElement("div", {
      ref: scroller,
      style: {
        position: "absolute",
        inset: 0,
        overflowY: "auto",
        padding: "108px 26px 200px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--candle-400)",
        marginBottom: 18,
        textAlign: "center"
      }
    }, "\xB7 ", ch.title, " \xB7"), ch.paras.map((p, i) => /*#__PURE__*/React.createElement("p", {
      key: i,
      style: {
        fontFamily: "var(--font-serif)",
        fontSize: 20,
        lineHeight: 1.78,
        color: "var(--night-text)",
        margin: "0 0 22px",
        textWrap: "pretty",
        maxWidth: "34rem"
      }
    }, i === 0 ? /*#__PURE__*/React.createElement("span", {
      style: {
        float: "left",
        fontSize: 58,
        lineHeight: 0.86,
        fontWeight: 600,
        paddingRight: 12,
        paddingTop: 6,
        color: "var(--candle-400)",
        fontFamily: "var(--font-serif)"
      }
    }, p[0]) : null, i === 0 ? p.slice(1) : p)), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        padding: "8px 0 4px",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--night-muted)"
      }
    }, "\u2014 your word is needed \u2014")), phase === "read" && /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        padding: "40px 22px 28px",
        background: "linear-gradient(0deg, var(--night-900) 60%, rgba(19,17,32,0))",
        zIndex: 20
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "accent",
      full: true,
      size: "lg",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "git-fork",
        size: 19,
        stroke: 2
      }),
      onClick: () => setPhase("choose")
    }, "The night forks \u2014 choose")), (phase === "choose" || phase === "sealed") && /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end"
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: () => phase === "choose" && setPhase("read"),
      style: {
        position: "absolute",
        inset: 0,
        background: "rgba(8,6,14,0.6)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        background: "var(--night-800)",
        borderTopLeftRadius: "var(--radius-2xl)",
        borderTopRightRadius: "var(--radius-2xl)",
        padding: "14px 20px 26px",
        boxShadow: "var(--shadow-xl)",
        borderTop: "1px solid var(--night-600)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 40,
        height: 5,
        borderRadius: 999,
        background: "var(--night-600)",
        margin: "0 auto 16px"
      }
    }), phase === "choose" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-serif)",
        fontWeight: 600,
        fontSize: 22,
        color: "var(--night-text)",
        marginBottom: 4
      }
    }, "The gate, or the river?"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--night-muted)",
        marginBottom: 16
      }
    }, "Your word locks at 10pm"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        marginBottom: 18
      }
    }, ch.choices.map(c => /*#__PURE__*/React.createElement(Choice, {
      key: c.letter,
      letter: c.letter,
      flavor: c.flavor,
      meta: c.tally,
      selected: pick === c.letter,
      onClick: () => setPick(c.letter)
    }, c.text))), /*#__PURE__*/React.createElement(Button, {
      variant: "accent",
      full: true,
      size: "lg",
      disabled: !pick,
      onClick: () => setPhase("sealed")
    }, "Seal my word")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        padding: "6px 0 4px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "var(--candle-500)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 28,
      color: "#1a130a",
      stroke: 2.6
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-serif)",
        fontWeight: 600,
        fontSize: 22,
        color: "var(--night-text)",
        marginBottom: 6
      }
    }, "Your word is sealed."), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font-serif)",
        fontSize: 16,
        lineHeight: 1.5,
        color: "var(--night-soft)",
        margin: "0 auto 20px",
        maxWidth: 300
      }
    }, "The others have until 10pm. Tomorrow night, the road answers.")), /*#__PURE__*/React.createElement("div", {
      style: {
        background: "var(--night-700)",
        borderRadius: "var(--radius-lg)",
        padding: "16px 18px",
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(GuildDots, {
      members: dots,
      onNight: true,
      label: "3 of 4 have chosen"
    })), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onNight: true,
      full: true,
      size: "lg",
      onClick: onExit
    }, "Goodnight")))));
  }
  window.ReaderScreen = ReaderScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/babel-app/reader.jsx", error: String((e && e.message) || e) }); }

// ui_kits/babel-app/setup.jsx
try { (() => {
/* Guild setup + Character creation. Exposes window.SetupScreen, window.CharacterScreen */
(function () {
  const DS = window.BabelDesignSystem_2e9b76;
  const {
    Button,
    Input,
    Stepper,
    SegmentedControl,
    Avatar,
    Tag,
    Badge,
    IconButton
  } = DS;
  const {
    Icon,
    BABEL,
    ScreenScroll
  } = window;
  function StepHead({
    step,
    total,
    title,
    sub,
    onBack
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "60px 22px 6px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 22
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      label: "Back",
      variant: "plain",
      size: "sm",
      onClick: onBack
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-left",
      size: 18
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: "flex",
        gap: 6
      }
    }, Array.from({
      length: total
    }).map((_, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        flex: 1,
        height: 5,
        borderRadius: 999,
        background: i < step ? "var(--candle-500)" : "var(--line)"
      }
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--ink-400)",
        marginBottom: 8
      }
    }, "Step ", step, " of ", total), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-sans)",
        fontWeight: 700,
        fontSize: 28,
        lineHeight: 1.08,
        letterSpacing: "-0.02em",
        color: "var(--ink-900)"
      }
    }, title), sub && /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font-serif)",
        fontSize: 16,
        lineHeight: 1.5,
        color: "var(--ink-500)",
        margin: "10px 0 0"
      }
    }, sub));
  }
  function SetupScreen({
    onBack,
    onNext
  }) {
    const [players, setPlayers] = React.useState(4);
    const [pages, setPages] = React.useState(8);
    const [mode, setMode] = React.useState("Read");
    const [tone, setTone] = React.useState("med");
    const invited = BABEL.guild.members;
    return /*#__PURE__*/React.createElement(ScreenScroll, null, /*#__PURE__*/React.createElement(StepHead, {
      step: 1,
      total: 2,
      title: "Set the terms of your tale.",
      sub: "These keep four friends on the same page \u2014 literally.",
      onBack: onBack
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "22px 18px 0",
        display: "flex",
        flexDirection: "column",
        gap: 22
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Your guild"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 12,
        alignItems: "center"
      }
    }, invited.map((m, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: m.name === "You" ? "Y" : m.name,
      seat: m.seat,
      size: 50
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-sans)",
        fontSize: 11.5,
        color: "var(--ink-500)",
        marginTop: 6,
        maxWidth: 56,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, m.name.split(" ")[0]))), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("button", {
      style: {
        width: 50,
        height: 50,
        borderRadius: "50%",
        border: "1.5px dashed var(--line-strong)",
        background: "transparent",
        color: "var(--ink-400)",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 22
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-sans)",
        fontSize: 11.5,
        color: "var(--ink-400)",
        marginTop: 6
      }
    }, "Invite")))), /*#__PURE__*/React.createElement(Field, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Pages per night"), /*#__PURE__*/React.createElement(SubLabel, null, "Everyone reads the same beat. No one falls behind.")), /*#__PURE__*/React.createElement(Stepper, {
      value: pages,
      min: 4,
      max: 14,
      suffix: "pages",
      onChange: setPages
    })), /*#__PURE__*/React.createElement(Field, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Players"), /*#__PURE__*/React.createElement(SubLabel, null, "One character each.")), /*#__PURE__*/React.createElement(Stepper, {
      value: players,
      min: 2,
      max: 4,
      suffix: "",
      onChange: setPlayers
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "How you'll read"), /*#__PURE__*/React.createElement(SegmentedControl, {
      options: ["Read", "Listen"],
      value: mode,
      onChange: setMode
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Lean the world toward\u2026"), /*#__PURE__*/React.createElement(SubLabel, null, "A starting tone \u2014 your tastes do the rest."), /*#__PURE__*/React.createElement(SegmentedControl, {
      options: [{
        value: "med",
        label: "Medieval"
      }, {
        value: "sci",
        label: "Sci-fi"
      }, {
        value: "cosy",
        label: "Cosy"
      }],
      value: tone,
      onChange: setTone
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        paddingTop: 4,
        paddingBottom: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      full: true,
      size: "lg",
      onClick: onNext
    }, "Next \u2014 build your character"))));
  }
  const TASTES = ["The Lord of the Rings", "Dune", "The Witcher", "Studio Ghibli", "Disco Elysium", "Le Guin", "Mistborn", "Hollow Knight", "Brooklyn 99", "Murakami"];
  function CharacterScreen({
    onBack,
    onDone
  }) {
    const [name, setName] = React.useState("");
    const [picked, setPicked] = React.useState(["The Lord of the Rings", "Disco Elysium", "Studio Ghibli"]);
    const [trait, setTrait] = React.useState("loyal");
    const toggle = t => setPicked(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
    return /*#__PURE__*/React.createElement(ScreenScroll, null, /*#__PURE__*/React.createElement(StepHead, {
      step: 2,
      total: 2,
      title: "Now \u2014 who are you, inside it?",
      sub: "Your favourites quietly shape your character and the world you wake in.",
      onBack: onBack
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "22px 18px 0",
        display: "flex",
        flexDirection: "column",
        gap: 22
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 14,
        alignItems: "center",
        background: "var(--paper)",
        borderRadius: "var(--radius-lg)",
        padding: 16,
        boxShadow: "var(--shadow-sm)"
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: "Y",
      seat: 2,
      size: 56,
      ring: true
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement(Input, {
      placeholder: "Name your character",
      value: name,
      onChange: e => setName(e.target.value)
    }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Your taste profile"), /*#__PURE__*/React.createElement(SubLabel, null, "Books, films, games \u2014 pick what's yours."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 9,
        flexWrap: "wrap"
      }
    }, TASTES.map(t => /*#__PURE__*/React.createElement(Tag, {
      key: t,
      selected: picked.includes(t),
      onClick: () => toggle(t)
    }, t)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "At your core, you are\u2026"), /*#__PURE__*/React.createElement(SegmentedControl, {
      options: [{
        value: "loyal",
        label: "Loyal"
      }, {
        value: "cunning",
        label: "Cunning"
      }, {
        value: "reckless",
        label: "Reckless"
      }],
      value: trait,
      onChange: setTrait
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        background: "var(--gradient-dusk)",
        borderRadius: "var(--radius-lg)",
        padding: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "rgba(40,32,22,0.6)",
        marginBottom: 6
      }
    }, "Talegate will weave"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-serif)",
        fontSize: 17,
        lineHeight: 1.5,
        color: "var(--ink-900)"
      }
    }, "A ", /*#__PURE__*/React.createElement("b", null, "loyal"), " wanderer with a mapmaker's eye and a soft spot for lost things \u2014 at home in slow, painted worlds.")), /*#__PURE__*/React.createElement("div", {
      style: {
        paddingBottom: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "accent",
      full: true,
      size: "lg",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "sparkles",
        size: 19,
        stroke: 2
      }),
      onClick: onDone
    }, "Weave the first chapter"))));
  }
  function Label({
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-sans)",
        fontWeight: 700,
        fontSize: 15,
        color: "var(--ink-900)",
        marginBottom: 10
      }
    }, children);
  }
  function SubLabel({
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        color: "var(--ink-400)",
        marginBottom: 12,
        marginTop: -6
      }
    }, children);
  }
  function Field({
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14
      }
    }, children);
  }
  window.SetupScreen = SetupScreen;
  window.CharacterScreen = CharacterScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/babel-app/setup.jsx", error: String((e && e.message) || e) }); }

// ui_kits/babel-app/shelf.jsx
try { (() => {
/* Shelf (catalog) + Detail sheet. Exposes window.ShelfScreen, window.DetailSheet */
(function () {
  const DS = window.BabelDesignSystem_2e9b76;
  const {
    StoryCover,
    Button,
    Badge,
    IconButton,
    Tag
  } = DS;
  const {
    Icon,
    BABEL,
    ScreenScroll
  } = window;
  function Carousel({
    label,
    items,
    onPick
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 22
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-sans)",
        fontWeight: 700,
        fontSize: 17,
        color: "var(--ink-900)",
        padding: "0 20px",
        marginBottom: 12,
        letterSpacing: "-0.01em"
      }
    }, label), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 14,
        overflowX: "auto",
        padding: "4px 20px 8px"
      }
    }, items.map((s, i) => /*#__PURE__*/React.createElement(StoryCover, {
      key: i,
      title: s.title,
      author: s.author,
      genre: s.genre,
      size: "md",
      onClick: () => onPick(s)
    }))));
  }
  function ShelfScreen({
    onPick
  }) {
    const all = BABEL.shelf;
    const featured = all[0];
    return /*#__PURE__*/React.createElement(ScreenScroll, null, /*#__PURE__*/React.createElement("div", {
      style: {
        background: "var(--gradient-dusk)",
        padding: "66px 20px 22px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "rgba(40,32,22,0.6)",
        marginBottom: 8
      }
    }, "The Talegate Library \xB7 10 tales"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-sans)",
        fontWeight: 700,
        fontSize: 34,
        lineHeight: 1.05,
        letterSpacing: "-0.025em",
        color: "var(--ink-900)",
        marginBottom: 18
      }
    }, "Pick a tale,", /*#__PURE__*/React.createElement("br", null), "the way you'd pick a book together."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 16,
        alignItems: "flex-end",
        background: "rgba(255,255,255,0.5)",
        borderRadius: "var(--radius-xl)",
        padding: 14,
        backdropFilter: "var(--blur-glass)",
        WebkitBackdropFilter: "var(--blur-glass)"
      }
    }, /*#__PURE__*/React.createElement(StoryCover, {
      title: featured.title,
      author: featured.author,
      genre: featured.genre,
      size: "md",
      onClick: () => onPick(featured)
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        paddingBottom: 4
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "lit"
    }, "Editor's pick"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-serif)",
        fontWeight: 600,
        fontSize: 20,
        lineHeight: 1.15,
        color: "var(--ink-900)",
        margin: "10px 0 6px"
      }
    }, featured.title), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font-serif)",
        fontSize: 13.5,
        lineHeight: 1.45,
        color: "var(--ink-600,#6b6457)",
        margin: "0 0 12px"
      }
    }, "A guild of four, one road, and a gate that opens only at a price."), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      onClick: () => onPick(featured)
    }, "Open")))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "8px 0 6px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 9,
        overflowX: "auto",
        padding: "12px 20px"
      }
    }, ["All", "Medieval", "Sci-fi", "Cosy", "Noir", "Horror", "Myth"].map((g, i) => /*#__PURE__*/React.createElement(Tag, {
      key: g,
      selected: i === 0,
      onClick: () => {}
    }, g))), /*#__PURE__*/React.createElement(Carousel, {
      label: "Handpicked this month",
      items: all.slice(0, 5),
      onPick: onPick
    }), /*#__PURE__*/React.createElement(Carousel, {
      label: "For long-distance guilds",
      items: all.slice(5),
      onPick: onPick
    })));
  }
  function DetailSheet({
    story,
    onClose,
    onStart
  }) {
    if (!story) return null;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        zIndex: 60,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end"
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: onClose,
      style: {
        position: "absolute",
        inset: 0,
        background: "rgba(20,16,10,0.42)",
        backdropFilter: "blur(2px)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        background: "var(--paper)",
        borderTopLeftRadius: "var(--radius-2xl)",
        borderTopRightRadius: "var(--radius-2xl)",
        padding: "14px 22px 26px",
        maxHeight: "88%",
        overflowY: "auto",
        boxShadow: "var(--shadow-xl)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 40,
        height: 5,
        borderRadius: 999,
        background: "var(--line-strong)",
        margin: "0 auto 18px"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 18,
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement(StoryCover, {
      title: story.title,
      author: story.author,
      genre: story.genre,
      size: "md"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral",
      style: {
        marginBottom: 8
      }
    }, story.genre), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-sans)",
        fontWeight: 700,
        fontSize: 24,
        lineHeight: 1.1,
        letterSpacing: "-0.02em",
        color: "var(--ink-900)"
      }
    }, story.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        color: "var(--ink-400)",
        marginTop: 4
      }
    }, "by ", story.author), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        marginTop: 14,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        color: "var(--ink-500)",
        display: "flex",
        alignItems: "center",
        gap: 5
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "calendar",
      size: 14
    }), " 30 nights"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        color: "var(--ink-500)",
        display: "flex",
        alignItems: "center",
        gap: 5
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "users",
      size: 14
    }), " 2\u20134 guild")))), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font-serif)",
        fontSize: 17,
        lineHeight: 1.6,
        color: "var(--ink-700)",
        margin: "0 0 18px"
      }
    }, "A guild of four wakes on the wrong side of a burning country. The only way home runs through the Ember Gate \u2014 and the Gate remembers every bargain. ", /*#__PURE__*/React.createElement("em", null, "Your tastes shape who you become inside it.")), /*#__PURE__*/React.createElement("div", {
      style: {
        background: "var(--indigo-50)",
        borderRadius: "var(--radius-md)",
        padding: "14px 16px",
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--indigo-600)",
        marginBottom: 6
      }
    }, "Adapts to your guild"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-sans)",
        fontSize: 13.5,
        lineHeight: 1.5,
        color: "var(--ink-700)"
      }
    }, "Characters, sub-plots, and tone bend toward each player's favourite books, films, and games.")), /*#__PURE__*/React.createElement(Button, {
      variant: "accent",
      full: true,
      size: "lg",
      onClick: onStart
    }, "Start a new tale with your guild")));
  }
  window.ShelfScreen = ShelfScreen;
  window.DetailSheet = DetailSheet;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/babel-app/shelf.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.AvatarStack = __ds_scope.AvatarStack;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.GuildDots = __ds_scope.GuildDots;

__ds_ns.ProgressTrack = __ds_scope.ProgressTrack;

__ds_ns.Choice = __ds_scope.Choice;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.Stepper = __ds_scope.Stepper;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Sheet = __ds_scope.Sheet;

__ds_ns.StoryCover = __ds_scope.StoryCover;

})();
