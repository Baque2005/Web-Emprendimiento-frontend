import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { Package, ArrowLeft, ShoppingBag, Store } from 'lucide-react';

const Orders = () => {
  const navigate = useNavigate();
  const { orders, products, businesses } = useApp();

  // Quita anotaciones de tipo TypeScript en parámetros
  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-warning/20 text-warning',
      confirmed: 'bg-primary/20 text-primary',
      preparing: 'bg-accent/20 text-accent',
      ready: 'bg-success/20 text-success',
      delivered: 'bg-success/20 text-success',
      cancelled: 'bg-destructive/20 text-destructive',
    };
    const labels = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      preparing: 'Preparando',
      ready: 'Listo',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    };
    return (
      <Badge className={styles[status]}>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>

          <h1 className="font-display text-3xl font-bold mb-8">Mis Pedidos</h1>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map(order => {
                const business = businesses.find(b => b.id === order.businessId);
                
                return (
                  <div
                    key={order.id}
                    className="bg-card rounded-xl border border-border p-6 animate-slide-up"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-display text-lg font-bold">
                                Orden #{order.id.slice(-6).toUpperCase()}
                              </h3>
                              {getStatusBadge(order.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString('es-EC', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>

                        {business && (
                          <div
                            onClick={() => navigate(`/business/${business.id}`)}
                            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                          >
                            <img
                              src={business.logo}
                              alt={business.name}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-sm">{business.name}</p>
                              <p className="text-xs text-muted-foreground">{business.faculty}</p>
                            </div>
                            <Store className="h-4 w-4 text-muted-foreground ml-auto" />
                          </div>
                        )}

                        <div className="space-y-2">
                          {order.products.map(item => {
                            const product = products.find(p => p.id === item.productId);
                            return product ? (
                              <div key={item.productId} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {product.name} x{item.quantity}
                                </span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>

                      <div className="lg:text-right lg:min-w-[150px]">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-display text-2xl font-bold text-primary">
                          ${order.total.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {order.paymentMethod === 'paypal' ? '💳 PayPal' : '💵 Efectivo'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-2">Sin pedidos aún</h2>
              <p className="text-muted-foreground mb-6">
                Cuando realices pedidos, aparecerán aquí
              </p>
              <Button variant="hero" onClick={() => navigate('/catalog')}>
                <ShoppingBag className="h-5 w-5" />
                Explorar Catálogo
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
