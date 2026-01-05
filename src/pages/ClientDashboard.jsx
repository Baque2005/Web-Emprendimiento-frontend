import React from 'react';
import { Card } from '../components/Card.jsx';
import { ShoppingBag, Star, Package, Users } from 'lucide-react';

const MOCK_ORDERS = [
  { id: "ORD-001", product: "Eco-Cuaderno", status: "Entregado", date: "2023-10-25", total: 12.50, customer: "Carlos Ruiz" },
  { id: "ORD-002", product: "Mochila Ergonómica", status: "Pendiente", date: "2023-10-27", total: 45.00, customer: "María López" },
];

export const ClientDashboard = () => (
  <div className="space-y-8">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <h2 className="text-2xl font-bold text-gray-900 text-center sm:text-left">Bienvenido de nuevo, Carlos</h2>
      <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium">
        <Star className="w-4 h-4 fill-indigo-700" />
        <span>Nivel Oro</span>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <Card className="border-l-4 border-l-indigo-600">
        <p className="text-gray-500 text-sm font-medium">Pedidos Activos</p>
        <h3 className="text-3xl font-bold mt-1">02</h3>
      </Card>
      <Card className="border-l-4 border-l-green-600">
        <p className="text-gray-500 text-sm font-medium">Favoritos</p>
        <h3 className="text-3xl font-bold mt-1">12</h3>
      </Card>
      <Card className="border-l-4 border-l-orange-600">
        <p className="text-gray-500 text-sm font-medium">Mensajes Nuevos</p>
        <h3 className="text-3xl font-bold mt-1">03</h3>
      </Card>
    </div>
    <Card>
      <h3 className="text-lg font-bold mb-4">Última Actividad</h3>
      <div className="space-y-4">
        {MOCK_ORDERS.map(order => (
          <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b last:border-0 gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg"><Package className="w-5 h-5 text-gray-600" /></div>
              <div>
                <p className="font-semibold text-gray-900">{order.product}</p>
                <p className="text-xs text-gray-500">{order.id} • {order.date}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              order.status === 'Entregado' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
            }`}>
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </Card>
  </div>
);
