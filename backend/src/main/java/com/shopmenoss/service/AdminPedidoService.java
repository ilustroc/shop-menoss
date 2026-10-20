package com.shopmenoss.service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shopmenoss.dto.ActualizarEstadoPedidoRequest;
import com.shopmenoss.dto.AdminPedidoDetalleResponse;
import com.shopmenoss.dto.AdminPedidoResumenResponse;
import com.shopmenoss.dto.DetallePedidoResponse;
import com.shopmenoss.exception.EstadoPedidoInvalidoException;
import com.shopmenoss.exception.TransicionEstadoInvalidaException;
import com.shopmenoss.model.DetallePedido;
import com.shopmenoss.model.EstadoPedido;
import com.shopmenoss.model.Pedido;
import com.shopmenoss.repository.PedidoRepository;

import jakarta.persistence.EntityNotFoundException;

/**
 * Gestión administrativa de pedidos (feature/admin-pedidos).
 * Reutiliza Pedido, DetallePedido y PedidoRepository de feature/pedidos.
 */
@Service
@Transactional(readOnly = true)
public class AdminPedidoService {

    private final PedidoRepository pedidoRepository;

    public AdminPedidoService(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    /** Lista todos los pedidos (más recientes primero), opcionalmente filtrados por estado. */
    public List<AdminPedidoResumenResponse> listarPedidos(String estado) {
        List<Pedido> pedidos;

        if (estado == null || estado.isBlank()) {
            pedidos = pedidoRepository.findAll(Sort.by(Sort.Direction.DESC, "fechaCreacion"));
        } else {
            pedidos = pedidoRepository.findByEstadoOrderByFechaCreacionDesc(convertirEstado(estado));
        }

        return pedidos.stream()
                .map(this::construirResumen)
                .toList();
    }

    public AdminPedidoDetalleResponse obtenerPedido(Long id) {
        return construirDetalle(buscarPedido(id));
    }

    @Transactional
    public AdminPedidoDetalleResponse actualizarEstado(Long id, ActualizarEstadoPedidoRequest request) {
        Pedido pedido = buscarPedido(id);
        EstadoPedido estadoActual = pedido.getEstado();
        EstadoPedido estadoNuevo = convertirEstado(request.getEstado());

        if (estadoActual == estadoNuevo) {
            throw new TransicionEstadoInvalidaException(
                    "El pedido " + id + " ya se encuentra en estado " + estadoActual
            );
        }

        if (!ReglasEstadoPedido.esTransicionValida(estadoActual, estadoNuevo)) {
            List<EstadoPedido> permitidos = ReglasEstadoPedido.estadosSiguientes(estadoActual);
            String detalle = permitidos.isEmpty()
                    ? estadoActual + " es un estado final y ya no puede cambiar"
                    : "Desde " + estadoActual + " solo se puede pasar a " + permitidos;

            throw new TransicionEstadoInvalidaException(
                    "No se puede cambiar el pedido de " + estadoActual + " a " + estadoNuevo + ". " + detalle
            );
        }

        pedido.setEstado(estadoNuevo);
        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        return construirDetalle(pedidoGuardado);
    }

    private Pedido buscarPedido(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pedido no encontrado: " + id));
    }

    private EstadoPedido convertirEstado(String estado) {
        try {
            return EstadoPedido.valueOf(estado.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new EstadoPedidoInvalidoException(
                    "Estado inválido: " + estado + ". Valores permitidos: "
                    + Arrays.toString(EstadoPedido.values())
            );
        }
    }

    private AdminPedidoResumenResponse construirResumen(Pedido pedido) {
        int cantidadProductos = pedido.getDetalles().stream()
                .mapToInt(DetallePedido::getCantidad)
                .sum();

        AdminPedidoResumenResponse response = new AdminPedidoResumenResponse();
        response.setId(pedido.getId());
        response.setFechaCreacion(pedido.getFechaCreacion());
        response.setEstado(pedido.getEstado());
        response.setMetodoPago(pedido.getMetodoPago());
        response.setDireccion(pedido.getDireccion());
        response.setCantidadProductos(cantidadProductos);
        response.setTotal(pedido.getTotal());
        return response;
    }

    private AdminPedidoDetalleResponse construirDetalle(Pedido pedido) {
        List<DetallePedidoResponse> detalles = pedido.getDetalles().stream()
                .map(detalle -> new DetallePedidoResponse(
                        detalle.getId(),
                        detalle.getProducto() != null ? detalle.getProducto().getId() : null,
                        detalle.getNombreProducto(),
                        detalle.getCantidad(),
                        detalle.getPrecioUnitario(),
                        detalle.getPrecioUnitario().multiply(
                                BigDecimal.valueOf(detalle.getCantidad())
                        )
                ))
                .toList();

        AdminPedidoDetalleResponse response = new AdminPedidoDetalleResponse();
        response.setId(pedido.getId());
        response.setFechaCreacion(pedido.getFechaCreacion());
        response.setEstado(pedido.getEstado());
        response.setEstadosPermitidos(ReglasEstadoPedido.estadosSiguientes(pedido.getEstado()));
        response.setDireccion(pedido.getDireccion());
        response.setReferencia(pedido.getReferencia());
        response.setMetodoPago(pedido.getMetodoPago());
        response.setSubtotal(pedido.getSubtotal());
        response.setEnvio(pedido.getEnvio());
        response.setTotal(pedido.getTotal());
        response.setDetalles(detalles);
        return response;
    }
}