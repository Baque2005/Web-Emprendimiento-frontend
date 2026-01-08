import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/context/AppContext';
import { ShoppingCart, Star } from 'lucide-react';
import { toast } from 'sonner';

export const ProductCard = ({ product, index = 0 }) => {
  const navigate = useNavigate();
  const { addToCart, businesses } = useApp();
  const business = businesses.find(b => b.id === product.businessId);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    toast.success('Producto agregado al carrito', {
      description: product.name,
      action: {
        label: 'Ver Carrito',
        onClick: () => navigate('/cart'),
      },
    });
  };

  return (
    <div
      className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 animate-slide-up cursor-pointer"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.featured && (
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
            <Star className="h-3 w-3 mr-1 fill-current" />
            Destacado
          </Badge>
        )}
        {product.stock < 10 && product.stock > 0 && (
          <Badge variant="destructive" className="absolute top-3 right-3">
            ¡Últimas unidades!
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        {business && (
          <div className="flex items-center gap-2">
            <img
              src={business.logo}
              alt={business.name}
              className="h-6 w-6 rounded-full object-cover"
            />
            <span className="text-xs text-muted-foreground">{business.name}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="font-display text-xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          <Button
            size="sm"
            variant="hero"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
