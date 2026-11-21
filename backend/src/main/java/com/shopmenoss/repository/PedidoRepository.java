package com.shopmenoss.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shopmenoss.model.EstadoPedido;
import com.shopmenoss.model.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Pedido p where p.id = :id")
    Optional<Pedido> findByIdForUpdate(@Param("id") Long id);

    List<Pedido> findByUsuarioCorreo(String correo);


    List<Pedido> findByEstadoOrderByFechaCreacionDesc(EstadoPedido estado);
}
