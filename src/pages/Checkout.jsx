import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  CheckCircle2,
  Package,
} from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart, addOrder, user } = useApp();
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    if (!isComplete && cart.length === 0) {
      navigate('/cart');
    }
  }, [cart.length, isComplete, navigate]);

  if (cart.length === 0 && !isComplete) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create order
    const newOrder = {
      id: `o${Date.now()}`,
      customerId: user?.id || 'guest',
      businessId: cart[0].product.businessId,
      products: cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total: cartTotal,
      status: 'pending',
      createdAt: new Date().toISOString(),
      paymentMethod,
    };

    addOrder(newOrder);
    setIsComplete(true);
    clearCart();
    setIsProcessing(false);

    toast.success('¡Pedido realizado con éxito!', {
      description: `Orden #${newOrder.id.slice(-6).toUpperCase()}`,
    });
  };

  if (isComplete) {
    return (
      <Layout>
        <div className="container py-16">
          <div className="max-w-md mx-auto text-center animate-scale-in">
            <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-success" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-2">¡Pedido Confirmado!</h1>
            <p className="text-muted-foreground mb-8">
              Tu pedido ha sido registrado exitosamente. El emprendedor se pondrá en contacto contigo pronto.
            </p>
            <div className="space-y-4">
              <Button variant="hero" size="lg" onClick={() => navigate('/orders')}>
                <Package className="h-5 w-5" />
                Ver Mis Pedidos
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/catalog')}>
                Seguir Comprando
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Carrito
          </button>

          <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Contact Info */}
                <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                  <h2 className="font-display text-xl font-bold">Información de Contacto</h2>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre Completo *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Tu nombre"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono / WhatsApp *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+593 99 123 4567"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección de Entrega</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        placeholder="Campus universitario, edificio..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas Adicionales</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Instrucciones especiales, horarios de entrega, etc."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                  <h2 className="font-display text-xl font-bold">Método de Pago</h2>

                  <div className="space-y-3" role="radiogroup" aria-label="Método de pago">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={paymentMethod === 'paypal'}
                      onClick={() => setPaymentMethod('paypal')}
                      className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-colors ${
                        paymentMethod === 'paypal'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <span className="h-4 w-4 rounded-full border border-primary flex items-center justify-center shrink-0">
                        {paymentMethod === 'paypal' && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                      </span>
                      <div className="flex items-center gap-3 flex-1">
                        <div className="h-10 w-10 rounded-lg bg-[#003087] flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold">PayPal</p>
                          <p className="text-sm text-muted-foreground">Pago seguro en línea</p>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      role="radio"
                      aria-checked={paymentMethod === 'cash'}
                      onClick={() => setPaymentMethod('cash')}
                      className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-colors ${
                        paymentMethod === 'cash'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <span className="h-4 w-4 rounded-full border border-primary flex items-center justify-center shrink-0">
                        {paymentMethod === 'cash' && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                      </span>
                      <div className="flex items-center gap-3 flex-1">
                        <div className="h-10 w-10 rounded-lg bg-success flex items-center justify-center">
                          <Wallet className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold">Efectivo</p>
                          <p className="text-sm text-muted-foreground">Pago al momento de la entrega</p>
                        </div>
                      </div>
                    </button>
                  </div>

                  {paymentMethod === 'paypal' && (
                    <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                      <p>Serás redirigido a PayPal para completar el pago de forma segura.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:sticky lg:top-24 h-fit">
                <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                  <h2 className="font-display text-xl font-bold">Resumen</h2>
                  
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                        </div>
                        <p className="font-semibold">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-display text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">${cartTotal.toFixed(2)}</span>
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <span key={paymentMethod} className="inline-flex items-center gap-2">
                        {paymentMethod === 'paypal' ? (
                          <>
                            <CreditCard className="h-5 w-5" />
                            <span>Pagar con PayPal</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-5 w-5" />
                            <span>Confirmar Pedido</span>
                          </>
                        )}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
