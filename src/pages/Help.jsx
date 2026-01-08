import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Search,
  HelpCircle,
  ShoppingBag,
  Store,
  CreditCard,
  MessageCircle,
  Book,
  ArrowRight,
} from 'lucide-react';

const faqs = [
  {
    category: 'Compradores',
    icon: ShoppingBag,
    questions: [
      {
        q: '¿Cómo realizo un pedido?',
        a: 'Para realizar un pedido, navega por el catálogo, agrega productos al carrito y procede al checkout. Puedes pagar con PayPal o coordinar pago en efectivo con el emprendedor.',
      },
      {
        q: '¿Cómo me comunico con un emprendedor?',
        a: 'Puedes contactar directamente a los emprendedores a través del botón de WhatsApp disponible en cada producto y perfil de negocio.',
      },
      {
        q: '¿Dónde recojo mi pedido?',
        a: 'Los puntos de entrega se coordinan directamente con cada emprendedor. Generalmente son dentro del campus universitario.',
      },
      {
        q: '¿Puedo cancelar un pedido?',
        a: 'Contacta directamente al emprendedor lo antes posible para solicitar la cancelación. Las políticas pueden variar según el negocio.',
      },
    ],
  },
  {
    category: 'Emprendedores',
    icon: Store,
    questions: [
      {
        q: '¿Cómo registro mi negocio?',
        a: 'Haz clic en "Registrar Negocio" y completa el formulario con la información de tu emprendimiento. Necesitarás un correo institucional de la Universidad de Guayaquil.',
      },
      {
        q: '¿Cuánto cuesta publicar productos?',
        a: 'La plataforma es completamente gratuita para estudiantes de la Universidad de Guayaquil. No cobramos comisiones por ventas.',
      },
      {
        q: '¿Cómo agrego productos?',
        a: 'Desde tu panel de control, ve a la sección "Productos" y haz clic en "Agregar Producto". Completa la información y sube fotos atractivas.',
      },
      {
        q: '¿Cómo recibo los pagos?',
        a: 'Puedes recibir pagos a través de PayPal o coordinar pago en efectivo con tus clientes. Tú gestionas directamente tus finanzas.',
      },
    ],
  },
  {
    category: 'Pagos',
    icon: CreditCard,
    questions: [
      {
        q: '¿Es seguro pagar con PayPal?',
        a: 'Sí, PayPal es una pasarela de pago segura y reconocida mundialmente. Tus datos financieros están protegidos.',
      },
      {
        q: '¿Puedo pagar en efectivo?',
        a: 'Sí, muchos emprendedores aceptan pago en efectivo al momento de la entrega. Coordina directamente con el vendedor.',
      },
      {
        q: '¿Cómo solicito un reembolso?',
        a: 'Contacta directamente al emprendedor para resolver cualquier problema. Si pagaste con PayPal, puedes abrir una disputa desde tu cuenta.',
      },
    ],
  },
];

const guides = [
  {
    title: 'Guía para Compradores',
    description: 'Aprende a navegar la plataforma y realizar compras',
    icon: ShoppingBag,
    hash: '#faq-compradores',
  },
  {
    title: 'Guía para Emprendedores',
    description: 'Todo lo que necesitas para gestionar tu negocio',
    icon: Store,
    hash: '#faq-emprendedores',
  },
  {
    title: 'Guía de Pagos',
    description: 'Información sobre métodos de pago disponibles',
    icon: CreditCard,
    hash: '#faq-pagos',
  },
  {
    title: 'Políticas de la Plataforma',
    description: 'Términos de uso y políticas de la comunidad',
    icon: Book,
    hash: '#politicas',
  },
];

