import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">What do you need?</h2>
      <div className="grid grid-cols-3 gap-3">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active-scale h-auto flex-col space-y-2"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mx-auto`}>
              <i className={`${category.icon} text-white text-lg`}></i>
            </div>
            <span className="text-sm font-medium text-gray-700">{category.name}</span>
          </Button>
        ))}
      </div>
    </section>
  );
}
