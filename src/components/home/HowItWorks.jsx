import { Search, ShoppingBag, MessageCircle, CreditCard } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Explora',
    description: 'Navega por el catálogo y descubre productos únicos de estudiantes emprendedores.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: ShoppingBag,
    title: 'Selecciona',
    description: 'Agrega productos a tu carrito y personaliza tu pedido según tus necesidades.',
    color: 'bg-accent/10 text-accent',
  },
  {
    icon: MessageCircle,
    title: 'Contacta',
    description: 'Comunícate directamente con el emprendedor para coordinar detalles.',
    color: 'bg-success/10 text-success',
  },
  {
    icon: CreditCard,
    title: 'Paga Seguro',
    description: 'Realiza tu pago de forma segura a través de PayPal o coordina pago en efectivo.',
    color: 'bg-warning/10 text-warning',
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold mb-4">
            ¿Cómo Funciona?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprar a emprendedores universitarios nunca fue tan fácil
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
              
              <div className="relative bg-card rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${step.color} mb-4`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;