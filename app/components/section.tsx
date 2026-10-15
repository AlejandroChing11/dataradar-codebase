export default function Section({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`flex flex-col gap-2 ${className}`}>
      <h2 className="text-lg font-semibold">{title}</h2>
      {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
      <div className="mt-2 flex-1">{children}</div>
    </section>
  );
}
