"use client";

import { motion, type Variants } from "framer-motion";

type RevealTextProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  splitBy?: "word" | "char";
};

const container = (stagger: number, delay: number): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

const child: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

const tagMap = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
} as const;

const NBSP = " ";

export function RevealText({
  text,
  as = "span",
  className,
  delay = 0,
  splitBy = "word",
}: RevealTextProps) {
  const Tag = tagMap[as];
  const pieces = splitBy === "word" ? text.split(" ") : text.split("");

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      variants={container(splitBy === "word" ? 0.08 : 0.02, delay)}
      aria-label={text}
    >
      {pieces.map((piece, i) =>
        piece === " " || piece === "" ? (
          <span key={i} className="inline-block" aria-hidden="true">
            {NBSP}
          </span>
        ) : (
          <span key={i}>
            <span
              className="inline-block overflow-hidden pb-[0.12em] align-top leading-[1.2]"
              aria-hidden="true"
            >
              <motion.span className="inline-block" variants={child}>
                {piece}
              </motion.span>
            </span>
            {splitBy === "word" && i !== pieces.length - 1 ? " " : ""}
          </span>
        )
      )}
    </Tag>
  );
}
