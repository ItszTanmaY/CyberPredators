# Paste this into Antigravity first

You are building a hackathon MVP called NyayaLens (Court Document Organizer) in 6 hours with a team of 5.

Read these files fully before writing code: `README.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/PROMPTS.md`, `docs/TASKS.md`, `docs/FEATURES.md`.

## What to build

A Next.js (App Router) and Tailwind web app. The user uploads an Indian court judgment PDF. The browser reads it with pdfjs-dist, picks key pages, and sends them to a serverless route `/api/analyze`. The route calls an LLM (provider behind `lib/llm.js`, key in `API_KEY`, model name in `MODEL_NAME`), returns the JSON record defined in `docs/PROMPTS.md`, and the UI shows case type, parties, statutes, outcome, summary. Every item links to its source page with the evidence phrase highlighted. Unverified items show an amber "check source" chip.

## How to work

1. Plan first: write a short plan listing the files you will create for tasks T1 to T6 in `docs/TASKS.md`. Wait for my approval.
2. Build T1 to T6 in order. After each task, run the app or a test and show me evidence that its acceptance check passes.
3. Keep functions small and in the folder layout from `docs/ARCHITECTURE.md`.
4. Do not store documents on a server. Never put the API key in client code or commit it.
5. Cache model results on disk by file hash.
6. If something in the docs is unclear or a package name does not exist, say so and propose a fix instead of guessing.
7. Do not add accounts, a database, or OCR.

## Quality bar

- The UI should look polished: clean layout, clear loading steps, friendly error messages, a visible disclaimer ("Automated summary for review support. Not legal advice.").
- The app must run with `npm install` then `npm run dev` after I add `.env.local` with `API_KEY` and `MODEL_NAME`.
- Provide `.env.example`.

## First output I want

1. A short plan.
2. The scaffold (T1).
3. A list of anything in the docs you could not confirm.

Do not start Phase B tasks until I say so.
