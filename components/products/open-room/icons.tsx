// Icons used by the Open Room window, ported from open-room-site src/components/icons.tsx.

type IconProps = { className?: string; size?: number };

export function ChevronIcon({ className, size = 14 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m4 6 4 4 4-4" />
    </svg>
  );
}

export function PlusIcon({ className, size = 14 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}

export function GearIcon({ className, size = 14 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6.7 1.8h2.6l.4 1.7 1.5.9 1.7-.5 1.3 2.2-1.3 1.2v1.8l1.3 1.2-1.3 2.2-1.7-.5-1.5.9-.4 1.7H6.7l-.4-1.7-1.5-.9-1.7.5-1.3-2.2 1.3-1.2V7.3L1.8 6.1l1.3-2.2 1.7.5 1.5-.9.4-1.7Z" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  );
}

export function SlidersIcon({ className, size = 14 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M2 4.5h12M2 8h12M2 11.5h12" />
      <circle cx="6" cy="4.5" r="1.3" fill="currentColor" />
      <circle cx="10.5" cy="8" r="1.3" fill="currentColor" />
      <circle cx="5" cy="11.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

export function PencilIcon({ className, size = 14 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m10.5 2.5 3 3-8 8H2.5v-3l8-8Z" />
    </svg>
  );
}

export function PaperclipIcon({ className, size = 14 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m13 7.5-5.3 5.3a3.2 3.2 0 0 1-4.5-4.5l5.6-5.6a2.1 2.1 0 0 1 3 3l-5.6 5.6a1 1 0 0 1-1.5-1.5L9.6 5" />
    </svg>
  );
}

export function MicIcon({ className, size = 14 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="5.5" y="1.5" width="5" height="8" rx="2.5" />
      <path d="M3 7.5a5 5 0 0 0 10 0M8 12.5v2" />
    </svg>
  );
}

export function ArrowUpIcon({ className, size = 14 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 13V3M4 7l4-4 4 4" />
    </svg>
  );
}

export function BrainIcon({ className, size = 14 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 2.5a2.5 2.5 0 0 0-4.6 1.3A2.5 2.5 0 0 0 3 8.5a2.5 2.5 0 0 0 2 4.2 2.2 2.2 0 0 0 3 .3 2.2 2.2 0 0 0 3-.3 2.5 2.5 0 0 0 2-4.2 2.5 2.5 0 0 0-.4-4.7A2.5 2.5 0 0 0 8 2.5Zm0 0v10.5" />
    </svg>
  );
}

export function WrenchIcon({ className, size = 14 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M13.5 4.2a3.3 3.3 0 0 1-4.3 4.1l-5.4 5.4-1.5-1.5 5.4-5.4a3.3 3.3 0 0 1 4.1-4.3L9.6 4.7l1.7 1.7 2.2-2.2Z" />
    </svg>
  );
}

export function ShieldIcon({ className, size = 14 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M8 1.8 13 3.6v4c0 3-2.2 5.3-5 6.6-2.8-1.3-5-3.6-5-6.6v-4l5-1.8Z" />
      <path d="M6.6 6.5a1.4 1.4 0 1 1 2 1.3c-.4.2-.6.5-.6.9M8 10.8h.01" />
    </svg>
  );
}

export function TerminalIcon({ className, size = 14 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m3 4 4 4-4 4M8.5 12H13" />
    </svg>
  );
}
