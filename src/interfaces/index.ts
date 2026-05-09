/**
 * Categoría de productos
 */
export interface Categoria {
   id: number;
   nombre: string;
   descripcion?: string;
}

export type CategoriaPayload = Omit<Categoria, 'id'>;

/**
 * Ingrediente utilizado en productos
 */
export interface Ingrediente {
   id: number;
   nombre: string;
   unidad_medida: string;
}

export type IngredientePayload = Omit<Ingrediente, 'id'>;

/**
 * Producto con sus categorías e ingredientes
 */
export interface Producto {
   id: number;
   descripcion?: string;
   nombre: string;
   precio: number;
   categoria_id: number;
   ingredientes?: Ingrediente[];
}

export interface ProductoPayload {
   nombre: string;
   precio: number;
   categoria_id: number;
   ingredientes_ids?: number[];
   descripcion?: string;
}
