package com.shopmenoss.dto;

public record InventarioResponse(
        Long productoId,
        String nombre,
        Integer stock,
        boolean stockBajo
) {
}
