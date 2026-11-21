package com.shopmenoss.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import com.shopmenoss.model.*;
import com.shopmenoss.security.JwtService;
import jakarta.persistence.EntityManager;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class TiendaIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired EntityManager em;
    @Autowired JwtService jwt;
    @Autowired org.springframework.security.crypto.password.PasswordEncoder encoder;

    private Usuario usuario(String correo, Rol rol) {
        var u = new Usuario("Prueba", "Cliente", correo, encoder.encode("DemoTest123!"), rol);
        em.persist(u); em.flush(); return u;
    }

    @Test void registroLoginYPermisos() throws Exception {
        mvc.perform(post("/api/auth/registro").contentType("application/json").content("""
            {"nombre":"Nuevo","apellido":"Cliente","correo":"nuevo@test.com","password":"DemoTest123!"}
            """)).andExpect(status().isCreated());
        mvc.perform(post("/api/auth/registro").contentType("application/json").content("""
            {"nombre":"Nuevo","apellido":"Cliente","correo":"nuevo@test.com","password":"DemoTest123!"}
            """)).andExpect(status().isConflict());
        mvc.perform(post("/api/auth/login").contentType("application/json").content("""
            {"correo":"nuevo@test.com","password":"DemoTest123!"}
            """)).andExpect(status().isOk()).andExpect(jsonPath("$.token").isString());
        mvc.perform(post("/api/auth/login").contentType("application/json").content("""
            {"correo":"nuevo@test.com","password":"incorrecta"}
            """)).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/admin/pedidos")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/pedidos").header("Authorization", "Bearer invalido")).andExpect(status().isUnauthorized());
        var cliente = usuario("cliente@test.com", Rol.CLIENTE);
        mvc.perform(get("/api/admin/pedidos").header("Authorization","Bearer "+jwt.generarToken(cliente)))
            .andExpect(status().isForbidden());
        mvc.perform(post("/api/productos").header("Authorization","Bearer "+jwt.generarToken(cliente))
            .contentType("application/json").content("{}")).andExpect(status().isForbidden());
        mvc.perform(post("/api/pedidos").header("Authorization","Bearer "+jwt.generarToken(cliente))
            .contentType("application/json").content("{\"direccion\":\"Av Prueba 123\",\"metodoPago\":\"EFECTIVO\",\"detalles\":[null]}"))
            .andExpect(status().isBadRequest());
    }

    @Test void compraPersistenciaPropiedadYEstado() throws Exception {
        var cliente = usuario("comprador@test.com", Rol.CLIENTE);
        var otro = usuario("otro@test.com", Rol.CLIENTE);
        var admin = usuario("admin@test.com", Rol.ADMINISTRADOR);
        var cat = new Categoria(); cat.setNombre("Integracion"); em.persist(cat);
        var p = new Producto(); p.setNombre("Producto real H2"); p.setPrecio(new java.math.BigDecimal("9.90"));
        p.setStock(7); p.setCategoria(cat); em.persist(p); em.flush();
        String auth = "Bearer "+jwt.generarToken(cliente);
        mvc.perform(post("/api/pedidos").header("Authorization",auth).contentType("application/json")
            .content("{\"direccion\":\"Av Prueba 123\",\"metodoPago\":\"EFECTIVO\",\"detalles\":[{\"productoId\":"+p.getId()+",\"cantidad\":2}]}"))
            .andExpect(status().isCreated()).andExpect(jsonPath("$.total").value(29.8))
            .andExpect(jsonPath("$.envio").value(10));
        em.flush(); em.clear();
        var pedido = em.createQuery("select p from Pedido p where p.usuario.correo = :correo",Pedido.class)
            .setParameter("correo",cliente.getCorreo()).getSingleResult();
        assertEquals(5,em.find(Producto.class,p.getId()).getStock());
        mvc.perform(get("/api/pedidos/"+pedido.getId()).header("Authorization",auth)).andExpect(status().isOk());
        mvc.perform(get("/api/pedidos/"+pedido.getId()).header("Authorization","Bearer "+jwt.generarToken(otro)))
            .andExpect(status().isNotFound());
        mvc.perform(get("/api/pedidos").header("Authorization","Bearer "+jwt.generarToken(otro)))
            .andExpect(jsonPath("$.length()").value(0));
        mvc.perform(put("/api/admin/pedidos/"+pedido.getId()+"/estado")
            .header("Authorization","Bearer "+jwt.generarToken(admin)).contentType("application/json")
            .content("{\"estado\":\"CONFIRMADO\"}")).andExpect(status().isOk());
        mvc.perform(get("/api/pedidos/"+pedido.getId()).header("Authorization",auth))
            .andExpect(jsonPath("$.estado").value("CONFIRMADO"));
    }

    @Test void administracionPersisteProductosCategoriasYStock() throws Exception {
        var admin = usuario("catalogo@test.com", Rol.ADMINISTRADOR);
        String auth = "Bearer " + jwt.generarToken(admin);
        mvc.perform(post("/api/categorias").header("Authorization", auth)
            .contentType("application/json").content("{\"nombre\":\"Categoria API\",\"descripcion\":\"Prueba H2\"}"))
            .andExpect(status().isCreated());
        long categoriaId = em.createQuery("select c.id from Categoria c where c.nombre = 'Categoria API'", Long.class).getSingleResult();
        mvc.perform(put("/api/categorias/"+categoriaId).header("Authorization", auth)
            .contentType("application/json").content("{\"nombre\":\"Categoria actualizada\"}"))
            .andExpect(status().isOk());
        String producto = "{\"nombre\":\"Producto API\",\"precio\":12.50,\"stock\":3,\"categoriaId\":"+categoriaId+"}";
        mvc.perform(post("/api/productos").header("Authorization", auth).contentType("application/json").content(producto))
            .andExpect(status().isCreated()).andExpect(jsonPath("$.categoriaNombre").value("Categoria actualizada"));
        long id = em.createQuery("select p.id from Producto p where p.nombre = 'Producto API'", Long.class).getSingleResult();
        em.flush(); em.clear();
        mvc.perform(get("/api/productos/"+id)).andExpect(status().isOk()).andExpect(jsonPath("$.precio").value(12.5));
        mvc.perform(put("/api/productos/"+id).header("Authorization", auth).contentType("application/json")
            .content(producto.replace("Producto API", "Producto editado"))).andExpect(status().isOk());
        mvc.perform(put("/api/productos/"+id+"/stock").header("Authorization", auth)
            .contentType("application/json").content("{\"stock\":5}")).andExpect(status().isOk());
        em.flush(); em.clear();
        mvc.perform(get("/api/inventario").header("Authorization", auth)).andExpect(status().isOk());
        mvc.perform(get("/api/productos/"+id)).andExpect(jsonPath("$.stock").value(5))
            .andExpect(jsonPath("$.nombre").value("Producto editado"));
        mvc.perform(delete("/api/productos/"+id).header("Authorization", auth)).andExpect(status().isNoContent());
        mvc.perform(get("/api/productos").param("q", "Producto editado")).andExpect(jsonPath("$.length()").value(0));
        assertNotNull(em.find(Producto.class, id), "Desactivar conserva el producto histórico");
        mvc.perform(delete("/api/categorias/"+categoriaId).header("Authorization", auth)).andExpect(status().isConflict());
    }

    @Test void pedidosHistoricosPermanecenSoloParaAdministracion() throws Exception {
        var cliente = usuario("historia@test.com", Rol.CLIENTE);
        var admin = usuario("historico-admin@test.com", Rol.ADMINISTRADOR);
        var p = new Pedido(); p.setDireccion("Histórico"); p.setMetodoPago(MetodoPago.EFECTIVO);
        p.setSubtotal(java.math.BigDecimal.TEN); p.setEnvio(java.math.BigDecimal.ZERO); p.setTotal(java.math.BigDecimal.TEN);
        em.persist(p); em.flush(); em.clear();
        mvc.perform(get("/api/pedidos/"+p.getId()).header("Authorization", "Bearer "+jwt.generarToken(cliente)))
            .andExpect(status().isNotFound());
        mvc.perform(get("/api/admin/pedidos/"+p.getId()).header("Authorization", "Bearer "+jwt.generarToken(admin)))
            .andExpect(status().isOk()).andExpect(jsonPath("$.total").value(10));
        assertNull(em.find(Pedido.class, p.getId()).getUsuario());
    }
}
