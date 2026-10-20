package com.shopmenoss.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.shopmenoss.dto.ActualizarEstadoPedidoRequest;
import com.shopmenoss.dto.AdminPedidoDetalleResponse;
import com.shopmenoss.dto.AdminPedidoResumenResponse;
import com.shopmenoss.exception.EstadoPedidoInvalidoException;
import com.shopmenoss.exception.TransicionEstadoInvalidaException;
import com.shopmenoss.model.DetallePedido;
import com.shopmenoss.model.EstadoPedido;
import com.shopmenoss.model.MetodoPago;
import com.shopmenoss.model.Pedido;
import com.shopmenoss.repository.PedidoRepository;

import jakarta.persistence.EntityNotFoundException;

@ExtendWith(MockitoExtension.class)
class AdminPedidoServiceTest {

    @Mock
    private PedidoRepository pedidoRepository;

    @InjectMocks
    private AdminPedidoService adminPedidoService;

    private Pedido crearPedido(Long id, EstadoPedido estado) {
        DetallePedido detalle = new DetallePedido();
        detalle.setId(1L);
        detalle.setNombreProducto("Arroz Extra 1 kg");
        detalle.setPrecioUnitario(new BigDecimal("4.80"));
        detalle.setCantidad(3);

        Pedido pedido = new Pedido();
        pedido.setId(id);
        pedido.setEstado(estado);
        pedido.setDireccion("Av. Arequipa 123");
        pedido.setMetodoPago(MetodoPago.EFECTIVO);
        pedido.setSubtotal(new BigDecimal("14.40"));
        pedido.setEnvio(BigDecimal.ZERO);
        pedido.setTotal(new BigDecimal("14.40"));
        pedido.setDetalles(List.of(detalle));
        detalle.setPedido(pedido);
        return pedido;
    }

    @Test
    void listarPorEstadoUsaElFiltro() {
        Pedido pedido = crearPedido(1L, EstadoPedido.PENDIENTE);
        when(pedidoRepository.findByEstadoOrderByFechaCreacionDesc(EstadoPedido.PENDIENTE))
                .thenReturn(List.of(pedido));

        List<AdminPedidoResumenResponse> resultado = adminPedidoService.listarPedidos("pendiente");

        assertEquals(1, resultado.size());
        assertEquals(3, resultado.get(0).getCantidadProductos());
    }

    @Test
    void obtenerPedidoInexistenteLanza404() {
        when(pedidoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> adminPedidoService.obtenerPedido(99L));
    }

    @Test
    void actualizarEstadoValidoGuardaElCambio() {
        Pedido pedido = crearPedido(1L, EstadoPedido.PENDIENTE);
        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(pedido));
        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(inv -> inv.getArgument(0));

        AdminPedidoDetalleResponse respuesta = adminPedidoService.actualizarEstado(
                1L, new ActualizarEstadoPedidoRequest("CONFIRMADO"));

        assertEquals(EstadoPedido.CONFIRMADO, respuesta.getEstado());
        assertEquals(List.of(EstadoPedido.PREPARANDO, EstadoPedido.CANCELADO), respuesta.getEstadosPermitidos());
    }

    @Test
    void noPermiteSaltarDePendienteAEntregado() {
        Pedido pedido = crearPedido(1L, EstadoPedido.PENDIENTE);
        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(pedido));

        assertThrows(TransicionEstadoInvalidaException.class, () -> adminPedidoService.actualizarEstado(
                1L, new ActualizarEstadoPedidoRequest("ENTREGADO")));
        verify(pedidoRepository, never()).save(any());
    }

    @Test
    void noPermiteCambiarUnPedidoEntregado() {
        Pedido pedido = crearPedido(1L, EstadoPedido.ENTREGADO);
        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(pedido));

        assertThrows(TransicionEstadoInvalidaException.class, () -> adminPedidoService.actualizarEstado(
                1L, new ActualizarEstadoPedidoRequest("CANCELADO")));
    }

    @Test
    void estadoInexistenteLanza400() {
        Pedido pedido = crearPedido(1L, EstadoPedido.PENDIENTE);
        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(pedido));

        assertThrows(EstadoPedidoInvalidoException.class, () -> adminPedidoService.actualizarEstado(
                1L, new ActualizarEstadoPedidoRequest("VOLANDO")));
    }
}