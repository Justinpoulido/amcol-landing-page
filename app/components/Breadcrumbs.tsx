import Link from "next/link";

type Crumb = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-2">
          {index > 0 ? <span aria-hidden="true">/</span> : null}
          {item.href ? (
            <Link href={item.href} className="hover:text-slate-900">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
