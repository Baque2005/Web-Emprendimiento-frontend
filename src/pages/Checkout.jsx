import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Banknote,
  Wallet,
  CheckCircle2,
  Package,
} from 'lucide-react';

const safeParseJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart, addOrder, user } = useApp();
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const paymentStorageKey = user?.id ? `ug-payment-methods:${user.id}` : 'ug-payment-methods';
  const [paymentMethods, setPaymentMethods] = useState(() =>
    safeParseJson(localStorage.getItem(paymentStorageKey), [])
  );
  const defaultPayment = paymentMethods.find((pm) => pm?.isDefault) || paymentMethods[0] || null;
  const [selectedPaymentId, setSelectedPaymentId] = useState(defaultPayment?.id || null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({ type: 'paypal', email: '', label: '' });

  const [addresses] = useState(() => safeParseJson(localStorage.getItem('ug-addresses'), []));
  const defaultAddress = addresses.find((a) => a?.isDefault) || addresses[0] || null;
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddress?.id || 'manual');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: defaultAddress
      ? `${defaultAddress.address || ''}${defaultAddress.city ? `, ${defaultAddress.city}` : ''}`.trim()
      : '',
    notes: '',
  });

  useEffect(() => {
    if (!isComplete && cart.length === 0) {
      navigate('/cart');
    }
  }, [cart.length, isComplete, navigate]);

  const selectedAddress = addresses.find((a) => a?.id === selectedAddressId) || null;
  const isDelivery = deliveryMethod === 'delivery';

  useEffect(() => {
    // Reload payment methods when user changes.
    setPaymentMethods(safeParseJson(localStorage.getItem(paymentStorageKey), []));
  }, [paymentStorageKey]);

  useEffect(() => {
    // Ensure we always have a selection if any method exists.
    if (paymentMethods.length === 0) {
      setSelectedPaymentId(null);
      return;
    }

    const stillExists = paymentMethods.some((pm) => pm.id === selectedPaymentId);
    if (stillExists) return;

    const nextDefault = paymentMethods.find((pm) => pm.isDefault) || paymentMethods[0];
    setSelectedPaymentId(nextDefault?.id || null);
  }, [paymentMethods, selectedPaymentId]);

  const selectedPayment = paymentMethods.find((pm) => pm?.id === selectedPaymentId) || null;
  const paymentType = selectedPayment?.type || null;

  useEffect(() => {
    if (!isDelivery) return;
    if (!selectedAddress) return;
    const addressText = `${selectedAddress.address || ''}${selectedAddress.city ? `, ${selectedAddress.city}` : ''}`.trim();
    setFormData((prev) => ({
      ...prev,
      address: addressText,
      phone: prev.phone || selectedAddress.phone || '',
    }));
  }, [isDelivery, selectedAddressId, selectedAddress]);

  if (cart.length === 0 && !isComplete) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    if (isDelivery && !formData.address?.trim()) {
      toast.error('Por favor ingresa o selecciona una dirección de entrega');
      return;
    }

    if (!selectedPayment) {
      toast.error('Agrega y selecciona un método de pago para continuar');
      setIsPaymentModalOpen(true);
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create order
    const delivery = !isDelivery
      ? { method: 'pickup' }
      : selectedAddress
        ? {
            method: 'delivery',
            address: {
              id: selectedAddress.id,
              label: selectedAddress.label,
              address: selectedAddress.address,
              city: selectedAddress.city,
              phone: selectedAddress.phone,
            },
          }
        : { method: 'delivery', addressText: formData.address };

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
      paymentMethod: paymentType,
      payment: {
        id: selectedPayment.id,
        type: selectedPayment.type,
        label: selectedPayment.label,
        email: selectedPayment.email,
      },
      contact: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      delivery,
      notes: formData.notes,
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

  const addPaymentMethod = () => {
    if (newPayment.type === 'paypal' && !newPayment.email?.trim()) {
      toast.error('Por favor ingresa el correo de PayPal');
      return;
    }

    const method = {
      id: `pm${Date.now()}`,
      type: newPayment.type,
      label: newPayment.label || (newPayment.type === 'paypal' ? 'PayPal' : 'Efectivo'),
      email: newPayment.type === 'paypal' ? newPayment.email.trim() : undefined,
      isDefault: paymentMethods.length === 0,
    };

    const next = [...paymentMethods, method];
    setPaymentMethods(next);
    localStorage.setItem(paymentStorageKey, JSON.stringify(next));
    setSelectedPaymentId(method.id);
    setNewPayment({ type: 'paypal', email: '', label: '' });
    setIsPaymentModalOpen(false);
    toast.success('Método de pago agregado');
  };

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

                    <div className="space-y-2">
                      <Label>Entrega</Label>
                      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Tipo de entrega">
                        <button
                          type="button"
                          role="radio"
                          aria-checked={deliveryMethod === 'delivery'}
                          onClick={() => setDeliveryMethod('delivery')}
                          className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                            deliveryMethod === 'delivery'
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/30'
                          }`}
                        >
                          Entrega
                        </button>
                        <button
                          type="button"
                          role="radio"
                          aria-checked={deliveryMethod === 'pickup'}
                          onClick={() => setDeliveryMethod('pickup')}
                          className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                            deliveryMethod === 'pickup'
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/30'
                          }`}
                        >
                          Retiro
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {deliveryMethod === 'pickup'
                          ? 'El cliente retira el pedido (no requiere dirección).'
                          : 'Selecciona una dirección guardada o escribe una nueva.'}
                      </p>
                    </div>
                  
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
                      <Label htmlFor="address">Dirección de Entrega{isDelivery ? ' *' : ''}</Label>
                      {isDelivery && addresses.length > 0 ? (
                        <div className="space-y-2">
                          <select
                            value={selectedAddressId}
                            onChange={(e) => setSelectedAddressId(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            {addresses.map((a) => (
                              <option key={a.id} value={a.id}>
                                {a.label || 'Dirección'}: {a.address}{a.city ? `, ${a.city}` : ''}
                              </option>
                            ))}
                            <option value="manual">Otra dirección…</option>
                          </select>

                          {selectedAddressId === 'manual' && (
                            <Input
                              id="address"
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                              placeholder="Campus universitario, edificio..."
                              required={isDelivery}
                            />
                          )}
                        </div>
                      ) : (
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          placeholder={deliveryMethod === 'pickup' ? 'No aplica (retiro)' : 'Campus universitario, edificio...'}
                          disabled={!isDelivery}
                          required={isDelivery}
                        />
                      )}
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

                  {paymentMethods.length === 0 ? (
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Wallet className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">No tienes método de pago</p>
                          <p className="text-sm text-muted-foreground">
                            Agrega uno para poder continuar con la compra.
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            onClick={() => setIsPaymentModalOpen(true)}
                          >
                            Agregar método de pago
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3" role="radiogroup" aria-label="Método de pago">
                      {paymentMethods.map((pm) => (
                        <button
                          key={pm.id}
                          type="button"
                          role="radio"
                          aria-checked={selectedPaymentId === pm.id}
                          onClick={() => setSelectedPaymentId(pm.id)}
                          className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-colors ${
                            selectedPaymentId === pm.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/30'
                          }`}
                        >
                          <span className="h-4 w-4 rounded-full border border-primary flex items-center justify-center shrink-0">
                            {selectedPaymentId === pm.id && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                          </span>
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                                pm.type === 'paypal' ? 'bg-white border border-border' : 'bg-success'
                              }`}
                            >
                              {pm.type === 'paypal' ? (
                                <img
                                  src="/PayPal-Symbol.png"
                                  alt="PayPal"
                                  className="h-5 w-5 object-contain"
                                />
                              ) : (
                                <Wallet className="h-5 w-5 text-white" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold truncate">{pm.label}</p>
                                {pm.isDefault && (
                                  <span className="text-xs text-muted-foreground">(Predeterminado)</span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {pm.type === 'paypal'
                                  ? pm.email
                                    ? `PayPal • ${pm.email}`
                                    : 'PayPal'
                                  : 'Efectivo'}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}

                      <div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setIsPaymentModalOpen(true)}
                        >
                          Agregar otro método
                        </Button>
                      </div>
                    </div>
                  )}

                  {paymentType === 'paypal' && (
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
                    disabled={isProcessing || paymentMethods.length === 0 || !selectedPaymentId}
                  >
                    {isProcessing ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <span key={paymentType || 'none'} className="inline-flex items-center gap-2">
                        {paymentType === 'paypal' ? (
                          <>
                            <img
                              src="/PayPal-Symbol.png"
                              alt="PayPal"
                              className="h-5 w-5 object-contain"
                            />
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

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Método de Pago</DialogTitle>
            <DialogDescription>Selecciona el tipo de pago que deseas agregar</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                className={`p-4 border rounded-lg text-center transition-colors ${
                  newPayment.type === 'paypal' ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                }`}
                onClick={() => setNewPayment((p) => ({ ...p, type: 'paypal' }))}
              >
                <img
                  src="/PayPal-Symbol.png"
                  alt="PayPal"
                  className="h-8 w-8 mx-auto mb-2 object-contain"
                />
                <p className="font-medium">PayPal</p>
              </button>
              <button
                type="button"
                className={`p-4 border rounded-lg text-center transition-colors ${
                  newPayment.type === 'cash' ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                }`}
                onClick={() => setNewPayment((p) => ({ ...p, type: 'cash' }))}
              >
                <Banknote className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="font-medium">Efectivo</p>
              </button>
            </div>

            <div className="space-y-2">
              <Label>Nombre del método</Label>
              <Input
                placeholder={newPayment.type === 'paypal' ? 'Mi PayPal' : 'Pago en efectivo'}
                value={newPayment.label}
                onChange={(e) => setNewPayment((p) => ({ ...p, label: e.target.value }))}
              />
            </div>

            {newPayment.type === 'paypal' && (
              <div className="space-y-2">
                <Label>Correo de PayPal</Label>
                <Input
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={newPayment.email}
                  onChange={(e) => setNewPayment((p) => ({ ...p, email: e.target.value }))}
                />
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button type="button" onClick={addPaymentMethod} className="w-full sm:w-auto">
              Agregar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPaymentModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Checkout;
