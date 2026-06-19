import { getRepository } from "../db";
import type { DashboardStats, Lead, LeadStatus } from "../models/types";

const STATUSES: LeadStatus[] = ["yangi", "suhbatda", "oqiyapti", "rad-etildi"];

/** Computes aggregated dashboard metrics from the current data. */
export async function computeStats(): Promise<DashboardStats> {
  const repo = getRepository();
  const [leads, courses, teachers] = await Promise.all([
    repo.listLeads(),
    repo.listCourses(),
    repo.listTeachers(),
  ]);

  const sorted = [...leads].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const leadsByStatus = STATUSES.reduce(
    (acc, status) => {
      acc[status] = leads.filter((l) => l.status === status).length;
      return acc;
    },
    {} as Record<LeadStatus, number>
  );

  return {
    totalLeads: leads.length,
    activeStudents: leadsByStatus.oqiyapti,
    totalCourses: courses.length,
    totalTeachers: teachers.length,
    recentLeads: sorted.slice(0, 5),
    leadsByStatus,
    leadsTrend: buildTrend(leads, 14),
  };
}

/** Daily lead counts for the last `days` days (oldest first). */
function buildTrend(leads: Lead[], days: number): { date: string; count: number }[] {
  const buckets = new Map<string, number>();
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const lead of leads) {
    const key = new Date(lead.createdAt).toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  return [...buckets.entries()].map(([date, count]) => ({ date, count }));
}
