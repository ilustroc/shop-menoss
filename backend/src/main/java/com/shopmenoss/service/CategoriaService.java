package com.shopmenoss.service;

import com.shopmenoss.dto.CategoriaRequest;
import com.shopmenoss.dto.CategoriaResponse;
import com.shopmenoss.model.Categoria;
import com.shopmenoss.repository.CategoriaRepository;
import com.shopmenoss.repository.ProductoRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;

    public CategoriaService(CategoriaRepository categoriaRepository,
            ProductoRepository productoRepository) {
        this.categoriaRepository = categoriaRepository;
        this.productoRepository = productoRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponse> listar() {
        return categoriaRepository.findAll(Sort.by("nombre")).stream()
                .map(this::aResponse)
                .toList();
    }

    @Transactional
    public CategoriaResponse crear(CategoriaRequest request) {
        String nombre = request.nombre().trim();
        if (categoriaRepository.existsByNombreIgnoreCase(nombre)) {
            throw new IllegalStateException("Ya existe una categoría con el nombre '" + nombre + "'");
        }

        Categoria categoria = new Categoria();
        categoria.setNombre(nombre);
        categoria.setDescripcion(limpiar(request.descripcion()));
        return aResponse(categoriaRepository.save(categoria));
    }

    @Transactional
    public CategoriaResponse actualizar(Long id, CategoriaRequest request) {
        Categoria categoria = buscarEntidad(id);

        String nombre = request.nombre().trim();
        if (categoriaRepository.existsByNombreIgnoreCaseAndIdNot(nombre, id)) {
            throw new IllegalStateException("Ya existe otra categoría con el nombre '" + nombre + "'");
        }

        categoria.setNombre(nombre);
        categoria.setDescripcion(limpiar(request.descripcion()));
        return aResponse(categoriaRepository.save(categoria));
    }

    @Transactional
    public void eliminar(Long id) {
        Categoria categoria = buscarEntidad(id);

        if (productoRepository.existsByCategoriaId(id)) {
            throw new IllegalStateException(
                    "No se puede eliminar la categoría '" + categoria.getNombre()
                            + "' porque tiene productos asociados");
        }

        categoriaRepository.delete(categoria);
    }

    private Categoria buscarEntidad(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "No se encontró la categoría con id " + id));
    }

    private String limpiar(String texto) {
        return (texto == null || texto.isBlank()) ? null : texto.trim();
    }

    private CategoriaResponse aResponse(Categoria categoria) {
        return new CategoriaResponse(
                categoria.getId(),
                categoria.getNombre(),
                categoria.getDescripcion());
    }
}

