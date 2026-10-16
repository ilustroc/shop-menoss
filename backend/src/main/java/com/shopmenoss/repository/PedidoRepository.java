package com.shopmenoss.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shopmenoss.model.EstadoPedido;
import com.shopmenoss.model.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByEstadoOrderByFechaCreacionDesc(EstadoPedido estado);
}
