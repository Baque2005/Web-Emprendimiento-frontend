import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CreditCard,
  ShoppingBag,
} from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateCartQuantity, removeFromCart, clearCart, cartTotal } = useApp();

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="container py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">Tu carrito está vacío</h1>
            <p className="text-muted-foreground mb-6">
              Explora nuestro catálogo y agrega productos que te interesen
            </p>
            <Button variant="hero" onClick={() => navigate('/catalog')}>
              <ShoppingBag className="h-5 w-5" />
              Explorar Catálogo
            </Button>
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
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Continuar Comprando
          </button>

          <h1 className="font-display text-3xl font-bold mb-8">
            Carrito de Compras ({cart.length})
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-4 bg-card rounded-xl border border-border animate-slide-up"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-24 w-24 rounded-lg object-cover cursor-pointer"
                    onClick={() => navigate(`/product/${item.product.id}`)}
                  />
                  <div className="flex-1">
                    <h3
                      className="font-semibold cursor-pointer hover:text-primary transition-colors"
                      onClick={() => navigate(`/product/${item.product.id}`)}
                    >
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {item.product.description}
                    </p>
                    <p className="font-display text-lg font-bold text-primary mt-1">
                      ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                variant="ghost"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => {
                  clearCart();
                  toast.success('Carrito vaciado');
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Vaciar Carrito
              </Button>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h2 className="font-display text-xl font-bold">Resumen del Pedido</h2>
                
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product.name} x{item.quantity}
                      </span>
                      <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Envío</span>
                  <span>A coordinar</span>
                </div>

                <Separator />

                <div className="flex justify-between font-display text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">${cartTotal.toFixed(2)}</span>
                </div>

                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/checkout')}
                >
                  <CreditCard className="h-5 w-5" />
                  Proceder al Pago
                </Button>

                {/* PayPal Info */}
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Pago seguro con PayPal o en efectivo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;