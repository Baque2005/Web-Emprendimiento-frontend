import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Flag } from 'lucide-react';

const typeLabel = (type) => {
  if (type === 'product') return 'producto';
  if (type === 'business') return 'negocio';
  if (type === 'user') return 'usuario';
  return 'contenido';
};

export const ReportButton = ({
  type,
  targetId,
  targetName,
  className,
  buttonVariant = 'outline',
  buttonSize = 'sm',
  showText = true,
}) => {
  const navigate = useNavigate();
  const { user, createReport } = useApp();

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const label = useMemo(() => typeLabel(type), [type]);

  const onOpen = () => {
    if (!user) {
      toast.error('Inicia sesión para reportar');
      navigate('/login');
      return;
    }
    setOpen(true);
  };

  const onSubmit = async () => {
    const trimmed = reason.trim();
    if (!trimmed) {
      toast.error('Escribe la razón del reporte');
      return;
    }

    try {
      setSubmitting(true);
      createReport({ type, targetId, targetName, reason: trimmed });
      toast.success('Reporte enviado');
      setReason('');
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant={buttonVariant}
        size={buttonSize}
        className={cn(
          className,
          'hover:text-destructive hover:border-destructive hover:bg-destructive/10 active:text-destructive active:border-destructive active:bg-destructive/10',
          open && 'text-destructive border-destructive bg-destructive/10'
        )}
        onClick={onOpen}
      >
        <Flag className="h-4 w-4" />
        {showText ? `Reportar ${label}` : null}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reportar {label}</DialogTitle>
            <DialogDescription>
              Cuéntanos por qué quieres reportar {targetName ? `"${targetName}"` : `este ${label}`}. Esto se enviará al administrador.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label>Razón</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej: Información incorrecta, precio engañoso, contenido inapropiado..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Evita incluir datos sensibles. El reporte quedará registrado.
            </p>
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button type="button" onClick={onSubmit} disabled={submitting} className="w-full sm:w-auto">
              {submitting ? 'Enviando...' : 'Enviar reporte'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
