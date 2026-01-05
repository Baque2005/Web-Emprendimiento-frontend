import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
const MOCK_PRODUCTS = [
  { id: 1, name: "Eco-Cuaderno Universitario", price: 12.50, category: "Papelería", rating: 4.8, img: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400" },
  { id: 2, name: "Termo Acero Inoxidable", price: 25.00, category: "Accesorios", rating: 4.5, img: "https://images.unsplash.com/photo-1517254456976-ee8682099819?w=400" },
  { id: 3, name: "Mochila Ergonómica", price: 45.00, category: "Textil", rating: 4.9, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400" },
  { id: 4, name: "Lámpara de Escritorio LED", price: 18.99, category: "Tecnología", rating: 4.2, img: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=400" },
];

const categories = [
  "Todos",
  "Papelería",
  "Accesorios",
  "Textil",
  "Tecnología",
  "Hogar",
  "Belleza",
  "Deportes",
  "Alimentos",
  "Juguetes",
  "Arte",
  "Salud",
  "Electrodomésticos",
  "Mascotas",
  "Libros",
  "Ropa",
  "Calzado",
  "Jardinería"
];

export const Catalog = () => {
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const matchesCategory = filter === "Todos" ? true : p.category === filter;
    const matchesName = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesName;
  });

  // Cerrar el menú si se hace clic fuera
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="px-2 sm:px-4 md:px-8 py-6 max-w-7xl mx-auto space-y-8 w-full">
      <div className="flex flex-col gap-6 md:gap-8 w-full">
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center md:text-left">Catálogo de Productos</h2>
          <p className="text-gray-500 text-center md:text-left">Apoya el emprendimiento local universitario</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full items-center justify-between">
          {/* Dropdown de categorías */}
          <div className="relative w-full md:w-auto flex-shrink-0" ref={dropdownRef}>
            <button
              type="button"
              className="w-full md:w-56 flex items-center justify-between px-5 py-2 rounded-lg border-2 border-indigo-500 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              onClick={() => setOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={open}
            >
              <span className="truncate">{filter}</span>
              <svg className={`w-5 h-5 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {open && (
              <ul className="absolute z-20 mt-2 w-full md:w-56 max-h-64 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg animate-fade-in">
                {categories.map(cat => (
                  <li
                    key={cat}
                    className={`px-5 py-2 cursor-pointer text-base transition-colors ${
                      filter === cat ? 'bg-indigo-600 text-white font-semibold' : 'hover:bg-indigo-50 text-gray-700'
                    }`}
                    onClick={() => {
                      setFilter(cat);
                      setOpen(false);
                    }}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Buscador */}
          <div className="w-full md:w-72 flex-shrink-0">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-base"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="group cursor-pointer" onClick={() => navigate(`/producto/${product.id}`)}>
            <div className="bg-gray-200 rounded-2xl overflow-hidden aspect-square mb-3 relative">
              <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {product.rating}
              </div>
            </div>
            <h3 className="font-bold text-gray-900 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{product.category}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-extrabold text-indigo-700">${product.price.toFixed(2)}</span>
              {/* Puedes agregar botón de compra aquí */}
            </div>
          </div>
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div className="text-center text-gray-500 py-12 text-lg">No se encontraron productos.</div>
      )}
    </div>
  );
}
