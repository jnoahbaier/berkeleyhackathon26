A soft pill segmented control for a small set of exclusive options — reading vs listening, tone presets, view toggles.

```jsx
<SegmentedControl options={["Read","Listen"]} value={mode} onChange={setMode} />
<SegmentedControl options={[{value:"med",label:"Medieval"},{value:"sci",label:"Sci-fi"}]} value={g} onChange={setG} />
```

Options are strings or `{value,label}`. Pass `onNight` on dark surfaces.
