package com.shopmenoss.security;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.shopmenoss.repository.UsuarioRepository;

/**
 * Permite a Spring Security autenticar con los usuarios guardados en la base de datos.
 * El usuario se identifica con su correo y su contraseña cifrada con BCrypt.
 * El rol (CLIENTE o ADMINISTRADOR) se convierte en ROLE_CLIENTE o ROLE_ADMINISTRADOR.
 */
@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        String correoNormalizado = correo == null ? "" : correo.trim().toLowerCase();

        return usuarioRepository.findByCorreo(correoNormalizado)
                .map(usuario -> User.withUsername(usuario.getCorreo())
                        .password(usuario.getPassword())
                        .roles(usuario.getRol().name())
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("Credenciales inválidas"));
    }
}