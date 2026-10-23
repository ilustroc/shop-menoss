package com.shopmenoss.service;

import com.shopmenoss.dto.ProductoRequest;
import com.shopmenoss.dto.ProductoResponse;
import com.shopmenoss.model.Categoria;
import com.shopmenoss.model.Producto;
import com.shopmenoss.repository.CategoriaRepository;
import com.shopmenoss.repository.ProductoRepository;
import com.shopmenoss.repository.ProductoSpecifications;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public ProductoService(ProductoRepository productoRepository,
            CategoriaRepository categoriaRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductoResponse> buscar(Long categoriaId, String texto, boolean incluirInactivos) {
        return productoRepository
                .findAll(ProductoSpecifications.filtrar(categoriaId, texto, incluirInactivos),
                        Sort.by("nombre"))
                .stream()
                .map(this::aResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductoResponse obtenerPorId(Long id) {
        return aResponse(buscarEntidad(id));
    }

    @Transactional
    public ProductoResponse crear(ProductoRequest request) {
        Categoria categoria = buscarCategoria(request.categoriaId());

        Producto producto = new Producto();
        producto.setStock(request.stock() != null ? request.stock() : 0);
        producto.setActivo(request.activo() != null ? request.activo() : true);
        copiarDatos(producto, request, categoria);

        return aResponse(productoRepository.save(producto));
    }

    @Transactional
    public ProductoResponse actualizar(Long id, ProductoRequest request) {
        Producto producto = buscarEntidad(id);
        Categoria categoria = buscarCategoria(request.categoriaId());

        if (request.stock() != null) {
            producto.setStock(request.stock());
        }
        if (request.activo() != null) {
            producto.setActivo(request.activo());
        }
        copiarDatos(producto, request, categoria);

        return aResponse(productoRepository.save(producto));
    }

    @Transactional
    public void eliminar(Long id) {
        Producto producto = buscarEntidad(id);
        producto.setActivo(false);
        productoRepository.save(producto);
    }

    private void copiarDatos(Producto producto, ProductoRequest request, Categoria categoria) {
        producto.setNombre(request.nombre().trim());
        producto.setDescripcion(limpiar(request.descripcion()));
        producto.setPrecio(request.precio());
        producto.setImagenUrl(limpiar(request.imagenUrl()));
        producto.setCategoria(categoria);
    }

    private Producto buscarEntidad(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "No se encontró el producto con id " + id));
    }

    private Categoria buscarCategoria(Long categoriaId) {
        return categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "No se encontró la categoría con id " + categoriaId));
    }

    private String limpiar(String texto) {
        return (texto == null || texto.isBlank()) ? null : texto.trim();
    }

    private ProductoResponse aResponse(Producto producto) {
        Categoria categoria = producto.getCategoria();
        return new ProductoResponse(
                producto.getId(),
                producto.getNombre(),
                producto.getDescripcion(),
                producto.getPrecio(),
                producto.getStock(),
                producto.getImagenUrl(),
                producto.getActivo(),
                categoria.getId(),
                categoria.getNombre());
    }
}
