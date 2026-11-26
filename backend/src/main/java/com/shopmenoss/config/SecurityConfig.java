package com.shopmenoss.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.http.MediaType;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, com.shopmenoss.security.JwtService jwtService) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                // Gestión administrativa: solo ADMINISTRADOR.
                // Sin credenciales -> 401. Usuario CLIENTE -> 403.
                .requestMatchers("/api/admin/**").hasRole("ADMINISTRADOR")
                // Catálogo público; pedidos autenticados y escritura administrativa.
                .requestMatchers("/api/auth/**", "/api/health").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/productos/**", "/api/categorias/**").permitAll()
                .requestMatchers("/api/productos/**", "/api/categorias/**", "/api/inventario/**").hasRole("ADMINISTRADOR")
                .anyRequest().authenticated()
            )
            // Autenticación básica con correo y contraseña (UsuarioDetailsService).
            .httpBasic(Customizer.withDefaults())
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, exception) -> {
                    response.setStatus(401);
                    response.setCharacterEncoding("UTF-8");
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.getWriter().write("{\"error\":\"Autenticación requerida o sesión no válida\"}");
                })
                .accessDeniedHandler((request, response, exception) -> {
                    response.setStatus(403);
                    response.setCharacterEncoding("UTF-8");
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.getWriter().write("{\"error\":\"Acceso denegado\"}");
                })
            )
            .addFilterBefore(new com.shopmenoss.security.JwtAuthFilter(jwtService),
                org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
