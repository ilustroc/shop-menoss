import { useEffect } from "react";

interface Props {
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  textoProcesando?: string;
  procesando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

function ConfirmModal({
  titulo,
  mensaje,
  textoConfirmar = "Confirmar",
  textoProcesando = "Procesando...",
  procesando = false,
  onConfirmar,
  onCancelar,
}: Props) {
  useEffect(() => {
    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !procesando) onCancelar();
    };
    document.addEventListener("keydown", alPresionar);
    return () => document.removeEventListener("keydown", alPresionar);
  }, [procesando, onCancelar]);

  return (
    <>
      <div
        className="modal d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-titulo"
        onClick={() => {
          if (!procesando) onCancelar();
        }}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="confirm-titulo">
                {titulo}
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar"
                onClick={onCancelar}
                disabled={procesando}
              />
            </div>
            <div className="modal-body">
              <p className="mb-0">{mensaje}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onCancelar}
                disabled={procesando}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={onConfirmar}
                disabled={procesando}
              >
                {procesando ? textoProcesando : textoConfirmar}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  );
}

export default ConfirmModal;
