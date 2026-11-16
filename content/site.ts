// Site copy and data. Facts come from Lincoln's resume; keep wording plain.

export type Role = {
  logo: string;
  company: string;
  role: string;
  when: string;
  line: string;
  hash: string;
  head?: boolean;
  /** Ran alongside the role above it (contract), drawn as a side branch. */
  branch?: boolean;
  /** The logo is already a full square tile (fill it, no padding). */
  tile?: boolean;
};

export const ROLES: Role[] = [
  { logo: "/assets/os.png", company: "Opinion System", role: "Full Stack Developer", when: "2023 — now", line: "Led a client portal for 25k+ clients. Tech lead for a B2B SaaS platform.", hash: "a3f9c1e", head: true },
  { logo: "/assets/core.png", company: "Core Manufacturing", role: "Founding Frontend Engineer · contract", when: "2025 — 2026", line: "Concept to production in 6 months, including a generative-UI chat.", hash: "7c21d0b", branch: true, tile: true },
  { logo: "/assets/GBatteries.png", company: "GBatteries", role: "Full Stack Developer", when: "2022", line: "Hardware simulation in Python, services on AWS ECS.", hash: "e4b8a92" },
  { logo: "/assets/trading-central.png", company: "Trading Central", role: "Software Developer", when: "2021", line: "Financial data visualisation in React and Angular.", hash: "19dd3f0" },
  { logo: "/assets/cra.png", company: "Canada Revenue Agency", role: "IT Analyst & Developer", when: "2020", line: "Data masking research and test automation.", hash: "0b6e7aa" },
];

export const REVIEWS = [
  { name: "Mathieu Martel", role: "Senior Software Developer, Opinion System", text: "Lincoln consistently demonstrates strong technical skills, ownership, and a collaborative mindset. He’s reliable, adaptable, and someone I trust to deliver high-quality work on challenging problems." },
  { name: "Arif Lalani", role: "Lead UI/UX Designer, Opinion System", text: "Lincoln quickly understands challenges and always comes forward with thoughtful solutions that improve both the product and the team’s workflow." },
  { name: "Amélie Fontaine", role: "Lead Developer, Trading Central", text: "Lincoln translated our Figma designs into pixel-perfect React components faster than anyone I've worked with." },
];

export const CHECKS: [string, string][] = [
  ["Build", "Next.js · React · TypeScript · Node · Postgres"],
  ["Tests", "1,100+ passing in Open Room"],
  ["Evals", "32 resumes, nothing invented (Cover Me)"],
  ["Shipped", "2 products with real users"],
  ["Review", "3 approvals"],
];

export const EMAIL = "lincolnlaylor@gmail.com";
export const GITHUB = "https://github.com/TheLinc";
export const LINKEDIN = "https://www.linkedin.com/in/lincolnlaylor/";
