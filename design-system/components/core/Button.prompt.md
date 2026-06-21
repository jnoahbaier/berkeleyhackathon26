Talegate's primary action button — pill-shaped with a soft 0.97 press and calm bedtime easing; use for any tap target with a text label.

```jsx
<Button variant="primary" size="lg" onClick={start}>Begin tonight's chapter</Button>
<Button variant="accent" iconLeft={<Moon />}>Light the chapter</Button>
<Button variant="secondary" onNight>Maybe later</Button>
<Button variant="ghost">Skip</Button>
```

Variants: `primary` (Talegate indigo), `accent` (candle amber — the "lit" CTA), `secondary` (paper/outline, pass `onNight` on dark reader surfaces), `ghost` (text-only). Sizes `sm | md | lg`. `full` stretches to container width. Pass `iconLeft` / `iconRight` Lucide nodes.
