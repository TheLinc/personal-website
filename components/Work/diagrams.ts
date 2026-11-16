export type DNode = { id: string; label: string; sub?: string; x: number; y: number; w?: number }; // viewBox 0 0 800 360
export type DEdge = { from: string; to: string; label?: string };
export type Diagram = { fig: string; nodes: DNode[]; edges: DEdge[] };

export const coverMeDiagram: Diagram = {
  fig: "Cover Me — request path",
  nodes: [
    { id: "ext", label: "Extension", sub: "Chrome MV3", x: 30, y: 40 },
    { id: "edge", label: "Edge Functions", sub: "Deno · usage limits", x: 315, y: 40 },
    { id: "claude", label: "Claude API", sub: "tailor · score · write", x: 600, y: 40 },
    { id: "web", label: "Dashboard", sub: "Next.js · Vercel", x: 30, y: 160 },
    { id: "pg", label: "Postgres", sub: "RLS · AES-256-GCM", x: 315, y: 160 },
    { id: "evals", label: "Eval harness", sub: "CI · 32 resumes", x: 600, y: 160 },
    { id: "stripe", label: "Stripe", sub: "checkout · webhooks", x: 30, y: 280 },
  ],
  edges: [
    { from: "ext", to: "edge", label: "posting + resume" },
    { from: "edge", to: "claude", label: "proxied" },
    { from: "edge", to: "pg" },
    { from: "web", to: "pg" },
    { from: "web", to: "stripe" },
    { from: "evals", to: "claude", label: "changed prompts" },
  ],
};

export const openRoomDiagram: Diagram = {
  fig: "Open Room — process map",
  nodes: [
    { id: "ui", label: "React UI", sub: "renderer", x: 30, y: 40 },
    { id: "hud", label: "Overlay HUD", sub: "renderer", x: 30, y: 280 },
    { id: "main", label: "Main process", sub: "owns agent state", x: 315, y: 160 },
    { id: "sdk", label: "Agent SDK × n", sub: "one session per agent", x: 315, y: 40 },
    { id: "voice", label: "Voice sidecar", sub: "Node · ONNX", x: 600, y: 160 },
    { id: "stt", label: "Whisper + VAD", sub: "wake words", x: 600, y: 40 },
    { id: "tts", label: "Neural TTS", sub: "priority speech bus", x: 600, y: 280 },
  ],
  edges: [
    { from: "ui", to: "main", label: "IPC" },
    { from: "hud", to: "main", label: "IPC" },
    { from: "main", to: "sdk" },
    { from: "main", to: "voice", label: "JSON-RPC" },
    { from: "stt", to: "voice" },
    { from: "voice", to: "tts" },
  ],
};
