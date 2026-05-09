import api from './axios';
import {
   type Categoria,
   type Producto,
   type Ingrediente,
   type CategoriaPayload,
   type IngredientePayload,
   type ProductoPayload,
} from '../interfaces';

/**
 * ========== CATEGORÍAS ==========
 */

export const getCategorias = async (): Promise<Categoria[]> => {
   const { data } = await api.get('/categorias');
   return data;
};

export const getCategoriaById = async (id: number): Promise<Categoria> => {
   const { data } = await api.get(`/categorias/${id}`);
   return data;
};

export const createCategoria = async (nueva: CategoriaPayload): Promise<Categoria> => {
   const { data } = await api.post('/categorias', nueva);
   return data;
};

export const updateCategoria = async (id: number, datos: CategoriaPayload): Promise<Categoria> => {
   const { data } = await api.put(`/categorias/${id}`, datos);
   return data;
};

export const deleteCategoria = async (id: number): Promise<void> => {
   await api.delete(`/categorias/${id}`);
};

/**
 * ========== INGREDIENTES ==========
 */

export const getIngredientes = async (): Promise<Ingrediente[]> => {
   const { data } = await api.get('/ingredientes');
   return data;
};

export const createIngrediente = async (nuevo: IngredientePayload): Promise<Ingrediente> => {
   const { data } = await api.post('/ingredientes', nuevo);
   return data;
};

export const updateIngrediente = async (id: number, datos: IngredientePayload): Promise<Ingrediente> => {
   const { data } = await api.put(`/ingredientes/${id}`, datos);
   return data;
};

export const deleteIngrediente = async (id: number): Promise<void> => {
   await api.delete(`/ingredientes/${id}`);
};

/**
 * ========== PRODUCTOS ==========
 */

export const getProductos = async (): Promise<Producto[]> => {
   const { data } = await api.get('/productos');
   return data;
};

export const getProductoById = async (id: number): Promise<Producto> => {
   const { data } = await api.get(`/productos/${id}`);
   return data;
};

export const createProducto = async (nuevo: ProductoPayload): Promise<Producto> => {
   const { data } = await api.post('/productos', nuevo);
   return data;
};

export const updateProducto = async (id: number, datos: ProductoPayload): Promise<Producto> => {
   const { data } = await api.put(`/productos/${id}`, datos);
   return data;
};

export const deleteProducto = async (id: number): Promise<void> => {
   await api.delete(`/productos/${id}`);
};