# Personal site v2: three contenders (after two review rounds)

The brief and content inventory are in `2026-11-16-v2-concepts.md`.

## Round 1 scores

Four reviewers each scored one lens of the original concepts, out of 10:

| Concept | Creativity | Delivery | Impressiveness | Practicality |
|---|---|---|---|---|
| A, Little Lincoln | 4 | 5 | 4 | 5 |
| B, Ask the Crew | 7 | 4 | 6 | 3 |
| C, Field Guide | 6 | 7 | 7 | 7 |

- **A was replaced.** Its character lives on as the builder in Contender 3.
- **B and C were reshaped.** One more reviewer then checked all three together, and its fixes are applied below.

## Rules every contender follows

1. **The first phone screen says everything without any interaction.**
   - name and role
   - a full-size logo row: Opinion System, Core Manufacturing, Cover Me, Open Room
   - three facts with numbers: 200+ paying users, concept to production in 6 months, a 25k-client portal
   - contact links
2. **Every visual makes a claim in its caption,** in one plain sentence with a number. If it can't, cut it.
3. **At most one animated thing per screen, in its own frame.**
   - It starts when you act or scroll to it, and it's static under reduced motion.
   - Detail expands inline.
   - No global modes, no pan/zoom canvases, nothing moving next to text being read.
4. **Light, warm palette.** Paper or cream background, ink text, real brand logos.
5. **Demos show his real engineering.** Real Moonshine, real eval output, real traces, real agent runs. Anything that isn't real is labelled as an illustration.
6. **Every contender has an lstack page,** a spoof of pstack. Each of his skills (tackle, tackle-board, writing-tickets, review-loop, gauntlet-loop, …) gets what it does in plain words and when he reaches for it, and the page shows how they chain.
7. **Shared baseline work (about 12 agent-hours):**
   - content and logos
   - the lstack page
   - the Open Room demo video, compressed to 720p with a poster frame and `preload="none"`
   - testimonials, contact, GitHub data
   - removing three.js

## Factual guardrails

- **Moonshine numbers:** captioned "measured on his machine, on his test clips."
- **Long-context degradation:** shown as an illustration.
- **The autumn commit spike:** its cause gets confirmed by Lincoln before it's published.

---

## Contender 1: "Field Guide" (learn it by touching it)

**Pitch:** a calm, illustrated, light editorial site. Every hard idea comes with a small hands-on demo of his *actual* engineering, so a recruiter feels the concept and an engineer sees the evidence.

**First screen:** a three-line TL;DR card for recruiters, then the logo row. Each chapter is one plain sentence plus an inline "How it works" expander for engineers.

**Chapters**, one per screen:

1. **"Talk to it" (Open Room + Moonshine).**
   - **Default:** a recorded side-by-side plays muted. On the left, words appear and settle while the speaker talks (Open Room today). On the right, nothing appears until the speaker stops (the old pipeline).
   - **The caption names both changes:**
     - Dictation now streams, decoding every 0.7 s while you talk.
     - He switched to Moonshine because Whisper pads every clip to 30 s. Each Whisper re-decode cost 280–860 ms; Moonshine costs ~55 ms per second of audio and got the same words on his test clips.
   - **"Try your voice"** (opt-in, desktop) loads Moonshine Tiny in the browser and shows each re-decode's milliseconds live, labelled "in your browser". The model is tens of MB quantized; the exact size gets confirmed at build time.
   - The Open Room demo video and the five-agent crew sit beside it.
2. **"The backpack" (how he runs agents).**
   - **Left, labelled illustration:** one agent carries the whole backlog. As tickets fill its backpack, it starts missing details from the middle and its answers get gradually worse.
   - **Right, labelled real run:** the Open Room crew replays an actual tackle-board run from his repos, three slots at a time, with real ticket titles, worktrees, claim order and timings, and PRs opening.
   - Links to lstack.
3. **"Nothing invented" (Cover Me).**
   - One of the 32 real synthetic eval resumes, its tailored output, and the eval's pass/fail diff against the source (titles, dates and skills checked).
   - The suite's real pass rate, plus the Chrome Web Store link, user count and paid plans.
4. **"The year" (GitHub).** A static annotated SVG of the live contribution year, with the quiet winter and the autumn spike labelled in plain words.
5. **Experience.** A timeline of logos, one plain line each, with expanders.
6. **Testimonials and contact.**

