import api from './axios';
import { type Categoria, type Producto, type Ingrediente } from '../interfaces';

// ==========================================
// 1. CATEGORÍAS
// ==========================================

export const getCategorias = async (): Promise<Categoria[]> => {
  const { data } = await api.get('/categorias');
  return data;
};

export const getCategoriaById = async (id: number): Promise<Categoria> => {
  const { data } = await api.get(`/categorias/${id}`);
  return data;
};

export const createCategoria = async (nueva: Partial<Categoria>): Promise<Categoria> => {
  const { data } = await api.post('/categorias', nueva);
  return data;
};

export const updateCategoria = async (id: number, datos: Partial<Categoria>): Promise<Categoria> => {
  const { data } = await api.put(`/categorias/${id}`, datos);
  return data;
};

export const deleteCategoria = async (id: number): Promise<void> => {
  await api.delete(`/categorias/${id}`);
};


// ==========================================
// 2. INGREDIENTES
// ==========================================

export const getIngredientes = async (): Promise<Ingrediente[]> => {
  const { data } = await api.get('/ingredientes');
  return data;
};

export const createIngrediente = async (nuevo: { nombre: string; unidad_medida: string }): Promise<Ingrediente> => {
  const { data } = await api.post('/ingredientes', nuevo);
  return data;
};

export const updateIngrediente = async (id: number, datos: Partial<Ingrediente>): Promise<Ingrediente> => {
  const { data } = await api.put(`/ingredientes/${id}`, datos);
  return data;
};

export const deleteIngrediente = async (id: number): Promise<void> => {
  await api.delete(`/ingredientes/${id}`);
};


// ==========================================
// 3. PRODUCTOS (Relaciones 1:N y N:N)
// ==========================================

export const getProductos = async (): Promise<Producto[]> => {
  const { data } = await api.get('/productos');
  return data;
};

export const getProductoById = async (id: number): Promise<Producto> => {
  const { data } = await api.get(`/productos/${id}`);
  return data;
};

/**
 * Para crear un producto, enviamos los datos base e ingredientes_ids
 */
export const createProducto = async (nuevo: any): Promise<Producto> => {
  const { data } = await api.post('/productos', nuevo);
  return data;
};

/**
 * Actualización parcial del producto e ingredientes
 */
export const updateProducto = async (id: number, datos: any): Promise<Producto> => {
  const { data } = await api.put(`/productos/${id}`, datos);
  return data;
};

export const deleteProducto = async (id: number): Promise<void> => {
  await api.delete(`/productos/${id}`);
};