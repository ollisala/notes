# Note Trainer

A small web app for practicing music notes: reading notes off a treble clef staff, and finding
notes on a guitar fretboard (open position, frets 0-5).

Built with Vite + React + TypeScript, no backend — `npm run build` produces static files in
`dist/` ready to deploy anywhere (e.g. an S3 bucket, optionally under a subpath since asset
paths are relative).

## Development

```
npm install
npm run dev
```

## Build

```
npm run build
```

Output goes to `dist/`.
