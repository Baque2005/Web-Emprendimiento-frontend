import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout, Home, ShoppingBag, User, MessageSquare, BarChart3, Users, Store, LogOut, Plus, Trash2, Edit, Star, PieChart, Package, Menu } from 'lucide-react';
import { Button } from './components/Button.jsx';
import { Input } from './components/Input.jsx';
import { Card } from './components/Card.jsx';
import { ClientDashboard } from './pages/ClientDashboard.jsx';
import { AdminDashboard } from './pages/AdminDashboard.jsx';
import { EntrepreneurDashboard } from './pages/EntrepreneurDashboard.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { Catalog } from './pages/Catalog.jsx';
import { NotFound } from './pages/NotFound.jsx';
import ProductDetail from './pages/ProductDetail.jsx';

function Navbar({ role, user }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-100 z-50 px-4 sm:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}> 
        <div className="bg-indigo-600 p-1.5 rounded-lg">
          <Layout className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900" onClick={() => navigate('/')}>U-Emprende</span>
      </div>
      {/* Menú desktop */}
      <div className="hidden md:flex items-center gap-6">
        <span className="text-sm text-gray-500 hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/catalogo')}>Catálogo</span>
        {role === 'guest' ? (
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')}>Ingresar</Button>
            <Button onClick={() => navigate('/register')}>Unirse</Button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-900 leading-none">{user?.name || 'Usuario'}</span>
              <span className="text-xs text-gray-400 capitalize">{role}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm cursor-pointer" onClick={() => navigate(`/${role}/perfil`)}>
              {(user?.name || 'U').charAt(0)}
            </div>
            <button onClick={() => window.location.reload()} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      {/* Menú móvil */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setMenuOpen(v => !v)} className="p-2 text-gray-700 focus:outline-none">
          <Menu className="w-7 h-7" />
        </button>
        {menuOpen && (
          <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setMenuOpen(false)}></div>
        )}
        <div className={`fixed top-0 right-0 z-50 w-64 h-full bg-white shadow-lg border-l border-gray-100 transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100">
            <span className="text-xl font-bold tracking-tight text-gray-900">U-Emprende</span>
            <button onClick={() => setMenuOpen(false)} className="p-2 text-gray-400 hover:text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex flex-col gap-4 p-6">
            <button className="text-left text-gray-700 text-base font-medium hover:text-indigo-600" onClick={() => {navigate('/catalogo'); setMenuOpen(false);}}>Catálogo</button>
            {role === 'guest' ? (
              <>
                <Button variant="ghost" className="w-full justify-start" onClick={() => {navigate('/login'); setMenuOpen(false);}}>Ingresar</Button>
                <Button className="w-full justify-start" onClick={() => {navigate('/register'); setMenuOpen(false);}}>Unirse</Button>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-1 mb-2">
                  <span className="text-sm font-semibold text-gray-900 leading-none">{user?.name || 'Usuario'}</span>
                  <span className="text-xs text-gray-400 capitalize">{role}</span>
                </div>
                <Button className="w-full justify-start" onClick={() => {navigate(`/${role}/perfil`); setMenuOpen(false);}}>Perfil</Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => {window.location.reload(); setMenuOpen(false);}}>Cerrar sesión</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function Sidebar({ role }) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const adminLinks = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: BarChart3 },
    { label: 'Usuarios', path: '/admin/usuarios', icon: Users },
    { label: 'Emprendimientos', path: '/admin/emprendimientos', icon: Store },
    { label: 'Reportes', path: '/admin/reportes', icon: PieChart },
  ];
  const entrepreneurLinks = [
    { label: 'Resumen', path: '/emprendedor/dashboard', icon: BarChart3 },
    { label: 'Mi Negocio', path: '/emprendedor/mi-negocio', icon: Store },
    { label: 'Productos', path: '/emprendedor/productos', icon: Package },
    { label: 'Pedidos', path: '/emprendedor/pedidos', icon: ShoppingBag },
    { label: 'Mensajes', path: '/emprendedor/chat', icon: MessageSquare },
  ];
  const clientLinks = [
    { label: 'Panel Control', path: '/cliente/dashboard', icon: Home },
    { label: 'Mis Pedidos', path: '/cliente/pedidos', icon: ShoppingBag },
    { label: 'Chats', path: '/cliente/chat', icon: MessageSquare },
    { label: 'Perfil', path: '/cliente/perfil', icon: User },
  ];
  const links = role === 'admin' ? adminLinks : role === 'emprendedor' ? entrepreneurLinks : clientLinks;

  // Sidebar visible en desktop, drawer en móvil
  return (
    <>
      {/* Botón menú móvil */}
      <button className="md:hidden fixed top-20 left-4 z-40 bg-indigo-600 text-white p-2 rounded-lg shadow-lg" onClick={() => setOpen(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      {/* Sidebar desktop */}
      <div className="hidden md:block w-64 bg-gray-50 border-r border-gray-200 h-[calc(100vh-64px)] fixed left-0 p-4 overflow-y-auto">
        <div className="space-y-1">
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all`}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </button>
          ))}
        </div>
      </div>
      {/* Drawer móvil */}
      {open && <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setOpen(false)}></div>}
      <div className={`fixed top-0 left-0 z-50 w-64 h-full bg-white shadow-lg border-r border-gray-100 transform transition-transform duration-300 md:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100">
          <span className="text-xl font-bold tracking-tight text-gray-900">Menú</span>
          <button onClick={() => setOpen(false)} className="p-2 text-gray-400 hover:text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="space-y-1 p-4">
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => {navigate(link.path); setOpen(false);}}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all`}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default function App() {
  const [role, setRole] = useState('guest');
  const [user, setUser] = useState({ name: 'Carlos Ruiz', email: 'carlos.ruiz@u.edu' });
  const location = useLocation();

  // Animación de página
  const pageTransition = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.35, ease: 'easeInOut' }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col overflow-y-auto">
      <Navbar role={role} user={user} />
      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} {...pageTransition} className="flex-1 flex flex-col w-full">
          <Routes location={location}>
            <Route path="/" element={<>
              <div className="pt-16 w-full"><LandingPage /></div>
              <footer className="bg-gray-900 text-white py-20 px-4 sm:px-6 w-full">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-indigo-600 p-1.5 rounded-lg">
                        <Layout className="text-white w-6 h-6" />
                      </div>
                      <span className="text-xl font-bold">U-Emprende</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">Fomentando la cultura emprendedora desde el campus universitario hacia el mundo real.</p>
                  </div>
                  <div>
                    <h4 className="font-bold mb-4">Plataforma</h4>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li className="hover:text-white cursor-pointer transition-colors"><Link to="/catalogo">Catálogo</Link></li>
                      <li>Emprendedores</li>
                      <li>Historias de éxito</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-4">Soporte</h4>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li>Preguntas frecuentes</li>
                      <li>Términos y condiciones</li>
                      <li>Políticas de privacidad</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-4">Contacto</h4>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li>soporte@uemprende.edu</li>
                      <li>Campus Principal, Edificio de Bienestar</li>
                    </ul>
                  </div>
                </div>
                <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-gray-800 text-center text-gray-500 text-xs">
                  © 2023 Proyecto Académico U-Emprende. Todos los derechos reservados.
                </div>
              </footer>
            </>} />
            <Route path="/catalogo" element={<div className="pt-16 w-full"><Catalog /></div>} />
            <Route path="/login" element={<div className="pt-16 w-full"><AuthPage type="login" setRole={setRole} setUser={setUser} /></div>} />
            <Route path="/register" element={<div className="pt-16 w-full"><AuthPage type="register" setRole={setRole} setUser={setUser} /></div>} />
            <Route path="/producto/:id" element={<div className="pt-16 p-4 sm:p-8 w-full"><ProductDetail /></div>} />
            {/* Dashboards y rutas protegidas */}
            <Route path="/cliente/dashboard" element={<div className="flex flex-col md:flex-row min-h-screen pt-16 w-full"><Sidebar role={role} /><main className="md:ml-64 flex-1 p-4 sm:p-8 bg-white"><div className="max-w-6xl mx-auto w-full"><ClientDashboard /></div></main></div>} />
            <Route path="/admin/dashboard" element={<div className="flex flex-col md:flex-row min-h-screen pt-16 w-full"><Sidebar role={role} /><main className="md:ml-64 flex-1 p-4 sm:p-8 bg-white"><div className="max-w-6xl mx-auto w-full"><AdminDashboard /></div></main></div>} />
            <Route path="/emprendedor/dashboard" element={<div className="flex flex-col md:flex-row min-h-screen pt-16 w-full"><Sidebar role={role} /><main className="md:ml-64 flex-1 p-4 sm:p-8 bg-white"><div className="max-w-6xl mx-auto w-full"><EntrepreneurDashboard /></div></main></div>} />
            {/* Puedes agregar más rutas aquí */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
