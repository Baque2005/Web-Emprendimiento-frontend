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
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, businesses, products, orders, addProduct, updateProduct, deleteProduct } = useApp();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
  });

  const [editProduct, setEditProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: '',
  });

  const isEntrepreneur = user?.role === 'entrepreneur';

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

    const product = {
      id: `p${Date.now()}`,
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      stock: parseInt(newProduct.stock) || 0,
      image: newProduct.image,
      businessId: business.id,
    };

    addProduct(product);
    toast.success('Producto agregado exitosamente');
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    });
    setIsAddProductOpen(false);
  };

  const handleDeleteProduct = (productId) => {
    deleteProduct(productId);
    toast.success('Producto eliminado');
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditProduct({
      name: product.name || '',
      description: product.description || '',
      price: String(product.price ?? ''),
      category: product.category || '',
      stock: String(product.stock ?? ''),
      image: product.image || '',
    });
    setIsEditProductOpen(true);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    if (!editProduct.name || !editProduct.price || !editProduct.category) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    const updated = {
      ...editingProduct,
      name: editProduct.name,
      description: editProduct.description,
      price: parseFloat(editProduct.price),
      category: editProduct.category,
      stock: parseInt(editProduct.stock) || 0,
      image: editProduct.image || editingProduct.image,
      businessId: business.id,
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
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate(`/business/${business.id}`)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Perfil Público
                </Button>
                <Button variant="outline" onClick={() => navigate('/settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Configuración
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
                  <DialogContent className="sm:max-w-md">
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
                        <Label>URL de Imagen</Label>
                        <Input
                          value={editProduct.image}
                          onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })}
                          placeholder="https://..."
                        />
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
                    <Button variant="hero">
                      <Plus className="h-4 w-4" />
                      Agregar Producto
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
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
                        <Label>URL de Imagen</Label>
                        <Input
                          value={newProduct.image}
                          onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                          placeholder="https://..."
                        />
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
                  <Button variant="hero" onClick={() => setIsAddProductOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Agregar Producto
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <h2 className="font-display text-xl font-bold mb-6">Pedidos Recibidos</h2>
              
              {myOrders.length > 0 ? (
                <div className="space-y-4">
                  {myOrders.map(order => (
                    <div
                      key={order.id}
                      className="bg-card rounded-xl border border-border p-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">Orden #{order.id.slice(-6).toUpperCase()}</h3>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(order.createdAt).toLocaleDateString('es-EC', {
                              dateStyle: 'medium',
                            })} - {order.products.length} productos
                          </p>

                          {(order.contact?.phone || order.delivery?.method) && (
                            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                              {order.contact?.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-3.5 w-3.5" />
                                  <span>{order.contact.phone}</span>
                                </div>
                              )}

                              {order.delivery?.method === 'pickup' && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-3.5 w-3.5" />
                                  <span>Retiro (sin dirección)</span>
                                </div>
                              )}

                              {order.delivery?.method === 'delivery' && (
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-3.5 w-3.5 mt-0.5" />
                                  <span>
                                    {order.delivery.address
                                      ? `${order.delivery.address.label || 'Dirección'}: ${order.delivery.address.address || ''}${order.delivery.address.city ? `, ${order.delivery.address.city}` : ''}`.trim()
                                      : order.delivery.addressText
                                        ? `Entrega: ${order.delivery.addressText}`
                                        : 'Entrega'}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-display text-xl font-bold text-primary">
                            ${order.total.toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.paymentMethod === 'paypal' ? 'PayPal' : 'Efectivo'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
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
