/**
 * Legal Extraction Prompts and Canonical JSON Schema
 * Adheres strictly to docs/PROMPTS.md
 */

export const JSON_SCHEMA = {
  file: "string",
  court: "string or null",
  case_number: "string or null",
  decision_date: "YYYY-MM-DD or null",
  case_type: {
    category: "Civil | Criminal | Constitutional/Writ | Family | Commercial | Service | Tax | Other",
    sub_type: "string, e.g. Bail application, Divorce petition, Criminal Appeal, Writ of mandamus",
    reasoning: "one sentence on why"
  },
  parties: {
    petitioner: ["string"],
    respondent: ["string"],
    judges: ["string"]
  },
  statutes: [
    {
      act: "Indian Penal Code, 1860",
      sections: ["420", "34"],
      page: 2,
      evidence: "short exact phrase from the text"
    }
  ],
  outcome: {
    result: "Allowed | Dismissed | Partly allowed | Disposed of | Remanded | Acquitted | Convicted | Bail granted | Bail rejected | Other",
    detail: "one plain sentence summarizing operative order",
    page: 14,
    evidence: "short exact phrase from the text"
  },
  key_dates: [
    {
      date: "YYYY-MM-DD",
      event: "string"
    }
  ],
  summary: "3 to 4 plain-English sentences for a non-lawyer",
  summary_hi: "same summary translated in simple Hindi (Devanagari)",
  directions: [
    {
      action: "exact court order direction, e.g. furnish personal bond of Rs 10 Lakhs with two sureties",
      who: "who must act, e.g. Appellant / Trial Court / Registry",
      deadline: "YYYY-MM-DD or null",
      page: 29,
      evidence: "exact phrase from text"
    }
  ],
  brief: {
    facts: "factual background of the dispute in 2-3 sentences",
    issues: ["legal question 1 being decided by the court"],
    arguments: "key arguments submitted by petitioner and respondent",
    reasoning: "ratio decidendi and core judicial reasoning applied",
    decision: "final ruling and operative order of the court"
  },
  legal_terms: [
    {
      term: "Latin or legal term appearing in text, e.g. coram, suo motu, quashing, mandamus",
      meaning: "plain English, under 15 words"
    }
  ],
  precedents: [
    {
      name: "Case name cited in judgment, e.g. Satender Kumar Antil v. CBI",
      citation: "official citation, e.g. (2022) 10 SCC 51",
      treatment: "followed | distinguished | overruled | mentioned",
      page: 6,
      evidence: "exact phrase from text"
    }
  ],
  meta: {}
};

export function buildAnalysisPrompt(pages) {
  const formattedPagesText = pages
    .map(p => `[PAGE ${p.page}]\n${p.text}`)
    .join('\n\n--- PAGE BREAK ---\n\n');

  return `You are an expert on Indian courts and law. You will receive excerpts of one Indian court judgment.
Each excerpt starts with a tag like [PAGE 7].

Return ONLY valid JSON matching the schema below. No markdown formatting, no explanatory preamble, no trailing comments.

Rules:
1. case_type.category must be exactly one of: Civil, Criminal, Constitutional/Writ, Family, Commercial, Service, Tax, Other.
   Clues: FIR, bail, accused, IPC/BNS, CrPC/BNSS, NDPS => Criminal. Suit, decree, plaintiff, CPC, Specific Relief Act => Civil.
   Articles 226 or 32 => Constitutional/Writ. Hindu Marriage Act, maintenance, custody => Family.
2. parties: copy names exactly as written in the cause title near the top. Petitioner includes appellant, plaintiff, applicant. Respondent includes defendant, opposite party. Exclude advocates, counsel, and public prosecutors.
3. statutes: list each Act with the section numbers cited. Use the full official name when you can (e.g. "Indian Penal Code, 1860", "Code of Criminal Procedure, 1973", "Negotiable Instruments Act, 1881"). Include the page number and a short exact phrase as evidence.
4. outcome: the court's final operative order, usually in the last 1-3 pages. Map to one result value:
   Allowed | Dismissed | Partly allowed | Disposed of | Remanded | Acquitted | Convicted | Bail granted | Bail rejected | Other.
   Warning: "allowed" means the appeal or petition succeeded; "dismissed" means it failed. In criminal appeals, "appeal allowed" usually means the conviction was set aside or quashed.
5. directions: list each specific command/instruction issued by the court (who must act, action, deadline in YYYY-MM-DD or null, page number, and exact evidence phrase). Use [] if none.
6. brief: structured 5-part case brief (facts, issues, arguments, reasoning, decision) synthesized from text.
7. legal_terms: find Latin or technical legal words actually present in the text (e.g. coram, suo motu, mandamus, quashing, ratio decidendi, caveat, prima facie, lis pendens). Provide plain English meaning under 15 words.
8. precedents: list prior judgments cited with case name, citation, treatment (followed, distinguished, overruled, or mentioned), page, and exact evidence phrase.
9. Use only facts in the text. If something is not present, use null or an empty list. Never invent or hallucinate citations.
10. summary: 3 to 4 sentences in plain, direct English without legalese for everyday citizens.
11. summary_hi: Translate the summary into clear, everyday Hindi (Devanagari script) keeping legal names and section numbers intact.

SCHEMA:
${JSON.stringify(JSON_SCHEMA, null, 2)}

TEXT:
${formattedPagesText}`;
}

export function buildAskPrompt(question, pages) {
  const formattedPagesText = pages
    .map(p => `[PAGE ${p.page}]\n${p.text}`)
    .join('\n\n--- PAGE BREAK ---\n\n');

  return `You answer questions about an Indian court judgment using ONLY the excerpts below.
Each excerpt is tagged [PAGE n]. Cite page numbers like (p. 7).
If the excerpts do not contain the answer, say "The provided pages do not say."

QUESTION: ${question}

TEXT:
${formattedPagesText}`;
}
