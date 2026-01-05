import React from 'react';
import { Card } from '../components/Card.jsx';
import { Store } from 'lucide-react';
import { Button } from '../components/Button.jsx';

export const AdminDashboard = () => (
  <div className="space-y-8">
    <h2 className="text-2xl font-bold text-gray-900">Panel de Administración Global</h2>
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-0">
        <p className="text-indigo-100 text-sm font-medium">Total Emprendimientos</p>
        <div className="flex items-end gap-2 mt-2">
          <h3 className="text-4xl font-extrabold tracking-tighter">124</h3>
          <span className="text-sm text-indigo-200 mb-1">+5 esta semana</span>
        </div>
      </Card>
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border-0">
        <p className="text-slate-300 text-sm font-medium">Usuarios Registrados</p>
        <div className="flex items-end gap-2 mt-2">
          <h3 className="text-4xl font-extrabold tracking-tighter">2,450</h3>
          <span className="text-sm text-slate-400 mb-1">+12 hoy</span>
        </div>
      </Card>
      <Card className="bg-gradient-to-br from-teal-600 to-teal-700 text-white border-0">
        <p className="text-teal-100 text-sm font-medium">Volumen Transacciones</p>
        <div className="flex items-end gap-2 mt-2">
          <h3 className="text-4xl font-extrabold tracking-tighter">$45k</h3>
          <span className="text-sm text-teal-200 mb-1">↑ 8% este mes</span>
        </div>
      </Card>
    </div>
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-gray-900">Nuevas Solicitudes de Emprendimiento</h3>
        <Button variant="secondary" className="text-xs">Ver todas</Button>
      </div>
      <div className="divide-y divide-gray-50">
        {[
          { name: "EcoModa Uni", owner: "Laura Gil", date: "2 horas", status: "Pendiente" },
          { name: "CoffeeStudy", owner: "Mario Paz", date: "5 horas", status: "Pendiente" },
          { name: "BioTools", owner: "Elena Rius", date: "1 día", status: "Pendiente" }
        ].map((req, i) => (
          <div key={i} className="py-4 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{req.name}</h4>
                <p className="text-xs text-gray-500">Postulado por: {req.owner} • {req.date}</p>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="secondary" className="px-3 py-1 text-xs">Rechazar</Button>
              <Button className="px-3 py-1 text-xs">Aprobar</Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);
