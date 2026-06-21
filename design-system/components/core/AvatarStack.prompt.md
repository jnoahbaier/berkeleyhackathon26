An overlapping row of guild avatars with a "+N" overflow bubble — use to show who's in a guild.

```jsx
<AvatarStack members={[{name:"Mara",seat:1},{name:"Theo",seat:2},{name:"Iris",seat:3}]} size={40} />
```

Each member is `{ name, seat?, src? }`. `max` caps how many render before the overflow bubble.
