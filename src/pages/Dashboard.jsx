import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import { categories } from '@/data/mockData';
import { toast } from 'sonner';
import {
  Package,
  ShoppingBag,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  DollarSign,
  Eye,
  Settings,
  Upload,
  MapPin,
  Phone,
  X,
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, businesses, products, orders, addProduct, updateProduct, deleteProduct, updateOrderStatus, deleteOrder } = useApp();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProductImageName, setNewProductImageName] = useState('');
  const [editProductImageName, setEditProductImageName] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: '',
    images: [],
    fulfillment: 'both',
    paymentOption: 'both',
  });

  const [editProduct, setEditProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: '',
    images: [],
    fulfillment: 'both',
    paymentOption: 'both',
  });

  const isEntrepreneur = user?.role === 'entrepreneur';

  const readImageAsDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('No se pudo leer la imagen'));
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (!isEntrepreneur) {
      navigate('/login');
    }
  }, [isEntrepreneur, navigate]);

  if (!isEntrepreneur) {
    return null;
  }

  const businessId = user.businessId;
  const business = businesses.find(b => b.id === businessId);

  if (!business) {
    return (
      <Layout>
        <div className="container py-16">
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <h1 className="font-display text-2xl font-bold mb-2">Negocio no encontrado</h1>
            <p className="text-muted-foreground mb-6">
              Tu cuenta no tiene un negocio asociado. Intenta registrarte como emprendedor nuevamente.
            </p>
            <Button onClick={() => navigate('/register')}>Ir a Registro</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const myProducts = products.filter(p => p.businessId === business.id);
  const myOrders = orders.filter(o => o.businessId === business.id);

  const stats = {
    totalProducts: myProducts.length,
    totalOrders: myOrders.length,
    totalRevenue: myOrders.reduce((sum, o) => sum + o.total, 0),
    pendingOrders: myOrders.filter(o => o.status === 'pending').length,
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    const fulfillment = newProduct.fulfillment || 'both';
    const acceptsDelivery = fulfillment === 'delivery' || fulfillment === 'both';
    const acceptsPickup = fulfillment === 'pickup' || fulfillment === 'both';

    const paymentOption = newProduct.paymentOption || 'both';
    const acceptsPaypal = paymentOption === 'paypal' || paymentOption === 'both';
    const acceptsCash = paymentOption === 'cash' || paymentOption === 'both';

    const product = {
      id: `p${Date.now()}`,
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      stock: parseInt(newProduct.stock) || 0,
      images: (() => {
        const max = 6;
        const fromList = Array.isArray(newProduct.images) ? newProduct.images.filter(Boolean) : [];
        const base = fromList.length > 0 ? fromList : (newProduct.image ? [newProduct.image] : []);
        if (base.length > 0) return base.slice(0, max);
        return ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'];
      })(),
      businessId: business.id,
      acceptsDelivery,
      acceptsPickup,
      acceptsPaypal,
      acceptsCash,
    };

    product.image = product.images[0];

    addProduct(product);
    toast.success('Producto agregado exitosamente');
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      image: '',
      images: [],
      fulfillment: 'both',
      paymentOption: 'both',
    });
    setNewProductImageName('');
    setIsAddProductOpen(false);
  };

  const handleDeleteProduct = (productId) => {
    deleteProduct(productId);
    toast.success('Producto eliminado');
  };

  const handleEditClick = (product) => {
    const delivery = product?.acceptsDelivery !== false;
    const pickup = product?.acceptsPickup !== false;
    const fulfillment = delivery && pickup ? 'both' : delivery ? 'delivery' : pickup ? 'pickup' : 'both';

    const paypal = product?.acceptsPaypal !== false;
    const cash = product?.acceptsCash !== false;
    const paymentOption = paypal && cash ? 'both' : paypal ? 'paypal' : cash ? 'cash' : 'both';
    setEditingProduct(product);
    const existingImages = Array.isArray(product?.images) && product.images.filter(Boolean).length > 0
      ? product.images.filter(Boolean)
      : product.image
        ? [product.image]
        : [];
    setEditProduct({
      name: product.name || '',
      description: product.description || '',
      price: String(product.price ?? ''),
      category: product.category || '',
      stock: String(product.stock ?? ''),
      image: existingImages[0] || product.image || '',
      images: existingImages,
      fulfillment,
      paymentOption,
    });
    setEditProductImageName('');
    setIsEditProductOpen(true);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    if (!editProduct.name || !editProduct.price || !editProduct.category) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    const fulfillment = editProduct.fulfillment || 'both';
    const acceptsDelivery = fulfillment === 'delivery' || fulfillment === 'both';
    const acceptsPickup = fulfillment === 'pickup' || fulfillment === 'both';

    const paymentOption = editProduct.paymentOption || 'both';
    const acceptsPaypal = paymentOption === 'paypal' || paymentOption === 'both';
    const acceptsCash = paymentOption === 'cash' || paymentOption === 'both';

    const max = 6;
    const fromList = Array.isArray(editProduct.images) ? editProduct.images.filter(Boolean) : [];
    const base =
      fromList.length > 0
        ? fromList
        : editProduct.image
          ? [editProduct.image]
          : Array.isArray(editingProduct?.images) && editingProduct.images.filter(Boolean).length > 0
            ? editingProduct.images.filter(Boolean)
            : editingProduct?.image
              ? [editingProduct.image]
              : [];

    const nextImages = base.length > 0
      ? base.slice(0, max)
      : ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'];

    const updated = {
      ...editingProduct,
      name: editProduct.name,
      description: editProduct.description,
      price: parseFloat(editProduct.price),
      category: editProduct.category,
      stock: parseInt(editProduct.stock) || 0,
      images: nextImages,
      image: nextImages[0],
      businessId: business.id,
      acceptsDelivery,
      acceptsPickup,
      acceptsPaypal,
      acceptsCash,
    };

    updateProduct(updated);
    toast.success('Producto actualizado');
    setIsEditProductOpen(false);
    setEditingProduct(null);
  };

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

  const setOrderStatus = (order, nextStatus) => {
    if (!order?.id) return;
    updateOrderStatus(order.id, nextStatus);
    toast.success('Estado actualizado', {
      description: `Orden #${order.id.slice(-6).toUpperCase()} → ${nextStatus}`,
    });
  };

  const handleDeleteOrder = (order) => {
    if (!order?.id) return;
    const ok = window.confirm(`¿Eliminar la orden #${order.id.slice(-6).toUpperCase()}? Esta acción no se puede deshacer.`);
    if (!ok) return;
    deleteOrder(order.id);
    toast.success('Orden eliminada');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <div className="bg-card border-b border-border">
          <div className="container py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={business.logo}
                  alt={business.name}
                  className="h-16 w-16 rounded-xl object-cover"
                />
                <div>
                  <h1 className="font-display text-2xl font-bold">{business.name}</h1>
                  <p className="text-muted-foreground">Panel de Gestión</p>
                </div>
              </div>
              <div className="flex gap-3 w-full flex-nowrap md:w-auto">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/business/${business.id}`)}
                  className="flex-1 md:flex-none"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Perfil Público
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/settings')}
                  aria-label="Configuración"
                  title="Configuración"
                  className="shrink-0 w-12 px-0 justify-center md:w-auto md:px-4"
                >
                  <Settings className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Configuración</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold">{stats.totalProducts}</p>
                  <p className="text-sm text-muted-foreground">Productos</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold">{stats.totalOrders}</p>
                  <p className="text-sm text-muted-foreground">Pedidos</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold">${stats.totalRevenue.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Ingresos</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold">{stats.pendingOrders}</p>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList>
              <TabsTrigger value="products">
                <Package className="h-4 w-4 mr-2" />
                Productos
              </TabsTrigger>
              <TabsTrigger value="orders">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Pedidos
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-xl font-bold">Mis Productos</h2>
                <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
                  <DialogContent className="left-0 top-0 translate-x-0 translate-y-0 w-screen h-[100svh] max-h-[100svh] overflow-y-auto rounded-none border-0 p-4 pt-10 sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:w-full sm:h-auto sm:max-h-[90vh] sm:max-w-md sm:rounded-lg sm:border sm:p-6">
                    <DialogHeader>
                      <DialogTitle>Editar Producto</DialogTitle>
                      <DialogDescription>
                        Actualiza la información de tu producto
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label>Nombre del Producto *</Label>
                        <Input
                          value={editProduct.name}
                          onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                          placeholder="Ej: Almuerzo Ejecutivo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Descripción</Label>
                        <Textarea
                          value={editProduct.description}
                          onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                          placeholder="Describe tu producto..."
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Precio *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={editProduct.price}
                            onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Stock</Label>
                          <Input
                            type="number"
                            value={editProduct.stock}
                            onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Categoría *</Label>
                        <Select
                          value={editProduct.category}
                          onValueChange={(value) => setEditProduct({ ...editProduct, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => {
                              const Icon = cat.icon;
                              return (
                                <SelectItem key={cat.id} value={cat.id}>
                                  <Icon className="h-4 w-4 mr-2 inline-block" />
                                  {cat.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Entrega / Retiro</Label>
                        <Select
                          value={editProduct.fulfillment}
                          onValueChange={(value) => setEditProduct({ ...editProduct, fulfillment: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="delivery">Entrega a domicilio</SelectItem>
                            <SelectItem value="pickup">Retiro</SelectItem>
                            <SelectItem value="both">Entrega y Retiro</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Define cómo el cliente puede recibir el producto.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Método de pago</Label>
                        <Select
                          value={editProduct.paymentOption}
                          onValueChange={(value) => setEditProduct({ ...editProduct, paymentOption: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="cash">Efectivo</SelectItem>
                            <SelectItem value="both">PayPal y Efectivo</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Define cómo el cliente puede pagar este producto.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Imágenes (hasta 6)</Label>
                        <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium">Selecciona una o varias imágenes</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {Array.isArray(editProduct.images) && editProduct.images.length > 0
                                ? `${editProduct.images.length} / 6 seleccionadas`
                                : editProductImageName || 'Ningún archivo seleccionado'}
                            </p>
                          </div>
                          <label
                            htmlFor="edit-product-images"
                            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                          >
                            Elegir
                          </label>
                          <Input
                            id="edit-product-images"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={async (e) => {
                              const files = Array.from(e.target.files || []);
                              e.target.value = '';
                              if (files.length === 0) return;

                              const current = Array.isArray(editProduct.images) ? editProduct.images : [];
                              const remaining = 6 - current.length;
                              if (remaining <= 0) {
                                toast.error('Solo puedes subir hasta 6 imágenes');
                                return;
                              }

                              const slice = files.slice(0, remaining);
                              if (files.length > slice.length) {
                                toast.message('Límite alcanzado', {
                                  description: 'Solo se agregaron las primeras imágenes hasta completar 6.',
                                });
                              }

                              try {
                                const dataUrls = await Promise.all(slice.map(readImageAsDataUrl));
                                setEditProductImageName(slice.length === 1 ? slice[0].name : `${slice.length} archivos`);
                                setEditProduct((prev) => {
                                  const prevImages = Array.isArray(prev.images) ? prev.images : [];
                                  const nextImages = [...prevImages, ...dataUrls].filter(Boolean).slice(0, 6);
                                  return { ...prev, images: nextImages, image: nextImages[0] || prev.image };
                                });
                              } catch {
                                toast.error('No se pudo cargar una de las imágenes');
                              }
                            }}
                          />
                        </div>

                        {Array.isArray(editProduct.images) && editProduct.images.length > 0 && (
                          <div className="mt-3 grid grid-cols-3 gap-3">
                            {editProduct.images.map((img, imgIndex) => (
                              <div key={`${imgIndex}-${img?.slice?.(0, 12) || 'img'}`} className="relative">
                                <img
                                  src={img}
                                  alt={`Vista previa ${imgIndex + 1}`}
                                  className="h-24 w-full rounded-lg object-cover border border-border"
                                  loading="lazy"
                                />
                                <button
                                  type="button"
                                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center"
                                  aria-label="Quitar imagen"
                                  onClick={() => {
                                    setEditProduct((prev) => {
                                      const prevImages = Array.isArray(prev.images) ? prev.images : [];
                                      const nextImages = prevImages.filter((_, i) => i !== imgIndex);
                                      return { ...prev, images: nextImages, image: nextImages[0] || '' };
                                    });
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button variant="hero" className="w-full" onClick={handleUpdateProduct}>
                        <Upload className="h-4 w-4" />
                        Guardar Cambios
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                  <DialogTrigger asChild>
                    <Button variant="hero" aria-label="Agregar producto" title="Agregar producto" className="gap-2 md:gap-2">
                      <Plus className="h-4 w-4" />
                      <span className="hidden md:inline">Agregar Producto</span>
                      <span className="sr-only md:hidden">Agregar Producto</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="left-0 top-0 translate-x-0 translate-y-0 w-screen h-[100svh] max-h-[100svh] overflow-y-auto rounded-none border-0 p-4 pt-10 sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:w-full sm:h-auto sm:max-h-[90vh] sm:max-w-md sm:rounded-lg sm:border sm:p-6">
                    <DialogHeader>
                      <DialogTitle>Agregar Producto</DialogTitle>
                      <DialogDescription>
                        Completa la información de tu nuevo producto
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label>Nombre del Producto *</Label>
                        <Input
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                          placeholder="Ej: Almuerzo Ejecutivo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Descripción</Label>
                        <Textarea
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                          placeholder="Describe tu producto..."
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Precio *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Stock</Label>
                          <Input
                            type="number"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Categoría *</Label>
                        <Select
                          value={newProduct.category}
                          onValueChange={(value) => setNewProduct({...newProduct, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => {
                              const Icon = cat.icon;
                              return (
                                <SelectItem key={cat.id} value={cat.id}>
                                  <Icon className="h-4 w-4 mr-2 inline-block" />
                                  {cat.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Entrega / Retiro</Label>
                        <Select
                          value={newProduct.fulfillment}
                          onValueChange={(value) => setNewProduct({ ...newProduct, fulfillment: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="delivery">Entrega a domicilio</SelectItem>
                            <SelectItem value="pickup">Retiro</SelectItem>
                            <SelectItem value="both">Entrega y Retiro</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Define cómo el cliente puede recibir el producto.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Método de pago</Label>
                        <Select
                          value={newProduct.paymentOption}
                          onValueChange={(value) => setNewProduct({ ...newProduct, paymentOption: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="cash">Efectivo</SelectItem>
                            <SelectItem value="both">PayPal y Efectivo</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Define cómo el cliente puede pagar este producto.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Imágenes (hasta 6)</Label>
                        <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium">Selecciona una o varias imágenes</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {Array.isArray(newProduct.images) && newProduct.images.length > 0
                                ? `${newProduct.images.length} / 6 seleccionadas`
                                : newProductImageName || 'Ningún archivo seleccionado'}
                            </p>
                          </div>
                          <label
                            htmlFor="new-product-images"
                            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                          >
                            Elegir
                          </label>
                          <Input
                            id="new-product-images"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={async (e) => {
                              const files = Array.from(e.target.files || []);
                              e.target.value = '';
                              if (files.length === 0) return;

                              const current = Array.isArray(newProduct.images) ? newProduct.images : [];
                              const remaining = 6 - current.length;
                              if (remaining <= 0) {
                                toast.error('Solo puedes subir hasta 6 imágenes');
                                return;
                              }

                              const slice = files.slice(0, remaining);
                              if (files.length > slice.length) {
                                toast.message('Límite alcanzado', {
                                  description: 'Solo se agregaron las primeras imágenes hasta completar 6.',
                                });
                              }

                              try {
                                const dataUrls = await Promise.all(slice.map(readImageAsDataUrl));
                                setNewProductImageName(slice.length === 1 ? slice[0].name : `${slice.length} archivos`);
                                setNewProduct((prev) => {
                                  const prevImages = Array.isArray(prev.images) ? prev.images : [];
                                  const nextImages = [...prevImages, ...dataUrls].filter(Boolean).slice(0, 6);
                                  return { ...prev, images: nextImages, image: nextImages[0] || prev.image };
                                });
                              } catch {
                                toast.error('No se pudo cargar una de las imágenes');
                              }
                            }}
                          />
                        </div>

                        {Array.isArray(newProduct.images) && newProduct.images.length > 0 && (
                          <div className="mt-3 grid grid-cols-3 gap-3">
                            {newProduct.images.map((img, imgIndex) => (
                              <div key={`${imgIndex}-${img?.slice?.(0, 12) || 'img'}`} className="relative">
                                <img
                                  src={img}
                                  alt={`Vista previa ${imgIndex + 1}`}
                                  className="h-24 w-full rounded-lg object-cover border border-border"
                                  loading="lazy"
                                />
                                <button
                                  type="button"
                                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center"
                                  aria-label="Quitar imagen"
                                  onClick={() => {
                                    setNewProduct((prev) => {
                                      const prevImages = Array.isArray(prev.images) ? prev.images : [];
                                      const nextImages = prevImages.filter((_, i) => i !== imgIndex);
                                      return { ...prev, images: nextImages, image: nextImages[0] || '' };
                                    });
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button variant="hero" className="w-full" onClick={handleAddProduct}>
                        <Upload className="h-4 w-4" />
                        Publicar Producto
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {myProducts.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myProducts.map(product => (
                    <div
                      key={product.id}
                      className="bg-card rounded-xl border border-border overflow-hidden"
                    >
                      <div className="aspect-video relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="font-display text-lg font-bold text-primary">
                            ${product.price.toFixed(2)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Stock: {product.stock}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleEditClick(product)}
                          >
                            <Edit className="h-4 w-4" />
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-card rounded-xl border border-border">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-lg font-bold mb-2">No tienes productos</h3>
                  <p className="text-muted-foreground mb-6">Agrega tu primer producto para comenzar a vender</p>
                  <Button
                    variant="hero"
                    onClick={() => setIsAddProductOpen(true)}
                    aria-label="Agregar producto"
                    title="Agregar producto"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden md:inline">Agregar Producto</span>
                    <span className="sr-only md:hidden">Agregar Producto</span>
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <h2 className="font-display text-xl font-bold mb-6">Pedidos Recibidos</h2>
              
              {myOrders.length > 0 ? (
                <div className="space-y-4">
                  {myOrders.map((order) => {
                    const orderedProducts = order.products
                      .map((item) => products.find((p) => p.id === item.productId))
                      .filter(Boolean);

                    const canDelivery = orderedProducts.every((p) => p?.acceptsDelivery !== false);
                    const canPickup = orderedProducts.every((p) => p?.acceptsPickup !== false);

                    const optionsLabel = canDelivery && canPickup
                      ? 'Entrega y Retiro'
                      : canDelivery
                        ? 'Entrega a domicilio'
                        : canPickup
                          ? 'Retiro'
                          : 'Entrega / Retiro';

                    const deliveryMethod = order.delivery?.method;
                    const isPickup = deliveryMethod === 'pickup';
                    const deliveryText = isPickup
                      ? 'Retiro'
                      : order.delivery?.address
                        ? `${order.delivery.address.label || 'Dirección'}: ${order.delivery.address.address || ''}${order.delivery.address.city ? `, ${order.delivery.address.city}` : ''}`.trim()
                        : order.delivery?.addressText
                          ? `Entrega: ${order.delivery.addressText}`
                          : null;

                    return (
                      <div
                        key={order.id}
                        className="bg-card rounded-xl border border-border p-6 animate-slide-up"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                          <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between gap-3">
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
                                  })} - {order.products.length} productos
                                </p>
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Eliminar orden"
                                title="Eliminar orden"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteOrder(order)}
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {optionsLabel}
                              </Badge>
                              {deliveryMethod && (
                                <Badge variant="secondary" className="text-xs">
                                  Método: {deliveryMethod === 'pickup' ? 'Retiro' : 'Entrega'}
                                </Badge>
                              )}
                            </div>

                            <div className="space-y-2">
                              {order.products.map((item) => {
                                const product = products.find((p) => p.id === item.productId);
                                const name = product?.name || `Producto ${item.productId}`;
                                return (
                                  <div key={item.productId} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                      {name} x{item.quantity}
                                    </span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                );
                              })}
                            </div>

                            {(order.contact?.phone || deliveryText) && (
                              <div className="space-y-2 text-xs text-muted-foreground">
                                {order.contact?.phone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 shrink-0" />
                                    <span>{order.contact.phone}</span>
                                  </div>
                                )}
                                {deliveryText && (
                                  <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                                    <p className="max-w-[420px]">{deliveryText}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="lg:text-right lg:min-w-[180px]">
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="font-display text-2xl font-bold text-primary">
                              ${order.total.toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {order.paymentMethod === 'paypal' ? 'PayPal' : 'Efectivo'}
                            </p>

                            {order.status !== 'delivered' && order.status !== 'cancelled' && (
                              <div className="mt-3 flex flex-wrap justify-start lg:justify-end gap-2">
                                {order.status === 'pending' && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setOrderStatus(order, 'confirmed')}
                                    >
                                      Confirmar
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => setOrderStatus(order, 'cancelled')}
                                    >
                                      Cancelar
                                    </Button>
                                  </>
                                )}

                                {order.status === 'confirmed' && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setOrderStatus(order, 'preparing')}
                                    >
                                      Preparando
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => setOrderStatus(order, 'cancelled')}
                                    >
                                      Cancelar
                                    </Button>
                                  </>
                                )}

                                {order.status === 'preparing' && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setOrderStatus(order, 'ready')}
                                    >
                                      Listo
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => setOrderStatus(order, 'cancelled')}
                                    >
                                      Cancelar
                                    </Button>
                                  </>
                                )}

                                {order.status === 'ready' && (
                                  <Button
                                    size="sm"
                                    variant="success"
                                    onClick={() => setOrderStatus(order, 'delivered')}
                                  >
                                    Entregado
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 bg-card rounded-xl border border-border">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-lg font-bold mb-2">Sin pedidos aún</h3>
                  <p className="text-muted-foreground">Los pedidos de tus clientes aparecerán aquí</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
