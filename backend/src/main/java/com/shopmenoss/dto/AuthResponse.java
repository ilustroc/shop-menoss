package com.shopmenoss.dto;

import com.shopmenoss.model.Rol;

public class AuthResponse {

    private Long id;
    private String nombre;
    private String apellido;
    private String correo;
    private Rol rol;
    private String mensaje;
    private String token;

    // Constructor original (registro): sin token
    public AuthResponse(
            Long id,
            String nombre,
            String apellido,
            String correo,
            Rol rol,
            String mensaje) {

        this(id, nombre, apellido, correo, rol, mensaje, null);
    }

    // Constructor para login: con token
    public AuthResponse(
            Long id,
            String nombre,
            String apellido,
            String correo,
            Rol rol,
            String mensaje,
            String token) {

        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.rol = rol;
        this.mensaje = mensaje;
        this.token = token;
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

    public String getToken() {
        return token;
    }
}