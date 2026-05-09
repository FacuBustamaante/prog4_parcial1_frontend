import { LoadingStateProps } from '../types';

export const LoadingState = ({ message = 'Cargando...' }: LoadingStateProps) => (
  <div className="rounded-3xl border border-slate-200 bg-white/90 px-6 py-10 text-center text-sm font-semibold text-slate-500 shadow-sm">
    {message}
  </div>
);
