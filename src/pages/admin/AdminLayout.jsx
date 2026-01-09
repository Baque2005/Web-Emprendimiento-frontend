import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';

const AdminLayout = () => {
  const { user } = useApp();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  const links = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/users', label: 'Usuarios' },
    { to: '/admin/businesses', label: 'Emprendimientos' },
    { to: '/admin/orders', label: 'Pedidos' },
    { to: '/admin/reports', label: 'Reportes' },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="font-display text-3xl font-bold">Administración</h1>
              <p className="text-muted-foreground">Supervisa usuarios, emprendimientos, pedidos y estadísticas</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {links.map((l) => (
                <Button key={l.to} variant="outline" asChild>
                  <Link to={l.to}>{l.label}</Link>
                </Button>
              ))}
            </div>
          </div>

          <Outlet />
        </div>
      </div>
    </Layout>
  );
};

export default AdminLayout;
