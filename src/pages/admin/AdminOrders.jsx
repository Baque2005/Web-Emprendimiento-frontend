import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';

const statusLabel = (status) => {
  if (status === 'pending') return 'Pendiente';
  if (status === 'preparing') return 'Preparando';
  if (status === 'ready') return 'Listo';
  if (status === 'delivered') return 'Entregado';
  if (status === 'cancelled') return 'Cancelado';
  return status || '-';
};

const AdminOrders = () => {
  const { orders, businesses, users } = useApp();

  const rows = useMemo(() => {
    const businessById = new Map(businesses.map((b) => [b.id, b]));
    const userById = new Map((users || []).map((u) => [u.id, u]));

    return orders.map((o) => ({
      ...o,
      businessName: businessById.get(o.businessId)?.name || o.businessId,
      customerName: userById.get(o.customerId)?.name || o.customerId,
    }));
  }, [orders, businesses, users]);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="font-display text-xl font-bold">Pedidos</h2>
        <p className="text-muted-foreground">Vista general de pedidos en la plataforma</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="p-4 font-semibold">ID</th>
              <th className="p-4 font-semibold">Cliente</th>
              <th className="p-4 font-semibold">Emprendimiento</th>
              <th className="p-4 font-semibold">Total</th>
              <th className="p-4 font-semibold">Pago</th>
              <th className="p-4 font-semibold">Estado</th>
              <th className="p-4 font-semibold">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="p-6 text-muted-foreground" colSpan={7}>
                  No hay pedidos.
                </td>
              </tr>
            ) : (
              rows.map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="p-4">{o.id}</td>
                  <td className="p-4">{o.customerName}</td>
                  <td className="p-4">{o.businessName}</td>
                  <td className="p-4">${Number(o.total || 0).toFixed(2)}</td>
                  <td className="p-4">{o.paymentMethod || '-'}</td>
                  <td className="p-4">{statusLabel(o.status)}</td>
                  <td className="p-4">{o.createdAt ? new Date(o.createdAt).toLocaleString() : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
