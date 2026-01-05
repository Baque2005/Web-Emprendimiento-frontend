import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button.jsx';
import { Card } from '../components/Card.jsx';
import { Store, Package, BarChart3, Layout } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-20 pb-20">
      <section className="relative pt-32 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Impulsando el <span className="text-indigo-600">Talento Universitario</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            La plataforma definitiva para que estudiantes emprendedores conecten con clientes, gestionen sus negocios y escalen su impacto académico y profesional.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="w-full sm:w-auto px-8 py-4 text-lg" onClick={() => navigate('/register')}>Empieza ahora</Button>
            <Button variant="secondary" className="w-full sm:w-auto px-8 py-4 text-lg" onClick={() => navigate('/catalogo')}>Ver Catálogo</Button>
          </div>
        </div>
      </section>
      <section className="px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {[
            { title: "Visibilidad Real", desc: "Muestra tus productos ante toda la comunidad universitaria y externa.", icon: Store },
            { title: "Gestión Inteligente", desc: "Herramientas de inventario y pedidos diseñadas para estudiantes.", icon: Package },
            { title: "Crecimiento Académico", desc: "Transforma tu proyecto de aula en un negocio funcional y escalable.", icon: BarChart3 }
          ].map((feat, i) => (
            <Card key={i} className="flex flex-col items-center gap-4 hover:border-indigo-200 transition-all cursor-default">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <feat.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{feat.title}</h3>
              <p className="text-gray-500">{feat.desc}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
