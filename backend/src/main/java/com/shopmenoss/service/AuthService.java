package com.shopmenoss.service;

import com.shopmenoss.dto.AuthResponse;
import com.shopmenoss.dto.RegistroRequest;
import com.shopmenoss.model.Rol;
import com.shopmenoss.model.Usuario;
import com.shopmenoss.repository.UsuarioRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse registrar(RegistroRequest request) {

        String correo = request.getCorreo().trim().toLowerCase();

        if (usuarioRepository.existsByCorreo(correo)) {
            throw new IllegalArgumentException(
                "Ya existe una cuenta registrada con este correo"
            );
        }

        String passwordCifrada =
            passwordEncoder.encode(request.getPassword());

        Usuario usuario = new Usuario(
            request.getNombre().trim(),
            request.getApellido().trim(),
            correo,
            passwordCifrada,
            Rol.CLIENTE
        );

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        return new AuthResponse(
            usuarioGuardado.getId(),
            usuarioGuardado.getNombre(),
            usuarioGuardado.getApellido(),
            usuarioGuardado.getCorreo(),
            usuarioGuardado.getRol(),
            "Usuario registrado correctamente"
        );
    }
}