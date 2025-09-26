"use client";

export default function InlineError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <div className="text-xs text-red-600 mt-1">{children}</div>;
}
