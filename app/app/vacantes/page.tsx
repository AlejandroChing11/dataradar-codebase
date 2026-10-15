import { getTechnologies, getVacancies } from "@/lib/data";
import VacancyExplorer from "@/components/vacancy-explorer";

export default async function VacantesPage() {
  const [vacancies, technologies] = await Promise.all([getVacancies(), getTechnologies()]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Vacantes</h1>
        <p className="max-w-2xl text-text-muted">
          Explora y filtra las vacantes de data remotas rastreadas.
        </p>
      </header>

      <VacancyExplorer vacancies={vacancies} technologies={technologies} />
    </div>
  );
}
