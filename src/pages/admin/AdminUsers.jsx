import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';

const roleLabel = (role) => {
  if (role === 'admin') return 'Administrador';
  if (role === 'entrepreneur') return 'Emprendedor';
  return 'Cliente';
};

const AdminUsers = () => {
  const { users, deleteUser, user: currentUser, businesses } = useApp();

  const usersWithBusiness = useMemo(() => {
    const byId = new Map(businesses.map((b) => [b.id, b]));
    return (users || []).map((u) => ({
      ...u,
      businessName: u.businessId ? (byId.get(u.businessId)?.name || u.businessId) : '',
    }));
  }, [users, businesses]);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="font-display text-xl font-bold">Usuarios</h2>
        <p className="text-muted-foreground">Gestiona usuarios registrados y sus roles</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="p-4 font-semibold">Nombre</th>
              <th className="p-4 font-semibold">Correo</th>
              <th className="p-4 font-semibold">Rol</th>
              <th className="p-4 font-semibold">Emprendimiento</th>
              <th className="p-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usersWithBusiness.length === 0 ? (
              <tr>
                <td className="p-6 text-muted-foreground" colSpan={5}>
                  No hay usuarios registrados.
                </td>
              </tr>
            ) : (
              usersWithBusiness.map((u) => {
                const isSelf = currentUser?.id === u.id;
                const isAdmin = u.role === 'admin';

                return (
                  <tr key={u.id} className="border-t border-border">
                    <td className="p-4">{u.name}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">{roleLabel(u.role)}</td>
                    <td className="p-4">{u.businessName || '-'}</td>
                    <td className="p-4 text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isSelf || isAdmin}
                        onClick={() => deleteUser(u.id)}
                        title={isSelf ? 'No puedes eliminar tu propia cuenta' : isAdmin ? 'No se elimina el usuario admin' : 'Eliminar'}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
