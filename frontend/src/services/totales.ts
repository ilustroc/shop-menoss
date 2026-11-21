// Los precios incluyen IGV. El backend vuelve a calcular el importe definitivo.
export const COSTO_ENVIO = 10;

export function calcularTotales(items: { precio: number; cantidad: number }[]) {
  const subtotalCentimos = items.reduce(
    (acc, item) => acc + Math.round(item.precio * 100) * item.cantidad,
    0
  );
  const subtotal = subtotalCentimos / 100;
  const envio = items.length ? COSTO_ENVIO : 0;
  return { subtotal, igv: 0, envio, total: (subtotalCentimos + envio * 100) / 100 };
}
