The core in-story decision option — serif voice, designed for the dark night reader. Selectable, with an optional "betrayal" flavour for destructive choices.

```jsx
<Choice letter="A" onClick={pick} meta="2 of 4 chose this">Open the gate and trust her.</Choice>
<Choice letter="B" flavor="betrayal" selected meta="Sealed">Cut the rope. Let the river take him.</Choice>
```

Always render on a night surface. `flavor="betrayal"` switches the accent to danger-red.
