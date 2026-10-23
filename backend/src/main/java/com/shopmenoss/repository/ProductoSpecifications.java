package com.shopmenoss.repository;

import com.shopmenoss.model.Producto;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class ProductoSpecifications {

    private ProductoSpecifications() {
    }

    public static Specification<Producto> filtrar(Long categoriaId, String texto, boolean incluirInactivos) {
        return (root, query, cb) -> {
            List<Predicate> condiciones = new ArrayList<>();

            if (!incluirInactivos) {
                condiciones.add(cb.isTrue(root.get("activo")));
            }
            if (categoriaId != null) {
                condiciones.add(cb.equal(root.get("categoria").get("id"), categoriaId));
            }
            if (texto != null && !texto.isBlank()) {
                String patron = "%" + texto.trim().toLowerCase() + "%";
                condiciones.add(cb.like(cb.lower(root.get("nombre")), patron));
            }

            return cb.and(condiciones.toArray(new Predicate[0]));
        };
    }
}
