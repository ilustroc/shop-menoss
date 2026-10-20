package com.shopmenoss.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ProductoRequest(
        @NotBlank(message = "El nombre del producto es obligatorio") @Size(max = 150, message = "El nombre no puede superar los 150 caracteres") String nombre,

        @Size(max = 500, message = "La descripción no puede superar los 500 caracteres") String descripcion,

        @NotNull(message = "El precio es obligatorio") @DecimalMin(value = "0.01", message = "El precio debe ser mayor que 0") @Digits(integer = 8, fraction = 2, message = "El precio admite hasta 2 decimales") BigDecimal precio,

        @Min(value = 0, message = "El stock no puede ser negativo") Integer stock,

        @Size(max = 500, message = "La URL de la imagen no puede superar los 500 caracteres") String imagenUrl,

        Boolean activo,

        @NotNull(message = "La categoría es obligatoria") Long categoriaId) {
}
