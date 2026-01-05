import React from 'react';

export const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center">
    <h1 className="text-6xl font-extrabold text-indigo-600 mb-4">404</h1>
    <h2 className="text-2xl font-bold mb-2">Página no encontrada</h2>
    <p className="text-gray-500 mb-6">La ruta que buscas no existe o ha sido movida.</p>
    <a href="/" className="text-indigo-600 font-bold hover:underline">Volver al inicio</a>
  </div>
);
