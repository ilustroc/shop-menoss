package com.shopmenoss.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shopmenoss.dto.ActualizarEstadoPedidoRequest;
import com.shopmenoss.dto.AdminPedidoDetalleResponse;
import com.shopmenoss.dto.AdminPedidoResumenResponse;
import com.shopmenoss.service.AdminPedidoService;

import jakarta.validation.Valid;

/**
 * Endpoints de gestión administrativa de pedidos.
 * La restricción al rol ADMINISTRADOR se configura en SecurityConfig
 * (feature/authentication), regla para /api/admin/**.
 */
@RestController
@RequestMapping("/api/admin/pedidos")
public class AdminPedidoController {

    private final AdminPedidoService adminPedidoService;

    public AdminPedidoController(AdminPedidoService adminPedidoService) {
        this.adminPedidoService = adminPedidoService;
    }

    /** GET /api/admin/pedidos  o  GET /api/admin/pedidos?estado=PENDIENTE */
    @GetMapping
    public ResponseEntity<List<AdminPedidoResumenResponse>> listarPedidos(
            @RequestParam(required = false) String estado
    ) {
        return ResponseEntity.ok(adminPedidoService.listarPedidos(estado));
    }

    /** GET /api/admin/pedidos/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<AdminPedidoDetalleResponse> obtenerPedido(@PathVariable Long id) {
        return ResponseEntity.ok(adminPedidoService.obtenerPedido(id));
    }

    /** PUT /api/admin/pedidos/{id}/estado   body: { "estado": "CONFIRMADO" } */
    @PutMapping("/{id}/estado")
    public ResponseEntity<AdminPedidoDetalleResponse> actualizarEstado(
            @PathVariable Long id,
            @Valid @RequestBody ActualizarEstadoPedidoRequest request
    ) {
        return ResponseEntity.ok(adminPedidoService.actualizarEstado(id, request));
    }
}