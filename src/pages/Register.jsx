import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import { categories } from '@/data/mockData';
import { toast } from 'sonner';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Rocket,
  User,
  Store,
  Phone,
  AlertTriangle,
} from 'lucide-react';
import ShopShaderBackground from '@/components/ui/ShopShaderBackground';

const faculties = [
  'Facultad de Ciencias Administrativas',
  'Facultad de Ciencias Económicas',
  'Facultad de Ciencias Matemáticas y Físicas',
  'Facultad de Ciencias Médicas',
  'Facultad de Ciencias Naturales',
  'Facultad de Comunicación Social',
  'Facultad de Arquitectura y Urbanismo',
  'Facultad de Jurisprudencia',
  'Facultad de Ingeniería Industrial',
  'Facultad de Ingeniería Química',
  'Facultad de Filosofía, Letras y Ciencias de la Educación',
  'Facultad de Odontología',
  'Otra',
];

const Register = () => {
  const navigate = useNavigate();
  const { user, setUser, upsertUser, addBusiness } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageError, setPageError] = useState(null);
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    faculty: '',
    businessName: '',
    businessDescription: '',
    businessCategory: '',
    instagram: '',
  });

  const isUpgradeFlow = !!user && user.role === 'customer';

  const normalizeEmail = (rawEmail) => {
    const base = (rawEmail ?? '')
      .toString()
      .normalize('NFKC')
      .replace(/[\u200B-\u200D\u2060\uFEFF]/g, '')
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

  useEffect(() => {
    if (!user) return;

    if (user.role === 'admin') {
      navigate('/admin');
      return;
    }

    if (user.role === 'entrepreneur') {
      navigate('/dashboard');
      return;
    }

    if (user.role === 'customer') {
      setAccountType('entrepreneur');
      setStep(3);
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        password: '',
        phone: user.phone || '',
        faculty: user.faculty || '',
      }));
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setPageError(null);

    const normalizedEmail = normalizeEmail(formData.email);
    const emailChangedBySanitizer = normalizedEmail !== (formData.email ?? '').toString().trim().toLowerCase();
    
    if (!formData.name || !normalizedEmail || (!isUpgradeFlow && !formData.password)) {
      const description = 'Completa los campos requeridos para continuar.';
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

    if (accountType === 'entrepreneur' && (!formData.businessName || !formData.businessCategory)) {
      const description = 'Completa el nombre y la categoría del negocio.';
      setPageError({ title: 'Falta información del negocio', description });
      toast.error(description);
      return;
    }

    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const businessId = accountType === 'entrepreneur' ? `b${Date.now()}` : undefined;

      const nextUser = isUpgradeFlow
        ? {
            ...user,
            role: 'entrepreneur',
            businessId,
            name: formData.name,
            email: normalizedEmail,
            phone: formData.phone || '',
            faculty: formData.faculty || '',
          }
        : {
            id: `u${Date.now()}`,
            name: formData.name,
            email: normalizedEmail,
            role: accountType,
            businessId,
            phone: formData.phone || '',
            faculty: formData.faculty || '',
          };

      setUser(nextUser);
      upsertUser(nextUser);

      if (accountType === 'entrepreneur' && businessId) {
        addBusiness({
          id: businessId,
          name: formData.businessName,
          description: formData.businessDescription || 'Emprendimiento universitario',
          logo: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=200&h=200&fit=crop',
          banner: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=300&fit=crop',
          category: formData.businessCategory,
          owner: nextUser.name,
          faculty: nextUser.faculty || 'Universidad de Guayaquil',
          phone: nextUser.phone || '',
          email: nextUser.email,
          instagram: formData.instagram || '',
          rating: 0,
          totalSales: 0,
          joinedDate: new Date().toISOString().slice(0, 10),
        });
      }
      
      if (accountType === 'entrepreneur') {
        toast.success('¡Negocio registrado exitosamente!', {
          description: 'Ya puedes comenzar a agregar productos.',
        });
        navigate('/dashboard');
        return;
      }

      toast.success('¡Cuenta creada exitosamente!');
      navigate('/');
    } catch (error) {
      let description = getErrorMessage(error);
      if (emailChangedBySanitizer) {
        description = `${description}\n\nTip: Detecté caracteres/espacios raros en el correo (a veces pasa por el traductor automático). Reescribe el correo manualmente o desactiva la traducción.`;
      }
      setPageError({
        title: 'No se pudo completar el registro',
        description,
      });
      toast.error('No se pudo completar el registro', { description });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex notranslate" translate="no">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6 animate-slide-up">
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
            <h1 className="font-display text-3xl font-bold">{isUpgradeFlow ? 'Registrar Negocio' : 'Crear Cuenta'}</h1>
            <p className="text-muted-foreground mt-2">
              {isUpgradeFlow
                ? 'Completa la información de tu negocio'
                : step === 1
                  ? 'Elige el tipo de cuenta que deseas crear'
                  : step === 2
                    ? 'Completa tu información personal'
                    : 'Información de tu negocio'}
            </p>
          </div>

          {!isUpgradeFlow && (
            <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                } ${s === 3 && accountType === 'customer' ? 'hidden' : ''}`}
              />
            ))}
            </div>
          )}

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
            {/* Step 1: Account Type */}
            {step === 1 && !isUpgradeFlow && (
              <div role="radiogroup" aria-label="Tipo de cuenta" className="space-y-3">
                <button
                  type="button"
                  role="radio"
                  aria-checked={accountType === 'customer'}
                  onClick={() => setAccountType('customer')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all text-left ${
                    accountType === 'customer' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                      accountType === 'customer' ? 'border-primary' : 'border-muted-foreground/30'
                    }`}
                    aria-hidden="true"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        accountType === 'customer' ? 'bg-primary' : 'bg-transparent'
                      }`}
                    />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                        <User className="h-6 w-6 text-secondary-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">Comprador</p>
                        <p className="text-sm text-muted-foreground">Quiero explorar y comprar productos</p>
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={accountType === 'entrepreneur'}
                  onClick={() => setAccountType('entrepreneur')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all text-left ${
                    accountType === 'entrepreneur' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                      accountType === 'entrepreneur' ? 'border-primary' : 'border-muted-foreground/30'
                    }`}
                    aria-hidden="true"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        accountType === 'entrepreneur' ? 'bg-primary' : 'bg-transparent'
                      }`}
                    />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center">
                        <Store className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold">Emprendedor</p>
                        <p className="text-sm text-muted-foreground">Quiero vender mis productos</p>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* Step 2: Personal Info */}
            {step === 2 && !isUpgradeFlow && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Tu nombre completo"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Institucional *</Label>
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
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="Mínimo 8 caracteres"
                      className="pl-10 pr-10"
                      required
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+593..."
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="faculty">Facultad</Label>
                    <Select
                      value={formData.faculty}
                      onValueChange={(value) => setFormData({...formData, faculty: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>
                      <SelectContent>
                        {faculties.map((faculty) => (
                          <SelectItem key={faculty} value={faculty}>
                            {faculty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Business Info (only for entrepreneurs) */}
            {step === 3 && accountType === 'entrepreneur' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Nombre del Negocio *</Label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                      placeholder="Ej: Sabores UG"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessCategory">Categoría *</Label>
                  <Select
                    value={formData.businessCategory}
                    onValueChange={(value) => setFormData({...formData, businessCategory: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <span className="inline-flex items-center gap-2">
                            <category.icon className="h-4 w-4" aria-hidden="true" />
                            {category.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessDescription">Descripción del Negocio</Label>
                  <Textarea
                    id="businessDescription"
                    value={formData.businessDescription}
                    onChange={(e) => setFormData({...formData, businessDescription: e.target.value})}
                    placeholder="Cuéntanos sobre tu emprendimiento..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram (opcional)</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                    placeholder="@tu_negocio"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              {step > 1 && !isUpgradeFlow && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(step - 1)}
                >
                  Atrás
                </Button>
              )}
              
              {step < (accountType === 'entrepreneur' ? 3 : 2) ? (
                <Button
                  type="button"
                  variant="hero"
                  className="flex-1"
                  onClick={() => setStep(step + 1)}
                >
                  Continuar
                  <ArrowRight className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="hero"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {isUpgradeFlow ? 'Registrando negocio...' : 'Creando cuenta...'}
                    </>
                  ) : (
                    <>
                      {isUpgradeFlow ? 'Registrar Negocio' : 'Crear Cuenta'}
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>

          {!isUpgradeFlow && (
            <p className="text-center text-muted-foreground">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Inicia Sesión
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex relative flex-1 overflow-hidden bg-gradient-primary items-center justify-center p-12">
        <ShopShaderBackground className="opacity-80" />

        <div className="relative max-w-md text-center text-white">
          <div className="mb-6 flex justify-center" aria-hidden="true">
            <Rocket className="h-14 w-14 text-white" />
          </div>
          <h2 className="font-display text-4xl font-bold mb-4">
            {accountType === 'entrepreneur' 
              ? 'Lanza tu emprendimiento' 
              : 'Únete a la comunidad'}
          </h2>
          <p className="text-white/80 text-lg">
            {accountType === 'entrepreneur'
              ? 'Registra tu negocio y comienza a vender a toda la comunidad universitaria.'
              : 'Descubre productos únicos creados por estudiantes de la Universidad de Guayaquil.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;