**The wow:** "Try your voice", and watching his real agent run fill three slots.

**Effort:** about 40 agent-hours, plus about 10 for an optional guide character that hops between marked spots in the margins (desktop only).

**Needs from Lincoln:** confirm the spike was parallel agents; pick one real tackle-board run to replay.

---

## Contender 2: "Ask the Crew, for real" (the cursor swarm, but honest)

**Pitch:** the reference video done better, because the swarm is real. The page itself is a calm, fully readable portfolio. One framed section, "Ask the crew", holds his five Open Room agents as named live cursors. They answer questions about him by pulling his real cards onto an answer board.

**How a question gets answered:**
- **Chips only at launch:** "What has he shipped?", "Explain Open Room to my non-technical boss", "How does he use AI agents?".
- **It's really multi-agent, so the trace holds up under inspection:**
  - A planner call splits the question into card tasks.
  - Small-model calls write those cards in parallel, each streaming to its own cursor.
  - A separate reviewer call (Loop) checks every card against the site's source text. It sends back cards that are jargon-heavy or unsupported, and you watch the rewrite replace them.
  - This is his tackle-board and review-loop pattern, for real.
- **Grounded answers:**
  - Every sentence cites a card.
  - Questions the site can't answer get "Not on this site. Here's what is."
  - The cursors move on real stream events, not a timeline.
- **The answer is readable at once.** The choreography never delays the text.
- **"Show the trace" toggle:** the prompts, the raw JSON, tokens, latency, cost, and whether the cache was hit.
- **A grounding eval badge from day one:** "N adversarial questions, X% cited correctly", in the style of Cover Me's eval harness.

**Safety and cost:**
- **Chip answers:** each is generated once, reviewed by Lincoln, and cached with its trace, so they cost visitors nothing.
- **Free text** is a later add-on: rate-limited, size-limited by the response schema, with a hard monthly spend cap (around $10) and every answer logged. The cost is roughly a cent per question with a small model; that's an estimate to confirm against current pricing.
- **Layout:** no pan/zoom; a fixed board, which becomes a vertical feed on phones.

**The wow:** "I asked his portfolio something, his agents split the work, argued over the wording, and showed me the trace."

**Effort:** about 55–60 agent-hours for chips plus the eval, and about 10 more for free text.

---

## Contender 3: "Built for you" (a page made for each application)

**Pitch:** the reference video's "agents build the page live", done honestly.

**How a page gets made:**
- When Lincoln applies somewhere, he runs his own tailoring pipeline to produce `/for/<company>`. That's Cover Me's idea, tailoring without inventing, pointed at himself, packaged as an lstack skill.
- He reviews the page and puts the link in his application.

**What the hiring team sees:**
- A small pixel-art Lincoln (the character he asked for, as a builder rather than a pet) and his five crew agents build the page in front of them by replaying the real generation trace.
- They carry his standard cards in, reorder them for the role, and pin plain-language "why this fits" notes.
- Every note is stamped "✓ from source" and links to the card it came from.

**Safeguards and layout:**
- **No visitor input:** no abuse and no embarrassing public pages. Every page is reviewed by Lincoln before it exists.
- **Claims are checked against each card's actual text,** not just its ID. That check is measured on an eval set before he trusts it.
- **At most one gap,** phrased as "would ramp on …".
- **Readable from the first frame:**
  - The ~3 s build replay animates over cards that are already there.
  - It can be skipped, and it's static under reduced motion.
  - On phones the crew is a small strip at the top.
- **The homepage** is the general version, "built for whoever's reading", with the same replay, so every visitor gets the experience.
- **A "Show the trace" toggle** reveals the real generation steps for engineers.

**The wow:** "He sent a page built for our role, and I watched his agents assemble it. Every claim links to its source."

**Effort:** about 45 agent-hours: the replay engine, the generation pipeline (run offline by Lincoln), and about 10 for the character sprite (drawn in code, about 6 frames).

**Needs from Lincoln:** a photo or description for the character's likeness, and willingness to generate a page per application (one command).

---

## How they differ

- **1 teaches:** hands-on demos of his real engineering.
- **2 answers:** visitors ask questions, and a real multi-agent pipeline responds.
- **3 is built for you:** a page generated ahead of time, reviewed by Lincoln, and replayed live.
