import { DateTime } from "luxon";

/**
 * Simple time range extractor for terms like 'yesterday', 'last 7 days', 'last month'
 */
export function parseTimeRange(text: string): { from: string; to: string } | null {
  const now = DateTime.utc();
  if (text.includes("yesterday")) {
    const start = now.minus({ days: 1 }).startOf("day");
    const end = start.endOf("day");
    return { from: start.toISO() || "", to: end.toISO() || "" };
  }
  const m = text.match(/last\s+(\d+)\s+days?/);
  if (m) {
    const days = Number(m[1]);
    return {
      from: now.minus({ days }).startOf("day").toISO() || "",
      to: now.endOf("day").toISO() || ""
    };
  }
  if (text.includes("past month") || text.includes("last month")) {
    const start = now.minus({ months: 1 }).startOf("day");
    return { from: start.toISO() || "", to: now.endOf("day").toISO() || "" };
  }
  
  const explicit = text.match(/from\s+(\d{4}-\d{2}-\d{2})\s+to\s+(\d{4}-\d{2}-\d{2})/);
  if (explicit) {
    const from = DateTime.fromISO(explicit[1]).startOf("day");
    const to = DateTime.fromISO(explicit[2]).endOf("day");
    return { from: from.toISO() || "", to: to.toISO() || "" };
  }
  return null;
}
