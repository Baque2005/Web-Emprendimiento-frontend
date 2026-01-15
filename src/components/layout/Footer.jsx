import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4 text-center md:text-left">
            <Link to="/" className="flex items-center justify-center md:justify-start gap-0 font-display text-xl font-bold">
              <div className="flex h-16 w-16 items-center justify-center">
                <img src="/UGLOGO.png" alt="UG" className="h-12 w-12 object-contain" />
              </div>
              <span className="-ml-1">
                <span className="text-primary">UG</span>
                <span className="text-accent"> Emprende</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Plataforma de microemprendimientos estudiantiles de la Universidad de Guayaquil.
            </p>
          </div>

          {/* Links */}
          <div className="text-left">
            <h4 className="font-semibold mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/catalog" className="hover:text-primary transition-colors">Catálogo</Link></li>
              <li><Link to="/businesses" className="hover:text-primary transition-colors">Negocios</Link></li>
              <li><Link to="/register" className="hover:text-primary transition-colors">Registrar Negocio</Link></li>
              <li><Link to="/help" className="hover:text-primary transition-colors">Centro de Ayuda</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="text-left">
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/terms" className="hover:text-primary transition-colors">Términos de Uso</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Política de Privacidad</Link></li>
              <li><Link to="/help#preguntas-frecuentes" className="hover:text-primary transition-colors">Preguntas Frecuentes</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-left">
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:ugemprende@ug.edu.ec" className="hover:text-primary transition-colors">
                  ugemprende@ug.edu.ec
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>(04) 228-7072</span>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-primary" />
                <a href="https://instagram.com/ug_emprende" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  @ug_emprende
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 UG Emprende - Universidad de Guayaquil. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};