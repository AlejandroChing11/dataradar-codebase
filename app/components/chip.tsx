export interface ChipProps {
  label: string;
  required?: boolean;
}

// Chip de stack/tecnología. La variante "required" usa el acento teal.
export default function Chip({ label, required = false }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        required
          ? "border-primary text-primary"
          : "border-border bg-surface-2 text-text-muted"
      }`}
    >
      {label}
    </span>
  );
}
