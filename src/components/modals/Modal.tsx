import type { FormModalProps } from '../types';
import { PrimaryButton, SecondaryButton } from '../buttons/Button';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  subtitle,
}: Omit<FormModalProps, 'onSubmit' | 'isSubmitting'>) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.55)]">
        <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">{subtitle}</p>
          <h2 className="mt-1 text-xl font-black text-slate-800">{title}</h2>
        </div>
        <div className="px-6 py-6">
          {children}
        </div>
        <div className="border-t border-slate-100 bg-slate-50/40 px-6 py-4 flex justify-end gap-3">
          <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
        </div>
      </div>
    </div>
  );
};

export const FormModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  subtitle,
  isSubmitting = false,
}: FormModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.55)]">
        <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">{subtitle}</p>
          <h2 className="mt-1 text-xl font-black text-slate-800">{title}</h2>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 px-6 py-6">
          {children}
        </form>

        <div className="border-t border-slate-100 bg-slate-50/40 px-6 py-4 flex justify-end gap-3">
          <SecondaryButton onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            onClick={(e) => {
              const form = (e.currentTarget as any).closest('[role="dialog"]')?.querySelector('form');
              if (form) {
                const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                form.dispatchEvent(submitEvent);
              }
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
