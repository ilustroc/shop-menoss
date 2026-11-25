package com.shopmenoss.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.math.BigDecimal;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.shopmenoss.model.Categoria;
import com.shopmenoss.model.Producto;

import jakarta.persistence.EntityManager;

/**
 * El panel de inventario envía el stock que estaba viendo (stockAnterior).
 * Si una compra lo cambió mientras tanto, el ajuste se rechaza en lugar de sobrescribirlo.
 */
@SpringBootTest
@Transactional
class InventarioStockConcurrenteTest {

    @Autowired
    private InventarioService inventarioService;

    @Autowired
    private EntityManager entityManager;

    private Long productoId;

    @BeforeEach
    void prepararProducto() {
        Categoria categoria = new Categoria();
        categoria.setNombre("Categoria concurrencia");
        entityManager.persist(categoria);

        Producto producto = new Producto();
        producto.setNombre("Fideos 500g");
        producto.setPrecio(new BigDecimal("3.20"));
        producto.setCategoria(categoria);
        producto.setStock(10);
        producto.setActivo(true);
        entityManager.persist(producto);
        entityManager.flush();
        productoId = producto.getId();
    }

    @Test
    void actualizaSiElStockAnteriorCoincide() {
        var resultado = inventarioService.actualizarStock(productoId, 15, 10);

        assertEquals(15, resultado.stock());
    }

    @Test
    void rechazaElAjusteSiUnaCompraCambioElStock() {
        // Una compra descuenta 2 unidades mientras el administrador miraba "10"
        inventarioService.descontarStock(productoId, 2);

        assertThrows(IllegalStateException.class,
                () -> inventarioService.actualizarStock(productoId, 11, 10));

        entityManager.flush();
        entityManager.clear();
        assertEquals(8, entityManager.find(Producto.class, productoId).getStock());
    }

    @Test
    void sinStockAnteriorSigueFuncionandoComoAntes() {
        var resultado = inventarioService.actualizarStock(productoId, 3, null);

        assertEquals(3, resultado.stock());
    }
}