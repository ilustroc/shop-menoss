package com.shopmenoss.repository;

import com.shopmenoss.model.Rol;
import com.shopmenoss.model.Usuario;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DataJpaTest(showSql = false)
class UsuarioRepositoryTest {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Verifica que un usuario pueda guardarse y buscarse por correo
    @Test
    void debeGuardarYBuscarUsuarioPorCorreo() {

        Usuario usuario = new Usuario(
                "Jesus",
                "Garcia",
                "jesus@test.com",
                "Password123",
                Rol.CLIENTE);

        usuarioRepository.save(usuario);

        Optional<Usuario> resultado = usuarioRepository.findByCorreo("jesus@test.com");

        assertTrue(resultado.isPresent());
        assertEquals("Jesus", resultado.get().getNombre());
        assertEquals(Rol.CLIENTE, resultado.get().getRol());
    }

    // Verifica que exista un correo registrado
    @Test
    void existsByCorreoDebeRetornarTrue() {

        Usuario usuario = new Usuario(
                "Ana",
                "Perez",
                "ana@test.com",
                "Password123",
                Rol.CLIENTE);

        usuarioRepository.save(usuario);

        assertTrue(
                usuarioRepository.existsByCorreo("ana@test.com"));
    }

    // Verifica que un correo inexistente retorne false
    @Test
    void existsByCorreoDebeRetornarFalse() {

        assertFalse(
                usuarioRepository.existsByCorreo("noexiste@test.com"));
    }

    // Verifica que no se permitan correos duplicados
    @Test
    void noDebePermitirCorreosDuplicados() {

        Usuario usuario1 = new Usuario(
                "Jesus",
                "Garcia",
                "duplicado@test.com",
                "Password123",
                Rol.CLIENTE);

        Usuario usuario2 = new Usuario(
                "Ana",
                "Perez",
                "duplicado@test.com",
                "Password456",
                Rol.CLIENTE);

        usuarioRepository.saveAndFlush(usuario1);

        assertThrows(
                DataIntegrityViolationException.class,
                () -> usuarioRepository.saveAndFlush(usuario2));
    }
}