package com.shopmenoss.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.shopmenoss.model.Categoria;
import com.shopmenoss.model.Producto;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;

@SpringBootTest
@Transactional
class InventarioServiceTest {

    @Autowired
    private InventarioService inventarioService;

    @Autowired
    private EntityManager entityManager;

    private Long productoId;

    @BeforeEach
    void prepararProducto() {
        Categoria categoria = new Categoria();
        categoria.setNombre("Abarrotes de prueba");
        entityManager.persist(categoria);

        Producto producto = new Producto();
        producto.setNombre("Arroz");
        producto.setPrecio(new BigDecimal("5.00"));
        producto.setCategoria(categoria);
        producto.setStock(4);
        producto.setActivo(true);
        entityManager.persist(producto);
        entityManager.flush();
        productoId = producto.getId();
    }

    @Test
    void actualizaElStock() {
        var resultado = inventarioService.actualizarStock(productoId, 20);
        assertEquals(20, resultado.stock());
        assertEquals(20, entityManager.find(Producto.class, productoId).getStock());
    }

    @Test
    void listaProductosConStockBajo() {
        assertTrue(inventarioService.listarStockBajo().stream()
                .anyMatch(p -> p.productoId().equals(productoId)));
    }

    @Test
    void descuentaStockDisponible() {
        inventarioService.descontarStock(productoId, 3);
        assertEquals(1, entityManager.find(Producto.class, productoId).getStock());
    }

    @Test
    void noPermiteComprarMasDeLoDisponible() {
        assertThrows(IllegalStateException.class,
                () -> inventarioService.descontarStock(productoId, 6));
        assertEquals(4, entityManager.find(Producto.class, productoId).getStock());
    }

    @Test
    void rechazaStockNegativo() {
        assertThrows(IllegalStateException.class,
                () -> inventarioService.actualizarStock(productoId, -1));
    }

    @Test
    void retornaNoEncontradoSiNoExisteElProducto() {
        assertThrows(EntityNotFoundException.class,
                () -> inventarioService.descontarStock(-999L, 1));
    }
}
