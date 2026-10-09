"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  addWeeks,
  formatWeekRange,
  getAssignments,
  isCurrentWeek,
  startOfMonday,
  weekIndexFromMonday,
  weekKey,
  ZONE_HINTS,
  type Assignment,
  type Person,
} from "@/lib/schedule";

const PERSON_TONE: Record<
  Person,
  { chip: string; bar: string; soft: string }
> = {
  Gloria: {
    chip: "bg-[var(--person-gloria)] text-[var(--ink)]",
    bar: "bg-[var(--person-gloria)]",
    soft: "bg-[var(--person-gloria-soft)]",
  },
  Sofia: {
    chip: "bg-[var(--person-sofia)] text-[var(--ink)]",
    bar: "bg-[var(--person-sofia)]",
    soft: "bg-[var(--person-sofia-soft)]",
  },
  Elisa: {
    chip: "bg-[var(--person-elisa)] text-[var(--ink)]",
    bar: "bg-[var(--person-elisa)]",
    soft: "bg-[var(--person-elisa-soft)]",
  },
};

type DoneMap = Record<string, boolean>;

function storageKey(monday: Date, person: Person) {
  return `${weekKey(monday)}:${person}`;
}

function loadDone(): DoneMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("turni-casa-done");
    return raw ? (JSON.parse(raw) as DoneMap) : {};
  } catch {
    return {};
  }
}

function saveDone(map: DoneMap) {
  localStorage.setItem("turni-casa-done", JSON.stringify(map));
}

