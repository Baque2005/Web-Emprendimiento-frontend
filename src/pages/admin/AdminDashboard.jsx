import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';

const AdminDashboard = () => {
  const { businesses, products, orders, users } = useApp();

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    return {
      users: users?.length || 0,
      businesses: businesses.length,
      products: products.length,
      orders: orders.length,
      revenue: totalRevenue,
    };
  }, [businesses, products, orders, users]);

  const StatCard = ({ title, value }) => (
    <div className="bg-card rounded-xl border border-border p-6">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="font-display text-3xl font-bold mt-2">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Usuarios" value={stats.users} />
        <StatCard title="Emprendimientos" value={stats.businesses} />
        <StatCard title="Productos" value={stats.products} />
        <StatCard title="Pedidos" value={stats.orders} />
        <StatCard title="Ventas ($)" value={stats.revenue.toFixed(2)} />
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-display text-xl font-bold mb-4">Accesos rápidos</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="hero" asChild>
            <Link to="/admin/users">Gestionar usuarios</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/businesses">Gestionar emprendimientos</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/orders">Ver pedidos</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/reports">Ver reportes</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
