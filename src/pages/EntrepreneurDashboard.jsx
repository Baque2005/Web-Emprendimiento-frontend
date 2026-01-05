import React from 'react';
import { Card } from '../components/Card.jsx';
import { BarChart3, ShoppingBag, Users, Star, MessageSquare, Edit, Trash2 } from 'lucide-react';
import Button from '../components/Button.jsx';

const MOCK_MESSAGES = [
  { id: 1, from: "EcoEstudio", lastMsg: "¿Hola, cómo puedo ayudarte con tu pedido?", time: "10:30 AM", unread: true },
  { id: 2, from: "TechPoint", lastMsg: "Tu pedido ha sido despachado.", time: "Ayer", unread: false }
];

export const EntrepreneurDashboard = () => (
  <div className="space-y-8">
    <h2 className="text-2xl font-bold text-gray-900">Resumen de Ventas</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      <Card>
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Ventas Mes</p>
          <BarChart3 className="w-4 h-4 text-indigo-600" />
        </div>
        <h3 className="text-2xl font-bold">$1,240.00</h3>
        <p className="text-xs text-green-600 font-medium mt-1">↑ 12% vs mes anterior</p>
      </Card>
      <Card>
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Pedidos Hoy</p>
          <ShoppingBag className="w-4 h-4 text-orange-600" />
        </div>
        <h3 className="text-2xl font-bold">08</h3>
        <p className="text-xs text-gray-400 font-medium mt-1">3 pendientes de envío</p>
      </Card>
      <Card>
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Visitas</p>
          <Users className="w-4 h-4 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold">452</h3>
        <p className="text-xs text-green-600 font-medium mt-1">↑ 5% hoy</p>
      </Card>
      <Card>
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Feedback</p>
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        </div>
        <h3 className="text-2xl font-bold">4.8/5</h3>
        <p className="text-xs text-gray-400 font-medium mt-1">24 nuevas reseñas</p>
      </Card>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <h3 className="font-bold text-lg text-gray-900">Gestión de Pedidos</h3>
          <Button variant="ghost" className="text-xs">Ver todos</Button>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[400px]">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="pb-3">Pedido</th>
                <th className="pb-3">Cliente</th>
                <th className="pb-3">Estado</th>
                <th className="pb-3 text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[1, 2, 3].map(i => (
                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-medium text-gray-900">#ORD-90{i}</td>
                  <td className="py-4 text-gray-600">Estudiante {i}</td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${i === 2 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                      {i === 2 ? 'EN PROCESO' : 'LISTO'}
                    </span>
                  </td>
                  <td className="py-4 text-right font-bold text-gray-900">$24.00</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card>
        <h3 className="font-bold text-lg text-gray-900 mb-6">Mensajes Recientes</h3>
        <div className="space-y-4">
          {MOCK_MESSAGES.map(msg => (
            <div key={msg.id} className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer border border-transparent hover:border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-700">
                {msg.from.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-gray-900 truncate">{msg.from}</span>
                  <span className="text-[10px] text-gray-400 uppercase">{msg.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{msg.lastMsg}</p>
              </div>
              {msg.unread && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full mt-2"></div>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);
