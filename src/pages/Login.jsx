import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import VantaHaloBackground from '@/components/ui/VantaHaloBackground';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Cambia la firma de la función para que sea válida en .jsx (sin tipos)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock login - check for demo accounts
    if (formData.email === 'emprendedor@ug.edu.ec') {
      setUser({
        id: 'u1',
        name: 'María García',
        email: formData.email,
        role: 'entrepreneur',
        businessId: 'b1',
      });
      toast.success('¡Bienvenida, María!');
      navigate('/dashboard');
    } else if (formData.email === 'admin@ug.edu.ec') {
      setUser({
        id: 'admin',
        name: 'Administrador',
        email: formData.email,
        role: 'admin',
      });
      toast.success('¡Bienvenido, Administrador!');
      navigate('/admin');
    } else {
      setUser({
        id: `u${Date.now()}`,
        name: formData.email.split('@')[0],
        email: formData.email,
        role: 'customer',
      });
      toast.success('¡Bienvenido!');
      navigate('/');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-slide-up">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span>
              <span className="text-primary">UG</span>
              <span className="text-accent"> Emprende</span>
            </span>
          </Link>

          <div>
            <h1 className="font-display text-3xl font-bold">Iniciar Sesión</h1>
            <p className="text-muted-foreground mt-2">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="tu@ug.edu.ec"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-input" />
                <span className="text-muted-foreground">Recordarme</span>
              </label>
              <Link to="/forgot-password" className="text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ingresando...
                </>
              ) : (
                <>
                  Ingresar
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Regístrate
            </Link>
          </p>

          {/* Demo accounts */}
          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <p className="text-sm font-medium">Cuentas de prueba:</p>
            <p className="text-xs text-muted-foreground">Emprendedor: emprendedor@ug.edu.ec</p>
            <p className="text-xs text-muted-foreground">Admin: admin@ug.edu.ec</p>
            <p className="text-xs text-muted-foreground">(Cualquier contraseña)</p>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex relative flex-1 overflow-hidden bg-gradient-primary items-center justify-center p-12">
        <VantaHaloBackground className="opacity-80" />

        <div className="relative max-w-md text-center text-white">
          <h2 className="font-display text-4xl font-bold mb-4">
            Conecta con el emprendimiento universitario
          </h2>
          <p className="text-white/80 text-lg">
            Únete a la comunidad de emprendedores de la Universidad de Guayaquil 
            y descubre productos únicos creados por estudiantes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;