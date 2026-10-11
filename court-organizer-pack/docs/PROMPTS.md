# Prompts and JSON contract

Freeze this by hour 1. Everyone codes against it.

## JSON record

```json
{
  "file": "string",
  "court": "string or null",
  "case_number": "string or null",
  "decision_date": "YYYY-MM-DD or null",
  "case_type": {
    "category": "Civil | Criminal | Constitutional/Writ | Family | Commercial | Service | Tax | Other",
    "sub_type": "string, e.g. Bail application, Divorce petition, Writ of mandamus",
    "reasoning": "one sentence on why"
  },
  "parties": {
    "petitioner": ["string"],
    "respondent": ["string"],
    "judges": ["string"]
  },
  "statutes": [
    { "act": "Indian Penal Code, 1860", "sections": ["420", "34"], "page": 2, "evidence": "short exact phrase from the text" }
  ],
  "outcome": {
    "result": "Allowed | Dismissed | Partly allowed | Disposed of | Remanded | Acquitted | Convicted | Bail granted | Bail rejected | Other",
    "detail": "one plain sentence",
    "page": 14,
    "evidence": "short exact phrase from the text"
  },
  "key_dates": [ { "date": "YYYY-MM-DD", "event": "string" } ],
  "summary": "3 to 4 plain-English sentences",
  "summary_hi": "same summary in simple Hindi (extra feature)",
  "meta": {}
}
```

Rules:
- Unknown means `null` or `[]`. Never guess.
- `evidence` must be copied exactly from the text so we can verify it.
- Category comes from the fixed list only.

## Main extraction prompt

```text
You are an expert on Indian courts and law. You will receive excerpts of one court judgment.
Each excerpt starts with a tag like [PAGE 7].

Return ONLY valid JSON matching the schema below. No markdown, no commentary.

Rules:
1. case_type.category must be exactly one of: Civil, Criminal, Constitutional/Writ, Family, Commercial, Service, Tax, Other.
   Clues: FIR, bail, accused, IPC/BNS, CrPC/BNSS, NDPS => Criminal. Suit, decree, plaintiff, CPC, Specific Relief Act => Civil.
   Articles 226 or 32 => Constitutional/Writ. Hindu Marriage Act, maintenance, custody => Family.
2. parties: copy names exactly as written in the cause title near the top. Petitioner includes appellant, plaintiff, applicant. Respondent includes defendant, opposite party.
3. statutes: list each Act with the section numbers cited. Use the full official name when you can. Include the page tag and a short exact phrase as evidence.
4. outcome: the court's final operative order, usually in the last pages. Map to one result value.
   Warning: "allowed" means the appeal or petition succeeded; "dismissed" means it failed. In criminal appeals, "appeal allowed" usually means the conviction was set aside.
5. Use only facts in the text. If something is not present, use null or an empty list.
6. summary: 3 to 4 sentences, plain English, no legal jargon, for a non-lawyer.

SCHEMA: {schema}

TEXT:
{pages_text}
```

## Hindi summary prompt (extra)

```text
Translate this summary into simple, clear Hindi (Devanagari) that a non-lawyer can follow. Keep names, Act names and section numbers in their original form. Return only the Hindi text.

{summary}
```

## Ask the Judgment prompt (extra)

```text
You answer questions about one court judgment using ONLY the excerpts below.
Each excerpt is tagged [PAGE n]. Cite pages like (p. 7).
If the excerpts do not contain the answer, say "The provided pages do not say."

QUESTION: {question}

TEXT:
{pages_text}
```

## Retry prompt (used if JSON fails to parse)

```text
Your previous reply was not valid JSON. Return the same answer again as valid JSON only, matching the schema, with no extra text.
```

## Tuning checklist for the AI owner

- Test on all gold files after every prompt change and record the score.
- If outcomes are wrong, add two short worked examples to rule 4.
- If parties include lawyers, add "exclude advocates and counsel".
- If the model returns a category outside the list, reject and retry once.
