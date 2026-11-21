package com.shopmenoss.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CrearPedidoRequest {

    @NotBlank
    @Size(min = 5, max = 255)
    private String direccion;

    @Size(max = 255)
    private String referencia;

    @NotNull
    private MetodoPagoRequest metodoPago;

    @NotEmpty
    @Valid
    private List<@NotNull DetallePedidoRequest> detalles;

    public CrearPedidoRequest() {
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getReferencia() {
        return referencia;
    }

    public void setReferencia(String referencia) {
        this.referencia = referencia;
    }

    public MetodoPagoRequest getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(MetodoPagoRequest metodoPago) {
        this.metodoPago = metodoPago;
    }

    public List<DetallePedidoRequest> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetallePedidoRequest> detalles) {
        this.detalles = detalles;
    }
}
