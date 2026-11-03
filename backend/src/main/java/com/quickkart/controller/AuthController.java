package com.quickkart.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.quickkart.dto.AuthDtos.*;
import com.quickkart.dto.AuthDtos.AuthResponse;
import com.quickkart.dto.AuthDtos.LoginRequest;
import com.quickkart.dto.AuthDtos.RegisterRequest;
import com.quickkart.entity.AppUser;
import com.quickkart.entity.Role;
import com.quickkart.repository.UserRepository;
import com.quickkart.security.JwtService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthController(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest r) {
        if (users.existsByEmailIgnoreCase(r.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        
        }AppUser u = new AppUser();
        u.setName(r.name().trim());
        u.setEmail(r.email().trim().toLowerCase());
        u.setPhone(r.phone());
        u.setPasswordHash(encoder.encode(r.password()));
        u.setRole(Role.CUSTOMER);
        users.save(u);
        return response(u);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest r) {
        AppUser u = users.findByEmailIgnoreCase(r.email()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        if (!u.isActive() || !encoder.matches(r.password(), u.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        
        }return response(u);
    }

    @GetMapping("/check-email")
    public Map<String, Boolean> checkEmail(@RequestParam String email) {
        return Map.of("available", !users.existsByEmailIgnoreCase(email));
    }

    private AuthResponse response(AppUser u) {
        return new AuthResponse(jwt.generate(u.getEmail(), u.getRole().name()), u.getId(), u.getName(), u.getEmail(), u.getRole().name());
    }
}
