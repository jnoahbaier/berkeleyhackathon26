A circular, glassy icon-only control — Talegate's signature key-cap button from the brand (the ?, profile, scan controls in the inspiration). Always pass `label` for accessibility.

```jsx
<IconButton label="Help" variant="glass"><HelpCircle size={20} /></IconButton>
<IconButton label="Profile" variant="glass" onNight><User size={20} /></IconButton>
<IconButton label="Read" variant="solid" size="lg"><Search size={22} /></IconButton>
```

Variants: `glass` (translucent + blur, the default over gradients), `solid` (ink), `brand` (indigo), `plain` (paper outline). Sizes `sm | md | lg`. Pass `onNight` on dark surfaces.
