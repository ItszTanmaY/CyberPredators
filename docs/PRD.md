# Product Requirements Document

## 1. Problem

Indian courts produce thousands of pages of judgments, orders and filings daily. They are long and written in dense legal English with Latin terms and nested sentences. Clerks, junior lawyers and citizens spend hours reading just to learn the basics: what kind of case it is, who is involved, which laws are in play, and how it ended. Keyword search fails because the same idea is phrased many ways ("appeal allowed", "set aside", "conviction quashed").

## 2. Goal

A web tool that "reads" an uploaded judgment and, with no human reading it first, labels the case and highlights the key facts, each tied to its source page.

## 3. Users

| User | Need | What they get |
| --- | --- | --- |
| Court clerk | Sort incoming documents by type fast | Case type badge, batch dashboard, export |
| Junior lawyer | Understand a precedent in minutes | Parties, acts and sections, outcome, source links |
| Citizen | Know what happened in plain words | Simple summary, optional Hindi |

## 4. Core requirements (the brief)

| ID | Requirement | Acceptance |
| --- | --- | --- |
| R1 | Accept a multi-page PDF upload | A 60-page text PDF uploads and processes without error |
| R2 | Label the case type | Category from a fixed list plus a sub-type, correct on at least 80% of the test set |
| R3 | Identify parties | Petitioner or appellant, respondent, judges, shown as cards |
| R4 | Identify laws cited | Each Act with section numbers, normalized (IPC and BNS handled), at least 80% recall on test set |
| R5 | State the final outcome | Result word (allowed, dismissed, etc.) plus one-line detail, correct on at least 85% |
| R6 | Cope with legal English | Beats a plain keyword baseline on the test set (see EVALUATION) |
| R7 | Results in under 20 seconds | Measured on a 60-page file |

## 5. Winning extras (build after the core works)

See `FEATURES.md`. In priority order: source-page highlighting, verification flags, batch dashboard, keyword-baseline comparison, Hindi summary, Ask the Judgment Q and A, timeline, export.

## 6. Out of scope for the 6 hours

Scanned or handwritten documents (OCR), user accounts, a database, live scraping of court sites, legal advice.

## 7. Success metrics

- Field accuracy on 10 labelled judgments: case type, outcome, parties, statutes.
- Median time to result.
- Judge-chosen file works live.
- Every extracted item opens the right source page.

## 8. Risks

| Risk | Mitigation |
| --- | --- |
| Model invents values | Verify each value appears in the source text, flag unverified ones |
| Long files exceed limits | Send header pages, final pages and keyword-hit pages only |
| API or wifi fails in demo | Disk cache of results for the demo files |
| Old vs new criminal codes | Normalizer maps IPC, CrPC, Evidence Act to BNS, BNSS, BSA and back |
| "Allowed" misread | Prompt defines outcome words; eval checks them |

## 9. Disclaimer shown in the UI

"Automated summary for review support. Not legal advice. Verify against the original judgment."
