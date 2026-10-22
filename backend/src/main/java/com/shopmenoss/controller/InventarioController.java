package com.shopmenoss.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.shopmenoss.dto.ActualizarStockRequest;
import com.shopmenoss.dto.InventarioResponse;
import com.shopmenoss.service.InventarioService;

import jakarta.validation.Valid;

@RestController
public class InventarioController {

    private final InventarioService inventarioService;

    public InventarioController(InventarioService inventarioService) {
        this.inventarioService = inventarioService;
    }

    @GetMapping("/api/inventario")
    public List<InventarioResponse> listar() {
        return inventarioService.listarInventario();
    }

    @GetMapping("/api/inventario/bajo-stock")
    public List<InventarioResponse> listarStockBajo() {
        return inventarioService.listarStockBajo();
    }

    @PutMapping("/api/productos/{id}/stock")
    public InventarioResponse actualizarStock(
            @PathVariable Long id,
            @Valid @RequestBody ActualizarStockRequest request
    ) {
        return inventarioService.actualizarStock(id, request.stock());
    }
}
