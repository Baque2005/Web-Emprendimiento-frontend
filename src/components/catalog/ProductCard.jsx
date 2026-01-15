import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/context/AppContext';
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from 'lucide-react';
import { toast } from 'sonner';

export const ProductCard = ({ product, index = 0 }) => {
  const navigate = useNavigate();
  const { addToCart, businesses } = useApp();
  const fallbackImage = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop';
  const images = useMemo(() => {
    if (Array.isArray(product?.images) && product.images.filter(Boolean).length > 0) {
      return product.images.filter(Boolean);
    }
    return product?.image ? [product.image] : [];
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [currentImageSrc, setCurrentImageSrc] = useState('');
  const [previousImageSrc, setPreviousImageSrc] = useState('');
  const [autoPaused, setAutoPaused] = useState(false);
  const rotateTimeoutRef = useRef(null);
  const resumeTimeoutRef = useRef(null);
  const business = businesses.find(b => b.id === product.businessId);
  const acceptsDelivery = product?.acceptsDelivery !== false;
  const acceptsPickup = product?.acceptsPickup !== false;
  const acceptsPaypal = product?.acceptsPaypal !== false;
  const acceptsCash = product?.acceptsCash !== false;

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id]);

  const clearRotateTimers = useCallback(() => {
    if (rotateTimeoutRef.current) {
      window.clearTimeout(rotateTimeoutRef.current);
      rotateTimeoutRef.current = null;
    }
  }, []);

  const scheduleNextRotate = useCallback(() => {
    clearRotateTimers();
    if (images.length <= 1) return;
    if (autoPaused) return;

    rotateTimeoutRef.current = window.setTimeout(() => {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
  }, [autoPaused, clearRotateTimers, images.length]);

  const registerGalleryInteraction = useCallback(() => {
    setAutoPaused(true);
    clearRotateTimers();
    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = window.setTimeout(() => {
      setAutoPaused(false);
    }, 10000);
  }, [clearRotateTimers]);

  useEffect(() => {
    scheduleNextRotate();
    return () => clearRotateTimers();
  }, [activeImageIndex, scheduleNextRotate, clearRotateTimers]);

  useEffect(() => {
    if (!autoPaused) scheduleNextRotate();
  }, [autoPaused, scheduleNextRotate]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  const nextImageSrc = useMemo(() => {
    return images[activeImageIndex] || product?.image || fallbackImage;
  }, [images, activeImageIndex, product?.image, fallbackImage]);

  useEffect(() => {
    if (!nextImageSrc) return;

    setCurrentImageSrc((prev) => {
      if (prev && prev !== nextImageSrc) {
        setPreviousImageSrc(prev);
        window.setTimeout(() => setPreviousImageSrc(''), 350);
      } else {
        setPreviousImageSrc('');
      }
      return nextImageSrc;
    });
  }, [nextImageSrc]);

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
        {previousImageSrc ? (
          <img
            src={previousImageSrc}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover"
            aria-hidden="true"
          />
        ) : null}

        <img
          key={currentImageSrc}
          src={currentImageSrc || fallbackImage}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 motion-reduce:animate-none animate-in fade-in-0"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Imagen anterior"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                registerGalleryInteraction();
                setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Imagen siguiente"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                registerGalleryInteraction();
                setActiveImageIndex((prev) => (prev + 1) % images.length);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

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

        <div className="flex flex-wrap gap-2">
          {acceptsDelivery && (
            <Badge variant="secondary" className="text-xs">
              Entrega
            </Badge>
          )}
          {acceptsPickup && (
            <Badge variant="secondary" className="text-xs">
              Retiro
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {acceptsPaypal && (
            <Badge variant="secondary" className="text-xs">
              PayPal
            </Badge>
          )}
          {acceptsCash && (
            <Badge variant="secondary" className="text-xs">
              Efectivo
            </Badge>
          )}
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
