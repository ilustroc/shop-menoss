package com.shopmenoss.dto;

import jakarta.validation.constraints.NotBlank;

public class ActualizarEstadoPedidoRequest {

    // Se recibe como texto para responder 400 con un mensaje claro
    // si llega un estado que no existe (ej. "VOLANDO").
    @NotBlank(message = "El estado es obligatorio")
    private String estado;

    public ActualizarEstadoPedidoRequest() {
    }

    public ActualizarEstadoPedidoRequest(String estado) {
        this.estado = estado;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}