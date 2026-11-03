package com.quickkart.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 180)
    private String name;
    @Column(nullable = false, length = 3000)
    private String description;
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;
    @Column(precision = 12, scale = 2)
    private BigDecimal originalPrice;
    @Column(nullable = false)
    private Integer stock = 0;
    @Column(length = 700)
    private String imageUrl;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    @Column(nullable = false)
    private boolean active = true;
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String v) {
        name = v;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String v) {
        description = v;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal v) {
        price = v;
    }

    public BigDecimal getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(BigDecimal v) {
        originalPrice = v;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer v) {
        stock = v;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String v) {
        imageUrl = v;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category v) {
        category = v;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean v) {
        active = v;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
