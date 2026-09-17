package com.shopmenoss.controller;

import com.shopmenoss.config.SecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(HealthController.class)
@Import(SecurityConfig.class)
class HealthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    // Verifica que el endpoint responda correctamente
    @Test
    void healthDebeResponderStatus200() throws Exception {
        mockMvc
                .perform(get("/api/health"))
                .andExpect(status().isOk());
    }

    // Verifica el mensaje retornado por la API
    @Test
    void healthDebeRetornarMensajeEsperado() throws Exception {
        mockMvc
                .perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(
                        content().string(
                                "Shop Menoss API funcionando correctamente"));
    }
}