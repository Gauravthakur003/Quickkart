package com.quickkart.controller;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.quickkart.dto.OrderRequest;
import com.quickkart.entity.Address;
import com.quickkart.entity.AppUser;
import com.quickkart.entity.CartItem;
import com.quickkart.entity.CustomerOrder;
import com.quickkart.entity.OrderItem;
import com.quickkart.entity.OrderStatus;
import com.quickkart.entity.Product;
import com.quickkart.repository.AddressRepository;
import com.quickkart.repository.CartRepository;
import com.quickkart.repository.OrderRepository;
import com.quickkart.repository.ProductRepository;
import com.quickkart.service.CurrentUserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orders;
    private final CartRepository carts;
    private final AddressRepository addresses;
    private final ProductRepository products;
    private final CurrentUserService current;

    public OrderController(OrderRepository o, CartRepository c, AddressRepository a, ProductRepository p, CurrentUserService u) {
        orders = o;
        carts = c;
        addresses = a;
        products = p;
        current = u;
    }

    @PostMapping
    @Transactional
    public Object place(@Valid @RequestBody OrderRequest r) {
        AppUser user = current.get();
        var cart = carts.findByUserId(user.getId());
        if (cart.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Your cart is empty");
        
        }Address address = addresses.findByIdAndUserId(r.addressId(), user.getId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found"));
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem ci : cart) {
            Product p = products.findById(ci.getProduct().getId()).orElseThrow();
            if (p.getStock() < ci.getQuantity()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Insufficient stock for " + p.getName());
            
            }subtotal = subtotal.add(p.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity())));
        }
        BigDecimal delivery = subtotal.compareTo(new BigDecimal("999")) >= 0 ? BigDecimal.ZERO : new BigDecimal("40");
        CustomerOrder o = new CustomerOrder();
        o.setOrderNumber("QK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        o.setUser(user);
        o.setAddress(address);
        o.setPaymentMethod(r.paymentMethod());
        o.setStatus(OrderStatus.PLACED);
        o.setSubtotal(subtotal);
        o.setDeliveryCharge(delivery);
        o.setTotal(subtotal.add(delivery));
        for (CartItem ci : cart) {
            Product p = ci.getProduct();
            p.setStock(p.getStock() - ci.getQuantity());
            products.save(p);
            OrderItem oi = new OrderItem();
            oi.setOrder(o);
            oi.setProduct(p);
            oi.setProductName(p.getName());
            oi.setUnitPrice(p.getPrice());
            oi.setQuantity(ci.getQuantity());
            o.getItems().add(oi);
        }
        CustomerOrder saved = orders.save(o);
        carts.deleteByUserId(user.getId());
        return ApiMapper.order(saved);
    }

    @GetMapping
    public Object mine() {
        return orders.findByUserIdOrderByCreatedAtDesc(current.get().getId()).stream().map(ApiMapper::order).toList();
    }

    @GetMapping("/{id}")
    public Object one(@PathVariable Long id) {
        CustomerOrder o = orders.findById(id).filter(x -> x.getUser().getId().equals(current.get().getId())).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        return ApiMapper.order(o);
    }

    @PatchMapping("/{id}/cancel")
    @Transactional
    public Object cancel(@PathVariable Long id) {
        CustomerOrder o = orders.findById(id).filter(x -> x.getUser().getId().equals(current.get().getId())).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (o.getStatus() != OrderStatus.PLACED && o.getStatus() != OrderStatus.CONFIRMED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This order can no longer be cancelled");
        
        }o.setStatus(OrderStatus.CANCELLED);
        for (OrderItem item : o.getItems()) {
            Product p = item.getProduct();
            p.setStock(p.getStock() + item.getQuantity());
            products.save(p);
        }
        return ApiMapper.order(orders.save(o));
    }
}
