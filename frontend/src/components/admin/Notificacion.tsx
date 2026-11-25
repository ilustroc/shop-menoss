import { useEffect, useRef } from "react";

interface Props {
  tipo: "exito" | "error";
  mensaje: string;
  onCerrar: () => void;
  duracionMs?: number;
}

function Notificacion({ tipo, mensaje, onCerrar, duracionMs = 5000 }: Props) {
  // Se guarda la última función para que un re-render del padre no reinicie el temporizador.
  const cerrarRef = useRef(onCerrar);

  useEffect(() => {
    cerrarRef.current = onCerrar;
  });

  useEffect(() => {
    const temporizador = setTimeout(() => cerrarRef.current(), duracionMs);
    return () => clearTimeout(temporizador);
  }, [duracionMs]);

  const esError = tipo === "error";

  return (
    <div
      className="toast-container position-fixed top-0 end-0 p-3"
      style={{ zIndex: 2000 }}
    >
      <div
        className={`toast show align-items-center text-white border-0 ${esError ? "bg-danger" : "bg-success"}`}
        role={esError ? "alert" : "status"}
        aria-live={esError ? "assertive" : "polite"}
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body">{mensaje}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            aria-label="Cerrar"
            onClick={onCerrar}
          />
        </div>
      </div>
    </div>
  );
}

export default Notificacion;
