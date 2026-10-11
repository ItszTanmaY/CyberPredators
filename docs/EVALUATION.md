# Evaluation plan

Goal: show the judges real accuracy numbers and prove we beat plain keyword search.

## Gold set

10 public judgments, hand-labelled by P1 and P5 in `eval/gold.json`:

```json
[
  {
    "file": "samples/case01.pdf",
    "case_type": "Criminal",
    "petitioner": ["..."],
    "respondent": ["..."],
    "statutes": [{ "act": "Indian Penal Code, 1860", "sections": ["420"] }],
    "outcome": "Dismissed"
  }
]
```

Pick a spread: at least 3 Criminal, 2 Civil, 2 Writ, 1 Family, 1 Service or Tax, and 2 where the outcome wording is tricky (partly allowed, remanded).

## Metrics

| Field | How to score |
| --- | --- |
| Case type | Exact match on category |
| Outcome | Exact match on result value |
| Parties | A party counts as correct if its normalized name matches or overlaps at least 60% of words |
| Statutes | Recall (gold acts found) and precision (found acts that are in gold) |
| Verification rate | Share of extracted items marked verified |
| Latency | Median and worst seconds |

## Baseline

`lib/baseline.js`: classify by counting keywords (criminal words like FIR, accused, bail; civil words like suit, decree, plaintiff), take the last sentence containing "allowed" or "dismissed" for the outcome, regex for "Section N of the X Act" for statutes. Run it on the same files.

## Results table (fill in)

| Field | Keyword baseline | Our tool |
| --- | --- | --- |
| Case type accuracy | % | % |
| Outcome accuracy | % | % |
| Party match | % | % |
| Statute recall | % | % |
| Statute precision | % | % |
| Median time | s | s |

## Error log

After each run, list every miss with the cause (wrong page picked, prompt ambiguity, old code naming, model error). Feed this to the AI owner. Re-run after each prompt change and keep the best version.

## Honest limits (put on a slide)

- Tested on 10 files, a small sample.
- Text PDFs only; scans not supported yet.
- Summaries support review; they are not legal advice.
- Very long judgments use selected pages, not every page.
