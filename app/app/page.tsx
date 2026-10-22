import { getDashboardData, getVacancies } from "@/lib/data";
import Landing, { type LandingData } from "@/components/landing";

export const revalidate = 3600; // Refresca el radar cada hora (ISR)

export default async function HomePage() {
  const [{ stats }, vacancies] = await Promise.all([
    getDashboardData(),
    getVacancies(),
  ]);

  const data: LandingData = {
    activeVacancies: stats.activeVacancies,
    newToday: stats.newToday,
    newThisWeek: stats.newThisWeek,
    companiesTracked: stats.companiesTracked,
    topTech: stats.topTechnologies.slice(0, 8).map((t) => ({
      name: t.name,
      count: t.count,
    })),
    fresh: [...vacancies]
      .sort((a, b) => (b.first_seen ?? "").localeCompare(a.first_seen ?? ""))
      .slice(0, 3)
      .map((v) => ({
        id: v.id,
        title: v.title,
        company_name: v.company_name ?? "",
        block: v.block ?? "rest",
        is_active: v.is_active,
        technologies: v.technologies.slice(0, 3).map((tk) => tk.name),
      })),
  };

  return <Landing data={data} />;
}
