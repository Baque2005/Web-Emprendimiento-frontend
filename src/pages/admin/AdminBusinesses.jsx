import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { categories } from '@/data/mockData';

const AdminBusinesses = () => {
  const { businesses, deleteBusiness } = useApp();

  const categoryById = useMemo(() => {
    const map = new Map(categories.map((c) => [c.id, c.name]));
    return map;
  }, []);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="font-display text-xl font-bold">Emprendimientos</h2>
        <p className="text-muted-foreground">Gestiona los microemprendimientos registrados</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="p-4 font-semibold">Nombre</th>
              <th className="p-4 font-semibold">Propietario</th>
              <th className="p-4 font-semibold">Categoría</th>
              <th className="p-4 font-semibold">Contacto</th>
              <th className="p-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {businesses.length === 0 ? (
              <tr>
                <td className="p-6 text-muted-foreground" colSpan={5}>
                  No hay emprendimientos registrados.
                </td>
              </tr>
            ) : (
              businesses.map((b) => (
                <tr key={b.id} className="border-t border-border">
                  <td className="p-4">{b.name}</td>
                  <td className="p-4">{b.owner || '-'}</td>
                  <td className="p-4">{categoryById.get(b.category) || b.category || '-'}</td>
                  <td className="p-4">
                    <div className="text-muted-foreground">
                      <div>{b.email || '-'}</div>
                      <div>{b.phone || '-'}</div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="destructive" size="sm" onClick={() => deleteBusiness(b.id)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBusinesses;
