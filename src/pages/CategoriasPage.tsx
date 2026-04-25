import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../api/services';
import { type Categoria } from '../interfaces';

const CategoriasPage = () => {
   const queryClient = useQueryClient();
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingId, setEditingId] = useState<number | null>(null);

   const [formData, setFormData] = useState({
      nombre: '',
      descripcion: ''
   });
   const [deleteErrorPopup, setDeleteErrorPopup] = useState<{
      isOpen: boolean;
      message: string;
   }>({ isOpen: false, message: '' });
   const popupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

   const { data: categorias, isLoading, isError } = useQuery({
      queryKey: ['categorias'],
      queryFn: getCategorias,
   });

   const createMutation = useMutation({
      mutationFn: createCategoria,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['categorias'] });
         closeModal();
      },
   });

   const updateMutation = useMutation({
      mutationFn: (data: Partial<Categoria>) => updateCategoria(editingId!, data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['categorias'] });
         closeModal();
      },
   });

   const deleteMutation = useMutation({
      mutationFn: deleteCategoria,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['categorias'] });
      },
      onError: (error) => {
         let message = 'No se puede eliminar esta categoría porque tiene productos relacionados.';

         if (isAxiosError(error)) {
            const detail = error.response?.data?.detail;
            if (typeof detail === 'string' && detail.trim()) {
               message = detail;
            }
         }

         openDeleteErrorPopup(message);
      },
   });

   const openDeleteErrorPopup = (message: string) => {
      if (popupTimerRef.current) {
         clearTimeout(popupTimerRef.current);
      }

      setDeleteErrorPopup({ isOpen: true, message });

      popupTimerRef.current = setTimeout(() => {
         setDeleteErrorPopup({ isOpen: false, message: '' });
      }, 4000);
   };

   const closeDeleteErrorPopup = () => {
      if (popupTimerRef.current) {
         clearTimeout(popupTimerRef.current);
      }
      setDeleteErrorPopup({ isOpen: false, message: '' });
   };

   useEffect(() => {
      return () => {
         if (popupTimerRef.current) {
            clearTimeout(popupTimerRef.current);
         }
      };
   }, []);

   const closeModal = () => {
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ nombre: '', descripcion: '' });
   };

   const handleEditClick = (cat: Categoria) => {
      setEditingId(cat.id);
      setFormData({
         nombre: cat.nombre,
         descripcion: cat.descripcion || ''
      });
      setIsModalOpen(true);
   };

   const handleDeleteClick = (id: number) => {
      if (window.confirm("¿Estás seguro de eliminar esta categoría? Esto podría afectar a los productos vinculados.")) {
         deleteMutation.mutate(id);
      }
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingId !== null) {
         updateMutation.mutate(formData);
      } else {
         createMutation.mutate(formData);
      }
   };

   if (isLoading) return <div className="rounded-3xl border border-slate-200 bg-white/90 px-6 py-10 text-center text-sm font-semibold text-slate-500 shadow-sm">Cargando categorías...</div>;
   if (isError) return <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center text-sm font-semibold text-red-700 shadow-sm">Error al cargar categorías.</div>;

   return (
      <section className="relative isolate overflow-hidden rounded-[28px] border border-slate-200/80 bg-linear-to-br from-white via-slate-50 to-slate-100/70 p-6 md:p-8 shadow-[0_14px_38px_-28px_rgba(15,23,42,0.45)]">
         <div className="pointer-events-none absolute -left-24 -top-28 h-56 w-56 rounded-full bg-cyan-100/50 blur-3xl" />
         <div className="pointer-events-none absolute -right-28 bottom-6 h-56 w-56 rounded-full bg-indigo-100/40 blur-3xl" />

         <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
               <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Gestión</p>
               <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-800">Categorías</h2>
               <p className="mt-2 text-sm text-slate-500">Organiza tus productos por grupo con una estructura clara y mantenible.</p>
            </div>
            <button
               onClick={() => setIsModalOpen(true)}
               className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0"
            >
               + Nueva categoría
            </button>
         </div>

         <div className="relative mt-6 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-[0_20px_40px_-32px_rgba(15,23,42,0.65)] backdrop-blur-sm">
            <table className="min-w-full divide-y divide-slate-200/80">
               <thead className="bg-slate-100/80">
                  <tr>
                     <th className="px-6 py-4 text-left text-[11px] font-bold tracking-wide text-slate-500 uppercase">Nombre</th>
                     <th className="px-6 py-4 text-left text-[11px] font-bold tracking-wide text-slate-500 uppercase">Descripción</th>
                     <th className="px-6 py-4 text-left text-[11px] font-bold tracking-wide text-slate-500 uppercase">Acciones</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {categorias?.map((cat) => (
                     <tr key={cat.id} className="group transition-colors hover:bg-slate-50/80">
                        <td className="px-6 py-4">
                           <p className="text-sm font-bold text-slate-800">{cat.nombre}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{cat.descripcion || 'Sin descripción'}</td>
                        <td className="px-6 py-4 text-sm">
                           <div className="flex items-center gap-2">
                              <button
                                 onClick={() => handleEditClick(cat)}
                                 className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                              >
                                 Editar
                              </button>
                              <button
                                 onClick={() => handleDeleteClick(cat.id)}
                                 className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100"
                              >
                                 Eliminar
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
                  {categorias?.length === 0 && (
                     <tr>
                        <td colSpan={3} className="px-6 py-14 text-center">
                           <p className="text-sm font-semibold text-slate-700">Aún no hay categorías registradas</p>
                           <p className="mt-1 text-xs text-slate-500">Crea la primera categoría para comenzar a organizar productos.</p>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>

         {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-md">
               <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.55)]">
                  <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-5">
                     <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Formulario</p>
                     <h2 className="mt-1 text-xl font-black text-slate-800">
                        {editingId ? 'Editar categoría' : 'Nueva categoría'}
                     </h2>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
                     <div>
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Nombre</label>
                        <input
                           type="text"
                           className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                           value={formData.nombre}
                           onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                           required
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Descripción</label>
                        <textarea
                           className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                           value={formData.descripcion}
                           onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                           rows={4}
                        />
                     </div>
                     <div className="flex items-center justify-end gap-3 pt-1">
                        <button
                           type="button"
                           onClick={closeModal}
                           className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 transition hover:bg-slate-100"
                        >
                           Cancelar
                        </button>
                        <button
                           type="submit"
                           disabled={createMutation.isPending || updateMutation.isPending}
                           className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                        >
                           {createMutation.isPending || updateMutation.isPending ? 'Guardando...' : 'Guardar'}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {deleteErrorPopup.isOpen && (
            <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm">
               <div className="w-full max-w-md overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-[0_20px_55px_-30px_rgba(120,53,15,0.45)]">
                  <div className="border-b border-amber-100 bg-amber-50 px-5 py-3">
                     <h3 className="text-sm font-black tracking-wide text-amber-800 uppercase">No se pudo eliminar</h3>
                  </div>
                  <div className="px-5 py-4">
                     <p className="text-sm leading-relaxed text-slate-700">{deleteErrorPopup.message}</p>
                  </div>
                  <div className="flex justify-end px-5 pb-4">
                     <button
                        type="button"
                        onClick={closeDeleteErrorPopup}
                        className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-700"
                     >
                        Entendido
                     </button>
                  </div>
                  <div className="h-1.5 bg-amber-100">
                     <div className="h-full bg-amber-500 animate-[shrink_4s_linear_forwards]" />
                  </div>
               </div>
            </div>
         )}
      </section>
   );
};

export default CategoriasPage;