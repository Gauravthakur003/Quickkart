package com.quickkart.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.quickkart.repository.CategoryRepository;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository categories;

    public CategoryController(CategoryRepository c) {
        categories = c;
    }

    @GetMapping
    public Object all() {
        return categories.findAll().stream().filter(c -> c.isActive()).map(c -> java.util.Map.of("id", c.getId(), "name", c.getName(), "description", c.getDescription() == null ? "" : c.getDescription(), "imageUrl", c.getImageUrl() == null ? "" : c.getImageUrl())).toList();
    }
}
