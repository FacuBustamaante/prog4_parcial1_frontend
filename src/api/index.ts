/**
 * Punto de entrada centralizado para todas las llamadas a la API
 * Importa desde aquí para acceder a cualquier servicio
 */

export {
   // Categorías
   getCategorias,
   getCategoriaById,
   createCategoria,
   updateCategoria,
   deleteCategoria,
   // Ingredientes
   getIngredientes,
   createIngrediente,
   updateIngrediente,
   deleteIngrediente,
   // Productos
   getProductos,
   getProductoById,
   createProducto,
   updateProducto,
   deleteProducto,
} from './services';

// Re-exportar la instancia de axios para casos especiales
export { default as api } from './axios';
