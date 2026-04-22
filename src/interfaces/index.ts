export interface Categoria {
    id: number;
    nombre: string;
    descripcion?: string;
}

export interface Ingrediente {
    id: number;
    nombre: string;
    unidad_medida: string;
}

export interface Producto {
    id: number;
    descripcion?: string;
    nombre: string;
    precio: number;
    categoria_id: number;
    ingredientes?: Ingrediente[];
}

export interface Categoria {
    id: number;
    nombre: string;
    descripcion?: string;
}