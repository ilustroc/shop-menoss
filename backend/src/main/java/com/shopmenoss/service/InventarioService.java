package com.shopmenoss.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shopmenoss.dto.InventarioResponse;
import com.shopmenoss.model.Producto;
import com.shopmenoss.repository.ProductoRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.LockModeType;

/**
 * Gestion sencilla de stock. Se reutiliza la entidad Producto existente.
 * El descuento se realiza al crear un pedido, tal como funciona PedidoService.
 */
@Service
public class InventarioService {

    private static final int UMBRAL_STOCK_BAJO = 5;

    private final ProductoRepository productoRepository;
    private final EntityManager entityManager;

    public InventarioService(ProductoRepository productoRepository, EntityManager entityManager) {
        this.productoRepository = productoRepository;
        this.entityManager = entityManager;
    }

    @Transactional(readOnly = true)
    public List<InventarioResponse> listarInventario() {
        return productoRepository.findAll(Sort.by("nombre")).stream()
                .map(this::aResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<InventarioResponse> listarStockBajo() {
        return productoRepository.findAll(Sort.by("nombre")).stream()
                .filter(p -> p.getStock() != null && p.getStock() <= UMBRAL_STOCK_BAJO)
                .map(this::aResponse)
                .toList();
    }

    @Transactional
    public InventarioResponse actualizarStock(Long productoId, int nuevoStock) {
        if (nuevoStock < 0) {
            throw new IllegalStateException("El stock no puede ser negativo");
        }

        Producto producto = obtenerConBloqueo(productoId);
        producto.setStock(nuevoStock);
        return aResponse(producto);
    }

    /**
     * Metodo reutilizable por Pedidos.
     * La fila se bloquea hasta terminar la transaccion del pedido.
     * Si la compra falla, Spring revierte tambien el descuento.
     */
    @Transactional
    public Producto descontarStock(Long productoId, int cantidad) {
        if (cantidad <= 0) {
            throw new IllegalStateException("La cantidad debe ser mayor que cero");
        }

        Producto producto = obtenerConBloqueo(productoId);
        if (!Boolean.TRUE.equals(producto.getActivo())) {
            throw new IllegalStateException("El producto no esta activo: " + producto.getNombre());
        }
        if (producto.getStock() == null || producto.getStock() < cantidad) {
            throw new IllegalStateException("Stock insuficiente para el producto: " + producto.getNombre());
        }

        producto.setStock(producto.getStock() - cantidad);
        return producto;
    }

    private Producto obtenerConBloqueo(Long productoId) {
        Producto producto = entityManager.find(Producto.class, productoId, LockModeType.PESSIMISTIC_WRITE);
        if (producto == null) {
            throw new EntityNotFoundException("Producto no encontrado: " + productoId);
        }
        return producto;
    }

    private InventarioResponse aResponse(Producto producto) {
        Integer stock = producto.getStock();
        return new InventarioResponse(
                producto.getId(),
                producto.getNombre(),
                stock,
                stock != null && stock <= UMBRAL_STOCK_BAJO
        );
    }
}
