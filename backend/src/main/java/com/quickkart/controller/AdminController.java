package com.quickkart.controller;

import com.quickkart.entity.*;
import com.quickkart.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ProductRepository products;
    private final CategoryRepository categories;
    private final OrderRepository orders;
    private final UserRepository users;

    public AdminController(ProductRepository p, CategoryRepository c, OrderRepository o, UserRepository u) {
        products = p;
        categories = c;
        orders = o;
        users = u;
    }

    @GetMapping("/dashboard")
    public Object dashboard() {
        return Map.of("products", products.count(), "orders", orders.count(), "users", users.count(), "revenue", orders.findAll().stream().filter(o -> o.getStatus() != OrderStatus.CANCELLED).map(CustomerOrder::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add));
    }

    @GetMapping("/products")
    public Object allProducts() {
        return products.findAll().stream().map(ApiMapper::product).toList();
    }

    @PostMapping("/products")
    public Object createProduct(@RequestBody Map<String, Object> b) {
        Product p = new Product();
        applyProduct(p, b);
        return ApiMapper.product(products.save(p));
    }

    @PutMapping("/products/{id}")
    public Object updateProduct(@PathVariable Long id, @RequestBody Map<String, Object> b) {
        Product p = products.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        applyProduct(p, b);
        return ApiMapper.product(products.save(p));
    }

    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable Long id) {
        Product p = products.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        p.setActive(false);
        products.save(p);
    }

    @GetMapping("/orders")
    public Object allOrders() {
        return orders.findAll().stream().sorted(Comparator.comparing(CustomerOrder::getCreatedAt).reversed()).map(ApiMapper::order).toList();
    }

    @PatchMapping("/orders/{id}/status")
    public Object status(@PathVariable Long id, @RequestParam OrderStatus status) {
        CustomerOrder o = orders.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (o.getStatus() == OrderStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cancelled order cannot be updated");
        
        }o.setStatus(status);
        return ApiMapper.order(orders.save(o));
    }

    @GetMapping("/users")
    public Object allUsers() {
        return users.findAll().stream().map(ApiMapper::user).toList();
    }

    @PatchMapping("/users/{id}/active")
    public Object active(@PathVariable Long id, @RequestParam boolean value) {
        AppUser u = users.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        u.setActive(value);
        return ApiMapper.user(users.save(u));
    }

    @GetMapping("/categories")
    public Object allCategories() {
        return categories.findAll();
    }

    @PostMapping("/categories")
    public Object addCategory(@RequestBody Map<String, String> b) {
        Category c = new Category();
        c.setName(b.get("name"));
        c.setDescription(b.get("description"));
        c.setImageUrl(b.get("imageUrl"));
        return categories.save(c);
    }

    private void applyProduct(Product p, Map<String, Object> b) {
        p.setName(String.valueOf(b.get("name")));
        p.setDescription(String.valueOf(b.getOrDefault("description", "")));
        p.setPrice(new BigDecimal(String.valueOf(b.get("price"))));
        p.setOriginalPrice(new BigDecimal(String.valueOf(b.getOrDefault("originalPrice", b.get("price")))));
        p.setStock(Integer.parseInt(String.valueOf(b.getOrDefault("stock", 0))));
        p.setImageUrl(String.valueOf(b.getOrDefault("imageUrl", b.getOrDefault("image", ""))));
        Long categoryId = Long.valueOf(String.valueOf(b.get("categoryId")));
        p.setCategory(categories.findById(categoryId).orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid category")));
        p.setActive(!Boolean.FALSE.equals(b.get("active")));
    }
}
