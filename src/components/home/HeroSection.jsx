import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Store, Users } from 'lucide-react';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 lg:py-32">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse-slow" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm">
              <Sparkles className="h-4 w-4" />
              Plataforma Universitaria de Emprendimiento
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Impulsa tu{' '}
              <span className="text-gradient">emprendimiento</span>{' '}
              universitario
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg">
              Conectamos a estudiantes emprendedores de la Universidad de Guayaquil 
              con toda la comunidad universitaria. Registra tu negocio, muestra tus 
              productos y crece junto a nosotros.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                variant="hero"
                size="xl"
                onClick={() => navigate('/catalog')}
              >
                Explorar Catálogo
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={() => navigate('/register')}
              >
                Registrar Negocio
                <Store className="h-5 w-5" />
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div className="text-center">
                <p className="text-3xl font-display font-bold text-primary">50+</p>
                <p className="text-sm text-muted-foreground">Negocios</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-display font-bold text-primary">200+</p>
                <p className="text-sm text-muted-foreground">Productos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-display font-bold text-primary">1000+</p>
                <p className="text-sm text-muted-foreground">Usuarios</p>
              </div>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative hidden lg:block animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=500&fit=crop"
                alt="Estudiantes emprendedores"
                className="rounded-2xl shadow-xl"
              />
              
              {/* Floating cards */}
              <div className="absolute -left-8 top-1/4 bg-card p-4 rounded-xl shadow-lg animate-float">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                    <Store className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Nuevo Negocio</p>
                    <p className="text-xs text-muted-foreground">+15 esta semana</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-8 bottom-1/4 bg-card p-4 rounded-xl shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Comunidad</p>
                    <p className="text-xs text-muted-foreground">+50 nuevos hoy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
