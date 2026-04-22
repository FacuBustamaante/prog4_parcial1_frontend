import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductos, getCategorias, getIngredientes, createProducto, updateProducto, deleteProducto } from '../api/services';
import { type Producto } from '../interfaces';

type ProductoFormData = {
   nombre: string;
   precio: number;
   categoria_id: string;
   ingredientes_ids: number[];
};

const ProductosPage = () => {
   const queryClient = useQueryClient();
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingId, setEditingId] = useState<number | null>(null);

   const [formData, setFormData] = useState<ProductoFormData>({
      nombre: '',
      precio: 0,
      categoria_id: '',
      ingredientes_ids: [] as number[]
   });

   // Queries para datos sincronizados
   const { data: productos, isLoading, isError } = useQuery({ queryKey: ['productos'], queryFn: getProductos });
   const { data: categorias } = useQuery({ queryKey: ['categorias'], queryFn: getCategorias });
   const { data: ingredientes } = useQuery({ queryKey: ['ingredientes'], queryFn: getIngredientes });

   // Mutaciones
   const createMutation = useMutation({
      mutationFn: createProducto,
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['productos'] }); closeModal(); },
   });

   const updateMutation = useMutation({
      mutationFn: (data: ProductoFormData) =>
         updateProducto(editingId!, {
            ...data,
            categoria_id: Number(data.categoria_id),
         }),
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['productos'] }); closeModal(); },
   });

   const deleteMutation = useMutation({
      mutationFn: deleteProducto,
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['productos'] }); },
   });

   const closeModal = () => {
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ nombre: '', precio: 0, categoria_id: '', ingredientes_ids: [] });
   };

   const handleEditClick = (prod: Producto) => {
      setEditingId(prod.id);
      setFormData({
         nombre: prod.nombre,
         precio: prod.precio,
         categoria_id: String(prod.categoria_id),
         ingredientes_ids: prod.ingredientes?.map(i => i.id) || []
      });
      setIsModalOpen(true);
   };

   const handleDelete = (id: number) => {
      if (window.confirm("¿Eliminar este producto?")) {
         deleteMutation.mutate(id);
      }
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingId !== null) {
         updateMutation.mutate(formData);
      } else {
         createMutation.mutate({
            ...formData,
            categoria_id: Number(formData.categoria_id),
         });
      }
   };

   if (isLoading) return <div className="rounded-3xl border border-slate-200 bg-white/90 px-6 py-10 text-center text-sm font-semibold text-slate-500 shadow-sm">Cargando productos...</div>;
   if (isError) return <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center text-sm font-semibold text-red-700 shadow-sm">Error al cargar productos.</div>;

   return (
      <section className="relative isolate overflow-hidden rounded-[28px] border border-slate-200/80 bg-linear-to-br from-white via-slate-50 to-slate-100/70 p-6 md:p-8 shadow-[0_14px_38px_-28px_rgba(15,23,42,0.45)]">
         <div className="pointer-events-none absolute -left-24 -top-28 h-56 w-56 rounded-full bg-cyan-100/50 blur-3xl" />
         <div className="pointer-events-none absolute -right-28 bottom-6 h-56 w-56 rounded-full bg-indigo-100/40 blur-3xl" />

         <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
               <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Gestión</p>
               <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-800">Productos</h1>
               <p className="mt-2 text-sm text-slate-500">Administra catálogo, categorías y composición de ingredientes en un solo flujo.</p>
            </div>
            <button
               onClick={() => setIsModalOpen(true)}
               className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0"
            >
               + Nuevo producto
            </button>
         </div>

         <div className="relative mt-6 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-[0_20px_40px_-32px_rgba(15,23,42,0.65)] backdrop-blur-sm">
            <table className="min-w-full divide-y divide-slate-200/80">
               <thead className="bg-slate-100/80">
                  <tr>
                     <th className="px-6 py-4 text-left text-[11px] font-bold tracking-wide text-slate-500 uppercase">Producto</th>
                     <th className="px-6 py-4 text-left text-[11px] font-bold tracking-wide text-slate-500 uppercase">Categoría</th>
                     <th className="px-6 py-4 text-left text-[11px] font-bold tracking-wide text-slate-500 uppercase">Ingredientes</th>
                     <th className="px-6 py-4 text-left text-[11px] font-bold tracking-wide text-slate-500 uppercase">Precio</th>
                     <th className="px-6 py-4 text-left text-[11px] font-bold tracking-wide text-slate-500 uppercase">Acciones</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {productos?.map((prod) => (
                     <tr key={prod.id} className="group transition-colors hover:bg-slate-50/80">
                        <td className="px-6 py-4">
                           <p className="text-sm font-bold text-slate-800">{prod.nombre}</p>
                        </td>
                        <td className="px-6 py-4">
                           <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">
                              {categorias?.find(c => c.id === prod.categoria_id)?.nombre || `ID: ${prod.categoria_id}`}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-wrap gap-1.5">
                              {prod.ingredientes && prod.ingredientes.length > 0 ? (
                                 prod.ingredientes.map(ing => (
                                    <span key={ing.id} className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                                       {ing.nombre}
                                    </span>
                                 ))
                              ) : (
                                 <span className="text-xs italic text-slate-300">Sin ingredientes</span>
                              )}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-700">${prod.precio.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm">
                           <div className="flex items-center gap-2">
                              <button
                                 onClick={() => handleEditClick(prod)}
                                 className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                              >
                                 Editar
                              </button>
                              <button
                                 onClick={() => handleDelete(prod.id)}
                                 className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100"
                              >
                                 Eliminar
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
                  {productos?.length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-6 py-14 text-center">
                           <p className="text-sm font-semibold text-slate-700">Aún no hay productos registrados</p>
                           <p className="mt-1 text-xs text-slate-500">Crea un producto para completar tu catálogo.</p>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>

         {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-md">
               <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.55)]">
                  <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-5">
                     <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Formulario</p>
                     <h2 className="mt-1 text-xl font-black text-slate-800">{editingId ? 'Editar producto' : 'Nuevo producto'}</h2>
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

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Precio</label>
                           <input
                              type="number" step="0.01"
                              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                              value={formData.precio}
                              onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
                              required
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Categoría</label>
                           <select
                              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                              value={formData.categoria_id}
                              onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                              required
                           >
                              <option value="">Seleccionar...</option>
                              {categorias?.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                           </select>
                        </div>
                     </div>

                     <div>
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Ingredientes (Ctrl + Click)</label>
                        <select
                           multiple
                           className="mt-2 h-32 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                           value={formData.ingredientes_ids.map(String)}
                           onChange={(e) => {
                              const values = Array.from(e.target.selectedOptions, opt => Number(opt.value));
                              setFormData({ ...formData, ingredientes_ids: values });
                           }}
                        >
                           {ingredientes?.map(ing => <option key={ing.id} value={ing.id}>{ing.nombre}</option>)}
                        </select>
                     </div>

                     <div className="flex items-center justify-end gap-3 pt-1">
                        <button type="button" onClick={closeModal} className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 transition hover:bg-slate-100">Cancelar</button>
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
      </section>
   );
};

export default ProductosPage;