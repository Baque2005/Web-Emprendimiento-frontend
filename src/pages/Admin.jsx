import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useApp } from '@/context/AppContext';
import { mockBusinesses, categories } from '@/data/mockData';
import { toast } from 'sonner';
import {
  Shield,
  Users,
  Store,
  Package,
  ShoppingBag,
  Search,
  MoreHorizontal,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  UserCheck,
  Building2,
  Filter,
  Download,
  RefreshCw,
  Mail,
  Trash2,
  Edit,
  Star,
} from 'lucide-react';

// Extended mock data for admin panel
const mockUsers = [
  { id: 'u1', name: 'María García', email: 'maria@ug.edu.ec', role: 'entrepreneur', businessId: 'b1', avatar: 'https://i.pravatar.cc/150?u=maria' },
  { id: 'u2', name: 'Carlos Mendoza', email: 'carlos@ug.edu.ec', role: 'entrepreneur', businessId: 'b2', avatar: 'https://i.pravatar.cc/150?u=carlos' },
  { id: 'u3', name: 'Luis Pérez', email: 'luis@ug.edu.ec', role: 'entrepreneur', businessId: 'b3', avatar: 'https://i.pravatar.cc/150?u=luis' },
  { id: 'u4', name: 'Ana Rodríguez', email: 'ana@ug.edu.ec', role: 'entrepreneur', businessId: 'b4', avatar: 'https://i.pravatar.cc/150?u=ana' },
  { id: 'u5', name: 'Pedro Suárez', email: 'pedro@ug.edu.ec', role: 'customer', avatar: 'https://i.pravatar.cc/150?u=pedro' },
  { id: 'u6', name: 'Laura Cevallos', email: 'laura@ug.edu.ec', role: 'customer', avatar: 'https://i.pravatar.cc/150?u=laura' },
  { id: 'u7', name: 'Diego Morales', email: 'diego@ug.edu.ec', role: 'student', avatar: 'https://i.pravatar.cc/150?u=diego' },
  { id: 'u8', name: 'Sofía Ramos', email: 'sofia@ug.edu.ec', role: 'student', avatar: 'https://i.pravatar.cc/150?u=sofia' },
];

const mockReports = [
  { id: 'r1', type: 'product', targetId: 'p1', targetName: 'Almuerzo Ejecutivo', reason: 'Precio incorrecto', reportedBy: 'Pedro Suárez', reportedAt: '2024-12-20T10:00:00Z', status: 'pending' },
  { id: 'r2', type: 'business', targetId: 'b2', targetName: 'Arte Manabita', reason: 'Información desactualizada', reportedBy: 'Laura Cevallos', reportedAt: '2024-12-19T14:00:00Z', status: 'pending' },
  { id: 'r3', type: 'user', targetId: 'u7', targetName: 'Diego Morales', reason: 'Comportamiento inadecuado', reportedBy: 'Ana Rodríguez', reportedAt: '2024-12-18T09:00:00Z', status: 'reviewed' },
];

