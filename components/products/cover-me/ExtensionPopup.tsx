import type { ReactNode } from "react";
import Image from "next/image";

// The real extension popup's frame, in the extension's own dark palette.
export function ExtensionPopup({
  status,
  children,
  footer,
  className = "",
}: {
  status?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[18px] border border-cm-ext-border bg-cm-ext-bg text-cm-ext-text shadow-[0_30px_70px_-20px_rgba(15,14,40,0.55)] ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-cm-ext-elevated px-3.5 py-3 text-[13px] font-semibold">
        <Image src="/assets/coverme.png" width={18} height={18} alt="" className="rounded-[5px]" />
        Cover Me
        {status && <span className="ml-auto text-[11px] font-medium text-cm-ext-soft">{status}</span>}
      </div>
      {children}
      {footer && <div className="flex gap-2 border-t border-cm-ext-elevated px-3.5 py-3">{footer}</div>}
    </div>
  );
}

export type StepState = "done" | "active" | "todo";

const STEP_TEXT: Record<StepState, string> = {
  done: "text-cm-ext-soft",
  active: "font-medium text-cm-ext-text",
  todo: "text-cm-ext-muted",
};

// One line of the popup's tailoring progress list.
export function ProgressStep({ state, children }: { state: StepState; children: ReactNode }) {
  return (
    <li className={`flex items-center gap-2.5 text-[12px] ${STEP_TEXT[state]}`}>
      {state === "done" && (
        <span className="flex size-4 shrink-0 items-center justify-center rounded-[5px] bg-[rgba(99,102,241,0.28)] text-cm-ext-soft">
          <svg width="10" height="10" viewBox="0 0 256 256" fill="none" aria-hidden>
            <path d="M40 144l56 56L216 72" stroke="currentColor" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
      {state === "active" && (
        <svg className="size-4 shrink-0 animate-spin" viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="8" cy="8" r="6" stroke="var(--color-cm-ext-border)" strokeWidth="2" />
          <path d="M8 2a6 6 0 0 1 6 6" stroke="var(--color-cm-brand)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
      {state === "todo" && <span className="size-4 shrink-0 rounded-[5px] border border-dashed border-cm-ext-border" />}
      <span>
        <span className="sr-only">{state === "done" ? "Done: " : state === "active" ? "In progress: " : "Next: "}</span>
        {children}
      </span>
    </li>
  );
}

export function PopupButton({ children, primary }: { children: ReactNode; primary?: boolean }) {
  return (
    <span
      className={`flex-1 rounded-[10px] px-2 py-2.5 text-center text-[12px] font-semibold ${
        primary ? "bg-cm-brand text-white" : "bg-cm-ext-elevated text-cm-ext-text"
      }`}
    >
      {children}
    </span>
  );
}
