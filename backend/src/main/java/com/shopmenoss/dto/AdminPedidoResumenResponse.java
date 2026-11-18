package com.shopmenoss.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.shopmenoss.model.EstadoPedido;
import com.shopmenoss.model.MetodoPago;

/** Fila del listado administrativo de pedidos. */
public class AdminPedidoResumenResponse {

    private Long id;
    private LocalDateTime fechaCreacion;
    private EstadoPedido estado;
    private MetodoPago metodoPago;
    private String direccion;
    private Integer cantidadProductos;
    private BigDecimal total;

    public AdminPedidoResumenResponse() {
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

    public MetodoPago getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(MetodoPago metodoPago) {
        this.metodoPago = metodoPago;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public Integer getCantidadProductos() {
        return cantidadProductos;
    }

    public void setCantidadProductos(Integer cantidadProductos) {
        this.cantidadProductos = cantidadProductos;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}