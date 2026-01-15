import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/catalog/ProductCard';
import { categories } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { ReportButton } from '@/components/reports/ReportButton';
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  Instagram,
  MessageCircle,
  Calendar,
  ShoppingBag,
} from 'lucide-react';
import { toast } from 'sonner';

const BusinessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, businesses } = useApp();

  const business = businesses.find(b => b.id === id);
  const category = business ? categories.find(c => c.id === business.category) : null;
  const businessProducts = products.filter(p => p.businessId === id);

  if (!business) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Negocio no encontrado</h1>
          <Button onClick={() => navigate('/businesses')}>Ver Negocios</Button>
        </div>
      </Layout>
    );
  }

  const handleContact = () => {
    toast.success('Redirigiendo a WhatsApp...');
    window.open(`https://wa.me/${business.phone.replace(/\D/g, '')}?text=Hola, me interesa conocer más sobre ${business.name}`, '_blank');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Banner */}
        <div className="relative h-48 md:h-64 lg:h-80">
          <img
            src={business.banner}
            alt={business.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          
          <div className="container absolute bottom-0 left-0 right-0 transform translate-y-1/2">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
              <img
                src={business.logo}
                alt={business.name}
                className="h-24 w-24 md:h-32 md:w-32 rounded-2xl border-4 border-background object-cover shadow-xl"
              />
              <div className="flex-1">
                {category && (
                  <Badge className="mb-2 gap-1">
                    <category.icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {category.name}
                  </Badge>
                )}
                <h1 className="font-display text-3xl md:text-4xl font-bold">{business.name}</h1>
              </div>

              <div className="w-full md:w-auto md:ml-auto">
                <ReportButton
                  type="business"
                  targetId={business.id}
                  targetName={business.name}
                  buttonVariant="outline"
                  buttonSize="sm"
                  className="w-full md:w-auto gap-2"
                  showText
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container pt-28 sm:pt-24 md:pt-20 pb-16">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mt-10 sm:mt-8 md:mt-0 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-display text-xl font-bold mb-4">Sobre Nosotros</h2>
                <p className="text-muted-foreground">{business.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center gap-1 text-accent mb-1">
                      <Star className="h-5 w-5 fill-current" />
                      <span className="font-display text-2xl font-bold">{business.rating}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Calificación</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center gap-1 text-primary mb-1">
                      <ShoppingBag className="h-5 w-5" />
                      <span className="font-display text-2xl font-bold">{business.totalSales}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Ventas</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center gap-1 text-success mb-1">
                      <Calendar className="h-5 w-5" />
                      <span className="font-display text-2xl font-bold">
                        {new Date(business.joinedDate).toLocaleDateString('es-EC', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Desde</p>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <h2 className="font-display text-2xl font-bold mb-6">
                  Productos ({businessProducts.length})
                </h2>
                {businessProducts.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {businessProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/30 rounded-xl">
                    <p className="text-muted-foreground">Este negocio aún no tiene productos</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-4 lg:sticky lg:top-24">
                <h3 className="font-semibold">Información de Contacto</h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{business.faculty}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <span>{business.phone}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <span>{business.email}</span>
                  </div>

                  {business.instagram && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Instagram className="h-5 w-5 text-primary" />
                      </div>
                      <a
                        href={`https://instagram.com/${business.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {business.instagram}
                      </a>
                    </div>
                  )}
                </div>

                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handleContact}
                >
                  <MessageCircle className="h-5 w-5" />
                  Contactar por WhatsApp
                </Button>
              </div>

              {/* Owner Info */}
              <div className="bg-muted/30 rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-2">Propietario</p>
                <p className="font-semibold">{business.owner}</p>
                <p className="text-sm text-muted-foreground mt-1">{business.faculty}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BusinessDetail;
