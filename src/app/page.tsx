import { Suspense } from "react";
import { ScheduleBoard } from "@/components/schedule-board";

function BoardFallback() {
  return (
    <div className="relative mx-auto w-full max-w-3xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
      <p className="font-display text-sm font-semibold tracking-[0.18em] text-[var(--accent-deep)] uppercase">
        Turni Casa
      </p>
      <h1 className="mt-4 font-display text-4xl text-[var(--ink)]">Turni Casa</h1>
      <p className="mt-3 text-[var(--soft-ink)]">Caricamento turni…</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative z-10 flex flex-1 flex-col">
      <Suspense fallback={<BoardFallback />}>
        <ScheduleBoard />
      </Suspense>
    </main>
  );
}
