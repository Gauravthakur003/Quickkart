package com.quickkart.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.quickkart.entity.AppUser;
import com.quickkart.repository.UserRepository;
import com.quickkart.service.CurrentUserService;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final CurrentUserService current;
    private final UserRepository users;

    public ProfileController(CurrentUserService c, UserRepository u) {
        current = c;
        users = u;
    }

    @GetMapping
    public Object get() {
        return ApiMapper.user(current.get());
    }

    @PutMapping
    public Object update(@RequestBody Map<String, String> body) {
        AppUser u = current.get();
        if (body.containsKey("name")) {
            u.setName(body.get("name").trim());
        
        }if (body.containsKey("phone")) {
            u.setPhone(body.get("phone").trim());
        
        }return ApiMapper.user(users.save(u));
    }
}
