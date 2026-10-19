package com.shopmenoss.dto;

import com.shopmenoss.model.Rol;

public class AuthResponse {

    private Long id;
    private String nombre;
    private String apellido;
    private String correo;
    private Rol rol;
    private String mensaje;

    public AuthResponse(
            Long id,
            String nombre,
            String apellido,
            String correo,
            Rol rol,
            String mensaje) {

        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.rol = rol;
        this.mensaje = mensaje;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public String getCorreo() {
        return correo;
    }

    public Rol getRol() {
        return rol;
    }

    public String getMensaje() {
        return mensaje;
    }
}