A story cover tile for the Shelf carousel. Renders a tasteful gradient-and-type placeholder keyed by `genre` (swap for commissioned art via `src`).

```jsx
<StoryCover title="The Ember Gate" author="A. Solace" genre="medieval" size="lg" />
<StoryCover title="Signal in the Deep" genre="scifi" selected onClick={pick} />
```

Genres: `medieval | scifi | noir | cosy | horror | myth`. `selected` shows a candle-amber ring. Sizes `sm | md | lg`.
