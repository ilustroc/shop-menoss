package com.shopmenoss.repository;

import com.shopmenoss.model.Producto;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface ProductoRepository
        extends JpaRepository<Producto, Long>, JpaSpecificationExecutor<Producto> {

    boolean existsByCategoriaId(Long categoriaId);

    @Override
    @EntityGraph(attributePaths = "categoria")
    List<Producto> findAll(Specification<Producto> spec, Sort sort);

    @Override
    @EntityGraph(attributePaths = "categoria")
    Optional<Producto> findById(Long id);
}
