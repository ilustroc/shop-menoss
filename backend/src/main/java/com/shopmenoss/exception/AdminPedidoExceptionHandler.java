package com.shopmenoss.exception;

import java.util.Map;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.shopmenoss.controller.AdminPedidoController;

/**
 * Errores propios de admin-pedidos. Solo aplica a AdminPedidoController,
 * así no se modifica el GlobalExceptionHandler de feature/pedidos.
 * Los errores que no se manejan aquí (404, validaciones) siguen yendo
 * al GlobalExceptionHandler.
 */
@RestControllerAdvice(assignableTypes = AdminPedidoController.class)
@Order(Ordered.HIGHEST_PRECEDENCE)
public class AdminPedidoExceptionHandler {

    @ExceptionHandler(EstadoPedidoInvalidoException.class)
    public ResponseEntity<Map<String, String>> manejarEstadoInvalido(EstadoPedidoInvalidoException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(TransicionEstadoInvalidaException.class)
    public ResponseEntity<Map<String, String>> manejarTransicionInvalida(TransicionEstadoInvalidaException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> manejarJsonInvalido(HttpMessageNotReadableException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "El cuerpo de la petición no es un JSON válido"));
    }
}