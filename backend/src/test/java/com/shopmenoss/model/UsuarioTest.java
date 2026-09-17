package com.shopmenoss.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class UsuarioTest {

    // Verifica que el constructor asigne correctamente los datos
    @Test
    void constructorDebeAsignarDatos() {

        Usuario usuario = new Usuario(
                "Jesus",
                "Garcia",
                "jesus@test.com",
                "Password123",
                Rol.CLIENTE);

        assertEquals("Jesus", usuario.getNombre());
        assertEquals("Garcia", usuario.getApellido());
        assertEquals("jesus@test.com", usuario.getCorreo());
        assertEquals("Password123", usuario.getPassword());
        assertEquals(Rol.CLIENTE, usuario.getRol());
    }

    // Verifica que los setters actualicen los datos
    @Test
    void settersDebenActualizarDatos() {

        Usuario usuario = new Usuario();

        usuario.setId(1L);
        usuario.setNombre("Admin");
        usuario.setApellido("Menoss");
        usuario.setCorreo("admin@test.com");
        usuario.setPassword("Admin123");
        usuario.setRol(Rol.ADMINISTRADOR);

        assertEquals(1L, usuario.getId());
        assertEquals("Admin", usuario.getNombre());
        assertEquals("Menoss", usuario.getApellido());
        assertEquals("admin@test.com", usuario.getCorreo());
        assertEquals("Admin123", usuario.getPassword());
        assertEquals(Rol.ADMINISTRADOR, usuario.getRol());
    }
}