package com.shopmenoss.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import com.shopmenoss.model.EstadoPedido;

class ReglasEstadoPedidoTest {

    @Test
    void permiteElFlujoNormal() {
        assertTrue(ReglasEstadoPedido.esTransicionValida(EstadoPedido.PENDIENTE, EstadoPedido.CONFIRMADO));
        assertTrue(ReglasEstadoPedido.esTransicionValida(EstadoPedido.CONFIRMADO, EstadoPedido.PREPARANDO));
        assertTrue(ReglasEstadoPedido.esTransicionValida(EstadoPedido.PREPARANDO, EstadoPedido.ENTREGADO));
    }

    @Test
    void permiteCancelarAntesDeEntregar() {
        assertTrue(ReglasEstadoPedido.esTransicionValida(EstadoPedido.PENDIENTE, EstadoPedido.CANCELADO));
        assertTrue(ReglasEstadoPedido.esTransicionValida(EstadoPedido.CONFIRMADO, EstadoPedido.CANCELADO));
        assertTrue(ReglasEstadoPedido.esTransicionValida(EstadoPedido.PREPARANDO, EstadoPedido.CANCELADO));
    }

    @Test
    void noPermiteSaltarPasosNiRetroceder() {
        assertFalse(ReglasEstadoPedido.esTransicionValida(EstadoPedido.PENDIENTE, EstadoPedido.ENTREGADO));
        assertFalse(ReglasEstadoPedido.esTransicionValida(EstadoPedido.PREPARANDO, EstadoPedido.PENDIENTE));
    }

    @Test
    void entregadoYCanceladoSonFinales() {
        assertTrue(ReglasEstadoPedido.estadosSiguientes(EstadoPedido.ENTREGADO).isEmpty());
        assertTrue(ReglasEstadoPedido.estadosSiguientes(EstadoPedido.CANCELADO).isEmpty());
        assertFalse(ReglasEstadoPedido.esTransicionValida(EstadoPedido.CANCELADO, EstadoPedido.PENDIENTE));
    }
}