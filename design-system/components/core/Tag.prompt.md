A selectable pill chip for taste and genre selection during onboarding — favourite books, genres, hobbies.

```jsx
<Tag selected onClick={toggle}>Fantasy</Tag>
<Tag onClick={toggle} icon={<BookOpen size={15} />}>Sci-fi</Tag>
```

Filled ink when `selected`. Static (no hover/cursor) when `onClick` is omitted.
