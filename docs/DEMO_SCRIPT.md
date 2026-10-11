# Demo script (3 minutes) and Q and A

## Before you go on

- Cached results for 5 demo files are in `cache/`; the app loads them if the API fails.
- Open the app on the deployed URL and a local copy as backup.
- Have a screen recording ready.
- Pick one tricky file where keyword search fails.

## Script

| Time | Say and do |
| --- | --- |
| 0:00 | "A single Indian judgment can run 60 pages of dense legal English. Clerks, junior lawyers and citizens spend hours just to learn what kind of case it is and how it ended." |
| 0:20 | Drag a judgment (ask a judge to pick one if possible) into the upload box. Loading steps appear. |
| 0:35 | Result appears. "Case type: Criminal, bail application. Parties. Acts and sections. Outcome: Dismissed." |
| 1:00 | Click the outcome. The source page opens with the exact phrase highlighted. "Every answer links to its source, and we machine-verify it. Amber means check the source." |
| 1:20 | Click an IPC section. "Older judgments cite the IPC; the new code is BNS. We show both." |
| 1:35 | Open the compare view. "A keyword tool reads 'appeal allowed' in the wrong place and calls it a loss. Ours understands the context." |
| 1:55 | Open the library. "Here are 10 cases in one view, filter by type." |
| 2:15 | Toggle Hindi summary. "For citizens who do not read legal English." |
| 2:30 | Type a question in Ask the Judgment: "Who won?" Answer with page cite. |
| 2:45 | Show the accuracy table. "On 10 labelled judgments we got X% on case type and Y% on outcome versus Z% for keywords." |
| 3:00 | "Next: scanned documents, regional languages, and court system integration." |

## Slides (6)

1. Problem and who it hurts
2. Our solution in one screenshot
3. How it works (pipeline picture)
4. Why it is trustworthy (verification and sources)
5. Results (accuracy table, baseline comparison)
6. Limits, next steps, team

## Likely judge questions

| Question | Answer |
| --- | --- |
| How do you stop hallucinations? | Every value must carry an exact evidence phrase and page; we check that phrase exists in the text and flag anything unverified. |
| Why not just keyword search? | The brief's own point. We show the comparison on real files. |
| What about long judgments? | We send header, final order and keyword-hit pages, which hold the parties, laws and outcome. |
| What about scanned PDFs? | Out of scope today; OCR is the next step. |
| Is data private? | Nothing is stored on our server; documents go to the AI provider for processing only. For production we would use an on-premise or contracted model. |
| How accurate is it? | Show the table and be honest that the sample is small. |
| What is the AI model? | State the one you used; say the provider is swappable behind one wrapper. |
| Could this replace lawyers? | No. It speeds up review; a human verifies via the source links. |
