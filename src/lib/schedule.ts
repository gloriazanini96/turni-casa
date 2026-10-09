export const PEOPLE = ["Gloria", "Sofia", "Elisa"] as const;
export type Person = (typeof PEOPLE)[number];

export const ZONES = [
  "Salone 1 + corridoio",
  "Bagni + cucina",
  "Salone 2 + corridoio",
] as const;
export type Zone = (typeof ZONES)[number];

/** Monday 5 October 2026 — first week of the rotation */
export const ANCHOR_MONDAY = new Date(2026, 9, 5);

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

export type Assignment = {
  person: Person;
  zone: Zone;
};

export function startOfMonday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + offset);
  return d;
}

export function addWeeks(monday: Date, weeks: number): Date {
  return new Date(monday.getTime() + weeks * WEEK_MS);
}

export function weekIndexFromMonday(monday: Date): number {
  const anchor = startOfMonday(ANCHOR_MONDAY);
  return Math.round((monday.getTime() - anchor.getTime()) / WEEK_MS);
}

export function getAssignments(weekIndex: number): Assignment[] {
  const shift = ((weekIndex % ZONES.length) + ZONES.length) % ZONES.length;
  return PEOPLE.map((person, i) => ({
    person,
    zone: ZONES[(i + shift) % ZONES.length],
  }));
}

export function weekEndFromMonday(monday: Date): Date {
  return new Date(monday.getTime() + 6 * DAY_MS);
}

export function formatWeekRange(monday: Date): string {
  const end = weekEndFromMonday(monday);
  const sameMonth = monday.getMonth() === end.getMonth();

  const dayFmt = new Intl.DateTimeFormat("it-IT", { day: "numeric" });
  const monthFmt = new Intl.DateTimeFormat("it-IT", { month: "long" });
  const fullFmt = new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
  });

  if (sameMonth) {
    return `${dayFmt.format(monday)}–${dayFmt.format(end)} ${monthFmt.format(end)}`;
  }
  return `${fullFmt.format(monday)} – ${fullFmt.format(end)}`;
}

export function weekKey(monday: Date): string {
  const y = monday.getFullYear();
  const m = String(monday.getMonth() + 1).padStart(2, "0");
  const d = String(monday.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isCurrentWeek(monday: Date, today = new Date()): boolean {
  return weekKey(monday) === weekKey(startOfMonday(today));
}

export const ZONE_HINTS: Record<Zone, string> = {
  "Salone 1 + corridoio": "Pavimenti, superfici e corridoio lato salone 1",
  "Bagni + cucina": "Sanitari, lavandino, piano cucina e pavimenti",
  "Salone 2 + corridoio": "Pavimenti, superfici e corridoio lato salone 2",
};
