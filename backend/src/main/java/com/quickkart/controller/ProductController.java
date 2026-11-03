package com.quickkart.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.quickkart.entity.Product;
import com.quickkart.repository.ProductRepository;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository products;

    public ProductController(ProductRepository products) {
        this.products = products;
    }

    @GetMapping
    public List<?> all(@RequestParam(required = false) Long categoryId, @RequestParam(required = false) String search, @RequestParam(defaultValue = "newest") String sort) {
        List<Product> result;
        if (categoryId != null) {
            result = products.findByActiveTrueAndCategoryId(categoryId); 
        }else if (search != null && !search.isBlank()) {
            result = products.findByActiveTrueAndNameContainingIgnoreCase(search); 
        }else {
            result = products.findByActiveTrue();
        
        }return result.stream().map(ApiMapper::product).toList();
    }

    @GetMapping("/{id}")
    public Object one(@PathVariable Long id) {
        Product p = products.findById(id).filter(Product::isActive).orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Product not found"));
        return ApiMapper.product(p);
    }
}
