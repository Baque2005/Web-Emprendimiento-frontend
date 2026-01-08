import { useNavigate } from 'react-router-dom';
import { categories } from '@/data/mockData';

export const CategoriesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold mb-4">
            Explora por Categoría
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Encuentra productos y servicios de emprendedores universitarios 
            organizados por categoría.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => navigate(`/catalog?category=${category.id}`)}
              className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-card hover:bg-primary hover:shadow-glow transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className="group-hover:scale-110 transition-transform text-foreground group-hover:text-primary-foreground">
                <category.icon className="h-8 w-8" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-center group-hover:text-primary-foreground transition-colors">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
