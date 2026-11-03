package com.quickkart.controller;

import com.quickkart.dto.CartRequest;
import com.quickkart.entity.*;
import com.quickkart.repository.*;
import com.quickkart.service.CurrentUserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartRepository carts;
    private final ProductRepository products;
    private final CurrentUserService current;

    public CartController(CartRepository c, ProductRepository p, CurrentUserService u) {
        carts = c;
        products = p;
        current = u;
    }

    @GetMapping
    public Object get() {
        return view();
    }

    @PostMapping("/items")
    public Object add(@Valid @RequestBody CartRequest r) {
        AppUser u = current.get();
        Product p = products.findById(r.productId()).filter(Product::isActive).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        if (p.getStock() < r.quantity()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Insufficient stock");
        
        }CartItem i = carts.findByUserIdAndProductId(u.getId(), p.getId()).orElseGet(() -> {
            CartItem n = new CartItem();
            n.setUser(u);
            n.setProduct(p);
            n.setQuantity(0);
            return n;
        });
        i.setQuantity(i.getQuantity() + r.quantity());
        carts.save(i);
        return view();
    }

    @PutMapping("/items/{productId}")
    public Object update(@PathVariable Long productId, @RequestParam int quantity) {
        if (quantity < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be at least 1");
        
        }CartItem i = carts.findByUserIdAndProductId(current.get().getId(), productId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (i.getProduct().getStock() < quantity) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Insufficient stock");
        
        }i.setQuantity(quantity);
        carts.save(i);
        return view();
    }

    @DeleteMapping("/items/{productId}")
    public Object remove(@PathVariable Long productId) {
        carts.findByUserIdAndProductId(current.get().getId(), productId).ifPresent(carts::delete);
        return view();
    }

    @DeleteMapping
    public void clear() {
        carts.deleteByUserId(current.get().getId());
    }

    private Object view() {
        List<Map<String, Object>> items = carts.findByUserId(current.get().getId()).stream().map(i -> {
            Product p = i.getProduct();
            Map<String, Object> m = new LinkedHashMap<>(ApiMapper.product(p));
            m.put("quantity", i.getQuantity());
            m.put("lineTotal", p.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())));
            return m;
        }).toList();
        BigDecimal subtotal = items.stream().map(m -> (BigDecimal) m.get("lineTotal")).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal delivery = subtotal.signum() == 0 || subtotal.compareTo(new BigDecimal("999")) >= 0 ? BigDecimal.ZERO : new BigDecimal("40");
        return Map.of("items", items, "subtotal", subtotal, "deliveryCharge", delivery, "total", subtotal.add(delivery));
    }
}
