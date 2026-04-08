"use client";

import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <div
      className={className}
      style={{ animationDelay: delay ? `${delay}s` : undefined } as CSSProperties}
    >
      {children}
    </div>
  );
}
