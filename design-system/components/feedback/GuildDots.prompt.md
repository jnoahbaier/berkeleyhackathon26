The guild alignment indicator — one seat-coloured dot per member showing who's caught up / has chosen tonight (filled = done, hollow = still reading). This is how Talegate keeps everyone on the same page.

```jsx
<GuildDots members={[
  {name:"Mara",seat:1,done:true},
  {name:"Theo",seat:2,done:true},
  {name:"Iris",seat:3,done:false},
]} />
```

Auto-captions "N of M ready" unless you pass `label`. Pass `onNight` on the reader.
