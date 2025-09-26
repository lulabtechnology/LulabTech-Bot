"use client";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Chip({ children, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl border border-zinc-200 bg-white px-3 py-1 text-sm shadow hover:bg-zinc-50 active:scale-[0.98]"
    >
      {children}
    </button>
  );
}
