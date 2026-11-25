package com.shopmenoss.service;

import com.shopmenoss.dto.AuthResponse;
import com.shopmenoss.dto.LoginRequest;
import com.shopmenoss.dto.RegistroRequest;
import com.shopmenoss.model.Rol;
import com.shopmenoss.model.Usuario;
import com.shopmenoss.repository.UsuarioRepository;
import com.shopmenoss.security.JwtService;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse registrar(RegistroRequest request) {

        String correo = request.getCorreo().trim().toLowerCase();

        if (usuarioRepository.existsByCorreo(correo)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Ya existe una cuenta registrada con este correo");
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

    public AuthResponse login(LoginRequest request) {

        String correo = request.getCorreo().trim().toLowerCase();

        // Mismo mensaje si falla el correo o la contraseña,
        // para no revelar qué correos existen.
        Usuario usuario = usuarioRepository.findByCorreo(correo)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, "Credenciales incorrectas"));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, "Credenciales incorrectas");
        }

        String token = jwtService.generarToken(usuario);

        return new AuthResponse(
            usuario.getId(),
            usuario.getNombre(),
            usuario.getApellido(),
            usuario.getCorreo(),
            usuario.getRol(),
            "Inicio de sesión exitoso",
            token
        );
    }
}
