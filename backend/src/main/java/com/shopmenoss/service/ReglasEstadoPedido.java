package com.shopmenoss.service;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import com.shopmenoss.model.EstadoPedido;

/**
 * Define qué cambios de estado puede hacer el ADMINISTRADOR sobre un pedido.
 *
 * Flujo normal: PENDIENTE -> CONFIRMADO -> PREPARANDO -> ENTREGADO
 * Un pedido puede cancelarse mientras no haya sido entregado.
 * ENTREGADO y CANCELADO son estados finales.
 */
public final class ReglasEstadoPedido {

    private static final Map<EstadoPedido, List<EstadoPedido>> TRANSICIONES =
            new EnumMap<>(EstadoPedido.class);

    static {
        TRANSICIONES.put(EstadoPedido.PENDIENTE,
                List.of(EstadoPedido.CONFIRMADO, EstadoPedido.CANCELADO));
        TRANSICIONES.put(EstadoPedido.CONFIRMADO,
                List.of(EstadoPedido.PREPARANDO, EstadoPedido.CANCELADO));
        TRANSICIONES.put(EstadoPedido.PREPARANDO,
                List.of(EstadoPedido.ENTREGADO, EstadoPedido.CANCELADO));
        TRANSICIONES.put(EstadoPedido.ENTREGADO, List.of());
        TRANSICIONES.put(EstadoPedido.CANCELADO, List.of());
    }

    private ReglasEstadoPedido() {
    }

    /** Estados a los que se puede pasar desde el estado actual. */
    public static List<EstadoPedido> estadosSiguientes(EstadoPedido actual) {
        return TRANSICIONES.getOrDefault(actual, List.of());
    }

    public static boolean esTransicionValida(EstadoPedido actual, EstadoPedido nuevo) {
        return estadosSiguientes(actual).contains(nuevo);
    }
}