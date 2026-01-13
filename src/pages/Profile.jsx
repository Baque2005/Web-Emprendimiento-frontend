import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  Heart,
  Settings,
  Bell,
  CreditCard,
  Shield,
  Edit2,
  Save,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  Wallet,
  Banknote,
  Plus,
  Trash2,
  X,
  AlertTriangle,
  LogOut,
} from 'lucide-react';
import { mockProducts } from '@/data/mockData';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, orders = [], setUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab');
    const allowedTabs = ['info', 'orders', 'favorites', 'notifications', 'settings'];
    if (tab && allowedTabs.includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Profile data
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+593 99 888 7777',
    address: 'Av. Delta y Av. Kennedy, Guayaquil',
    birthDate: '1998-05-15',
  });

  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Payment methods state
  const paymentStorageKey = user?.id ? `ug-payment-methods:${user.id}` : 'ug-payment-methods';
  const [paymentMethods, setPaymentMethods] = useState(() => {
    const scoped = localStorage.getItem(paymentStorageKey);
    if (scoped) return JSON.parse(scoped);
    // Back-compat: if there is an old global key, reuse it once.
    const legacy = localStorage.getItem('ug-payment-methods');
    return legacy ? JSON.parse(legacy) : [];
  });

  // Addresses state
  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('ug-addresses');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'addr1',
            label: 'Casa',
            address: 'Av. Delta y Av. Kennedy',
            city: 'Guayaquil',
            phone: '+593 99 888 7777',
            isDefault: true,
          },
          {
            id: 'addr2',
            label: 'Universidad',
            address: 'Ciudadela Universitaria, Av. Kennedy',
            city: 'Guayaquil',
            phone: '+593 99 888 7777',
            isDefault: false,
          },
        ];
  });

  // Favorites state
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('ug-favorites');
    return saved ? JSON.parse(saved) : ['p1', 'p4', 'p9'];
  });
  const favoriteProducts = mockProducts.filter((p) => favorites.includes(p.id));

  // Notifications state
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Tu pedido está en preparación',
      message: 'El pedido #o1 está siendo preparado',
      time: '2 horas',
      read: false,
    },
    {
      id: 2,
      title: 'Nuevo producto disponible',
      message: 'Sabores UG agregó nuevos productos',
      time: '1 día',
      read: true,
    },
    {
      id: 3,
      title: '¡Oferta especial!',
      message: '20% de descuento en artesanías',
      time: '3 días',
      read: true,
    },
  ]);

  // Modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);

  // Form states for modals
  const [newPayment, setNewPayment] = useState({ type: 'paypal', email: '', label: '' });
  const [newAddress, setNewAddress] = useState({ label: '', address: '', city: '', phone: '' });

  // Pedidos del usuario
  const userOrders = orders.filter(
    (o) => o.customerId === user?.id || o.customerId === 'u1' || o.customerId === 'c1'
  );

  // Redirect if not logged in (avoid navigate during render)
  useEffect(() => {
    if (!user) navigate('/login', { replace: true });
  }, [user, navigate]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(paymentStorageKey, JSON.stringify(paymentMethods));
  }, [paymentMethods, paymentStorageKey]);

  useEffect(() => {
    localStorage.setItem('ug-addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('ug-favorites', JSON.stringify(favorites));
  }, [favorites]);

  if (!user) return null;

  const handleSave = () => {
    setUser({
      ...user,
      name: profileData.name,
      email: profileData.email,
    });
    setIsEditing(false);
    toast.success('Perfil actualizado correctamente');
  };

  const handleCancel = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '+593 99 888 7777',
      address: 'Av. Delta y Av. Kennedy, Guayaquil',
      birthDate: '1998-05-15',
    });
    setIsEditing(false);
  };

  const removeFavorite = (productId) => {
    setFavorites((prev) => prev.filter((id) => id !== productId));
    toast.success('Eliminado de favoritos');
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('Todas las notificaciones marcadas como leídas');
  };

  const deleteNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    toast.success('Notificación eliminada');
  };

  // Payment methods functions
  const addPaymentMethod = () => {
    if (newPayment.type === 'paypal' && !newPayment.email) {
      toast.error('Por favor ingresa el correo de PayPal');
      return;
    }
    const newMethod = {
      id: `pm${Date.now()}`,
      type: newPayment.type,
      label: newPayment.label || (newPayment.type === 'paypal' ? 'PayPal' : 'Efectivo'),
      email: newPayment.type === 'paypal' ? newPayment.email : undefined,
      isDefault: paymentMethods.length === 0,
    };
    setPaymentMethods((prev) => [...prev, newMethod]);
    setNewPayment({ type: 'paypal', email: '', label: '' });
    setShowPaymentModal(false);
    toast.success('Método de pago agregado');
  };

  const removePaymentMethod = (id) => {
    const method = paymentMethods.find((pm) => pm.id === id);
    if (method?.isDefault && paymentMethods.length > 1) {
      toast.error('No puedes eliminar el método de pago predeterminado');
      return;
    }
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
    toast.success('Método de pago eliminado');
  };

  const setDefaultPaymentMethod = (id) => {
    setPaymentMethods((prev) => prev.map((pm) => ({ ...pm, isDefault: pm.id === id })));
    toast.success('Método de pago predeterminado actualizado');
  };

  // Address functions
  const addAddress = () => {
    if (!newAddress.address || !newAddress.city) {
      toast.error('Por favor completa la dirección');
      return;
    }
    const addr = {
      id: `addr${Date.now()}`,
      label: newAddress.label || 'Nueva Dirección',
      address: newAddress.address,
      city: newAddress.city,
      phone: newAddress.phone || profileData.phone,
      isDefault: addresses.length === 0,
    };
    setAddresses((prev) => [...prev, addr]);
    setNewAddress({ label: '', address: '', city: '', phone: '' });
    setShowAddressModal(false);
    toast.success('Dirección agregada');
  };

  const removeAddress = (id) => {
    const addr = addresses.find((a) => a.id === id);
    if (addr?.isDefault && addresses.length > 1) {
      toast.error('No puedes eliminar la dirección predeterminada');
      return;
    }
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success('Dirección eliminada');
  };

  const setDefaultAddress = (id) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    toast.success('Dirección predeterminada actualizada');
  };

  const handleDeleteAccount = () => {
    setUser(null);
    localStorage.removeItem('ug-user');
    localStorage.removeItem('ug-cart');
    localStorage.removeItem('ug-favorites');
    localStorage.removeItem('ug-payment-methods');
    if (user?.id) localStorage.removeItem(`ug-payment-methods:${user.id}`);
    localStorage.removeItem('ug-addresses');
    toast.success('Cuenta eliminada correctamente');
    navigate('/');
  };

  const handleLogout = () => {
    setUser(null);
    toast.success('Sesión cerrada correctamente');
    navigate('/');
  };

  const handleEnableTwoFactor = () => {
    setTwoFactorEnabled(true);
    setShowTwoFactorModal(false);
    toast.success('Autenticación de dos factores activada');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      delivered: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      preparing: 'En preparación',
      ready: 'Listo',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    };
    return texts[status] || status;
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Layout>
      <div className="container py-4 sm:py-6 lg:py-8 px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-primary/20">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-xl sm:text-2xl bg-gradient-primary text-white">
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 mb-2">
              <h1 className="font-display text-2xl sm:text-3xl font-bold">{user.name}</h1>
              <Badge variant="secondary" className="capitalize">
                {user.role === 'customer' ? 'Comprador' : user.role}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">{user.email}</p>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1 mt-1">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              Miembro desde Enero 2025
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel} className="flex-1 sm:flex-none">
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleSave} className="flex-1 sm:flex-none">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="flex-1 sm:flex-none"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  <span className="sm:inline">Editar</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-destructive hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4 sm:pt-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xl sm:text-2xl font-bold">{userOrders.length}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Pedidos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:pt-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xl sm:text-2xl font-bold">{favorites.length}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Favoritos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:pt-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xl sm:text-2xl font-bold">
                    {userOrders.filter((o) => o.status === 'delivered').length}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Completados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:pt-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xl sm:text-2xl font-bold">
                    ${userOrders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="w-full h-auto flex flex-wrap gap-1 p-1">
            <TabsTrigger
              value="info"
              className="flex-1 min-w-[80px] gap-1 sm:gap-2 text-xs sm:text-sm py-2"
            >
              <User className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Info</span>
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="flex-1 min-w-[80px] gap-1 sm:gap-2 text-xs sm:text-sm py-2"
            >
              <Package className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Pedidos</span>
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="flex-1 min-w-[80px] gap-1 sm:gap-2 text-xs sm:text-sm py-2"
            >
              <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Favoritos</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex-1 min-w-[80px] gap-1 sm:gap-2 text-xs sm:text-sm py-2 relative"
            >
              <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Alertas</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex-1 min-w-[80px] gap-1 sm:gap-2 text-xs sm:text-sm py-2"
            >
              <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Config</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Info Personal */}
          <TabsContent value="info">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Información Personal</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Gestiona tu información de perfil y datos de contacto
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4 sm:space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs sm:text-sm">
                      Nombre Completo
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs sm:text-sm">
                      Correo Electrónico
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs sm:text-sm">
                      Teléfono
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-xs sm:text-sm">
                      Dirección
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Mis Pedidos */}
          <TabsContent value="orders">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Historial de Pedidos</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Revisa el estado de tus pedidos y su historial
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                {userOrders.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <Package className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold mb-2">No tienes pedidos aún</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Explora el catálogo y realiza tu primer pedido
                    </p>
                    <Button onClick={() => navigate('/catalog')}>Ver Catálogo</Button>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {userOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3 cursor-pointer"
                        onClick={() => navigate('/orders')}
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm sm:text-base">Pedido #{order.id}</p>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {new Date(order.createdAt).toLocaleDateString('es-EC', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                          <div className="text-left sm:text-right">
                            <p className="font-semibold text-sm sm:text-base">${order.total.toFixed(2)}</p>
                            <Badge className={`${getStatusColor(order.status)} text-xs`}>
                              {getStatusText(order.status)}
                            </Badge>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground hidden sm:block" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Favoritos */}
          <TabsContent value="favorites">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Productos Favoritos</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Tus productos guardados para después
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                {favoriteProducts.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <Heart className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold mb-2">No tienes favoritos</h3>
                    <p className="text-sm text-muted-foreground mb-4">Guarda los productos que te gusten</p>
                    <Button onClick={() => navigate('/catalog')}>Explorar Productos</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {favoriteProducts.map((product) => (
                      <div
                        key={product.id}
                        className="group relative border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div
                          className="aspect-video relative cursor-pointer"
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <button
                            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-red-50 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFavorite(product.id);
                            }}
                          >
                            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                          </button>
                        </div>
                        <div className="p-3 sm:p-4">
                          <h4 className="font-semibold text-sm sm:text-base line-clamp-1">{product.name}</h4>
                          <p className="text-base sm:text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Notificaciones */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Notificaciones</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Mantente al día con las novedades</CardDescription>
                  </div>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllNotificationsAsRead}
                      className="text-xs sm:text-sm"
                    >
                      Marcar todas como leídas
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <Bell className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold mb-2">No tienes notificaciones</h3>
                    <p className="text-sm text-muted-foreground">Te avisaremos cuando haya novedades</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border transition-colors ${
                          notification.read ? 'bg-background' : 'bg-primary/5 border-primary/20'
                        }`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div
                          className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center shrink-0 ${
                            notification.read ? 'bg-muted' : 'bg-primary/10'
                          }`}
                        >
                          <Bell
                            className={`h-4 w-4 sm:h-5 sm:w-5 ${
                              notification.read ? 'text-muted-foreground' : 'text-primary'
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm sm:text-base truncate">{notification.title}</p>
                            {!notification.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Hace {notification.time}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Configuración */}
          <TabsContent value="settings">
            <div className="space-y-4 sm:space-y-6">
              {/* Métodos de Pago */}
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        Métodos de Pago
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Configura tus métodos de pago preferidos
                      </CardDescription>
                    </div>
                    <Button size="sm" onClick={() => setShowPaymentModal(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Agregar</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  {paymentMethods.length === 0 ? (
                    <div className="text-center py-10 border rounded-lg bg-muted/30">
                      <Wallet className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="font-medium">Aún no tienes métodos de pago</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Agrega uno para poder completar compras más rápido.
                      </p>
                      <Button size="sm" onClick={() => setShowPaymentModal(true)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar método
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`flex items-center justify-between p-3 sm:p-4 border rounded-lg ${
                            method.isDefault ? 'border-primary bg-primary/5' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div
                              className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center ${
                                method.type === 'paypal' ? 'bg-white border border-border' : 'bg-green-100'
                              }`}
                            >
                              {method.type === 'paypal' ? (
                                <img
                                  src="/PayPal-Symbol.png"
                                  alt="PayPal"
                                  className="h-5 w-5 sm:h-6 sm:w-6 object-contain"
                                />
                              ) : (
                                <Banknote className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm sm:text-base">{method.label}</p>
                                {method.isDefault && (
                                  <Badge variant="secondary" className="text-[10px] sm:text-xs">
                                    Predeterminado
                                  </Badge>
                                )}
                              </div>
                              {method.email && (
                                <p className="text-xs sm:text-sm text-muted-foreground">{method.email}</p>
                              )}
                              <p className="text-xs text-muted-foreground capitalize">
                                {method.type === 'paypal' ? 'PayPal' : 'Pago en Efectivo'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!method.isDefault && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDefaultPaymentMethod(method.id)}
                                className="text-xs"
                              >
                                Usar
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removePaymentMethod(method.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Direcciones de Entrega */}
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Direcciones de Entrega
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Gestiona tus direcciones de entrega
                      </CardDescription>
                    </div>
                    <Button size="sm" onClick={() => setShowAddressModal(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Agregar</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`flex items-center justify-between p-3 sm:p-4 border rounded-lg ${
                          addr.isDefault ? 'border-primary bg-primary/5' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm sm:text-base">{addr.label}</p>
                              {addr.isDefault && (
                                <Badge variant="secondary" className="text-[10px] sm:text-xs">
                                  Predeterminado
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground">{addr.address}</p>
                            <p className="text-xs text-muted-foreground">
                              {addr.city} • {addr.phone}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!addr.isDefault && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDefaultAddress(addr.id)}
                              className="text-xs"
                            >
                              Usar
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeAddress(addr.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Preferencias */}
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">Preferencias</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Configura tus preferencias de notificación y seguridad
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
                  <div className="flex items-center justify-between p-3 sm:p-4 border rounded-lg">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm sm:text-base">Notificaciones por Email</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Recibe actualizaciones sobre tus pedidos
                        </p>
                      </div>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 border rounded-lg">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Bell className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm sm:text-base">Notificaciones Push</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Recibe alertas en tu navegador</p>
                      </div>
                    </div>
                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 border rounded-lg">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm sm:text-base">Autenticación de dos factores</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Añade una capa extra de seguridad</p>
                      </div>
                    </div>
                    {twoFactorEnabled ? (
                      <Badge className="bg-green-100 text-green-800">Activo</Badge>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => setShowTwoFactorModal(true)}>
                        Activar
                      </Button>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <Button
                    variant="outline"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Eliminar Cuenta
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal: Agregar Método de Pago */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Método de Pago</DialogTitle>
            <DialogDescription>Selecciona el tipo de pago que deseas agregar</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                className={`p-4 border rounded-lg text-center transition-colors ${
                  newPayment.type === 'paypal' ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                }`}
                onClick={() => setNewPayment({ ...newPayment, type: 'paypal' })}
              >
                <img
                  src="/PayPal-Symbol.png"
                  alt="PayPal"
                  className="h-8 w-8 mx-auto mb-2 object-contain"
                />
                <p className="font-medium">PayPal</p>
              </button>
              <button
                className={`p-4 border rounded-lg text-center transition-colors ${
                  newPayment.type === 'cash' ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                }`}
                onClick={() => setNewPayment({ ...newPayment, type: 'cash' })}
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
                onChange={(e) => setNewPayment({ ...newPayment, label: e.target.value })}
              />
            </div>

            {newPayment.type === 'paypal' && (
              <div className="space-y-2">
                <Label>Correo de PayPal</Label>
                <Input
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={newPayment.email}
                  onChange={(e) => setNewPayment({ ...newPayment, email: e.target.value })}
                />
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button onClick={addPaymentMethod} className="w-full sm:w-auto">
              Agregar
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowPaymentModal(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Agregar Dirección */}
      <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Dirección</DialogTitle>
            <DialogDescription>Ingresa los datos de tu nueva dirección de entrega</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Etiqueta</Label>
              <Input
                placeholder="Casa, Trabajo, Universidad..."
                value={newAddress.label}
                onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Dirección</Label>
              <Input
                placeholder="Calle, número, referencias..."
                value={newAddress.address}
                onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Ciudad</Label>
              <Input
                placeholder="Guayaquil"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Teléfono de contacto</Label>
              <Input
                placeholder="+593 99 XXX XXXX"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddressModal(false)}>
              Cancelar
            </Button>
            <Button onClick={addAddress}>Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Confirmar Eliminación de Cuenta */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Eliminar Cuenta
            </DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminarán todos tus datos, pedidos y configuraciones.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              ¿Estás seguro de que deseas eliminar tu cuenta permanentemente?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Sí, eliminar cuenta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Activar 2FA */}
      <Dialog open={showTwoFactorModal} onOpenChange={setShowTwoFactorModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Activar Autenticación de Dos Factores
            </DialogTitle>
            <DialogDescription>Protege tu cuenta con una capa adicional de seguridad</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-4xl font-mono font-bold tracking-widest mb-2">123 456</p>
              <p className="text-sm text-muted-foreground">Código de verificación de ejemplo</p>
            </div>
            <p className="text-sm text-muted-foreground">
              En una implementación real, escanearías un código QR con tu aplicación de autenticación (Google
              Authenticator, Authy, etc.)
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTwoFactorModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEnableTwoFactor}>Activar 2FA</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Profile;
