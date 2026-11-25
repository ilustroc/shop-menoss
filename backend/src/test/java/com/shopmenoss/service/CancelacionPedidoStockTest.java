package com.shopmenoss.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.shopmenoss.dto.ActualizarEstadoPedidoRequest;
import com.shopmenoss.dto.CrearPedidoRequest;
import com.shopmenoss.dto.DetallePedidoRequest;
import com.shopmenoss.dto.MetodoPagoRequest;
import com.shopmenoss.exception.TransicionEstadoInvalidaException;
import com.shopmenoss.model.EstadoPedido;
import com.shopmenoss.model.Pedido;
import com.shopmenoss.model.Categoria;
import com.shopmenoss.model.Producto;

import jakarta.persistence.EntityManager;

/**
 * Prueba de punta a punta con H2: crear un pedido descuenta stock
 * y cancelarlo desde administración lo devuelve.
 */
@SpringBootTest
@Transactional
@org.springframework.security.test.context.support.WithMockUser(username = "cliente@test.com")
class CancelacionPedidoStockTest {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private AdminPedidoService adminPedidoService;

    @Autowired
    private EntityManager entityManager;

    private Long productoId;

    @BeforeEach
    void prepararProducto() {
        entityManager.persist(new com.shopmenoss.model.Usuario("Cliente", "Prueba", "cliente@test.com", "test-only", com.shopmenoss.model.Rol.CLIENTE));
        Categoria categoria = new Categoria();
        categoria.setNombre("Categoria cancelacion");
        entityManager.persist(categoria);

        Producto producto = new Producto();
        producto.setNombre("Aceite 1L");
        producto.setPrecio(new BigDecimal("8.50"));
        producto.setCategoria(categoria);
        producto.setStock(10);
        producto.setActivo(true);
        entityManager.persist(producto);
        entityManager.flush();
        productoId = producto.getId();
    }

    @Test
    void cancelarPedidoDevuelveElStockDescontado() {
        Long pedidoId = pedidoService.crearPedido(pedidoDe(3)).getId();
        limpiarContexto();
        assertEquals(7, stockActual());

        adminPedidoService.actualizarEstado(pedidoId, new ActualizarEstadoPedidoRequest("CANCELADO"));
        limpiarContexto();
        assertEquals(10, stockActual());
    }

    @Test
    void confirmarPedidoNoCambiaElStock() {
        Long pedidoId = pedidoService.crearPedido(pedidoDe(3)).getId();
        limpiarContexto();

        adminPedidoService.actualizarEstado(pedidoId, new ActualizarEstadoPedidoRequest("CONFIRMADO"));
        limpiarContexto();
        assertEquals(7, stockActual());
    }

        @Test
    void cancelarDosVecesReponeElStockUnaSolaVez() {
        Long pedidoId = pedidoService.crearPedido(pedidoDe(3)).getId();
        limpiarContexto();

        adminPedidoService.actualizarEstado(pedidoId, new ActualizarEstadoPedidoRequest("CANCELADO"));
        limpiarContexto();
        assertEquals(10, stockActual());

        assertThrows(TransicionEstadoInvalidaException.class, () -> adminPedidoService.actualizarEstado(
                pedidoId, new ActualizarEstadoPedidoRequest("CANCELADO")));
        limpiarContexto();
        assertEquals(10, stockActual());
    }

    @Test
    void unPedidoEntregadoNoSePuedeModificar() {
        Long pedidoId = pedidoService.crearPedido(pedidoDe(2)).getId();
        limpiarContexto();
        for (String estado : new String[] {"CONFIRMADO", "PREPARANDO", "ENTREGADO"}) {
            adminPedidoService.actualizarEstado(pedidoId, new ActualizarEstadoPedidoRequest(estado));
            limpiarContexto();
        }

        assertThrows(TransicionEstadoInvalidaException.class, () -> adminPedidoService.actualizarEstado(
                pedidoId, new ActualizarEstadoPedidoRequest("CANCELADO")));
        limpiarContexto();

        // Sigue ENTREGADO en la base de datos y el stock no se repuso
        assertEquals(EstadoPedido.ENTREGADO, entityManager.find(Pedido.class, pedidoId).getEstado());
        assertEquals(8, stockActual());
    }

    private CrearPedidoRequest pedidoDe(int cantidad) {
        DetallePedidoRequest detalle = new DetallePedidoRequest();
        detalle.setProductoId(productoId);
        detalle.setCantidad(cantidad);

        CrearPedidoRequest request = new CrearPedidoRequest();
        request.setDireccion("Av. Arequipa 123");
        request.setMetodoPago(MetodoPagoRequest.EFECTIVO);
        request.setDetalles(List.of(detalle));
        return request;
    }

    // Simula peticiones separadas: guarda los cambios y vuelve a leer desde la base de datos
    private void limpiarContexto() {
        entityManager.flush();
        entityManager.clear();
    }

    private int stockActual() {
        return entityManager.find(Producto.class, productoId).getStock();
    }
}
