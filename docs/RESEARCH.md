# Research guide

Sites and package names here are from memory and unverified. Each owner confirms theirs in the first 30 minutes and tells the team if something is wrong.

## Per-person research tasks

| Person | Question | Look at | Share |
| --- | --- | --- | --- |
| P1 Data | Where do we get 15 real judgments and what do answers look like? | Indian Kanoon, Supreme Court website, eCourts judgments portal, High Court sites | PDFs plus labelled sheet |
| P2 Ingestion | What breaks PDF text extraction in judgments? | pdfjs-dist docs; test 5 files | Notes on headers, footers, two-column pages |
| P3 AI | What exists already for Indian legal NLP? Which prompt wording gives the best outcomes? | OpenNyAI project, InLegalBERT, ILDC dataset paper | One-page note on what to borrow |
| P4 Frontend | How do we show highlighted source pages well? | Next.js docs, Tailwind, a PDF or text viewer component | Clickable prototype with dummy JSON |
| P5 Eval | How do judges score, and how do we measure accuracy fairly? | Hackathon rubric | Scorecard and eval script plan |

## Search terms

- Indian legal NER, OpenNyAI, InLegalBERT, ILDC
- Rhetorical roles Indian judgments
- Indian court judgment case type classification
- BNS BNSS BSA section mapping table (for the IPC to BNS normalizer)

## Everyone: 15-minute legal primer

**Courts:** Supreme Court, High Courts, District and Sessions courts, tribunals.

**A judgment usually has:** cause title (court, parties, case number), facts, arguments of each side, the court's reasoning, and the final order (last 1 to 3 pages).

**Case type clues**

| Type | Clues |
| --- | --- |
| Criminal | FIR, accused, bail, conviction, IPC/BNS, CrPC/BNSS, NDPS, charge sheet |
| Civil | suit, plaintiff, defendant, decree, CPC, injunction, Specific Relief Act, Contract Act |
| Constitutional / Writ | Articles 32 or 226, writ, mandamus, certiorari, fundamental rights |
| Family | divorce, maintenance, custody, Hindu Marriage Act, Domestic Violence Act |
| Service | promotion, seniority, termination, service rules, tribunal |
| Tax | assessment, Income Tax Act, GST, tribunal |
| Commercial | arbitration, company, insolvency, IBC |

**Criminal codes changed:** from July 2024 the IPC, CrPC and Evidence Act were replaced by the Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS) and Bharatiya Sakshya Adhiniyam (BSA). Older judgments cite old codes. P2 builds a mapping table for the commonly cited sections and must verify it against an official source before the demo.

## Legal word list

| Term | Plain meaning |
| --- | --- |
| Petitioner / appellant | Side asking the court to act or challenging a decision |
| Respondent | Side defending |
| Prayer / relief | What the petitioner asks for |
| Impugned order | The earlier order being challenged |
| Stay | Pause on an action until decided |
| Suo motu | Court acting on its own |
| Prima facie | At first look |
| Allowed | Petition or appeal succeeded |
| Dismissed | Petition or appeal failed |
| Disposed of | Closed with stated directions |
| Remanded | Sent back to the lower court |
| Ex parte | Decided with one side absent |
| Acquitted / convicted | Found not guilty / guilty |
| Quashed / set aside | Cancelled |

## Data rules

Use only public judgments. Do not use sealed, juvenile, or sensitive family cases as demo files.
