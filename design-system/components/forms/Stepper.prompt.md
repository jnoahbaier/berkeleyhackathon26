A large numeric stepper for the guild's setup hyperparameters — player count (2–4) and pages-per-night cadence.

```jsx
<Stepper value={players} min={2} max={4} suffix="players" onChange={setPlayers} />
<Stepper value={pages} min={4} max={12} suffix="pages" onChange={setPages} />
```

Clamps to `min`/`max`; round circular ± buttons.
