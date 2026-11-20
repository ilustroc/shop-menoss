package com.shopmenoss.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.shopmenoss.dto.ProductoRequest;
import com.shopmenoss.model.Categoria;
import com.shopmenoss.model.Producto;

import jakarta.persistence.EntityManager;

@SpringBootTest
@Transactional
class ProductoServiceTest {

    @Autowired
    private ProductoService productoService;

    @Autowired
    private InventarioService inventarioService;

    @Autowired
    private EntityManager entityManager;

    private Long categoriaId;

    @BeforeEach
    void prepararCategoria() {
        Categoria categoria = new Categoria();
        categoria.setNombre("Categoria productos " + System.nanoTime());
        entityManager.persist(categoria);
        entityManager.flush();
        categoriaId = categoria.getId();
    }

    @Test
    void creaYConsultaProductoPersistido() {
        var creado = productoService.crear(new ProductoRequest(
                "Producto Postman",
                "Producto para prueba",
                new BigDecimal("12.50"),
                8,
                null,
                true,
                categoriaId));

        entityManager.flush();
        entityManager.clear();

        var consultado = productoService.obtenerPorId(creado.id());
        Producto persistido = entityManager.find(Producto.class, creado.id());

        assertNotNull(creado.id());
        assertEquals("Producto Postman", consultado.nombre());
        assertEquals(new BigDecimal("12.50"), consultado.precio());
        assertEquals(8, consultado.stock());
        assertEquals(categoriaId, consultado.categoriaId());
        assertEquals(creado.id(), persistido.getId());
    }

    @Test
    void productoCreadoEsCompatibleConInventarioYPedidos() {
        var creado = productoService.crear(new ProductoRequest(
                "Producto inventario",
                null,
                new BigDecimal("5.00"),
                3,
                null,
                true,
                categoriaId));

        assertTrue(inventarioService.listarInventario().stream()
                .anyMatch(p -> p.productoId().equals(creado.id()) && p.stock() == 3));

        inventarioService.descontarStock(creado.id(), 1);
        assertEquals(2, entityManager.find(Producto.class, creado.id()).getStock());
    }
}