const Admin = () => {
  const navigate = useNavigate();
  const { user, products = [], orders = [] } = useApp();
  const isAdmin = !!user && user.role === 'admin';
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [businessFilter, setBusinessFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isBusinessDialogOpen, setIsBusinessDialogOpen] = useState(false);
  const [users] = useState(mockUsers);
  const [businesses] = useState(mockBusinesses);
  const [reports, setReports] = useState(mockReports);
  const [userStatuses, setUserStatuses] = useState({});
  const [businessStatuses, setBusinessStatuses] = useState({});

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/login', { replace: true });
    }
  }, [isAdmin, navigate]);

  // Filtered data
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = userFilter === 'all' || u.role === userFilter;
      return matchesSearch && matchesFilter;
    });
  }, [users, searchTerm, userFilter]);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter(b => {
      const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           b.owner.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = businessFilter === 'all' || b.category === businessFilter;
      return matchesSearch && matchesFilter;
    });
  }, [businesses, searchTerm, businessFilter]);

  if (!isAdmin) return null;

  // Stats
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => (userStatuses[u.id] || 'active') === 'active').length,
    totalBusinesses: businesses.length,
    pendingBusinesses: businesses.filter(b => businessStatuses[b.id] === 'pending').length,
    totalProducts: products.length,
    totalOrders: orders.length,
    pendingReports: reports.filter(r => r.status === 'pending').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
  };

  // Actions
  const handleUserAction = (userId, action) => {
    const statusMap = { activate: 'active', suspend: 'suspended', ban: 'banned' };
    setUserStatuses((prev) => ({ ...prev, [userId]: statusMap[action] }));
    toast.success(`Usuario ${action === 'activate' ? 'activado' : action === 'suspend' ? 'suspendido' : 'baneado'} correctamente`);
  };

  const handleBusinessAction = (businessId, action) => {
    const statusMap = { approve: 'active', suspend: 'suspended', activate: 'active' };
    setBusinessStatuses((prev) => ({ ...prev, [businessId]: statusMap[action] }));
    toast.success(`Negocio ${action === 'approve' ? 'aprobado' : action === 'suspend' ? 'suspendido' : 'activado'} correctamente`);
  };

  const handleReportAction = (reportId, action) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, status: action === 'resolve' ? 'resolved' : 'dismissed' }
          : r
      )
    );
    toast.success(`Reporte ${action === 'resolve' ? 'resuelto' : 'descartado'}`);
  };

  const getUserStatus = (userId) => userStatuses[userId] || 'active';
  const getBusinessStatus = (businessId) => businessStatuses[businessId] || 'active';

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-destructive/20 text-destructive',
      entrepreneur: 'bg-primary/20 text-primary',
      customer: 'bg-accent/20 text-accent',
      student: 'bg-secondary text-secondary-foreground',
    };
    const labels = {
      admin: 'Admin',
      entrepreneur: 'Emprendedor',
      customer: 'Cliente',
      student: 'Estudiante',
    };
    const className = styles[role] || 'bg-muted text-muted-foreground';
    const label = labels[role] || role;
    return <Badge className={className}>{label}</Badge>;
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-success/20 text-success',
      suspended: 'bg-warning/20 text-warning',
      banned: 'bg-destructive/20 text-destructive',
      pending: 'bg-muted text-muted-foreground',
      reviewed: 'bg-primary/20 text-primary',
      resolved: 'bg-success/20 text-success',
      dismissed: 'bg-muted text-muted-foreground',
    };
    const labels = {
      active: 'Activo',
      suspended: 'Suspendido',
      banned: 'Baneado',
      pending: 'Pendiente',
      reviewed: 'Revisado',
      resolved: 'Resuelto',
      dismissed: 'Descartado',
    };
    const className = styles[status] || 'bg-muted text-muted-foreground';
    const label = labels[status] || status;
    return <Badge className={className}>{label}</Badge>;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <div className="bg-card border-b border-border">
          <div className="container py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-bold">Panel de Administración</h1>
                  <p className="text-muted-foreground">Gestiona usuarios, negocios y contenido</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold">{stats.totalUsers}</p>
                  <p className="text-sm text-muted-foreground">Usuarios</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Store className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold">{stats.totalBusinesses}</p>
                  <p className="text-sm text-muted-foreground">Negocios</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold">{stats.totalProducts}</p>
                  <p className="text-sm text-muted-foreground">Productos</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold">{stats.pendingReports}</p>
                  <p className="text-sm text-muted-foreground">Reportes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Usuarios Activos</p>
                  <p className="text-xl font-display font-bold">{stats.activeUsers}</p>
                </div>
                <UserCheck className="h-8 w-8 text-primary/50" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Negocios Pendientes</p>
                  <p className="text-xl font-display font-bold">{stats.pendingBusinesses}</p>
                </div>
                <Building2 className="h-8 w-8 text-accent/50" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-xl border border-success/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                  <p className="text-xl font-display font-bold">${stats.totalRevenue.toFixed(2)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success/50" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-warning/10 to-warning/5 rounded-xl border border-warning/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Pedidos</p>
                  <p className="text-xl font-display font-bold">{stats.totalOrders}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-warning/50" />
              </div>
            </div>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="users" className="gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Usuarios</span>
              </TabsTrigger>
              <TabsTrigger value="businesses" className="gap-2">
                <Store className="h-4 w-4" />
                <span className="hidden sm:inline">Negocios</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Productos</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">Reportes</span>
                {stats.pendingReports > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 justify-center">
                    {stats.pendingReports}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los roles</SelectItem>
                    <SelectItem value="entrepreneur">Emprendedores</SelectItem>
                    <SelectItem value="customer">Clientes</SelectItem>
                    <SelectItem value="student">Estudiantes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map(u => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatar || `https://i.pravatar.cc/40?u=${u.id}`}
                              alt={u.name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                            <span className="font-medium">{u.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{u.email}</TableCell>
                        <TableCell>{getRoleBadge(u.role)}</TableCell>
                        <TableCell>{getStatusBadge(getUserStatus(u.id))}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setSelectedUser(u); setIsUserDialogOpen(true); }}>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="h-4 w-4 mr-2" />
                                Enviar Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {getUserStatus(u.id) !== 'active' && (
                                <DropdownMenuItem onClick={() => handleUserAction(u.id, 'activate')}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Activar
                                </DropdownMenuItem>
                              )}
                              {getUserStatus(u.id) === 'active' && (
                                <DropdownMenuItem onClick={() => handleUserAction(u.id, 'suspend')} className="text-warning">
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Suspender
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleUserAction(u.id, 'ban')} className="text-destructive">
                                <Ban className="h-4 w-4 mr-2" />
                                Banear
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Businesses Tab */}
            <TabsContent value="businesses" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar negocios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={businessFilter} onValueChange={setBusinessFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                      <SelectItem key={cat.id} value={cat.id}>
                        <span className="inline-flex items-center gap-2">
                          {Icon ? <Icon className="h-4 w-4" /> : null}
                          <span>{cat.name}</span>
                        </span>
                      </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Negocio</TableHead>
                      <TableHead>Propietario</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBusinesses.map(b => (
                      <TableRow key={b.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={b.logo}
                              alt={b.name}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                            <div>
                              <span className="font-medium block">{b.name}</span>
                              <span className="text-xs text-muted-foreground">{b.faculty}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{b.owner}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {categories.find(c => c.id === b.category)?.name || b.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-warning text-warning" />
                            <span>{b.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(getBusinessStatus(b.id))}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/business/${b.id}`)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Perfil
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setSelectedBusiness(b); setIsBusinessDialogOpen(true); }}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {getBusinessStatus(b.id) === 'pending' && (
                                <DropdownMenuItem onClick={() => handleBusinessAction(b.id, 'approve')} className="text-success">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Aprobar
                                </DropdownMenuItem>
                              )}
                              {getBusinessStatus(b.id) !== 'active' && (
                                <DropdownMenuItem onClick={() => handleBusinessAction(b.id, 'activate')}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Activar
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleBusinessAction(b.id, 'suspend')} className="text-warning">
                                <XCircle className="h-4 w-4 mr-2" />
                                Suspender
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Negocio</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products
                      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(p => {
                        const business = businesses.find(b => b.id === p.businessId);
                        return (
                          <TableRow key={p.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="h-10 w-10 rounded-lg object-cover"
                                />
                                <span className="font-medium">{p.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {business?.name || 'Desconocido'}
                            </TableCell>
                            <TableCell className="font-semibold text-primary">
                              ${p.price.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={p.stock > 10 ? 'secondary' : p.stock > 0 ? 'outline' : 'destructive'}>
                                {p.stock}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {(() => {
                                const category = categories.find((c) => c.id === p.category);
                                const Icon = category?.icon;
                                return (
                                  <span className="inline-flex items-center gap-2">
                                    {Icon ? <Icon className="h-4 w-4" /> : null}
                                    <span>{category?.name || p.category}</span>
                                  </span>
                                );
                              })()}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => navigate(`/product/${p.id}`)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ver Producto
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-4">
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Objetivo</TableHead>
                      <TableHead>Razón</TableHead>
                      <TableHead>Reportado por</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map(r => (
                      <TableRow key={r.id}>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {r.type === 'product' ? <Package className="h-3 w-3 mr-1" /> : 
                             r.type === 'business' ? <Store className="h-3 w-3 mr-1" /> :
                             <Users className="h-3 w-3 mr-1" />}
                            {r.type === 'product' ? 'Producto' : r.type === 'business' ? 'Negocio' : 'Usuario'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{r.targetName}</TableCell>
                        <TableCell className="text-muted-foreground max-w-xs truncate">
                          {r.reason}
                        </TableCell>
                        <TableCell>{r.reportedBy}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(r.reportedAt).toLocaleDateString('es-EC')}
                        </TableCell>
                        <TableCell>{getStatusBadge(r.status)}</TableCell>
                        <TableCell className="text-right">
                          {r.status === 'pending' && (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReportAction(r.id, 'resolve')}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleReportAction(r.id, 'dismiss')}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* User Detail Dialog */}
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Detalles del Usuario</DialogTitle>
              <DialogDescription>Información completa del usuario seleccionado</DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedUser.avatar || `https://i.pravatar.cc/80?u=${selectedUser.id}`}
                    alt={selectedUser.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-display text-lg font-bold">{selectedUser.name}</h3>
                    <p className="text-muted-foreground">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Rol</p>
                    {getRoleBadge(selectedUser.role)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estado</p>
                    {getStatusBadge(getUserStatus(selectedUser.id))}
                  </div>
                </div>
                {selectedUser.businessId && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Negocio Asociado</p>
                    <p className="font-medium">
                      {businesses.find(b => b.id === selectedUser.businessId)?.name || 'N/A'}
                    </p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                Cerrar
              </Button>
              <Button variant="destructive" onClick={() => {
                if (selectedUser) handleUserAction(selectedUser.id, 'ban');
                setIsUserDialogOpen(false);
              }}>
                Banear Usuario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Business Detail Dialog */}
        <Dialog open={isBusinessDialogOpen} onOpenChange={setIsBusinessDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalles del Negocio</DialogTitle>
              <DialogDescription>Información completa del negocio seleccionado</DialogDescription>
            </DialogHeader>
            {selectedBusiness && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedBusiness.logo}
                    alt={selectedBusiness.name}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-display text-lg font-bold">{selectedBusiness.name}</h3>
                    <p className="text-muted-foreground">{selectedBusiness.faculty}</p>
                  </div>
                </div>
                <p className="text-sm">{selectedBusiness.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Propietario</p>
                    <p className="font-medium">{selectedBusiness.owner}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedBusiness.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Teléfono</p>
                    <p className="font-medium">{selectedBusiness.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Ventas Totales</p>
                    <p className="font-medium">{selectedBusiness.totalSales}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rating</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span className="font-medium">{selectedBusiness.rating}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Miembro desde</p>
                    <p className="font-medium">
                      {new Date(selectedBusiness.joinedDate).toLocaleDateString('es-EC')}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setIsBusinessDialogOpen(false)}>
                Cerrar
              </Button>
              <Button onClick={() => {
                if (selectedBusiness) navigate(`/business/${selectedBusiness.id}`);
              }}>
                Ver Perfil Público
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Admin;
