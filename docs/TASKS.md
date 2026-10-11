# Build tasks

Order matters. Each task has an owner, a clear output and an acceptance check. Agents: do not start a task until the previous one passes.

Owners: P1 Data and research, P2 Ingestion, P3 AI, P4 Frontend, P5 Eval and demo.

## Phase A: Core (hours 0 to 3)

| ID | Task | Owner | Output | Acceptance check |
| --- | --- | --- | --- | --- |
| T0 | Gather 15 public judgments (mix of Criminal, Civil, Writ, Family, Service, Tax); label 10 in `eval/gold.json` | P1 | `samples/*.pdf`, `eval/gold.json` | 10 labelled files exist and use the JSON contract |
| T1 | Scaffold Next.js app with Tailwind, env var `API_KEY`, `MODEL_NAME` | P4 | Running app at localhost | Home page loads |
| T2 | `lib/pdf.js`: `readPages(file)` and `selectPages(pages)` | P2 | Page array with numbers; key-page picker | On a 60-page PDF returns at most 12 pages including first 3 and last 4 |
| T3 | `lib/llm.js` and `app/api/analyze/route.js` using prompt in PROMPTS.md | P3 | Endpoint returning the JSON record | A sample PDF returns valid JSON with all required fields |
| T4 | Upload UI and result cards (case type badge, parties, statutes, outcome, summary) | P4 | Working end-to-end screen | Upload a PDF, see all cards filled |
| T5 | `lib/verify.js` evidence check and amber "check source" chips | P3 | `verified` flag per item | A deliberately wrong statute is flagged |
| T6 | `lib/statutes.js` alias table and IPC/BNS mapping | P2 | Normalizer | "I.P.C.", "IPC", "Indian Penal Code" all become one entry; IPC 420 maps to BNS 318 shown as a note |

Milestone M1 (hour 3): upload to result works for 3 different sample PDFs.

## Phase B: Winning features (hours 3 to 5)

| ID | Task | Owner | Output | Acceptance check |
| --- | --- | --- | --- | --- |
| T7 | Source viewer: click any item to show the page text with the evidence phrase highlighted | P4 | `SourceViewer` | Clicking the outcome opens the right page |
| T8 | Result cache by file hash plus `cache/` pre-run for demo files | P2 | Instant repeat uploads | Second upload returns in under 1 second |
| T9 | Library page: batch upload, table of cases with filters by case type | P4 | `app/library/page.js` | 5 files upload at once and appear as rows |
| T10 | Keyword baseline and side-by-side compare view | P5 | `lib/baseline.js`, `CompareView` | Shows at least 2 files where baseline fails and ours succeeds |
| T11 | Hindi summary toggle | P3 | `summary_hi` | Toggle switches language |
| T12 | Ask the Judgment box with page citations | P3 and P4 | `/api/ask` plus UI | Answer cites a page; unanswerable question returns "pages do not say" |
| T13 | Evaluation runner and accuracy table | P5 | `eval/run-eval.mjs`, `docs/EVALUATION.md` filled | Prints per-field accuracy over 10 files |

## Phase C: Polish (hours 5 to 6)

| ID | Task | Owner | Output | Acceptance check |
| --- | --- | --- | --- | --- |
| T14 | Export result as JSON and print-friendly PDF | P4 | Download buttons | File opens and matches screen |
| T15 | UI polish: loading steps ("Reading pages", "Finding parties", "Checking sources"), error states, disclaimer | P4 | Final UI | No raw errors visible |
| T16 | Deploy to Vercel, test on second device | P2 | Public URL | Works on another laptop |
| T17 | Slides, demo rehearsal x3, backup screen recording | P5 and P1 | 6 slides, video | Demo runs under 3 minutes |

## Cut order if behind

T14, T12, T11, T9 (keep a single-file view), T10. Never cut T5, T7 or T13.

## Definition of done

- All R1 to R7 in the PRD pass.
- Accuracy table filled with real numbers.
- Demo works offline from cache.
