package com.shopmenoss.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.shopmenoss.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    @Query("""
            SELECT p FROM Producto p
            WHERE p.activo = true
              AND (:categoriaId IS NULL OR p.categoria.id = :categoriaId)
              AND (:q IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :q, '%')))
            """)
    List<Producto> buscar(@Param("categoriaId") Long categoriaId, @Param("q") String q);
}