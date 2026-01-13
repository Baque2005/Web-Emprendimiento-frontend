import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  ShoppingCart,
  Menu,
  Store,
  LogOut,
  Settings,
  Package,
  HelpCircle,
  Shield,
  IdCard,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const Navbar = () => {
  const { user, setUser, cart } = useApp();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const navLinks = [
    { href: '/catalog', label: 'Catálogo' },
    { href: '/businesses', label: 'Negocios' },
    { href: '/help', label: 'Ayuda' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-0 font-display text-xl font-bold">
          <div className="flex h-16 w-16 items-center justify-center">
            <img src="/UGLOGO.png" alt="UG" className="h-12 w-12 object-contain" />
          </div>
          <span className="hidden sm:inline -ml-1">
            <span className="text-primary">UG</span>
            <span className="text-accent"> Emprende</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <Badge
                variant="default"
                className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground"
              >
                {cartItemCount}
              </Badge>
            )}
          </Button>

          {/* User Menu / Auth */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                {user.role === 'entrepreneur' && (
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <Store className="mr-2 h-4 w-4" />
                    Mi Negocio
                  </DropdownMenuItem>
                )}
                {user.role === 'admin' && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <Shield className="mr-2 h-4 w-4" />
                    Administración
                  </DropdownMenuItem>
                )}
                {user.role !== 'admin' && (
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <IdCard className="mr-2 h-4 w-4" />
                    Mi Perfil
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigate('/orders')}>
                  <Package className="mr-2 h-4 w-4" />
                  Mis Pedidos
                </DropdownMenuItem>
                {user.role !== 'admin' && (
                  <DropdownMenuItem onClick={() => navigate('/profile?tab=settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configuración
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigate('/help')}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Ayuda
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Ingresar
              </Button>
              <Button variant="hero" onClick={() => navigate('/register')}>
                Registrarse
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <>
                    <hr className="border-border" />
                    <Button variant="outline" onClick={() => { navigate('/login'); setIsOpen(false); }}>
                      Ingresar
                    </Button>
                    <Button variant="hero" onClick={() => { navigate('/register'); setIsOpen(false); }}>
                      Registrarse
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};