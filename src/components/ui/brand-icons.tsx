import type { SVGProps } from "react";

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path d="M15 8.5h-2a1 1 0 0 0-1 1V12h3l-.5 3H12v6.5h-3V15H7v-3h2V9a4 4 0 0 1 4-4h2v2.5Z" />
    </svg>
  );
}

export function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7.5 10.5v6M7.5 7.51v.01" strokeLinecap="round" />
      <path d="M11 16.5v-3.6c0-1.6 1-2.4 2.25-2.4S15.5 11.3 15.5 12.9v3.6" strokeLinecap="round" />
    </svg>
  );
}
