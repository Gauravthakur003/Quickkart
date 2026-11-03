package com.quickkart.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quickkart.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByActiveTrue();

    List<Product> findByActiveTrueAndCategoryId(Long categoryId);

    List<Product> findByActiveTrueAndNameContainingIgnoreCase(String name);
}
