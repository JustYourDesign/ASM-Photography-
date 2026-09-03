import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/animations/magnetic";
import { cn } from "@/lib/utils";

type AnimatedButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "light" | "dark" | "outline";
  className?: string;
};

export function AnimatedButton({
  href,
  children,
  variant = "light",
  className,
}: AnimatedButtonProps) {
  const styles = {
    light: "bg-paper text-ink",
    dark: "bg-ink text-paper",
    outline: "border border-paper/40 text-paper",
  };

  return (
    <Magnetic className="inline-block">
      <Link
        href={href}
        data-cursor="hidden"
        className={cn(
          "group inline-flex items-center gap-3 overflow-hidden rounded-full px-8 py-4 text-xs uppercase tracking-[0.2em] transition-colors duration-500",
          styles[variant],
          className
        )}
      >
        <span>{children}</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5" />
      </Link>
    </Magnetic>
  );
}
