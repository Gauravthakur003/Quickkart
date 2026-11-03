package com.quickkart.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.quickkart.entity.AppUser;
import com.quickkart.entity.Product;
import com.quickkart.entity.WishlistItem;
import com.quickkart.repository.ProductRepository;
import com.quickkart.repository.WishlistRepository;
import com.quickkart.service.CurrentUserService;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistRepository wish;
    private final ProductRepository products;
    private final CurrentUserService current;

    public WishlistController(WishlistRepository w, ProductRepository p, CurrentUserService c) {
        wish = w;
        products = p;
        current = c;
    }

    @GetMapping
    public Object all() {
        return wish.findByUserId(current.get().getId()).stream().map(i -> ApiMapper.product(i.getProduct())).toList();
    }

    @PostMapping("/{productId}")
    public Object add(@PathVariable Long productId) {
        AppUser u = current.get();
        Product p = products.findById(productId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (wish.findByUserIdAndProductId(u.getId(), productId).isEmpty()) {
            WishlistItem i = new WishlistItem();
            i.setUser(u);
            i.setProduct(p);
            wish.save(i);
        }
        return all();
    }

    @DeleteMapping("/{productId}")
    public Object remove(@PathVariable Long productId) {
        wish.findByUserIdAndProductId(current.get().getId(), productId).ifPresent(wish::delete);
        return all();
    }
}
