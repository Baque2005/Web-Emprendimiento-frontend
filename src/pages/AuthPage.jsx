import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';
import { Card } from '../components/Card.jsx';

export const AuthPage = ({ type, setRole, setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'cliente' });

  const handleAuth = (e) => {
    e.preventDefault();
    setUser({ name: formData.name || 'Usuario Demo', email: formData.email });
    setRole(formData.role);
    navigate(`/${formData.role}/dashboard`);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-gray-50">
      <Card className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">{type === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}</h2>
          <p className="text-gray-500">{type === 'login' ? 'Ingresa tus credenciales para continuar' : 'Únete a la mayor red de emprendedores'}</p>
        </div>
        <form className="space-y-4" onSubmit={handleAuth}>
          {type === 'register' && (
            <Input label="Nombre Completo" placeholder="Ej. Ana Pérez" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          )}
          <Input label="Email" type="email" placeholder="usuario@universidad.edu" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <Input label="Contraseña" type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          {type === 'register' && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Tipo de Cuenta</label>
              <select
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
              >
                <option value="cliente">Soy Cliente / Estudiante</option>
                <option value="emprendedor">Soy Emprendedor</option>
                <option value="admin">Administrador (Demo)</option>
              </select>
            </div>
          )}
          <Button type="submit" className="w-full py-3">{type === 'login' ? 'Ingresar' : 'Registrarse'}</Button>
        </form>
        <p className="text-center text-sm text-gray-500">
          {type === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          <button className="text-indigo-600 font-bold ml-1" type="button" onClick={() => navigate(type === 'login' ? '/register' : '/login')}>
            {type === 'login' ? 'Regístrate' : 'Ingresa'}
          </button>
        </p>
      </Card>
    </div>
  );
};
