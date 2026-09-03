"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

type AccordionItemProps = {
  question: string;
  answer: string;
  isTodo?: boolean;
};

function AccordionItem({ question, answer, isTodo }: AccordionItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-paper/10">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 py-6 text-left"
      >
        <span className="font-display text-lg text-paper md:text-xl">{question}</span>
        <Plus
          className={cn(
            "h-5 w-5 shrink-0 text-beige transition-transform duration-400",
            open && "rotate-45"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="overflow-hidden"
          >
            <p
              className={cn(
                "max-w-2xl pb-6 text-sm leading-relaxed text-paper/65 md:text-base",
                isTodo && "italic text-beige/70"
              )}
            >
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export type AccordionEntry = {
  id: string;
  question: string;
  answer: string;
};

export function Accordion({ items }: { items: AccordionEntry[] }) {
  return (
    <div className="mx-auto max-w-3xl">
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          question={item.question}
          answer={item.answer}
          isTodo={item.answer.trim().toUpperCase().startsWith("TODO")}
        />
      ))}
    </div>
  );
}
