// Personal projects. Numbers come from each repo's commits and docs; keep wording plain.

/** [name, icon file in /assets/icons (optional)] */
export type Tech = [string, string?];

export type Project = {
  id: string;
  logo: string;
  name: string;
  summary: string;
  links: [string, string][];
  stats?: [string, string][];
  /** How it works, in order, with what each step is built with. */
  flow: { step: string; detail: string; tech: Tech[] }[];
  challenges: { title: string; problem: string; fix: string }[];
};

export const COVER_ME: Project = {
  id: "cover-me",
  logo: "/assets/coverme.png",
  name: "Cover Me",
  summary:
    "A Chrome extension that writes your cover letter and tailors your resume to a job posting in about 20 seconds, without inventing experience.",
  links: [["cover-me.dev", "https://cover-me.dev"], ["Source", "https://github.com/TheLinc/cover-me"]],
  stats: [["~20 s", "per application"], ["200+", "users, paid plans"], ["32", "resumes in its eval suite"]],
  flow: [
    { step: "Lives in your browser", detail: "Reads your resume right on your computer.", tech: [["React", "react.png"], ["TypeScript", "ts.png"], ["pdf.js"]] },
    { step: "Reads the job posting", detail: "Pulls the details from LinkedIn, Greenhouse, Lever and more.", tech: [["Supabase Edge Functions", "supabase.png"]] },
    { step: "Writes, then checks", detail: "Claude writes and tailors; a second pass checks every claim against your resume.", tech: [["Claude API", "claude.svg"]] },
    { step: "Accounts and billing", detail: "A web dashboard for history, plans and payments.", tech: [["Next.js", "nextjs.png"], ["Postgres", "postgresql.svg"], ["Stripe", "stripe.svg"], ["Vercel", "vercel.svg"]] },
  ],
  challenges: [
    {
      title: "Stopping the AI from inventing experience",
      problem: "Even when told not to, the model added skills people didn’t have, like a nursing certification a nurse never listed.",
      fix: "Code strips any term found only in the posting, and every added skill must quote evidence from the resume, which a second model checks. Failed checks across 32 test resumes fell from 16 to 10.",
    },
    {
      title: "Reading postings from every job site",
      problem: "Each job board lays out its pages differently and changes them without warning, and an outdated reader quietly returns the wrong job.",
      fix: "Six site-specific readers plus a general fallback, run on the server so a broken site is fixed with a deploy instead of a new store release. 26 saved real postings catch regressions.",
    },
    {
      title: "Knowing when a change makes it worse",
      problem: "Prompts are easy to change and hard to judge, and a full quality check takes about 570 AI calls.",
      fix: "An eval suite of 32 resumes across 16 industries, where every posting asks for something the resume lacks. Pull requests that touch prompts run a quick 11-case check and fail if quality drops.",
    },
  ],
};

export const OPEN_ROOM: Project = {
  id: "open-room",
  logo: "/assets/openroom.png",
  name: "Open Room",
  summary:
    "A desktop app for talking to a team of AI coding agents by name. Say “Hey Atlas”, give it a task, and keep working while it does.",
  links: [["openroom.dev", "https://openroom.dev"], ["Source", "https://github.com/TheLinc/open-room"]],
  stats: [["~55 ms", "to transcribe a second of speech"], ["0.2 s", "from you stopping to final text"], ["121 / 126", "wake words heard in tests"]],
  flow: [
    { step: "Hears its name", detail: "Listens for “Hey Atlas” and writes down what you say as you speak, all on your computer.", tech: [["Moonshine speech-to-text"], ["ONNX Runtime"]] },
    { step: "Hands off the task", detail: "Each named agent is a Claude coding agent working in its own project.", tech: [["Claude Agent SDK", "claude.svg"]] },
    { step: "Talks back", detail: "Agents speak updates aloud, one at a time, most urgent first.", tech: [["Kokoro voice"]] },
    { step: "One desktop app", detail: "Runs on Windows and Mac.", tech: [["Electron", "electron.svg"], ["React", "react.png"], ["TypeScript", "ts.png"], ["Tailwind", "tailwind.png"]] },
  ],
  challenges: [
    {
      title: "Live transcription on your own computer",
      problem: "Whisper re-read a fixed 30-second window every pass (280–860 ms each), so words only appeared after you stopped, and long clips silently lost words.",
      fix: "Switched to Moonshine at about 55 ms per second of speech and lock in each word once two passes agree. Words now appear as you talk, and the final text lands about 0.2 s after you stop.",
    },
    {
      title: "Hearing its name, not its own voice",
      problem: "The wake word had to fire on “Hey Atlas” but not on similar words, chance phrases or the app’s own speech.",
      fix: "Trimmed each clip to just the speech and matched names by sound (Atlas or Atlus, never Atlantic). Hits on 126 synthetic test clips rose from 82 to 121, and anything that echoes the app’s own line is ignored.",
    },
    {
      title: "Many agents, one voice",
      problem: "Agents work in parallel but only one can speak at a time. Questions can’t get lost, and status updates pile up.",
      fix: "One shared queue: questions, then blockers, then results, then progress. Urgent lines interrupt, progress updates expire after 30 s, and bursts collapse into one notification.",
    },
  ],
};
