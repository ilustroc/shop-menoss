package com.shopmenoss.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import jakarta.persistence.EntityNotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Map<String, String>> manejarNoEncontrado(EntityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> manejarStockInsuficiente(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", ex.getMessage()));
    }

    // Errores con estado explícito (por ejemplo 401 en el login).
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> manejarEstado(ResponseStatusException ex) {
        String mensaje = ex.getReason() != null ? ex.getReason() : "Error en la solicitud";
        return ResponseEntity.status(ex.getStatusCode())
                .body(Map.of("error", mensaje));
    }

    // Datos inválidos de negocio (por ejemplo, correo ya registrado).
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> manejarArgumentoInvalido(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> manejarValidacion(MethodArgumentNotValidException ex) {
        Map<String, String> errores = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error
                -> errores.put(error.getField(), error.getDefaultMessage())
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errores);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> manejarErrorGeneral(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error interno del servidor"));
    }
}