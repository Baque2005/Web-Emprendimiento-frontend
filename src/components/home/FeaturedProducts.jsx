import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/catalog/ProductCard';
import { useApp } from '@/context/AppContext';
import { ArrowRight } from 'lucide-react';

export const FeaturedProducts = () => {
  const navigate = useNavigate();
  const { products } = useApp();
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);
  const loopProducts = featuredProducts.length > 0 ? featuredProducts : [];

  return (
    <section className="py-16">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold mb-2">
              Productos Destacados
            </h2>
            <p className="text-muted-foreground">
              Los productos más populares de nuestros emprendedores
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/catalog')}
          >
            Ver Todo
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {loopProducts.length > 0 ? (
          <div className="featured-carousel" aria-label="Carrusel de productos destacados">
            <div className="featured-carousel-track">
              <div className="featured-carousel-group">
                {loopProducts.map((product, index) => (
                  <div className="featured-carousel-item" key={product.id}>
                    <ProductCard product={product} index={index} />
                  </div>
                ))}
              </div>
              <div className="featured-carousel-group" aria-hidden="true">
                {loopProducts.map((product, index) => (
                  <div className="featured-carousel-item" key={`${product.id}-dup`}>
                    <ProductCard product={product} index={index} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground">No hay productos destacados todavía.</div>
        )}
      </div>
    </section>
  );
};
