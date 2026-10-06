# AI ToolBox

A React directory of the tools in `data.MD`.

## Run

```bash
npm install
npm run dev
```

## Edit the catalog

1. Change an entry in `data.MD`.
2. Run `node sync.mjs`.
3. Reload the app.

`sync.mjs` writes `src/data/catalog.json` and the page metadata in `index.html`. The React app reads that catalog and does not add entries.
