package com.shopmenoss.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.shopmenoss.model.EstadoPedido;
import com.shopmenoss.model.MetodoPago;

/** Detalle completo de un pedido para el ADMINISTRADOR. */
public class AdminPedidoDetalleResponse {

    private Long id;
    private LocalDateTime fechaCreacion;
    private EstadoPedido estado;
    /** Estados a los que el administrador puede mover este pedido. */
    private List<EstadoPedido> estadosPermitidos;
    private String direccion;
    private String referencia;
    private MetodoPago metodoPago;
    private BigDecimal subtotal;
    private BigDecimal envio;
    private BigDecimal total;
    // Reutiliza el DTO de detalle de feature/pedidos
    private List<DetallePedidoResponse> detalles;

    public AdminPedidoDetalleResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public EstadoPedido getEstado() {
        return estado;
    }

    public void setEstado(EstadoPedido estado) {
        this.estado = estado;
    }

    public List<EstadoPedido> getEstadosPermitidos() {
        return estadosPermitidos;
    }

    public void setEstadosPermitidos(List<EstadoPedido> estadosPermitidos) {
        this.estadosPermitidos = estadosPermitidos;
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

    public MetodoPago getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(MetodoPago metodoPago) {
        this.metodoPago = metodoPago;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getEnvio() {
        return envio;
    }

    public void setEnvio(BigDecimal envio) {
        this.envio = envio;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public List<DetallePedidoResponse> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetallePedidoResponse> detalles) {
        this.detalles = detalles;
    }
}