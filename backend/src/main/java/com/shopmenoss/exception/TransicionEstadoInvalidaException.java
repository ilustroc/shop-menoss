package com.shopmenoss.exception;

/** El estado existe, pero no se permite pasar a él desde el estado actual. Responde 409. */
public class TransicionEstadoInvalidaException extends RuntimeException {

    public TransicionEstadoInvalidaException(String mensaje) {
        super(mensaje);
    }
}