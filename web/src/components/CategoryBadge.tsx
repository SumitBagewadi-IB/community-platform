import { getCategory } from "@/lib/data";

export default function CategoryBadge({ categorySlug }: { categorySlug: string }) {
  const category = getCategory(categorySlug);
  if (!category) return null;

  return (
    <span className="cat-badge">
      <span className="cat-dot" style={{ background: category.color }} />
      {category.name}
    </span>
  );
}
