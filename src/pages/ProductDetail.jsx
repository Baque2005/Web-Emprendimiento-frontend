import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, ShoppingBag, MessageSquare } from 'lucide-react';
import Button from '../components/Button.jsx';

// Simulación de productos (debería venir de un contexto o API real)
const MOCK_PRODUCTS = [
  { id: 1, name: "Eco-Cuaderno Universitario", price: 12.50, category: "Papelería", rating: 4.8, img: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400", description: "Cuaderno ecológico hecho con materiales reciclados. Ideal para estudiantes comprometidos con el medio ambiente.", stock: 20, business: { name: "EcoEstudio", owner: "Ana Pérez", location: "Campus Central, Edificio B", contact: "0991234567", email: "ecoestudio@ug.edu.ec" } },
  { id: 2, name: "Termo Acero Inoxidable", price: 25.00, category: "Accesorios", rating: 4.5, img: "https://images.unsplash.com/photo-1517254456976-ee8682099819?w=400", description: "Termo resistente, mantiene tus bebidas frías o calientes por horas.", stock: 10, business: { name: "TechPoint", owner: "Luis Gómez", location: "Campus Norte, Edificio C", contact: "0987654321", email: "techpoint@ug.edu.ec" } },
  { id: 3, name: "Mochila Ergonómica", price: 45.00, category: "Textil", rating: 4.9, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", description: "Mochila cómoda y resistente, perfecta para llevar tus libros y laptop.", stock: 5, business: { name: "UniBags", owner: "María López", location: "Campus Sur, Edificio D", contact: "0976543210", email: "unibags@ug.edu.ec" } },
  { id: 4, name: "Lámpara de Escritorio LED", price: 18.99, category: "Tecnología", rating: 4.2, img: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=400", description: "Lámpara LED con luz regulable, ideal para estudiar de noche.", stock: 12, business: { name: "LuzEstudio", owner: "Carlos Ruiz", location: "Campus Central, Edificio A", contact: "0965432109", email: "luzestudio@ug.edu.ec" } },
];

export const ProductDetail = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const product = MOCK_PRODUCTS.find(p => p.id === Number(id));
  const [userRating, setUserRating] = useState(0);
  const [ratingSent, setRatingSent] = useState(false);

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
        <Button onClick={() => navigate('/catalogo')}>Volver al catálogo</Button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-6rem)] flex items-center justify-center py-8 md:py-0">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-4 sm:p-8 md:p-12 flex flex-col md:flex-row gap-10 animate-fade-in border border-gray-100">
        <div className="flex-1 flex flex-col gap-4 items-center md:items-start">
          <button className="flex items-center gap-2 text-indigo-600 font-semibold mb-2 hover:underline self-start" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" /> Volver
          </button>
          <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-square w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
            <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-6 justify-center">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-lg font-extrabold text-indigo-700">${product.price.toFixed(2)}</span>
              <span className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                <Star className="w-4 h-4 fill-yellow-500" /> {product.rating}
              </span>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">{product.category}</span>
            </div>
            <p className="text-gray-600 text-base mb-2 max-w-xl">{product.description}</p>
            <div className="flex items-center gap-4 text-sm mb-2">
              <span className={product.stock > 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                {product.stock > 0 ? `En stock: ${product.stock}` : 'Agotado'}
              </span>
            </div>
            {/* Sección de puntuación */}
            <div className="mt-2">
              <h3 className="font-semibold text-gray-800 mb-1">Tu puntuación:</h3>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    disabled={ratingSent}
                    className="focus:outline-none"
                  >
                    <Star className={`w-6 h-6 ${userRating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} transition-colors`} />
                  </button>
                ))}
                {!ratingSent ? (
                  <Button
                    className="ml-3 px-3 py-1 text-sm"
                    variant="primary"
                    onClick={() => userRating > 0 && setRatingSent(true)}
                    disabled={userRating === 0}
                  >Enviar</Button>
                ) : (
                  <span className="ml-3 text-green-600 font-semibold text-sm">¡Gracias por tu puntuación!</span>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-gray-900">Información del Negocio</h2>
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-1 border border-gray-100">
              <span className="font-semibold text-gray-800">{product.business.name}</span>
              <span className="text-gray-500 text-sm">Dueño: {product.business.owner}</span>
              <span className="text-gray-500 text-sm">Ubicación: {product.business.location}</span>
              <span className="text-gray-500 text-sm">Contacto: {product.business.contact}</span>
              <span className="text-gray-500 text-sm">Email: {product.business.email}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button className="flex-1 flex items-center justify-center gap-2 py-3 text-lg" variant="primary">
              <ShoppingBag className="w-5 h-5" /> Solicitar Pedido
            </Button>
            <Button className="flex-1 flex items-center justify-center gap-2 py-3 text-lg" variant="secondary">
              <MessageSquare className="w-5 h-5" /> Contactar Negocio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
