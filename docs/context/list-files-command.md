# List All Files with a Single Command

To efficiently list all files in the repository while ignoring `node_modules` and `.git`, the AI assistant should use this one-liner:

```bash
find . -type f \
  -not -path "./node_modules/*" \
  -not -path "./.git/*"
```

Why this helps:

- It lists only files (`-type f`).
- Excludes the `node_modules` directory (`-not -path "./node_modules/*"`).
- Excludes the `.git` directory (`-not -path "./.git/*"`).

By using this command, the assistant avoids multiple directory listing tool calls and simplifies file discovery.
