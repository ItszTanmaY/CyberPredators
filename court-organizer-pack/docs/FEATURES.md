# Features: must-have and winning extras

Judges in a hackathon reward a working demo that clearly solves the stated problem, then trust, then polish. This list is ordered by value per hour.

## Must-have (the brief)

1. PDF upload and text reading
2. Case type label (fixed categories plus sub-type)
3. Parties, judges
4. Acts and sections cited
5. Final outcome in plain words
6. Short plain-English summary

## Winning extras

| Rank | Feature | Why judges like it | Effort |
| --- | --- | --- | --- |
| 1 | **Click-to-source highlighting.** Every item links to its page and the exact phrase. | Proves it is not hallucinating. Strongest trust signal. | 1 h |
| 2 | **Verification chips.** Green "verified in text", amber "check source". | Shows responsible AI, directly addresses the main risk. | 0.5 h |
| 3 | **Accuracy scoreboard.** Real numbers on 10 labelled judgments. | Most teams skip this; it separates you from them. | 1 h |
| 4 | **Keyword baseline comparison.** Same file, plain keyword search vs our tool. | Directly answers the brief's challenge that keyword search fails. | 0.75 h |
| 5 | **Old to new criminal code mapping** (IPC to BNS, CrPC to BNSS). | Shows real India-specific knowledge; very few teams will know it. | 0.5 h |
| 6 | **Batch library dashboard** with filters. | Speaks to clerks handling thousands of documents. | 1 h |
| 7 | **Hindi plain-language summary.** | Serves everyday citizens named in the brief. | 0.5 h |
| 8 | **Ask the Judgment.** Questions answered only from the document with page cites. | The "wow" moment in a live demo. | 1 h |
| 9 | **Timeline of key dates.** | Visual, easy to explain. | 0.75 h |
| 10 | **Export to JSON and PDF.** | Practical for clerks. | 0.5 h |

## If you have spare time

- Confidence score per field.
- Similar-case finder using embeddings across the library.
- Dark mode and mobile layout.
- Sample judgments gallery on the home page so judges can try without finding a PDF.

## Do not build

- User accounts, payments, a database, scraping, OCR for handwriting. They cost hours and add no points.

## How to present extras

Lead with the brief's three outputs. Then say: "Because legal AI must be trusted, every answer links to its source and is machine-verified." Then show comparison and accuracy. Mention Hindi and Q and A last as bonus.
