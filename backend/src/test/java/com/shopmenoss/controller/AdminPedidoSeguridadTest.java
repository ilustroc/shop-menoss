package com.shopmenoss.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.shopmenoss.config.SecurityConfig;
import com.shopmenoss.model.Rol;
import com.shopmenoss.model.Usuario;
import com.shopmenoss.repository.UsuarioRepository;
import com.shopmenoss.security.UsuarioDetailsService;
import com.shopmenoss.service.AdminPedidoService;

/**
 * Verifica que /api/admin/pedidos solo sea accesible para ADMINISTRADOR,
 * usando la configuración real de SecurityConfig y usuarios de la base de datos (simulados).
 */
@WebMvcTest(AdminPedidoController.class)
@Import({SecurityConfig.class, UsuarioDetailsService.class})
class AdminPedidoSeguridadTest {

    private static final String PASSWORD = "Clave123";

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AdminPedidoService adminPedidoService;

    @MockitoBean
    private UsuarioRepository usuarioRepository;

    @BeforeEach
    void prepararUsuarios() {
        String passwordCifrada = new BCryptPasswordEncoder().encode(PASSWORD);

        when(usuarioRepository.findByCorreo("cliente@test.com")).thenReturn(Optional.of(
                new Usuario("Ana", "Cliente", "cliente@test.com", passwordCifrada, Rol.CLIENTE)));
        when(usuarioRepository.findByCorreo("admin@test.com")).thenReturn(Optional.of(
                new Usuario("Luis", "Admin", "admin@test.com", passwordCifrada, Rol.ADMINISTRADOR)));

        when(adminPedidoService.listarPedidos(any())).thenReturn(List.of());
    }

    @Test
    void sinAutenticacionResponde401() throws Exception {
        mockMvc.perform(get("/api/admin/pedidos"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void passwordIncorrectaResponde401() throws Exception {
        mockMvc.perform(get("/api/admin/pedidos").with(httpBasic("admin@test.com", "otraClave")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void clienteRecibeAccesoDenegado403() throws Exception {
        mockMvc.perform(get("/api/admin/pedidos").with(httpBasic("cliente@test.com", PASSWORD)))
                .andExpect(status().isForbidden());
    }

    @Test
    void clienteNoPuedeCambiarEstado() throws Exception {
        mockMvc.perform(put("/api/admin/pedidos/1/estado")
                        .with(httpBasic("cliente@test.com", PASSWORD))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"estado\":\"CANCELADO\"}"))
                .andExpect(status().isForbidden());

        verify(adminPedidoService, never()).actualizarEstado(anyLong(), any());
    }

    @Test
    void administradorPuedeListarPedidos() throws Exception {
        mockMvc.perform(get("/api/admin/pedidos").with(httpBasic("admin@test.com", PASSWORD)))
                .andExpect(status().isOk());
    }
}