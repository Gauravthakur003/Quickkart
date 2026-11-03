package com.quickkart.controller;

import java.util.Map;

import com.quickkart.entity.Address;
import com.quickkart.entity.AppUser;
import com.quickkart.entity.CustomerOrder;
import com.quickkart.entity.Product;

public final class ApiMapper {

    private ApiMapper() {
    }

    public static Map<String, Object> product(Product p) {
        return Map.of("id", p.getId(), "name", p.getName(), "description", p.getDescription(), "price", p.getPrice(), "originalPrice", p.getOriginalPrice() == null ? p.getPrice() : p.getOriginalPrice(), "stock", p.getStock(), "image", p.getImageUrl() == null ? "" : p.getImageUrl(), "category", p.getCategory().getName(), "categoryId", p.getCategory().getId(), "active", p.isActive());
    }

    public static Map<String, Object> user(AppUser u) {
        return Map.of("id", u.getId(), "name", u.getName(), "email", u.getEmail(), "phone", u.getPhone(), "role", u.getRole().name(), "active", u.isActive());
    }

    public static Map<String, Object> address(Address a) {
        return Map.of("id", a.getId(), "fullName", a.getFullName(), "phone", a.getPhone(), "line1", a.getLine1(), "line2", a.getLine2() == null ? "" : a.getLine2(), "city", a.getCity(), "state", a.getState(), "postalCode", a.getPostalCode(), "country", a.getCountry(), "defaultAddress", a.isDefaultAddress());
    }

    public static Map<String, Object> order(CustomerOrder o) {
        return Map.of("id", o.getId(), "orderNumber", o.getOrderNumber(), "status", o.getStatus().name(), "paymentMethod", o.getPaymentMethod().name(), "subtotal", o.getSubtotal(), "deliveryCharge", o.getDeliveryCharge(), "total", o.getTotal(), "createdAt", o.getCreatedAt().toString(), "items", o.getItems().stream().map(i -> Map.of("productId", i.getProduct().getId(), "name", i.getProductName(), "unitPrice", i.getUnitPrice(), "quantity", i.getQuantity())).toList(), "address", address(o.getAddress()));
    }
}
