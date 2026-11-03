package com.quickkart.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quickkart.entity.CustomerOrder;

public interface OrderRepository extends JpaRepository<CustomerOrder, Long> {

    List<CustomerOrder> findByUserIdOrderByCreatedAtDesc(Long userId);
}
