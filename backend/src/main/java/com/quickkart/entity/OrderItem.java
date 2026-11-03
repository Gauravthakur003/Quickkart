package com.quickkart.entity;

import java.math.BigDecimal;

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
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "order_id", nullable = false)
    private CustomerOrder order;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    @Column(nullable = false, length = 180)
    private String productName;
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;
    @Column(nullable = false)
    private Integer quantity;

    public Long getId() {
        return id;
    }

    public CustomerOrder getOrder() {
        return order;
    }

    public void setOrder(CustomerOrder v) {
        order = v;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product v) {
        product = v;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String v) {
        productName = v;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal v) {
        unitPrice = v;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer v) {
        quantity = v;
    }
}
