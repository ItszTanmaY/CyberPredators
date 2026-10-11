# Architecture

## Principle

No heavy backend. Next.js (frontend plus one serverless API route) on Vercel. The LLM does the understanding. The browser reads the PDF so we keep real page numbers and avoid upload size limits.

## Data flow

```
Browser
  1. pdf.js reads the PDF -> pages [{page, text}]
  2. selectPages(): header (first 3), final order (last 4), plus pages whose text hits statute or outcome keywords
  3. POST /api/analyze {pages, fileName}
Server route
  4. Build prompt from PROMPTS.md, call LLM, require JSON
  5. Verify: every statute, party and outcome phrase must appear in the page text; else mark verified:false
  6. Normalize: statute names via lib/statutes.js (IPC <-> BNS mapping)
  7. Return the JSON record
Browser
  8. Render result cards; clicking an item opens the source page text with the evidence highlighted
  9. Save record to localStorage (case library) and to a downloadable JSON
```

## Stack

| Layer | Choice | Note |
| --- | --- | --- |
| Framework | Next.js (App Router) | One repo, deploys to Vercel |
| Styling | Tailwind CSS | Fast clean UI |
| PDF reading | pdfjs-dist | In the browser |
| LLM | Gemini API by default (Antigravity users usually have access) | Keep the provider behind `lib/llm.js` so Claude or others can be swapped. Model name comes from `MODEL_NAME` env var; confirm the current name in the provider docs |
| Storage | localStorage and JSON cache folder | No database |
| Hosting | Vercel | `API_KEY` in project env vars |

## Folder layout

```
court-organizer/
  app/
    page.js                  upload + results
    library/page.js          batch dashboard of analysed cases
    api/analyze/route.js     extraction endpoint
    api/ask/route.js         Ask the Judgment endpoint (extra)
  components/
    UploadBox.js  CaseTypeBadge.js  PartyCards.js  StatuteList.js
    OutcomeBox.js  SourceViewer.js  VerificationChip.js  CompareView.js
  lib/
    pdf.js                   readPages(), selectPages()
    llm.js                   callLLM(prompt) wrapper, retry once on bad JSON
    verify.js                evidence check against page text
    statutes.js              alias table + IPC/BNS mapping
    baseline.js              plain keyword classifier for the comparison view
  eval/
    gold.json                hand-labelled answers
    run-eval.mjs             runs all PDFs, prints accuracy table
  samples/                   demo PDFs
  cache/                     saved model outputs for the demo
  docs/
```

## API contract

`POST /api/analyze`

Request:
```json
{ "fileName": "x.pdf", "totalPages": 62, "pages": [ { "page": 1, "text": "..." } ] }
```

Response: the record in `PROMPTS.md`, with an added `meta` block:
```json
{ "meta": { "latencyMs": 8400, "pagesSent": [1,2,3,59,60,61,62], "model": "..." } }
```

Errors return `{ "error": "message" }` with a 4xx or 5xx status. The UI shows a friendly message and a retry button.

## Verification logic (the trust feature)

For each extracted item, search the sent pages for its text (case-insensitive, whitespace collapsed, fuzzy match allowed). Found: `verified: true` and store `page`. Not found: `verified: false`, shown with an amber chip "check source".

## Performance notes

- Send at most about 12 pages of text.
- Run the model call with a 45 second timeout.
- Cache by hash of file bytes so re-uploads are instant.

## Security

Key only on the server. No document is stored on the server. Show a notice that the file is sent to an AI provider for analysis.