function UpcomingPreview({
  baseMonday,
  done,
}: {
  baseMonday: Date;
  done: DoneMap;
}) {
  const weeks = [1, 2, 3].map((offset) => {
    const monday = addWeeks(baseMonday, offset);
    return {
      monday,
      label: formatWeekRange(monday),
      assignments: getAssignments(weekIndexFromMonday(monday)),
    };
  });

  return (
    <section className="mt-12 space-y-4">
      <div>
        <h2 className="font-display text-2xl tracking-tight text-[var(--ink)]">
          Prossime settimane
        </h2>
        <p className="mt-1 text-[var(--soft-ink)]">
          Anteprima della rotazione — tre settimane in avanti.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {weeks.map((week, i) => (
          <article
            key={weekKey(week.monday)}
            className="preview-card rounded-2xl border border-[var(--line)] bg-white/55 p-4 backdrop-blur-sm"
            style={{ animationDelay: `${120 + i * 80}ms` }}
          >
            <p className="text-xs font-semibold tracking-wide text-[var(--soft-ink)] uppercase">
              {week.label}
            </p>
            <ul className="mt-3 space-y-2">
              {week.assignments.map((a) => (
                <li key={a.person} className="flex items-start gap-2 text-sm">
                  <span
                    className={`mt-1 size-2 shrink-0 rounded-full ${PERSON_TONE[a.person].bar}`}
                  />
                  <span>
                    <span className="font-medium text-[var(--ink)]">
                      {a.person}
                    </span>
                    <span className="text-[var(--soft-ink)]"> · {a.zone}</span>
                  </span>
                </li>
              ))}
            </ul>
            {week.assignments.every(
              (a) => done[storageKey(week.monday, a.person)]
            ) ? (
              <p className="mt-3 text-xs text-[var(--accent-deep)]">
                Tutto fatto
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function AssignmentRow({
  assignment,
  checked,
  onToggle,
  index,
}: {
  assignment: Assignment;
  checked: boolean;
  onToggle: () => void;
  index: number;
}) {
  const tone = PERSON_TONE[assignment.person];
  const id = `task-${assignment.person}`;

  return (
    <label
      htmlFor={id}
      className={`assignment-row group flex cursor-pointer items-start gap-4 rounded-2xl border border-[var(--line)] p-4 transition-all duration-300 sm:p-5 ${
        checked
          ? "bg-white/40 opacity-70"
          : `${tone.soft} bg-white/70 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-18px_rgba(28,58,48,0.45)]`
      }`}
      style={{ animationDelay: `${80 + index * 70}ms` }}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onToggle}
        className="mt-1"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex rounded-md px-2 py-0.5 text-sm font-semibold ${tone.chip}`}
          >
            {assignment.person}
          </span>
          {checked ? (
            <Badge variant="secondary" className="bg-white/80 text-[var(--soft-ink)]">
              Fatto
            </Badge>
          ) : null}
        </div>
        <p
          className={`mt-2 font-display text-xl leading-tight text-[var(--ink)] sm:text-2xl ${
            checked ? "line-through decoration-[var(--soft-ink)]" : ""
          }`}
        >
          {assignment.zone}
        </p>
        <p className="mt-1 text-sm text-[var(--soft-ink)]">
          {ZONE_HINTS[assignment.zone]}
        </p>
      </div>
      <span
        aria-hidden
        className={`mt-1 hidden h-12 w-1.5 shrink-0 rounded-full sm:block ${tone.bar}`}
      />
    </label>
  );
}

export function ScheduleBoard() {
  const [monday, setMonday] = useState<Date | null>(null);
  const [done, setDone] = useState<DoneMap>({});

  useEffect(() => {
    setMonday(startOfMonday(new Date()));
    setDone(loadDone());
  }, []);

  if (!monday) {
    return (
      <div className="relative mx-auto w-full max-w-3xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        <header className="hero-in space-y-5">
          <p className="inline-flex items-center gap-2 font-display text-sm font-semibold tracking-[0.18em] text-[var(--accent-deep)] uppercase">
            <Sparkles className="size-4" aria-hidden />
            Turni Casa
          </p>
          <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-[var(--ink)] sm:text-5xl">
            Turni Casa
          </h1>
          <p className="text-[var(--soft-ink)]">Caricamento turni…</p>
        </header>
      </div>
    );
  }

  const activeMonday = monday;
  const weekIndex = weekIndexFromMonday(activeMonday);
  const assignments = getAssignments(weekIndex);
  const current = isCurrentWeek(activeMonday);
  const completedCount = assignments.filter(
    (a) => done[storageKey(activeMonday, a.person)]
  ).length;

  function go(delta: number) {
    setMonday((prev) => (prev ? addWeeks(prev, delta) : prev));
  }

  function goToday() {
    setMonday(startOfMonday(new Date()));
  }

  function toggle(person: Person) {
    const key = storageKey(activeMonday, person);
    setDone((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveDone(next);
      return next;
    });
  }

  return (
    <div className="relative mx-auto w-full max-w-3xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
      <header className="hero-in space-y-5">
        <p className="inline-flex items-center gap-2 font-display text-sm font-semibold tracking-[0.18em] text-[var(--accent-deep)] uppercase">
          <Sparkles className="size-4" aria-hidden />
          Turni Casa
        </p>
        <div className="space-y-3">
          <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-[var(--ink)] sm:text-5xl">
            Turni Casa
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-[var(--soft-ink)] sm:text-lg">
            Rotazione settimanale tra Gloria, Sofia ed Elisa. Ogni settimana
            cambia zona: saloni, corridoio, bagni e cucina.
          </p>
        </div>
      </header>

      <section className="mt-10 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[var(--soft-ink)] uppercase">
              Settimana
            </p>
            <h2 className="font-display text-2xl text-[var(--ink)] sm:text-3xl">
              {formatWeekRange(activeMonday)}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {current ? (
              <Badge className="bg-[var(--leaf)] text-[var(--ink)]">
                Questa settimana
              </Badge>
            ) : (
              <Button variant="ghost" size="sm" onClick={goToday}>
                Torna a oggi
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => go(-1)}
            aria-label="Settimana precedente"
            className="border-[var(--line)] bg-white/70"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => go(1)}
            aria-label="Settimana successiva"
            className="border-[var(--line)] bg-white/70"
          >
            <ChevronRight />
          </Button>
          <p className="ml-2 text-sm text-[var(--soft-ink)]">
            {completedCount} di {assignments.length} completati
          </p>
        </div>

        <div key={weekKey(activeMonday)} className="space-y-3">
          {assignments.map((assignment, index) => (
            <AssignmentRow
              key={assignment.person}
              assignment={assignment}
              checked={Boolean(
                done[storageKey(activeMonday, assignment.person)]
              )}
              onToggle={() => toggle(assignment.person)}
              index={index}
            />
          ))}
        </div>
      </section>

      <UpcomingPreview baseMonday={activeMonday} done={done} />

      <footer className="mt-14 border-t border-[var(--line)] pt-6 text-sm text-[var(--soft-ink)]">
        La rotazione riparte ogni tre settimane. Segna i turni come fatti: lo
        stato resta salvato su questo dispositivo.
      </footer>
    </div>
  );
}
