import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight, AlertTriangle } from 'lucide-react';
import VantaHaloBackground from '@/components/ui/VantaHaloBackground';

const Login = () => {
  const navigate = useNavigate();
  const { setUser, upsertUser } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageError, setPageError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const normalizeEmail = (rawEmail) => {
    const base = (rawEmail ?? '')
      .toString()
      .normalize('NFKC')
      .replace(/[\u200B-\u200D\u2060\uFEFF]/g, '') // caracteres invisibles
      .replace(/\s+/g, '')
      .trim();

    return base
      .replace(/＠/g, '@')
      .replace(/[。．｡]/g, '.')
      .toLowerCase();
  };

  const isLikelyEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const getErrorMessage = (error) => {
    if (!error) return 'Ocurrió un error inesperado.';
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    try {
      return JSON.stringify(error);
    } catch {
      return 'Ocurrió un error inesperado.';
    }
  };

  // Cambia la firma de la función para que sea válida en .jsx (sin tipos)
  const handleSubmit = async (e) => {
    e.preventDefault();

    setPageError(null);

    const normalizedEmail = normalizeEmail(formData.email);
    const emailChangedBySanitizer = normalizedEmail !== (formData.email ?? '').toString().trim().toLowerCase();
    
    if (!normalizedEmail || !formData.password) {
      const description = 'Por favor completa el correo y la contraseña.';
      setPageError({ title: 'Faltan datos', description });
      toast.error(description);
      return;
    }

    if (!isLikelyEmail(normalizedEmail)) {
      const description = 'El correo no parece válido. Si tienes el traductor automático activo, puede estar insertando caracteres invisibles: reescribe el correo o desactiva la traducción en esta página.';
      setPageError({ title: 'Correo inválido', description });
      toast.error('Correo inválido', { description });
      return;
    }

    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock login - check for demo accounts
      if (normalizedEmail === 'emprendedor@ug.edu.ec') {
        const nextUser = {
          id: 'u1',
          name: 'María García',
          email: normalizedEmail,
          role: 'entrepreneur',
          businessId: 'b1',
        };
        setUser(nextUser);
        upsertUser(nextUser);
        toast.success('¡Bienvenida, María!');
        navigate('/dashboard');
        return;
      }

      if (normalizedEmail === 'admin@ug.edu.ec') {
        const nextUser = {
          id: 'admin',
          name: 'Administrador',
          email: normalizedEmail,
          role: 'admin',
        };
        setUser(nextUser);
        upsertUser(nextUser);
        toast.success('¡Bienvenido, Administrador!');
        navigate('/admin');
        return;
      }

      const nextUser = {
        id: `u${Date.now()}`,
        name: normalizedEmail.split('@')[0],
        email: normalizedEmail,
        role: 'customer',
      };
      setUser(nextUser);
      upsertUser(nextUser);
      toast.success('¡Bienvenido!');
      navigate('/');
    } catch (error) {
      let description = getErrorMessage(error);
      if (emailChangedBySanitizer) {
        description = `${description}\n\nTip: Detecté caracteres/espacios raros en el correo (a veces pasa por el traductor automático). Reescribe el correo manualmente o desactiva la traducción.`;
      }
      setPageError({
        title: 'No se pudo iniciar sesión',
        description,
      });
      toast.error('No se pudo iniciar sesión', { description });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex notranslate" translate="no">
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
            {pageError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <div>
                  <AlertTitle>{pageError.title}</AlertTitle>
                  <AlertDescription>
                    <p>{pageError.description}</p>
                  </AlertDescription>
                </div>
              </Alert>
            )}
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
                  className="pl-10 notranslate"
                  translate="no"
                  autoComplete="email"
                  inputMode="email"
                  spellCheck={false}
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