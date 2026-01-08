import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Rocket, ArrowRight } from 'lucide-react';

export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 md:p-12 lg:p-16">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent/20 blur-3xl" />
          </div>

          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
                <Rocket className="h-4 w-4" />
                ¿Eres estudiante emprendedor?
              </div>

              <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
                Registra tu negocio y llega a miles de usuarios
              </h2>

              <p className="text-white/80 text-lg">
                Únete a la comunidad de emprendedores universitarios más grande de la 
                Universidad de Guayaquil. Es gratis y solo toma 5 minutos.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => navigate('/register')}
                >
                  Comenzar Ahora
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white hover:bg-white/10"
                  onClick={() => navigate('/help')}
                >
                  Más Información
                </Button>
              </div>
            </div>

            <div className="hidden lg:flex justify-end">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop"
                alt="Emprendedores trabajando"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
