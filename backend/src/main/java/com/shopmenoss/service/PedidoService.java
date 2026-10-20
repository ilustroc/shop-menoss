package com.shopmenoss.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shopmenoss.dto.CrearPedidoRequest;
import com.shopmenoss.dto.DetallePedidoRequest;
import com.shopmenoss.dto.DetallePedidoResponse;
import com.shopmenoss.dto.MetodoPagoRequest;
import com.shopmenoss.dto.PedidoResponse;
import com.shopmenoss.model.DetallePedido;
import com.shopmenoss.model.MetodoPago;
import com.shopmenoss.model.Pedido;
import com.shopmenoss.model.Producto;
import com.shopmenoss.repository.DetallePedidoRepository;
import com.shopmenoss.repository.PedidoRepository;
import com.shopmenoss.repository.ProductoRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class PedidoService {

    private static final BigDecimal COSTO_ENVIO = new BigDecimal("10000");

    private final PedidoRepository pedidoRepository;
    private final DetallePedidoRepository detallePedidoRepository;
    private final ProductoRepository productoRepository;

    public PedidoService(
            PedidoRepository pedidoRepository,
            DetallePedidoRepository detallePedidoRepository,
            ProductoRepository productoRepository
    ) {
        this.pedidoRepository = pedidoRepository;
        this.detallePedidoRepository = detallePedidoRepository;
        this.productoRepository = productoRepository;
    }

    @Transactional
    public PedidoResponse crearPedido(CrearPedidoRequest request) {
        Pedido pedido = new Pedido();
        pedido.setDireccion(request.getDireccion());
        pedido.setReferencia(request.getReferencia());
        pedido.setMetodoPago(MetodoPago.valueOf(request.getMetodoPago().name()));
        pedido.setFechaCreacion(LocalDateTime.now());

        BigDecimal subtotal = BigDecimal.ZERO;
        List<DetallePedido> detalles = new ArrayList<>();

        for (DetallePedidoRequest detalleRequest : request.getDetalles()) {
            Producto producto = productoRepository.findById(detalleRequest.getProductoId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Producto no encontrado: " + detalleRequest.getProductoId()
                    ));

            if (producto.getStock() < detalleRequest.getCantidad()) {
                throw new IllegalStateException(
                        "Stock insuficiente para el producto: " + producto.getNombre()
                );
            }

            producto.setStock(producto.getStock() - detalleRequest.getCantidad());
            productoRepository.save(producto);

            BigDecimal precioUnitario = producto.getPrecio();
            BigDecimal subtotalDetalle = precioUnitario.multiply(
                    BigDecimal.valueOf(detalleRequest.getCantidad())
            );

            subtotal = subtotal.add(subtotalDetalle);

            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(pedido);
            detalle.setProducto(producto);
            detalle.setNombreProducto(producto.getNombre());
            detalle.setCantidad(detalleRequest.getCantidad());
            detalle.setPrecioUnitario(precioUnitario);

            detalles.add(detalle);
        }

        pedido.setSubtotal(subtotal);
        pedido.setEnvio(COSTO_ENVIO);
        pedido.setTotal(subtotal.add(COSTO_ENVIO));

        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        for (DetallePedido detalle : detalles) {
            detalle.setPedido(pedidoGuardado);
        }

        List<DetallePedido> detallesGuardados = detallePedidoRepository.saveAll(detalles);

        return construirResponse(pedidoGuardado, detallesGuardados);
    }

    public List<PedidoResponse> listarPedidos() {
        List<Pedido> pedidos = pedidoRepository.findAll();
        List<PedidoResponse> respuesta = new ArrayList<>();

        for (Pedido pedido : pedidos) {
            List<DetallePedido> detalles = detallePedidoRepository.findByPedidoId(pedido.getId());
            respuesta.add(construirResponse(pedido, detalles));
        }

        return respuesta;
    }

    public PedidoResponse obtenerPedido(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pedido no encontrado: " + id));

        List<DetallePedido> detalles = detallePedidoRepository.findByPedidoId(pedido.getId());

        return construirResponse(pedido, detalles);
    }

    private PedidoResponse construirResponse(Pedido pedido, List<DetallePedido> detalles) {
        List<DetallePedidoResponse> detallesResponse = new ArrayList<>();

        for (DetallePedido detalle : detalles) {
            BigDecimal subtotalDetalle = detalle.getPrecioUnitario()
                    .multiply(BigDecimal.valueOf(detalle.getCantidad()));

            detallesResponse.add(new DetallePedidoResponse(
                    detalle.getId(),
                    detalle.getProducto().getId(),
                    detalle.getProducto().getNombre(),
                    detalle.getCantidad(),
                    detalle.getPrecioUnitario(),
                    subtotalDetalle
            ));
        }

        PedidoResponse response = new PedidoResponse();
        response.setId(pedido.getId());
        response.setDireccion(pedido.getDireccion());
        response.setReferencia(pedido.getReferencia());
        response.setMetodoPago(MetodoPagoRequest.valueOf(pedido.getMetodoPago().name()));
        response.setSubtotal(pedido.getSubtotal());
        response.setEnvio(pedido.getEnvio());
        response.setTotal(pedido.getTotal());
        response.setFechaCreacion(pedido.getFechaCreacion());
        response.setDetalles(detallesResponse);

        return response;
    }
}
