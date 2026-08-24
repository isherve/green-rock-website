import { cn } from "@/lib/utils";

/** Inline logo — always renders (no missing file on deploy) */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      role="img"
      aria-label="Green Rock"
      className={cn("shrink-0", className)}
    >
      <circle cx="256" cy="256" r="248" fill="#0a5c45" />
      <circle cx="256" cy="256" r="228" fill="none" stroke="#c9a227" strokeWidth="10" />
      <text
        x="256"
        y="290"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="168"
        fontWeight="700"
        fill="#c9a227"
      >
        GR
      </text>
    </svg>
  );
}
