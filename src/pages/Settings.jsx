import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Store } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const { user, businesses, updateBusiness } = useApp();

  const business = useMemo(() => {
    if (!user?.businessId) return null;
    return businesses.find((b) => b.id === user.businessId) || null;
  }, [businesses, user?.businessId]);

  const [businessForm, setBusinessForm] = useState({
    name: '',
    description: '',
    category: '',
    phone: '',
    instagram: '',
    logo: '',
    banner: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role === 'entrepreneur' && business) {
      setBusinessForm({
        name: business.name || '',
        description: business.description || '',
        category: business.category || '',
        phone: business.phone || '',
        instagram: business.instagram || '',
        logo: business.logo || '',
        banner: business.banner || '',
      });
    }
  }, [user, business, navigate]);

  const handleSaveBusiness = () => {
    if (!business) return;

    if (!businessForm.name || !businessForm.category) {
      toast.error('Completa los campos requeridos');
      return;
    }

    updateBusiness({
      ...business,
      name: businessForm.name,
      description: businessForm.description,
      category: businessForm.category,
      phone: businessForm.phone,
      instagram: businessForm.instagram,
      logo: businessForm.logo,
      banner: businessForm.banner,
    });

    toast.success('Configuración guardada');
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container max-w-3xl">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold">Configuración</h1>
              <p className="text-muted-foreground">Administra tu cuenta y, si aplica, tu negocio</p>
            </div>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Volver
            </Button>
          </div>

          {/* Cuenta */}
          <div className="bg-card rounded-xl border border-border p-6 mb-6">
            <h2 className="font-display text-xl font-bold mb-4">Cuenta</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input value={user.name || ''} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Correo</Label>
                <Input value={user.email || ''} readOnly />
              </div>
            </div>
          </div>

          {/* Cliente: registrar negocio */}
          {user.role === 'customer' && (
            <div className="bg-card rounded-xl border border-border p-6 mb-6">
              <h2 className="font-display text-xl font-bold mb-2">¿Quieres vender?</h2>
              <p className="text-muted-foreground mb-4">
                Registra tu negocio para poder publicar productos y gestionar pedidos.
              </p>
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl"
                onClick={() => navigate('/register')}
              >
                Registrar Negocio
                <Store className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Negocio (solo emprendedor) */}
          {user.role === 'entrepreneur' && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-display text-xl font-bold mb-4">Mi Negocio</h2>

              {!business ? (
                <div className="text-muted-foreground">
                  No se encontró un negocio asociado a tu cuenta.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nombre del Negocio *</Label>
                    <Input
                      value={businessForm.name}
                      onChange={(e) => setBusinessForm({ ...businessForm, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Textarea
                      value={businessForm.description}
                      onChange={(e) => setBusinessForm({ ...businessForm, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Categoría *</Label>
                    <Select
                      value={businessForm.category}
                      onValueChange={(value) => setBusinessForm({ ...businessForm, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => {
                          const Icon = cat.icon;
                          return (
                            <SelectItem key={cat.id} value={cat.id}>
                              <Icon className="h-4 w-4 mr-2 inline-block" />
                              {cat.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Teléfono</Label>
                      <Input
                        value={businessForm.phone}
                        onChange={(e) => setBusinessForm({ ...businessForm, phone: e.target.value })}
                        placeholder="+593..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Instagram</Label>
                      <Input
                        value={businessForm.instagram}
                        onChange={(e) => setBusinessForm({ ...businessForm, instagram: e.target.value })}
                        placeholder="@mi_negocio"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>URL Logo</Label>
                    <Input
                      value={businessForm.logo}
                      onChange={(e) => setBusinessForm({ ...businessForm, logo: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>URL Banner</Label>
                    <Input
                      value={businessForm.banner}
                      onChange={(e) => setBusinessForm({ ...businessForm, banner: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <Button variant="hero" onClick={handleSaveBusiness}>
                    Guardar Cambios
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
