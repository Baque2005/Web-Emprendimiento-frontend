import { useLayoutEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { categories } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Copy,
  ShoppingCart,
  Minus,
  Mail,
  Plus,
  Send,
  Star,
  Store,
  MessageCircle,
  Share2,
  Heart,
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, businesses, addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [id]);

  const product = products.find(p => p.id === id);
  const business = product ? businesses.find(b => b.id === product.businessId) : null;
  const category = product ? categories.find(c => c.id === product.category) : null;

  if (!product || !business) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Producto no encontrado</h1>
          <Button onClick={() => navigate('/catalog')}>Volver al Catálogo</Button>
        </div>
      </Layout>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success('Producto agregado al carrito', {
      description: `${quantity}x ${product.name}`,
      action: {
        label: 'Ver Carrito',
        onClick: () => navigate('/cart'),
      },
    });
  };

  const handleContact = () => {
    toast.success('Redirigiendo a WhatsApp...', {
      description: `Contactando a ${business.name}`,
    });
    window.open(`https://wa.me/${business.phone.replace(/\D/g, '')}?text=Hola, me interesa el producto: ${product.name}`, '_blank');
  };

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: product.name,
      text: product.description,
      url,
    };

    try {
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        await navigator.share(shareData);
        toast.success('Compartido correctamente');
        return;
      }

      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        toast.success('Enlace copiado', {
          description: 'Pégalo donde quieras compartirlo.',
        });
        return;
      }

      window.prompt('Copia y comparte este enlace:', url);
    } catch (error) {
      // Si el usuario cancela el share nativo, evitamos mostrar error.
      if (error?.name === 'AbortError') return;

      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(url);
          toast.success('Enlace copiado', {
            description: 'Pégalo donde quieras compartirlo.',
          });
          return;
        }
      } catch {
        // noop
      }

      toast.error('No se pudo compartir', {
        description: 'Intenta copiar el enlace manualmente desde la barra de direcciones.',
      });
    }
  };

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        toast.success('Enlace copiado', {
          description: 'Pégalo donde quieras compartirlo.',
        });
        return;
      }
      window.prompt('Copia y comparte este enlace:', url);
    } catch {
      window.prompt('Copia y comparte este enlace:', url);
    }
  };

  const shareTo = (target) => {
    const url = window.location.href;
    const title = product.name;
    const text = product.description;

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedMessage = encodeURIComponent(`${title}\n${text}\n${url}`);

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodedMessage}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      x: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedMessage}`,
    };

    const shareUrl = shareUrls[target];
    if (!shareUrl) return;

    if (target === 'email') {
      window.location.href = shareUrl;
      return;
    }

    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Layout>
      <div key={id} className="min-h-screen bg-background py-8 animate-slide-up">
        <div className="container">
          {/* Breadcrumb */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.featured && (
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Destacado
                  </Badge>
                )}
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-4 right-4 h-10 w-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center hover:bg-card transition-colors"
                >
                  <Heart
                    className={`h-5 w-5 ${isFavorite ? 'fill-destructive text-destructive' : 'text-foreground'}`}
                  />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                {category && (
                  <Badge variant="secondary" className="mb-3 gap-1">
                    <category.icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {category.name}
                  </Badge>
                )}
                <h1 className="font-display text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-muted-foreground text-lg">{product.description}</p>
              </div>

              {/* Business Info */}
              <div
                onClick={() => navigate(`/business/${business.id}`)}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
              >
                <img
                  src={business.logo}
                  alt={business.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{business.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span>{business.rating}</span>
                    <span>•</span>
                    <span>{business.totalSales} ventas</span>
                  </div>
                </div>
                <Store className="h-5 w-5 text-muted-foreground" />
              </div>

              {/* Price and Stock */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Precio</p>
                  <p className="font-display text-4xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Stock disponible</p>
                  <p className={`font-semibold ${product.stock < 10 ? 'text-destructive' : 'text-success'}`}>
                    {product.stock} unidades
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <p className="font-medium">Cantidad:</p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                    className="w-20 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="hero"
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Agregar al Carrito
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleContact}
                >
                  <MessageCircle className="h-5 w-5" />
                  Contactar
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  asChild
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button type="button" aria-label="Compartir producto">
                        <Share2 className="h-5 w-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Compartir</DropdownMenuLabel>
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                          handleCopyLink();
                        }}
                        className="gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Copiar enlace
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                          shareTo('whatsapp');
                        }}
                        className="gap-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                          shareTo('facebook');
                        }}
                        className="gap-2"
                      >
                        <Send className="h-4 w-4" />
                        Facebook
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                          shareTo('x');
                        }}
                        className="gap-2"
                      >
                        <Send className="h-4 w-4" />
                        X (Twitter)
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                          shareTo('telegram');
                        }}
                        className="gap-2"
                      >
                        <Send className="h-4 w-4" />
                        Telegram
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                          shareTo('email');
                        }}
                        className="gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        Email
                      </DropdownMenuItem>
                      {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              handleShare();
                            }}
                            className="gap-2"
                          >
                            <Share2 className="h-4 w-4" />
                            Más opciones...
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Button>
              </div>

              {/* Total */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total:</span>
                  <span className="font-display text-2xl font-bold text-primary">
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-2xl font-bold mb-6">Productos Relacionados</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p, index) => (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/product/${p.id}`)}
                    className="cursor-pointer group bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                        {p.name}
                      </h3>
                      <p className="font-display text-lg font-bold text-primary mt-1">
                        ${p.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;