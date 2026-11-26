export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

// --- Contratos del backend (CategoriaRequest / CategoriaResponse) ---
export interface CategoriaResponse {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface CategoriaRequest {
  nombre: string;
  descripcion?: string | null;
}
