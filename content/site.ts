// Site copy and data. Facts come from Lincoln's resume; keep wording plain.

export type Role = {
  logo: string;
  company: string;
  role: string;
  when: string;
  /** One line: the job in plain words. */
  summary: string;
  /** What Lincoln did, most important first. */
  points: string[];
  stack: string[];
  hash: string;
  head?: boolean;
  /** Ran alongside the role above it (contract), drawn as a side branch. */
  branch?: boolean;
  /** The logo is already a full square tile (fill it, no padding). */
  tile?: boolean;
};

export const ROLES: Role[] = [
  {
    logo: "/assets/os.png",
    company: "Opinion System",
    role: "Full Stack Developer",
    when: "Feb 2023 — now",
    summary: "Tech lead on a B2B SaaS platform for reviews and surveys, and leading its AI integrations.",
    points: [
      "Leading AI integrations across the platform, building AI-powered features on AWS Bedrock.",
      "Led a new client portal used by 25k+ clients, built in Next.js, React, Zustand and React Query.",
      "Designed backend APIs, data models and SQL that cut average query time by 70% on high-volume client data.",
      "Built event-driven pipelines with Symfony Messenger and Mercure for real-time updates, with retries and failure handling.",
      "Made the UI accessible and localized: keyboard navigation, i18n, Figma designs built in MUI with custom theming.",
      "Integrated Braintree payments and HubSpot CRM, plus Google and Facebook APIs, cron jobs and AWS S3.",
      "Added authentication and role-based access control enforced in route middleware.",
      "Tech lead: code reviews, coding standards, mentoring, and weekly releases on a set roadmap.",
      "Led a team shipping React Native features: analysed the codebase, wrote the tickets and coordinated the work.",
    ],
    stack: ["Next.js", "React", "TypeScript", "PHP / Symfony", "MySQL", "React Native", "AWS"],
    hash: "a3f9c1e",
    head: true,
  },
  {
    logo: "/assets/core.png",
    company: "Core Manufacturing",
    role: "Founding Frontend Engineer · contract",
    when: "Oct 2025 — Apr 2026",
    summary: "First frontend hire at a manufacturing analytics startup; took the product from concept to launch in 6 months.",
    points: [
      "Owned frontend strategy, architecture and delivery from the first commit to the production launch.",
      "Built a generative-UI chat that renders interfaces from structured LLM output.",
      "Built a schema-driven framework that renders user-defined graph data models with dynamic properties and relationships.",
      "Wrote Next.js API routes that hid the graph backend's limits behind simple, frontend-friendly APIs.",
      "Set up the design system and component library the rest of the app is built from.",
      "Built fast CRUD flows for large, complex manufacturing datasets.",
    ],
    stack: ["Next.js", "React", "TypeScript", "shadcn/ui", "Tailwind", "Graph databases", "LLMs"],
    hash: "7c21d0b",
    branch: true,
    tile: true,
  },
  {
    logo: "/assets/GBatteries.png",
    company: "GBatteries",
    role: "Full Stack Developer",
    when: "2022",
    summary: "Software for a battery-charging hardware company.",
    points: [
      "Built a Python hardware-simulation app used to test charging hardware.",
      "Wrote real-time socket servers that collect data from the hardware.",
      "Deployed Dockerized services on AWS ECS and published an internal PyPI library for the team.",
    ],
    stack: ["Python", "Docker", "AWS ECS", "WebSockets"],
    hash: "e4b8a92",
  },
  {
    logo: "/assets/trading-central.png",
    company: "Trading Central",
    role: "Software Developer",
    when: "2021",
    summary: "Frontend for financial market research tools.",
    points: [
      "Built React front-ends for financial data visualisation.",
      "Built Angular components with custom SVG charts.",
      "Turned Figma designs into responsive, accessible layouts and worked on the REST integration.",
    ],
    stack: ["React", "Angular", "SVG", "REST"],
    hash: "19dd3f0",
  },
  {
    logo: "/assets/cra.png",
    company: "Canada Revenue Agency",
    role: "IT Analyst & Developer",
    when: "2020",
    summary: "Data security and testing in the federal tax agency's IT group.",
    points: [
      "Researched data masking and obfuscation approaches for sensitive data.",
      "Automated testing of custom Jira features with UFT.",
      "Contributed to data security policy and technology benchmarking with vendors.",
    ],
    stack: ["UFT", "Jira", "Data masking"],
    hash: "0b6e7aa",
  },
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
