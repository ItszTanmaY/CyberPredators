# Court Document Organizer (working title: NyayaLens)

Upload a raw Indian court judgment (PDF). Get back, in seconds: the case type, the parties, the laws cited, the final outcome and a plain-English summary, with every item linked to the page it came from.

Hackathon track: Legal, "Streamlining Court Document Review and Organization". Time box: 6 hours. Team: 5.

## What is in this pack

| File | Who reads it | Purpose |
| --- | --- | --- |
| `docs/PRD.md` | Everyone | What we are building, for whom, and what "done" means |
| `docs/ARCHITECTURE.md` | Devs | Stack, data flow, folder layout, API contract |
| `docs/TASKS.md` | Everyone | Ordered build tasks with owners and acceptance checks |
| `docs/PROMPTS.md` | AI owner | The extraction prompts and JSON schema |
| `docs/FEATURES.md` | Everyone | Must-have vs winning extras, in build order |
| `docs/EVALUATION.md` | Eval owner | How we prove accuracy to the judges |
| `docs/DEMO_SCRIPT.md` | Presenter | 3-minute demo and Q and A answers |
| `docs/RESEARCH.md` | Research owner | What to read, what data to get, legal cheat sheet |
| `ANTIGRAVITY_START_PROMPT.md` | Whoever drives Antigravity | Paste this first to get the agent building |

## How to use with Antigravity

1. Create an empty project folder, copy this whole pack into it, open it in Antigravity.
2. Open `ANTIGRAVITY_START_PROMPT.md`, paste its contents into the agent chat.
3. Let the agent build tasks T1 to T6 from `docs/TASKS.md`, then review its work against each task's acceptance check.
4. Split the remaining tasks across the team (owners are listed in `docs/TASKS.md`).

## Ground rules

- One JSON contract (`docs/PROMPTS.md`). Freeze it by hour 1.
- Cache every model result to disk so the demo never depends on wifi.
- Never commit the API key. Use `.env.local`.
- Public judgments only. No confidential case data.
- Names of packages, models and websites in this pack were written from memory. Confirm each works in the first 30 minutes.
