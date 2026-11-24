import axios from "axios";

/**
 * Extrae un mensaje legible de un error de Axios.
 * Formatos del backend (GlobalExceptionHandler):
 *  - 404 / 409 / 500 -> { "error": "mensaje" }
 *  - 400 (validación) -> { "campo": "mensaje", ... }
 */
export function obtenerMensajeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.";
    }

    const { status, data } = error.response;

    if (status === 401)
      return "Tu sesión no es válida o expiró. Inicia sesión nuevamente.";
    if (status === 403) return "No tienes permisos para realizar esta acción.";

    if (data && typeof data === "object") {
      const registro = data as Record<string, unknown>;
      if (typeof registro.error === "string") return registro.error;

      const mensajes = Object.values(registro).filter(
        (valor): valor is string => typeof valor === "string",
      );
      if (mensajes.length > 0) return mensajes.join(" ");
    }

    if (typeof data === "string" && data.trim()) return data;
    return `Error ${status} al comunicarse con el servidor.`;
  }

  return error instanceof Error
    ? error.message
    : "Ocurrió un error inesperado.";
}
