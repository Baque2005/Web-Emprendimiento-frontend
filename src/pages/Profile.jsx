import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser, upsertUser } = useApp();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    faculty: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setForm({
      name: user.name || '',
      phone: user.phone || '',
      faculty: user.faculty || '',
    });
  }, [user, navigate]);

  if (!user) return null;

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error('El nombre es requerido');
      return;
    }

    const updatedUser = {
      ...user,
      name: form.name.trim(),
      phone: form.phone.trim(),
      faculty: form.faculty.trim(),
    };

    setUser(updatedUser);
    upsertUser(updatedUser);
    toast.success('Perfil actualizado');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container max-w-3xl">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold">Mi Perfil</h1>
              <p className="text-muted-foreground">Visualiza y actualiza tu información personal</p>
            </div>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Volver
            </Button>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Correo</Label>
                <Input value={user.email || ''} readOnly />
              </div>

              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+593..."
                />
              </div>

              <div className="space-y-2">
                <Label>Facultad</Label>
                <Input
                  value={form.faculty}
                  onChange={(e) => setForm({ ...form, faculty: e.target.value })}
                  placeholder="Facultad de ..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="hero" onClick={handleSave}>
                Guardar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
