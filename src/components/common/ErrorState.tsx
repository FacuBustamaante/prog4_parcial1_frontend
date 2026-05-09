import { ErrorStateProps } from '../types';

export const ErrorState = ({ message = 'Error al cargar datos.' }: ErrorStateProps) => (
  <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center text-sm font-semibold text-red-700 shadow-sm">
    {message}
  </div>
);