const Help = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const getHeaderOffset = useCallback(() => {
    const header = document.querySelector('header');
    const headerHeight = header?.getBoundingClientRect().height ?? 64;
    return Math.round(headerHeight + 12);
  }, []);

  const scrollToHash = useCallback(
    (hash, { behavior = 'smooth', tries = 10 } = {}) => {
      if (!hash || typeof document === 'undefined') return;

      const id = hash.startsWith('#') ? hash.slice(1) : hash;

      const attempt = (remaining) => {
        const el = document.getElementById(id);

        if (!el) {
          if (remaining <= 0) return;
          window.setTimeout(() => attempt(remaining - 1), 50);
          return;
        }

        const offset = getHeaderOffset();
        const elTop = el.getBoundingClientRect().top + window.scrollY;
        const targetTop = Math.max(0, Math.round(elTop - offset));
        window.scrollTo({ top: targetTop, behavior });
      };

      attempt(tries);
    },
    [getHeaderOffset],
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!location.hash) return;
    const t = window.setTimeout(() => scrollToHash(location.hash), 0);
    return () => window.clearTimeout(t);
  }, [location.hash, scrollToHash]);

  const onGuideClick = (hash) => {
    navigate({ pathname: '/help', hash });
    if (location.pathname === '/help') {
      scrollToHash(hash);
    }
  };

  const filteredFaqs = useMemo(() => {
    return faqs
      .map((category) => ({
        ...category,
        questions: category.questions.filter(
          (q) =>
            q.q.toLowerCase().includes(search.toLowerCase()) ||
            q.a.toLowerCase().includes(search.toLowerCase()),
        ),
      }))
      .filter((category) => category.questions.length > 0);
  }, [search]);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-primary py-16 text-white">
          <div className="container text-center">
            <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="h-8 w-8" />
            </div>
            <h1 className="font-display text-4xl font-bold mb-4">
              Centro de Ayuda
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              ¿Tienes preguntas? Aquí encontrarás respuestas y guías para aprovechar al máximo la plataforma.
            </p>

            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar en las preguntas frecuentes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-12 bg-white text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="container py-12">
          <h2 className="font-display text-2xl font-bold mb-6">Guías Rápidas</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {guides.map((guide, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onGuideClick(guide.hash)}
                className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all text-left group"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <guide.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{guide.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="container pb-16">
          <h2 id="preguntas-frecuentes" className="font-display text-2xl font-bold mb-6">Preguntas Frecuentes</h2>
          
          <div className="space-y-8">
            {filteredFaqs.map((category, index) => (
              <div
                key={index}
                id={
                  category.category === 'Compradores'
                    ? 'faq-compradores'
                    : category.category === 'Emprendedores'
                      ? 'faq-emprendedores'
                      : category.category === 'Pagos'
                        ? 'faq-pagos'
                        : undefined
                }
                className="bg-card rounded-xl border border-border p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold">{category.category}</h3>
                </div>

                <Accordion type="single" collapsible className="space-y-2">
                  {category.questions.map((item, qIndex) => (
                    <AccordionItem key={qIndex} value={`${index}-${qIndex}`} className="border-none">
                      <AccordionTrigger className="hover:no-underline py-3 px-4 rounded-lg hover:bg-muted/50 text-left">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-3 text-muted-foreground">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12 bg-muted/30 rounded-xl">
              <p className="text-muted-foreground">No se encontraron resultados para tu búsqueda</p>
            </div>
          )}
        </div>

        {/* Policies */}
        <div className="container pb-16">
          <div id="politicas" className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Book className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-display text-xl font-bold">Políticas de la Plataforma</h2>
            </div>
            <div className="text-muted-foreground space-y-2 text-sm text-left max-w-3xl">
              <p>
                Estas políticas resumen buenas prácticas para usar UG Emprende de forma segura y respetuosa.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Respeta a la comunidad: cero acoso, insultos o discriminación.</li>
                <li>Publica información real: precios, stock y descripciones claras.</li>
                <li>Coordina entregas y pagos con responsabilidad dentro del campus.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div id="contacto" className="bg-muted/30 py-16">
          <div className="container text-center">
            <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold mb-2">
              ¿No encontraste lo que buscabas?
            </h2>
            <p className="text-muted-foreground mb-6">
              Contáctanos y te ayudaremos lo más pronto posible
            </p>
            <Button asChild variant="hero" size="lg">
              <a href="mailto:ugemprende@ug.edu.ec">
                Contactar Soporte
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Help;
