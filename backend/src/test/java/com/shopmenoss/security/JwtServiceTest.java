package com.shopmenoss.security;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import com.shopmenoss.model.Rol;
import com.shopmenoss.model.Usuario;

class JwtServiceTest {
    private static final String SECRET = "shop-menoss-test-jwt-key-2026-only-for-tests";

    @Test
    void reconoceTokenValidoYTokenVencido() {
        Usuario cliente = new Usuario("Ana", "Cliente", "ana@test.com", "hash", Rol.CLIENTE);
        assertTrue(new JwtService(SECRET, 60_000).esValido(new JwtService(SECRET, 60_000).generarToken(cliente)));
        assertFalse(new JwtService(SECRET, -1).esValido(new JwtService(SECRET, -1).generarToken(cliente)));
    }
}
