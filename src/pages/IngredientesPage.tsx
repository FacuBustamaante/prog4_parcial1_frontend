import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   getIngredientes,
   createIngrediente,
   updateIngrediente,
   deleteIngrediente,
} from '../api';
import {
   type Ingrediente,
   type IngredientePayload,
} from '../interfaces';
import {
   FormModal,
   LoadingState,
   ErrorState,
   PrimaryButton,
   SecondaryButton,
   DangerButton,
} from '../components';

const IngredientesPage = () => {
   const queryClient = useQueryClient();
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingId, setEditingId] = useState<number | null>(null);
   const [formData, setFormData] = useState<IngredientePayload>({
      nombre: '',
      unidad_medida: '',
   });

   const { data: ingredientes, isLoading, isError } = useQuery({
      queryKey: ['ingredientes'],
      queryFn: getIngredientes,
   });

   const createMutation = useMutation({
      mutationFn: createIngrediente,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
         closeModal();
      },
   });

   const updateMutation = useMutation({
      mutationFn: (data: IngredientePayload) =>
         updateIngrediente(editingId!, data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
         closeModal();
      },
   });

   const deleteMutation = useMutation({
      mutationFn: deleteIngrediente,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
      },
   });

   const closeModal = () => {
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ nombre: '', unidad_medida: '' });
   };

   const handleEditClick = (ingrediente: Ingrediente) => {
      setEditingId(ingrediente.id);
      setFormData({
         nombre: ingrediente.nombre,
         unidad_medida: ingrediente.unidad_medida,
      });
      setIsModalOpen(true);
   };

   const handleDeleteClick = (id: number) => {
      if (window.confirm('¿Eliminar este ingrediente?')) {
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

   if (isLoading)
      return <LoadingState message="Cargando ingredientes..." />;
   if (isError)
      return <ErrorState message="Error al cargar ingredientes." />;

   return (
      <section className="relative isolate overflow-hidden rounded-[28px] border border-slate-200/80 bg-linear-to-br from-white via-slate-50 to-slate-100/70 p-6 md:p-8 shadow-[0_14px_38px_-28px_rgba(15,23,42,0.45)]">
         <div className="pointer-events-none absolute -left-24 -top-28 h-56 w-56 rounded-full bg-cyan-100/50 blur-3xl" />
         <div className="pointer-events-none absolute -right-28 bottom-6 h-56 w-56 rounded-full bg-indigo-100/40 blur-3xl" />

         <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
               <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Gestión
               </p>
               <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-800">
                  Ingredientes
               </h2>
               <p className="mt-2 text-sm text-slate-500">
                  Define los insumos y unidades para mantener consistencia en
                  tus productos.
               </p>
            </div>
            <PrimaryButton
               onClick={() => setIsModalOpen(true)}
               className="hover:-translate-y-0.5"
            >
               + Nuevo ingrediente
            </PrimaryButton>
         </div>

         <div className="relative mt-6 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-[0_20px_40px_-32px_rgba(15,23,42,0.65)] backdrop-blur-sm">
            <table className="min-w-full divide-y divide-slate-200/80">
               <thead className="bg-slate-100/80">
                  <tr>
                     <th className="px-6 py-4 text-left text-[11px] font-bold tracking-wide text-slate-500 uppercase">
                        Nombre
                     </th>
                     <th className="px-6 py-4 text-left text-[11px] font-bold tracking-wide text-slate-500 uppercase">
                        Unidad
                     </th>
                     <th className="px-6 py-4 text-left text-[11px] font-bold tracking-wide text-slate-500 uppercase">
                        Acciones
                     </th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {ingredientes?.map((ing) => (
                     <tr
                        key={ing.id}
                        className="group transition-colors hover:bg-slate-50/80"
                     >
                        <td className="px-6 py-4 text-sm font-bold text-slate-800">
                           {ing.nombre}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                           {ing.unidad_medida}
                        </td>
                        <td className="px-6 py-4 text-sm">
                           <div className="flex items-center gap-2">
                              <SecondaryButton
                                 onClick={() => handleEditClick(ing)}
                              >
                                 Editar
                              </SecondaryButton>
                              <DangerButton
                                 onClick={() => handleDeleteClick(ing.id)}
                              >
                                 Eliminar
                              </DangerButton>
                           </div>
                        </td>
                     </tr>
                  ))}
                  {ingredientes?.length === 0 && (
                     <tr>
                        <td colSpan={3} className="px-6 py-14 text-center">
                           <p className="text-sm font-semibold text-slate-700">
                              Aún no hay ingredientes registrados
                           </p>
                           <p className="mt-1 text-xs text-slate-500">
                              Agrega ingredientes para usarlos al crear
                              productos.
                           </p>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>

         <FormModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onSubmit={handleSubmit}
            title={
               editingId ? 'Editar ingrediente' : 'Nuevo ingrediente'
            }
            subtitle="Formulario"
            isSubmitting={
               createMutation.isPending || updateMutation.isPending
            }
         >
            <div>
               <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Nombre
               </label>
               <input
                  placeholder="Ej: Harina"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  value={formData.nombre}
                  onChange={(e) =>
                     setFormData({ ...formData, nombre: e.target.value })
                  }
                  required
               />
            </div>
            <div>
               <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Unidad de medida
               </label>
               <input
                  placeholder="Ej: kg, litros, gramos"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  value={formData.unidad_medida}
                  onChange={(e) =>
                     setFormData({
                        ...formData,
                        unidad_medida: e.target.value,
                     })
                  }
                  required
               />
            </div>
         </FormModal>
      </section>
   );
};

export default IngredientesPage;