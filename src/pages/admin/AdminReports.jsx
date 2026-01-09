import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { categories } from '@/data/mockData';

const AdminReports = () => {
  const { users, businesses, products, orders } = useApp();

  const categoryNameById = useMemo(() => {
    const map = new Map(categories.map((c) => [c.id, c.name]));
    return map;
  }, []);

  const breakdown = useMemo(() => {
    const businessByCategory = new Map();
    const productsByCategory = new Map();

    for (const b of businesses) {
      const key = b.category || 'unknown';
      businessByCategory.set(key, (businessByCategory.get(key) || 0) + 1);
    }

    for (const p of products) {
      const key = p.category || 'unknown';
      productsByCategory.set(key, (productsByCategory.get(key) || 0) + 1);
    }

    const rows = Array.from(new Set([...businessByCategory.keys(), ...productsByCategory.keys()])).map((k) => ({
      categoryId: k,
      categoryName: categoryNameById.get(k) || k,
      businesses: businessByCategory.get(k) || 0,
      products: productsByCategory.get(k) || 0,
    }));

    rows.sort((a, b) => (b.businesses + b.products) - (a.businesses + a.products));
    return rows;
  }, [businesses, products, categoryNameById]);

  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0), [orders]);

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-display text-xl font-bold">Resumen</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground">Usuarios</p>
            <p className="text-2xl font-bold mt-1">{users?.length || 0}</p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground">Emprendimientos</p>
            <p className="text-2xl font-bold mt-1">{businesses.length}</p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground">Pedidos</p>
            <p className="text-2xl font-bold mt-1">{orders.length}</p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground">Ventas ($)</p>
            <p className="text-2xl font-bold mt-1">{totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="font-display text-xl font-bold">Por categoría</h2>
          <p className="text-muted-foreground">Emprendimientos y productos agrupados por categoría</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left">
                <th className="p-4 font-semibold">Categoría</th>
                <th className="p-4 font-semibold">Emprendimientos</th>
                <th className="p-4 font-semibold">Productos</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.length === 0 ? (
                <tr>
                  <td className="p-6 text-muted-foreground" colSpan={3}>
                    No hay datos para reportes.
                  </td>
                </tr>
              ) : (
                breakdown.map((r) => (
                  <tr key={r.categoryId} className="border-t border-border">
                    <td className="p-4">{r.categoryName}</td>
                    <td className="p-4">{r.businesses}</td>
                    <td className="p-4">{r.products}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
